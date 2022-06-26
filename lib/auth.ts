import { database } from '@interfaces/firestore';
import { db } from 'config/firebase';
import { doc, writeBatch } from 'firebase/firestore';

/**
 * @description - Create a user session
 * */
export const createSession = async (idToken: string) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
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
