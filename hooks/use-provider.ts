import { commitUserData, createSession } from '@lib/auth';
import { auth } from 'config/firebase';
import { getAdditionalUserInfo, getRedirectResult } from 'firebase/auth';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

/**
 * @description - Get the result from the redirect and sign in the user
 * @returns - loading - Returns the state of the user creation
 **/
export const useProvider = (): [
  loading: boolean,
  setLoading: Dispatch<SetStateAction<boolean>>
] => {
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    getRedirectResult(auth).then(async (result) => {
      if (result) {
        setLoading(true);

        if (getAdditionalUserInfo(result)?.isNewUser) {
          const { uid, displayName, email } = result.user;

          // Generate a username for the user
          const username =
            displayName?.replace(' ', '-').toLocaleLowerCase() +
            Date.now().toString();
          // Create an Image of the photoURL is null
          const photoURL =
            result.user.photoURL ||
            `https://avatars.dicebear.com/api/adventurer/${uid}.svg`;

          try {
            await commitUserData(
              uid,
              username,
              email as string,
              displayName as string,
              photoURL
            );
          } catch (error) {
            setLoading(false);
            console.error(error);
          }
        }

        // Get the user id Token
        const idToken = await result.user.getIdToken();

        // Create a session for the user
        try {
          await createSession(idToken);
          setLoading(false);
        } catch (error) {
          setLoading(false);
          console.log(error);
        }
      }
    });
  });

  return [loading, setLoading];
};
