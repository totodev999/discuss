import HeaderAuth from '@/components/header-auth';
import { Input, Navbar, NavbarBrand, NavbarContent } from '@nextui-org/react';
import Link from 'next/link';
import * as actions from '@/actions';
import HeaderInput from './Header-input';

export default function Header() {
  return (
    <Navbar className="shadow mb-6 p-4">
      <NavbarBrand>
        <Link href="/" className="font-bold">
          Discuss
        </Link>
      </NavbarBrand>
      <NavbarContent justify="center">
        <HeaderInput />
      </NavbarContent>
      <NavbarContent justify="end">
        <HeaderAuth />
      </NavbarContent>
    </Navbar>
  );
}
