import { sessionOptions } from 'config/session';
import { ISession, Session } from 'interfaces/session';
import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';

export default withIronSessionApiRoute(async function (
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Handle invalid methods
  if (req.method !== 'POST') {
    return res.status(405).send('Method not allowed');
  }

  const { data } = req.body;

  if (!data) {
    return res.status(400).send('Insufficent data');
  }

  try {
    const keys = Object.keys(data);
    const values = Object.values(data);

    const validKeys = ['uid', 'username', 'email', 'displayName', 'photoURL'];

    const keysValid = keys.every((key) => {
      return validKeys.includes(key);
    });

    if (!keysValid) {
      return res
        .status(400)
        .send('You are trying to update feilds which are not in the session');
    }

    const session = req.session as ISession;

    keys.map((key, index: number) => {
      session[key as Session] = values[index] as string;
    });

    await session.save();

    return res.status(200).send('Updated the session');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal server error');
  }
},
sessionOptions);
