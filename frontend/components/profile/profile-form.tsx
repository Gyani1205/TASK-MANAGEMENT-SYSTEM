'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { profileSchema, type ProfileFormValues } from '@/lib/validations/profile.schema';
import { useUpdateProfile } from '@/hooks/use-profile';
import type { AuthUser } from '@/types/auth.types';

export function ProfileForm({ user }: { user: AuthUser }) {
  const updateProfile = useUpdateProfile();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user.name, username: user.username, avatarUrl: user.avatarUrl ?? '' },
  });

  const watchedAvatar = watch('avatarUrl');
  const watchedName = watch('name');

  const onSubmit = (values: ProfileFormValues) => {
    updateProfile.mutate({ ...values, avatarUrl: values.avatarUrl || undefined });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={watchedAvatar || undefined} alt={watchedName} />
          <AvatarFallback className="text-lg">{watchedName?.[0]?.toUpperCase() ?? '?'}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1.5">
          <Label htmlFor="avatarUrl">Avatar URL</Label>
          <Input id="avatarUrl" placeholder="https://..." {...register('avatarUrl')} />
          {errors.avatarUrl && <p className="text-xs text-destructive">{errors.avatarUrl.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" {...register('name')} />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="username">Username</Label>
          <Input id="username" {...register('username')} />
          {errors.username && <p className="text-xs text-destructive">{errors.username.message}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Email</Label>
        <Input value={user.email} disabled />
        <p className="text-xs text-muted-foreground">Email changes aren't supported yet.</p>
      </div>

      <div className="space-y-1.5">
        <Label>Role</Label>
        <Input value={user.isGuest ? 'Guest' : 'Member'} disabled />
      </div>

      <Button type="submit" disabled={!isDirty || updateProfile.isPending}>
        {updateProfile.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        Save changes
      </Button>
    </form>
  );
}
