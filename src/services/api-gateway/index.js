import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { clerkMiddleware, requireAuth } from '@clerk/express';

const app = express();
const publicRouter = express.Router();
const protectedRouter = express.Router();

app.use(cors());

protectedRouter.use(
  clerkMiddleware({
    publishableKey: process.env.VITE_CLERK_PUBLISHABLE_KEY,
    secretKey: process.env.VITE_CLERK_SECRET_KEY,
  })
);

// https://blog.risingstack.com/building-an-api-gateway-using-nodejs/
// https://dev.to/techcheck/creating-a-react-node-and-express-app-1ieg

protectedRouter.use(
  '/api/events',
  requireAuth(),
  createProxyMiddleware({
    target: `${process.env.EVENT_SERVICE_URL}`,
    changeOrigin: true,
  })
);

protectedRouter.use(
  '/api/tickets',
  requireAuth(),
  createProxyMiddleware({
    target: `${process.env.TICKET_SERVICE_URL}`,
    changeOrigin: true,
  })
);

protectedRouter.use(
  '/api/payment',
  requireAuth(),
  createProxyMiddleware({
    target: `${process.env.PAYMENT_SERVICE_URL}`,
    changeOrigin: true,
  })
);

publicRouter.use(
  '/api/webhooks',
  createProxyMiddleware({
    target: `${process.env.WEBHOOKS_SERVICE_URL}`,
    changeOrigin: true,
  })
);

app.use(publicRouter);
app.use(protectedRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
