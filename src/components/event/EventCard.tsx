import { NavLink } from 'react-router';
import { type Event } from '../../interfaces/Event';

export default function EventCard({ event }: { event: Event }) {
  return (
    <div className='font-sans max-w-sm w-full mx-auto min-h-[220px]'>
      <div className='flex flex-col p-3 space-y-2 h-full'>
        <h2 className='text-xl text-white'>
          <NavLink
            to={'/events/' + event.event_id}
            className='text-white hover:text-white text-2xl'>
            {event.title}
          </NavLink>
        </h2>
        <p className='text-white'>{event.artists.name}</p>
        <p className='text-white text-sm'>
          <span className='font-medium'>{event.start_time}</span>
        </p>
      </div>
    </div>
  );
}
