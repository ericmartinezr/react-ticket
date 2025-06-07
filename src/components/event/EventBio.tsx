import Loading from '../Loading';
import axios from 'axios';
import { useContext, useState } from 'react';
import { NavLink, useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import { BackgroundContext } from '../../context/BackgroundContext';
import { type Event } from '../../interfaces/Event';

export default function EventBio() {
  const { getToken } = useAuth();
  const { background, setBackground } = useContext(BackgroundContext);
  const [open, setOpen] = useState(true);
  const { eventId } = useParams();
  const eventQuery = useQuery<Event[]>({
    queryKey: ['event', eventId],
    queryFn: async () => {
      const token = await getToken();
      const response = await axios.get(
        `${import.meta.env.VITE_API_SERVICE_URL}/api/events/${eventId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    },
  });

  if (eventQuery.isPending) return <Loading />;
  if (eventQuery.error) return <h1>Error...</h1>;

  const eventData = eventQuery.data[0];

  setBackground(eventData.event_image);

  return (
    <div className='font-sans relative w-full h-full min-h-screen bg-black bg-opacity-70  text-white overflow-hidden'>
      <div className='relative z-10 flex items-center justify-center flex-col text-center h-[70vh] px-4'>
        <h1 className='text-4xl md:text-6xl font-extrabold'>
          {eventData.title}
        </h1>
        <p className='mt-4 text-lg text-gray-300'>
          {eventData.artists.name} – July 12, 2025
        </p>
        <div className='mt-24'>
          <NavLink
            to={`/tickets/event/${eventData.event_id}`}
            className='inline-block bg-opacity-20 bg-black text-white hover:bg-white hover:text-black px-6 py-2 sm:text-lg'>
            Get a Ticket
          </NavLink>
        </div>
      </div>

      <div className='relative z-10 flex flex-col items-center'>
        {/* Toggle Button */}
        <button
          onClick={() => setOpen(!open)}
          className='mb-4 w-12 h-12 flex items-center justify-center rounded-full bg-white bg-opacity-20 backdrop-blur-md hover:bg-opacity-30 transition'
          aria-label='Toggle event details'>
          <svg
            className={`h-6 w-6 text-white transform transition-transform duration-300 ${
              open ? 'rotate-180' : ''
            }`}
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M19 9l-7 7-7-7'
            />
          </svg>
        </button>

        <div
          className={`transition-all duration-500 opacity-95 ease-in-out overflow-hidden ${
            open ? 'max-h-[500px]' : 'max-h-0'
          } w-full px-6`}>
          <div className='max-w-3xl mx-auto bg-white bg-opacity-10 backdrop-blur-md shadow-lg px-6 py-6 text-sm text-gray-100 space-y-2'>
            <p>
              <strong>Date:</strong> {eventData.start_time}
            </p>
            <p>
              <strong>Time:</strong> {eventData.start_time}
            </p>
            <p>
              <strong>Location:</strong> {eventData.location}
            </p>
            <p>
              <strong>Capacity:</strong> {eventData.capacity} attendees
            </p>
            <p>
              <strong>Artist:</strong> {eventData.artists.name}
            </p>
            <p>
              <strong>Description:</strong> {eventData.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
