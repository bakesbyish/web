import { sessionOptions } from 'config/session';
import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';

export default withIronSessionApiRoute(async function (
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Handle invalid methods
  if (req.method !== 'DELETE') {
    return res.status(405).send('Method not allowed');
  }

  try {
    // Destroy the session
    req.session.destroy();
    return res.status(200).send('Session destroyed');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal server error');
  }
},
sessionOptions);
