import { Outlet } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ClerkProvider,
  RedirectToSignIn,
  SignedIn,
  SignedOut,
} from '@clerk/clerk-react';
import Navbar from './Navbar';
import { useState } from 'react';
import { BackgroundContext } from '../context/BackgroundContext';

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Add your Clerk Publishable Key to the .env file');
}

const queryClient = new QueryClient();

export default function Root() {
  const [background, setBackground] = useState('event_1');
  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      afterSignOutUrl='/'>
      <SignedIn>
        <BackgroundContext.Provider value={{ background, setBackground }}>
          <div className='w-full h-screen max-w-full max-h-screen'>
            <div className='absolute z-50'>
              <Navbar />
            </div>
            <div className='md:absolute z-0 w-full md:h-screen md:flex md:items-center md:bg-black'>
              <picture>
                {/* Mobile */}
                <source
                  media='(max-width: 600px)'
                  srcSet={`/assets/events/mobile/${background}.webp`}
                  className='w-full h-full object-cover opacity-80 duration-300 easin-in-out'
                />
                {/* Desktop */}
                <source
                  media='(min-width: 601px)'
                  srcSet={`/assets/events/desktop/${background}.jpg`}
                  className='w-full h-full object-cover opacity-80 duration-300 easin-in-out'
                />
                {/* Fallback */}
                <img
                  aria-hidden='true'
                  loading='lazy'
                  decoding='async'
                  src={`/assets/events/original/${background}.jpg`}
                  alt='Event picture'
                  className='w-full h-full object-cover opacity-80 duration-300 easin-in-out'
                />
              </picture>
            </div>
            <div className='md:absolute z-20 w-full md:h-screen md:flex md:items-center'>
              <main className='w-full'>
                <QueryClientProvider client={queryClient}>
                  <Outlet />
                </QueryClientProvider>
              </main>
            </div>
          </div>
        </BackgroundContext.Provider>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </ClerkProvider>
  );
}
