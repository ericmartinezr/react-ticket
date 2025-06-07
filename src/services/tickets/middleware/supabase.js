import { getAuth } from '@clerk/express';
import { createClient } from '@supabase/supabase-js';

const supabaseMiddleware = (req, res, next) => {
  // Retrieve the Clerk Auth object from the request, populated by clerkMiddleware
  const { sessionId, getToken } = getAuth(req);

  // Initialize the Supabase client
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY,
    {
      accessToken: async () => (await getToken()) ?? null,
    }
  );

  // Attach the configured Supabase client instance to the request object.
  // This makes it accessible to all subsequent route handlers and middleware.
  req.supabase = supabase;
  next(); // Pass control to the next middleware or route handler
};

export default supabaseMiddleware;
