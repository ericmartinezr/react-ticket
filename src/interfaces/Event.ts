import type { Artist } from './Artist';

export interface Event {
  event_id: number;
  title: string;
  location: string;
  start_time: string;
  end_time: string;
  description: string;
  artists: Artist;
  capacity: number;
  created_at?: string;
  event_image: string;
}
