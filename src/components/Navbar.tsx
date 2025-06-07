import { SignOutButton } from '@clerk/clerk-react';
import { useState } from 'react';
import { NavLink } from 'react-router';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className='font-sans fixed top-0 left-0 w-full z-50 bg-white bg-opacity-5 backdrop-blur-md shadow-md'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          {/* Logo / Site Name */}
          <div className='flex-shrink-0 text-white text-xl font-bold'>
            <NavLink to={'/'}>TicketSystem</NavLink>
          </div>

          {/* Desktop Menu */}
          <div className='hidden md:flex space-x-6 text-white font-medium'>
            <NavLink
              to={'/events'}
              className='hover:underline'>
              Events
            </NavLink>
            <a
              href='#'
              className='hover:underline'>
              Artists
            </a>
            <a
              href='#'
              className='block hover:underline'>
              <SignOutButton />
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <div className='md:hidden'>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className='text-white focus:outline-none'
              aria-label='Toggle menu'>
              <svg
                className='h-6 w-6'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'>
                {menuOpen ? (
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                ) : (
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M4 6h16M4 12h16M4 18h16'
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Items */}
      {menuOpen && (
        <div className='md:hidden px-4 pb-4 space-y-2 text-white font-medium'>
          <a
            href='#'
            className='block hover:underline'>
            Events
          </a>
          <a
            href='#'
            className='block hover:underline'>
            Artists
          </a>
          <a
            href='#'
            className='block hover:underline'>
            Tickets
          </a>
          <a
            href='#'
            className='block hover:underline'>
            About
          </a>
          <a
            href='#'
            className='block hover:underline'>
            <SignOutButton />
          </a>
        </div>
      )}
    </nav>
  );
}
