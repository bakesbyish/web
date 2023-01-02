import { database } from '@interfaces/firestore';
import { Session } from '@interfaces/session';
import { auth, db } from 'config/firebase';
import { signOut } from 'firebase/auth';
import { doc, writeBatch } from 'firebase/firestore';

/**
 * @description - Create a user session
 * @param {string} idToken - The unique JWT token of the user
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
 * @param {string} uid - The user id of the user
 * @param {string} username - The username of the user
 * @param {string} email - The email of the user
 * @param {string} displayName - The displayName of the user
 * @param {string} photoURL - The profile picture of the user
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

/**
 * @description - update the session with the given valid key and value
 * @param {Session} key - The key of the value that needs to updated
 * @param {string} value - The value of the key that needs to be updated
 **/
export const updateSession = async (key: Session, value: string) => {
  await fetch('/api/auth/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data: { [key]: value } }),
  });
};
