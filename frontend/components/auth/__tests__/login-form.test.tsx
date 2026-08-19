import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoginForm } from '../login-form';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock('@/services/auth.service', () => ({
  authService: {
    login: vi.fn(),
    googleLoginUrl: () => 'http://localhost:4000/api/v1/auth/google',
  },
}));

function renderWithClient(ui: React.ReactElement) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
}

describe('LoginForm', () => {
  beforeEach(() => vi.clearAllMocks());

  it('shows a validation error for an invalid email instead of submitting', async () => {
    const { authService } = await import('@/services/auth.service');
    renderWithClient(<LoginForm />);

    await userEvent.type(screen.getByLabelText('Email'), 'not-an-email');
    await userEvent.type(screen.getByLabelText('Password'), 'password123');
    await userEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    await waitFor(() => {
      expect(screen.getByText('Enter a valid email address')).toBeInTheDocument();
    });
    expect(authService.login).not.toHaveBeenCalled();
  });

  it('submits valid credentials through the auth service', async () => {
    const { authService } = await import('@/services/auth.service');
    (authService.login as any).mockResolvedValue({
      user: { id: '1', name: 'Ada', email: 'ada@taskflow.dev', username: 'ada', isGuest: false },
      accessToken: 'token',
      refreshToken: 'refresh',
    });

    renderWithClient(<LoginForm />);

    await userEvent.type(screen.getByLabelText('Email'), 'ada@taskflow.dev');
    await userEvent.type(screen.getByLabelText('Password'), 'password123');
    await userEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'ada@taskflow.dev', password: 'password123' }),
      );
    });
  });

  it('renders Google and guest sign-in options', () => {
    renderWithClient(<LoginForm />);
    expect(screen.getByRole('button', { name: /continue with google/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /continue as guest/i })).toBeInTheDocument();
  });
});
