import { createContext } from 'react';

export const BackgroundContext = createContext(
  {} as {
    background: string;
    setBackground: React.Dispatch<React.SetStateAction<string>>;
  }
);
