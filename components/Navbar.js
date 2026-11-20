import { getCurrentUser } from '@/lib/auth';
import NavbarClient from './NavbarClient';

// Server component: reads the session cookie and hands a tiny user object to the client part.
export default async function Navbar() {
  const user = await getCurrentUser();
  return <NavbarClient user={user ? { name: user.name } : null} />;
}
