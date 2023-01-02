import { IProfileContext } from '@interfaces/context';
import { createContext, useContext } from 'react';

export const ProfileContext = createContext<IProfileContext>({
  user: undefined,
});

export const useProfileContext = () => {
  return useContext(ProfileContext);
};
