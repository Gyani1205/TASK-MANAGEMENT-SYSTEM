/**
 * End-to-end auth flow test.
 *
 * Requires a real PostgreSQL database — set DATABASE_URL to a disposable test
 * database before running (e.g. `taskflow_test`), then:
 *
 *   npx prisma migrate deploy
 *   npm run test:e2e
 *
 * This suite boots the full Nest application (real Prisma, real bcrypt, real
 * cookies) and exercises the HTTP layer end-to-end, unlike the mocked unit
 * specs next to each service.
 */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/config/prisma.service';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  const testUser = {
    email: `e2e-${Date.now()}@taskflow.test`,
    username: `e2e_${Date.now()}`,
    name: 'E2E Test User',
    password: 'correct-horse-battery-staple',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.setGlobalPrefix('api/v1');
    await app.init();

    prisma = moduleFixture.get(PrismaService);
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: testUser.email } });
    await app.close();
  });

  it('POST /auth/signup creates an account and returns a token pair', async () => {
    const response = await request(app.getHttpServer()).post('/api/v1/auth/signup').send(testUser).expect(201);

    expect(response.body.user.email).toBe(testUser.email);
    expect(response.body.user).not.toHaveProperty('password');
    expect(response.body.accessToken).toBeDefined();
    expect(response.headers['set-cookie']).toBeDefined();
  });

  it('POST /auth/signup rejects a duplicate email', async () => {
    await request(app.getHttpServer()).post('/api/v1/auth/signup').send(testUser).expect(409);
  });

  it('POST /auth/login rejects an incorrect password', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: testUser.email, password: 'wrong-password' })
      .expect(401);
  });

  it('POST /auth/login succeeds with the correct credentials', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: testUser.email, password: testUser.password })
      .expect(200);

    expect(response.body.accessToken).toBeDefined();
  });

  it('POST /auth/guest provisions a temporary guest account', async () => {
    const response = await request(app.getHttpServer()).post('/api/v1/auth/guest').expect(200);

    expect(response.body.user.isGuest).toBe(true);
    await prisma.user.delete({ where: { id: response.body.user.id } });
  });

  it('GET /users/me requires authentication', async () => {
    await request(app.getHttpServer()).get('/api/v1/users/me').expect(401);
  });

  it('GET /users/me returns the profile for a valid bearer token', async () => {
    const login = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    const response = await request(app.getHttpServer())
      .get('/api/v1/users/me')
      .set('Authorization', `Bearer ${login.body.accessToken}`)
      .expect(200);

    expect(response.body.email).toBe(testUser.email);
  });
});
