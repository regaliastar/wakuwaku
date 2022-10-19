import { createContext } from 'react';

export interface ContentData {
  shouldTyeing?: boolean;
  typingDone?: boolean;
}

const ContentContext = createContext<ContentData | undefined>(undefined);
export const ContentContextProvider = ContentContext.Provider;
