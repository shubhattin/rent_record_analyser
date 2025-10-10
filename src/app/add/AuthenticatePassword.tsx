'use client';

import { useState } from 'react';
import { signIn } from '~/lib/auth-client';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';

export default function AuthenticatePassword() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setErrorMsg(null);
    try {
      await signIn.username({ username, password });
    } catch (err: any) {
      setErrorMsg(err?.message ?? 'Failed to sign in');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form className="mx-auto max-w-sm space-y-3" onSubmit={onSubmit}>
      <div className="flex flex-col gap-1">
        <Label htmlFor="username">Username</Label>
        <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {errorMsg && <div className="text-sm text-red-600">{errorMsg}</div>}
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  );
}
