import { database } from '@interfaces/firestore';
import { firebaseAdmin } from 'config/firebase-admin';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function discount(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Handle invalid methods
  if (req.method !== 'GET') {
    return res.status(405).send('Method not allowed');
  }

  // Get the coupon code
  const { code } = req.query as { code: string };

  if (!code) {
    return res.status(400).send('Insufficent data');
  }

  const db = firebaseAdmin.firestore();

  const discountRef = db.collection(database.discounts).doc(code);
  const discountSnapshot = await discountRef.get();

  if (!discountSnapshot.exists) {
    return res.status(200).send({ discount: null, exsists: false });
  }

  const { discount, used } = discountSnapshot.data() as {
    discount: number;
    used?: boolean;
  };

  if (used) {
    return res.status(200).json({ discount: 0, exsists: false });
  }

  if (!discount) {
    return res.status(200).json({ discount: 0, exsists: true });
  }

  await discountRef.update({
    used: true,
  });
  return res.status(200).json({ discount, exsists: true });
}
