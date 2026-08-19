import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;

  const mockUser = {
    id: 'user_1',
    email: 'ada@taskflow.dev',
    username: 'ada',
    name: 'Ada Lovelace',
    password: null as string | null,
    refreshToken: null as string | null,
    avatarUrl: null,
    isGuest: false,
    googleId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            createGuest: jest.fn(),
            findByEmail: jest.fn(),
            findRawById: jest.fn(),
            findOrCreateFromGoogle: jest.fn(),
            setRefreshToken: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: { signAsync: jest.fn().mockResolvedValue('signed.jwt.token') },
        },
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn((key: string) => `${key}_value`),
            get: jest.fn((key: string, fallback?: string) => fallback ?? `${key}_value`),
          },
        },
      ],
    }).compile();

    authService = moduleRef.get(AuthService);
    usersService = moduleRef.get(UsersService);
    jwtService = moduleRef.get(JwtService);
  });

  describe('login', () => {
    it('throws Unauthorized when the user does not exist', async () => {
      usersService.findByEmail.mockResolvedValue(null);

      await expect(authService.login({ email: 'nobody@taskflow.dev', password: 'whatever' })).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('throws Unauthorized for a guest/OAuth-only account with no password set', async () => {
      usersService.findByEmail.mockResolvedValue({ ...mockUser, password: null } as any);

      await expect(authService.login({ email: mockUser.email, password: 'whatever' })).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('throws Unauthorized when the password does not match', async () => {
      const hashed = await bcrypt.hash('correct-password', 4);
      usersService.findByEmail.mockResolvedValue({ ...mockUser, password: hashed } as any);

      await expect(authService.login({ email: mockUser.email, password: 'wrong-password' })).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('issues a token pair and sanitizes the user (no password/refreshToken leaked) on success', async () => {
      const hashed = await bcrypt.hash('correct-password', 4);
      usersService.findByEmail.mockResolvedValue({ ...mockUser, password: hashed } as any);
      usersService.setRefreshToken.mockResolvedValue(undefined as any);

      const result = await authService.login({ email: mockUser.email, password: 'correct-password' });

      expect(result.accessToken).toBe('signed.jwt.token');
      expect(result.refreshToken).toBe('signed.jwt.token');
      expect(result.user).not.toHaveProperty('password');
      expect(result.user).not.toHaveProperty('refreshToken');
      expect(jwtService.signAsync).toHaveBeenCalledTimes(2);
      expect(usersService.setRefreshToken).toHaveBeenCalledWith(mockUser.id, 'signed.jwt.token');
    });
  });

  describe('guestLogin', () => {
    it('provisions a guest user and issues tokens for them', async () => {
      const guest = { ...mockUser, id: 'guest_1', isGuest: true };
      usersService.createGuest.mockResolvedValue(guest as any);
      usersService.setRefreshToken.mockResolvedValue(undefined as any);

      const result = await authService.guestLogin();

      expect(usersService.createGuest).toHaveBeenCalled();
      expect(result.user.isGuest).toBe(true);
      expect(result.accessToken).toBeDefined();
    });
  });

  describe('refresh', () => {
    it('throws Unauthorized when no stored refresh token hash exists', async () => {
      usersService.findRawById.mockResolvedValue({ ...mockUser, refreshToken: null } as any);

      await expect(authService.refresh(mockUser.id, 'some-token')).rejects.toThrow(UnauthorizedException);
    });

    it('throws Unauthorized when the presented token does not match the stored hash', async () => {
      const storedHash = await bcrypt.hash('the-real-token', 4);
      usersService.findRawById.mockResolvedValue({ ...mockUser, refreshToken: storedHash } as any);

      await expect(authService.refresh(mockUser.id, 'a-forged-token')).rejects.toThrow(UnauthorizedException);
    });

    it('rotates tokens when the presented refresh token is valid', async () => {
      const storedHash = await bcrypt.hash('the-real-token', 4);
      usersService.findRawById.mockResolvedValue({ ...mockUser, refreshToken: storedHash } as any);
      usersService.setRefreshToken.mockResolvedValue(undefined as any);

      const result = await authService.refresh(mockUser.id, 'the-real-token');

      expect(result.accessToken).toBe('signed.jwt.token');
      expect(usersService.setRefreshToken).toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('clears the stored refresh token', async () => {
      usersService.setRefreshToken.mockResolvedValue(undefined as any);
      const result = await authService.logout(mockUser.id);
      expect(usersService.setRefreshToken).toHaveBeenCalledWith(mockUser.id, null);
      expect(result).toEqual({ success: true });
    });
  });
});
