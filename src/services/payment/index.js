import express from 'express';
import axios from 'axios';
import amqp from 'amqplib';
import { clerkMiddleware, requireAuth, getAuth } from '@clerk/express';
import supabaseMiddleware from './middleware/supabase.js';

const app = express();
const router = express.Router();

app.use(express.json());
app.use(
  clerkMiddleware({
    publishableKey: process.env.VITE_CLERK_PUBLISHABLE_KEY,
    secretKey: process.env.VITE_CLERK_SECRET_KEY,
  })
);
app.use(supabaseMiddleware);

function sendNotification(ticketData) {
  amqp
    .connect(`${process.env.RABBITMQ_SERVICE_URL}`)
    .then((connection) => {
      connection
        .createChannel()
        .then((channel) => {
          const queueName = 'generate_ticket';
          channel.assertQueue(queueName, {
            durable: true,
          });

          channel.sendToQueue(
            queueName,
            Buffer.from(JSON.stringify(ticketData))
          );
          console.log(' [x] Sent %s', ticketData);
        })
        .then(() => setTimeout(() => connection.close(), 2000));
    })
    .catch((error) => {
      console.error('AMQP error ', error);
    });
}

router.use(requireAuth());

router.post('/', async (req, res) => {
  const { eventId } = req.body;
  const auth = getAuth(req);
  const supabase = req.supabase;

  try {
    const availability = await axios.get(
      `${process.env.TICKET_SERVICE_URL}/api/tickets/${eventId}/availability`,
      {
        headers: {
          Authorization: `Bearer ${await auth.getToken()}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (availability.status !== 200 || availability.statusText !== 'OK') {
      throw new Error('Error while checking ticket availability');
    }

    if (!availability.data.available) {
      throw new Error(
        "Can't complete the purchase since there are no tickets available"
      );
    }

    const { data, error } = await supabase
      .from('purchases')
      .insert({
        user_id: auth.userId,
        ticket_id: availability.data.ticket_id,
        purchased_at: new Date(),
        amount: availability.data.price,
      })
      .select(
        `
          *,
          tickets (
            *,
            events (
              *
            )
          )
          
          `
      );

    if (error) {
      console.error('Internal error purchasing the ticket', error);
      throw new Error('Internal error when registering the purchase');
    }

    // Llamo al servicio que genera el ticket / envia notificacion
    const resultData = data[0];
    const eventData = resultData.tickets.events;
    const ticketData = {
      eventName: eventData.title,
      location: eventData.location,
      price: resultData.amount,
      eventImage: '',
      startTime: eventData.start_time,
      endTime: eventData.end_time,
      purchasedAt: resultData.purchased_at,
    };

    sendNotification(ticketData);

    res.status(200).json({
      message:
        'Ticket bought correctly. You will receive an email with the invoice shortly.',
      success: true,
    });
  } catch (error) {
    console.error('Error purchasing the ticket', error);
    res.status(500).json({
      message: 'Error purchasing the ticket',
      success: false,
    });
  }
});

app.use('/api/payment', router);

const port = process.env.PORT || 3003;
app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
