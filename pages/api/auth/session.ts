import { ISession } from '@interfaces/session';
import { sessionOptions } from 'config/session';
import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';

export default withIronSessionApiRoute(async function (
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Handle invalid methods
  if (req.method !== 'GET') {
    return res.status(405).send('Method not allowed');
  }

  try {
    const session = req.session as ISession;

    const uid = session.uid || '';
    const username = session.username || '';
    const email = session.email || '';
    const displayName = session.displayName || '';
    const photoURL = session.photoURL || '';

    if (!(uid && username && email && photoURL && displayName)) {
      return res.status(200).json({
				user: null
      });
    }

    return res.status(200).json({
			user: {
				uid,
				username,
				email,
				displayName,
				photoURL
			}
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal server error');
  }
},
sessionOptions);
