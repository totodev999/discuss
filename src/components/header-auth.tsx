'use client';

import {
  Avatar,
  Button,
  NavbarItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@nextui-org/react';
import * as actions from '@/actions';
import { useSession } from 'next-auth/react';
import { leakEnv } from '@/db/queries/post';
import { useEffect } from 'react';

export default function HeaderAuth() {
  const session = useSession();

  useEffect(() => {
    leakEnv().then((s) => console.log(s));
  }, []);

  let authContent: React.ReactNode;

  if (session.status === 'loading') {
    authContent = null;
  } else if (session?.data?.user) {
    authContent = (
      <Popover placement="left">
        <PopoverTrigger>
          <Avatar src={session.data.user.image || ''} alt="Profile Picture" />
        </PopoverTrigger>
        <PopoverContent>
          <div className="p-4">
            <form action={actions.signOut}>
              <Button type="submit" color="primary" variant="bordered">
                Sign Out
              </Button>
            </form>
          </div>
        </PopoverContent>
      </Popover>
    );
  } else {
    authContent = (
      <>
        <NavbarItem>
          <form action={actions.singIn}>
            <Button type="submit" color="secondary" variant="bordered">
              Sing In
            </Button>
          </form>
        </NavbarItem>
        <NavbarItem>
          <form action={actions.singIn}>
            <Button type="submit" color="primary" variant="flat">
              Sing Up
            </Button>
          </form>
        </NavbarItem>
      </>
    );
  }

  return authContent;
}
