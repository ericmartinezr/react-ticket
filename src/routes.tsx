import { createBrowserRouter } from 'react-router';
import Root from './components/Root';
import Main from './components/Main';
import EventMain from './components/event/EventMain';
import EventLanding from './components/event/EventLanding';
import EventBio from './components/event/EventBio';
import TicketLanding from './components/tickets/TicketLanding';
import TicketMain from './components/tickets/TicketMain';

const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: Main },
      {
        path: 'events',
        Component: EventLanding,
        children: [
          {
            index: true,
            Component: EventMain,
          },
          {
            path: ':eventId',
            Component: EventBio,
          },
        ],
      },
      {
        path: 'tickets',
        Component: TicketLanding,
        children: [
          {
            // index: true,
            path: 'event/:eventId',
            Component: TicketMain,
          },
        ],
      },
    ],
    ErrorBoundary: () => <div>Error</div>,
  },
]);

export default router;
