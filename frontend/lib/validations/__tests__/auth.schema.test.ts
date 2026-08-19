import { describe, it, expect } from 'vitest';
import { loginSchema, signupSchema } from '../auth.schema';

describe('loginSchema', () => {
  it('accepts a valid login payload', () => {
    const result = loginSchema.safeParse({ email: 'ada@taskflow.dev', password: 'secret123' });
    expect(result.success).toBe(true);
  });

  it('rejects an invalid email', () => {
    const result = loginSchema.safeParse({ email: 'not-an-email', password: 'secret123' });
    expect(result.success).toBe(false);
  });

  it('rejects an empty password', () => {
    const result = loginSchema.safeParse({ email: 'ada@taskflow.dev', password: '' });
    expect(result.success).toBe(false);
  });
});

describe('signupSchema', () => {
  const base = {
    name: 'Ada Lovelace',
    username: 'ada',
    email: 'ada@taskflow.dev',
    password: 'password123',
    confirmPassword: 'password123',
  };

  it('accepts a fully valid signup payload', () => {
    expect(signupSchema.safeParse(base).success).toBe(true);
  });

  it('rejects mismatched passwords', () => {
    const result = signupSchema.safeParse({ ...base, confirmPassword: 'different' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('confirmPassword');
    }
  });

  it('rejects a password under 8 characters', () => {
    const result = signupSchema.safeParse({ ...base, password: 'short', confirmPassword: 'short' });
    expect(result.success).toBe(false);
  });

  it('rejects a username with invalid characters', () => {
    const result = signupSchema.safeParse({ ...base, username: 'ada lovelace!' });
    expect(result.success).toBe(false);
  });

  it('rejects a username shorter than 3 characters', () => {
    const result = signupSchema.safeParse({ ...base, username: 'ab' });
    expect(result.success).toBe(false);
  });
});
