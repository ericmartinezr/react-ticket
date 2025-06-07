import express from 'express';
import { clerkMiddleware, requireAuth } from '@clerk/express';
import supabaseMiddleware from './middleware/supabase.js';

const app = express();
const router = express.Router();

app.use(
  clerkMiddleware({
    publishableKey: process.env.VITE_CLERK_PUBLISHABLE_KEY,
    secretKey: process.env.VITE_CLERK_SECRET_KEY,
  })
);
app.use(supabaseMiddleware);

router.use(requireAuth());

router.get('/:eventId', async (req, res, next) => {
  const supabase = req.supabase;
  const { eventId } = req.params;
  const { data, error } = await supabase
    .from('events')
    .select(
      `
      event_id,
      capacity,
      description,
      start_time,
      end_time,
      location,
      title,
      event_image,
      artists (
        name
      )  
    `
    )
    .eq('event_id', eventId);
  if (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed at getting event bio' });
  } else {
    res.status(200).json(data);
  }
});

router.get('/', async (req, res, next) => {
  const supabase = req.supabase;
  const { data, error } = await supabase
    .from('events')
    .select('event_id,title,start_time,artists(name)');
  if (error) {
    console.error('error', error);
    res.status(500).json({ error: 'Failed at getting events' });
  } else {
    res.status(200).json(data);
  }
});

app.use('/api/events', router);

const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
