'use client';

import { api } from '$convex/_generated/api';
import { useQuery } from 'convex/react';
import { useContext, useState } from 'react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { signIn } from '~/lib/auth-client';
import { AppContext } from '~/components/AppDataContext';

export default function Page() {
  const data = useQuery(api.routes.addEditData.getTask, {});
  const [count, setCount] = useState(0);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { user_info } = useContext(AppContext);

  return (
    <div>
      <div>Fetched Data: {data?.length}</div>
      <button onClick={() => setCount(count + 1)}>{count} Click me</button>
      {user_info && <div>Logged in as {user_info.name}</div>}
      {!user_info && (
        <div>
          <Input value={username} onChange={(e) => setUsername(e.target.value)} />
          <Input value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button onClick={() => signIn.username({ username, password })}>Login</Button>
        </div>
      )}
    </div>
  );
}
