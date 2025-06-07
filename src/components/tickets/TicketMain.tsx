import axios from 'axios';
import Loading from '../Loading';
import { useParams } from 'react-router';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import { type Event } from '../../interfaces/Event';

export default function TicketMain() {
  const { eventId } = useParams();
  const { getToken } = useAuth();
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

  interface TicketPriceQuery {
    price?: number;
    message?: string;
    available?: boolean;
  }
  const ticketPriceQuery = useQuery<TicketPriceQuery>({
    queryKey: ['ticket_price', eventId],
    queryFn: async () => {
      const token = await getToken();
      const response = await axios.get(
        `${import.meta.env.VITE_API_SERVICE_URL}/api/tickets/price/${eventId}`,
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

  const makePayment = useMutation({
    mutationFn: async (eventId) => {
      const token = await getToken();
      // Es necesario enviar el token por Bearer para que el backend lo pueda ver
      return axios.post(
        `${import.meta.env.VITE_API_SERVICE_URL}/api/payment`,
        eventId,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
    },
  });

  if (eventQuery.isPending || ticketPriceQuery.isPending) return <Loading />;
  if (eventQuery.error || ticketPriceQuery.error) return <h1>Error...</h1>;

  const eventData = eventQuery.data[0];
  const ticketData = ticketPriceQuery.data;
  const ticketPrice = ticketData.price;
  const ticketMessage = ticketData.message;
  const ticketsAvailable = ticketData.available;

  let buttonText = `Pay $${ticketPrice}`;
  if (makePayment.isPending && !makePayment.isSuccess) {
    buttonText = 'Loading...';
  }
  if (!makePayment.isPending && !makePayment.isSuccess && !makePayment.isIdle) {
    buttonText = 'Error';
  }
  if (!ticketsAvailable) {
    buttonText = ticketMessage!;
  }

  return (
    <div className='font-sans text-white relative flex flex-col'>
      <div className='flex-grow px-6 py-16'>
        <div className='max-w-3xl mx-auto bg-black bg-opacity-50 shadow-md p-8 space-y-8'>
          <div>
            <h2 className='text-2xl font-bold'>Ticket Summary</h2>
            <ul className='mt-4 space-y-2'>
              <li>
                <strong>Artist:</strong> {eventData.artists.name}
              </li>
              <li>
                <strong>Location:</strong> {eventData.location}
              </li>
              <li>
                <strong>Date:</strong> {eventData.start_time}
              </li>
              <li>
                <strong>Time:</strong> {eventData.end_time}
              </li>
              <li>
                <strong>Price:</strong>
                {ticketsAvailable ? `$${ticketPrice}` : ticketMessage}
              </li>
            </ul>
          </div>

          <div>
            <h2 className='text-2xl font-bold'>Payment Information</h2>
            <form className='mt-6 grid gap-4 text-black'>
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
                onClick={() => {
                  makePayment.mutate({ eventId: eventData.event_id });
                }}
                disabled={ticketsAvailable ? false : true}
                type='button'
                className='mt-6 bg-slate-800 text-white text-lg px-6 py-3 hover:bg-indigo-700 transition'>
                {buttonText}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
