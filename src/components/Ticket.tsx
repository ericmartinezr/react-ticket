import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Loading from './Loading';

export default function Ticket() {
  const { isPending, error, data } = useQuery({
    queryKey: ['buy'],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_SERVICE_URL}/api/tickets`
      );
      return response.data;
    },
  });

  if (isPending) return <Loading />;
  if (error) return <h1>Error...</h1>;

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col'>
      <div className='bg-white py-12 px-6 text-center border-b'>
        <h1 className='text-4xl font-bold text-gray-900'>Buy Your Ticket</h1>
        <p className='mt-2 text-gray-600 text-lg'>
          Live in Sunset Arena — July 12, 2025
        </p>
      </div>

      <div className='flex-grow bg-gray-50 px-6 py-16'>
        <div className='max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8 space-y-8'>
          <div>
            <h2 className='text-2xl font-semibold text-gray-800'>
              Ticket Summary
            </h2>
            <ul className='mt-4 text-gray-600 space-y-2'>
              <li>
                <strong>Artist:</strong> The Rolling Beats
              </li>
              <li>
                <strong>Location:</strong> Sunset Arena, San Francisco, CA
              </li>
              <li>
                <strong>Date:</strong> July 12, 2025
              </li>
              <li>
                <strong>Time:</strong> 6:00 PM – 11:00 PM
              </li>
              <li>
                <strong>Section:</strong> General Admission
              </li>
              <li>
                <strong>Price:</strong> $89.00
              </li>
            </ul>
          </div>

          <div>
            <h2 className='text-2xl font-semibold text-gray-800'>
              Payment Information
            </h2>
            <form className='mt-6 grid gap-4'>
              <input
                type='text'
                placeholder='Full Name'
                className='w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none'
              />
              <input
                type='email'
                placeholder='Email Address'
                className='w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none'
              />
              <input
                type='text'
                placeholder='Card Number'
                className='w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none'
              />
              <div className='flex gap-4'>
                <input
                  type='text'
                  placeholder='MM/YY'
                  className='w-1/2 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none'
                />
                <input
                  type='text'
                  placeholder='CVC'
                  className='w-1/2 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none'
                />
              </div>

              <button
                type='submit'
                className='mt-6 bg-indigo-600 text-white text-lg px-6 py-3 rounded-xl hover:bg-indigo-700 transition'>
                Pay $89.00
              </button>
            </form>
          </div>
        </div>
      </div>

      <footer className='bg-gray-50 border-t py-6 text-center text-sm text-gray-400'>
        © 2025 Rolling Beats Tour. All rights reserved.
      </footer>
    </div>
  );
}
