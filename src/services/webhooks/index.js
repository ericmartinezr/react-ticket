import express from 'express';
import { verifyWebhook } from '@clerk/express/webhooks';
import { createClient } from '@supabase/supabase-js';

const app = express();
const router = express.Router();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

router.post(
  '/',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    try {
      const evt = await verifyWebhook(req);

      if (evt.type === 'user.created') {
        const payload = evt.data;
        const clerkId = payload.id;
        const createdAt = new Date(payload.created_at);
        const primaryEmail = payload.email_addresses.filter(
          (email) => email.id == payload.primary_email_address_id
        );

        const { data, error } = await supabase.from('users').insert([
          {
            user_id: clerkId,
            email: primaryEmail[0].email_address,
            created_at: createdAt,
          },
        ]);
        if (error) {
          console.error(error);
          return res
            .status(400)
            .send({ message: 'Error inserting new user', success: false });
        } else {
          console.log('User created correctly');
          return res
            .status(200)
            .send({ message: 'User created correctly', success: true });
        }
      } else {
        console.error('Incorrect webhook:', err);
        return res
          .status(400)
          .send({ message: 'Incorrect webhook', success: false });
      }
    } catch (err) {
      console.error('Error verifying webhook:', err);
      return res
        .status(400)
        .send({ message: 'Error verifying webhook', success: false });
    }
  }
);

app.use('/api/webhooks', router);

const port = process.env.PORT || 3005;
app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
