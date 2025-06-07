import express from 'express';
import { clerkMiddleware, requireAuth } from '@clerk/express';
import { createClient } from '@supabase/supabase-js';
import supabaseMiddleware from './middleware/supabase.js';

const app = express();
const router = express.Router();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(
  clerkMiddleware({
    publishableKey: process.env.VITE_CLERK_PUBLISHABLE_KEY,
    secretKey: process.env.VITE_CLERK_SECRET_KEY,
  })
);
app.use(supabaseMiddleware);

router.use(requireAuth());

router.get('/price/:eventId', async (req, res, next) => {
  const supabase = req.supabase;
  const { eventId } = req.params;
  const { data, error } = await supabase
    .from('tickets')
    .select('price')
    .limit(1)
    .eq('event_id', eventId)
    .eq('status', 'available');

  if (error) {
    res.status(500).json({ error: 'Error getting the ticket price' });
  } else {
    if (data.length == 0) {
      res.json({ message: 'No available tickets', available: false });
    } else {
      res.json({ ...data[0], available: true });
    }
  }
});

router.get('/:eventId/availability', async (req, res) => {
  const supabase = req.supabase;
  const { eventId } = req.params;
  const { data, error } = await supabase
    .from('tickets')
    .select('ticket_id,price')
    .limit(1)
    .eq('event_id', eventId)
    .eq('status', 'available');

  if (error) {
    res.status(500).json({ error: 'Error checking ticket availability' });
  } else {
    if (data.length == 0) {
      res.json({ message: 'No available tickets', available: false });
    } else {
      res.json({ ...data[0], available: true });
    }
  }
});

router.get('/', async (req, res, next) => {
  const supabase = req.supabase;
  const { data, error } = await supabase.from('tickets').select();
  if (error) {
    console.error('error', error);
    res.status(500).json({ error: 'Error getting tickets' });
  } else {
    res.status(200).json(data);
  }
});

app.use('/api/tickets', router);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
