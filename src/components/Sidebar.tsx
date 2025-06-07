import { SignOutButton } from '@clerk/clerk-react';
import { NavLink } from 'react-router';

export default function Sidebar() {
  return (
    <div className='h-screen flex flex-col w-64 bg-gray-800 text-white p-4'>
      <div className='flex-1'>
        <h2 className='text-xl font-bold mb-4'>Home</h2>
        <ul>
          <li className='mb-2'>
            <NavLink to='/events'>Events</NavLink>
          </li>
          <li className='mb-2'>
            <NavLink to='/tickets'>Tickets</NavLink>
          </li>
        </ul>
      </div>
      <div>
        <SignOutButton />
      </div>
    </div>
  );
}
