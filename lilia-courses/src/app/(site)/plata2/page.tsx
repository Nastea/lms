import { cookies } from 'next/headers';
import Plata2Gate from './Plata2Gate';

export default async function Plata2Page() {
  const cookieStore = await cookies();
  const unlocked = cookieStore.get('plata2_access')?.value === '1';
  return <Plata2Gate initialUnlocked={unlocked} />;
}
