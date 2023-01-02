import { database, IUserDocument } from '@interfaces/firestore';
import { ISession } from '@interfaces/session';
import { firebaseAdmin } from 'config/firebase-admin';
import { sessionOptions } from 'config/session';
import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';

export default withIronSessionApiRoute(async function (
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Handle invalid requests
  if (req.method !== 'POST') {
    return res.status(405).send('Method not allowed');
  }

  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).send('Insufficent data');
  }

  const auth = firebaseAdmin.auth();
  const db = firebaseAdmin.firestore();

  try {
    // Verify the idToken from the admin SDK
    const decoded = await auth.verifyIdToken(idToken);
    const uid = decoded.uid || '';

    if (!uid) {
      return res.status(401).send('Unauthorized');
    }

    // Get the userdata from the database
    const userRef = db.collection('users').doc(uid);
    const userSnapshot = await userRef.get();
    const userData = userSnapshot.data() as IUserDocument;

    const { username, email, displayName, photoURL } = userData;

    if (!(username && email && displayName && photoURL)) {
      console.log(uid, email, displayName, photoURL);
      return res.status(400).send('Login failed');
    }

    const session = req.session as ISession;

    // Save the data to the session
    try {
      session.uid = uid;
      session.username = username;
      session.email = email;
      session.displayName = displayName;
      session.photoURL = photoURL;

      await session.save();
      return res.status(200).send('Session created');
    } catch (error) {
      console.error(error);
      return res.status(500).send('Internal server error');
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal server error');
  }
},
sessionOptions);
