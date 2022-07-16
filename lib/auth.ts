import { database } from '@interfaces/firestore';
import { auth, db } from 'config/firebase';
import { signOut } from 'firebase/auth';
import { doc, writeBatch } from 'firebase/firestore';

/**
 * @description - Create a user session
 * */
export const createSession = async (idToken: string) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      idToken,
    }),
  });

  return response;
};

/**
 * @description - Add Registered user data to the database
 * */
export const commitUserData = async (
  uid: string,
  username: string,
  email: string,
  displayName: string,
  photoURL: string
) => {
  const userRef = doc(db, database.users, uid);
  const usernameRef = doc(db, database.usernames, username);

  const batch = writeBatch(db);

  batch.set(userRef, {
    uid,
    username,
    email,
    displayName,
    photoURL,
  });

  batch.set(usernameRef, {
    uid,
  });

  await batch.commit();
};

/**
 * @description - Get the idToken of the user
 * @returns {string | null} - idToken of the user
 * */
export const getIdToken = async (): Promise<string | undefined> => {
  return await auth.currentUser?.getIdToken(true);
};

/**
 * @description - Logout the user from firebase and destroy the user session
 * */
export const logout = async () => {
  const response = await fetch('/api/auth/logout', {
    method: 'DELETE',
  });

  if (Number(response.status) === 200) {
    await signOut(auth);
  }
};
