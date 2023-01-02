import { IUser } from '@interfaces/firestore';
import { logout } from '@lib/auth';
import { auth } from 'config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { KeyedMutator } from 'swr';
import { useSession } from './use-session';

/**
 * @description - Get the user data if the user is logged in
 * @returns - user - The user data if the user is signed in
 * @returns - validating - The loading state of the user
 * @returns - Get the latest user data on demand
 * */
export const useUserData = (): {
  user: IUser | null;
  validating: boolean;
  mutate: KeyedMutator<any>;
} => {
  const { data, validating, mutate } = useSession();

  // Remove retundant user sessions
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      data
        ? !user && !validating && data.user && logout()
        : user && !validating && logout();
    });
  }, [data, validating]);

  return {
    user: data ? data.user : null,
    validating,
    mutate,
  };
};
