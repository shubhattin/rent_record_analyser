'use client';

import { useContext, useState } from 'react';
import { AppContext } from '~/state/AppDataContext';
import { Button } from '~/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { User } from 'lucide-react';
import { signOut } from '~/lib/auth-client';

export default function UserControls() {
  const { user_info } = useContext(AppContext);
  const [open, setOpen] = useState(false);

  if (!user_info) return null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="User menu">
          <User className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56" align="end">
        <div className="space-y-2">
          <div className="text-sm">
            <div className="font-semibold">{user_info.name}</div>
            {user_info.username && (
              <div className="text-muted-foreground">{user_info.username}</div>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={async () => {
              await signOut();
              setOpen(false);
            }}
          >
            Sign out
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
