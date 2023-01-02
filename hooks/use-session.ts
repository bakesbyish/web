import { IUser } from '@interfaces/firestore';
import useSWR, { KeyedMutator } from 'swr';

/**
 * @description - Get the user data if the user is logged in
 * @returns - data - Contains the user object if the user is logged in
 * @returns - validating - The loading state of the user session
 * @returns - mutate - Revalidate the user session on demand
 **/
export const useSession = (): {
  data: { user: IUser | null } | undefined;
  validating: boolean;
  mutate: KeyedMutator<any>;
} => {
  const fetcher = async (url: string) => {
    const response = await fetch(url, {
      method: 'GET',
    });

    return response.json();
  };

  const { data, isValidating, mutate } = useSWR(['/api/auth/session'], fetcher);

  return {
    data,
    validating: isValidating,
    mutate,
  };
};
