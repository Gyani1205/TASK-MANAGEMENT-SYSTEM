import type { Metadata } from 'next';
import { SignupForm } from '@/components/auth/signup-form';

export const metadata: Metadata = { title: 'Create account — TaskFlow' };

export default function SignupPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
        <p className="text-sm text-muted-foreground">Start organizing your team's work in minutes.</p>
      </div>
      <SignupForm />
    </div>
  );
}
