import axios from 'axios';
import Loading from '../Loading';
import EventCard from './EventCard';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import { type Event } from '../../interfaces/Event';

export default function EventMain() {
  const { getToken } = useAuth();
  const { isPending, error, data } = useQuery<Event[]>({
    queryKey: ['events'],
    queryFn: async () => {
      const token = await getToken();
      const response = await axios.get(
        `${import.meta.env.VITE_API_SERVICE_URL}/api/events`,
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
  if (isPending) return <Loading />;
  if (error) return <h1>Error...</h1>;

  return (
    <div className='grid bg-black bg-opacity-70 p-4 xl:grid-cols-4 md:grid-cols-3 xs:grid-cols-1 gap-2'>
      {data.map((event, idx) => (
        <EventCard
          key={idx}
          event={event}
        />
      ))}
    </div>
  );
}
