import { database } from '@interfaces/firestore';
import {
  sendWhatsAppMessage,
  sendWhatsAppMessageToMerchant,
} from '@lib/communication';
import { firebaseAdmin } from 'config/firebase-admin';
import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from 'config/session';
import { ISession } from '@interfaces/session';
import { firestore } from 'firebase-admin';
import { ICheckoutForm } from '@lib/forms';

export default withIronSessionApiRoute(async function (
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Handle invalid methods
  if (req.method !== 'POST') {
    return res.status(405).send('Method not allowed');
  }

  const { items, data, discountCode } = req.body as {
    items: any;
    data: ICheckoutForm;
    discountCode: string | null;
  };

  if (!(items && data)) {
    return res.status(400).send('Insufficent data');
  }

  if (items.length >= 100) {
    return res.status(400).send('Who the hell are you');
  }

  const session = (req.session as ISession) || null;
  const uid = session?.uid || null;
  const displayName = session?.displayName || null;

  const db = firebaseAdmin.firestore();
  const ref = database.collections.orders;

  let discount = null;
  let code = discountCode;

  try {
    if (discountCode) {
      const discountRef = db.collection(database.discounts).doc(discountCode);
      const discountSnapshot = await discountRef.get();
      discount = discountSnapshot.data()?.discount || null;

      if (!discount) {
        code = null;
      }
    }
  } catch (error) {
    console.error(error);
  }

  try {
    const orderRef = await db.collection(database.orders).add({
      items,
      [ref.address]: data.address,
      [ref.state]: data.state,
      [ref.city]: data.city,
      [ref.contactNumber]: data.contactNumber,
      [ref.discount]: discount,
      [ref.discountCode]: code,
      [ref.visible]: true,
      [ref.orderStatus]: 'processing',
      [ref.uid]: uid ? uid : null,
      [ref.orderedAt]: firestore.FieldValue.serverTimestamp(),
    });

    await db
      .collection(database.orders)
      .doc(orderRef.id)
      .update({
        [ref.oid]: orderRef.id,
      });

    let message = '';

    message += '*New Order*\n\n';
    message += `        *Order#*: _${orderRef.id}_\n`;
    message += '*Customer Details*\n\n';

    if (displayName) {
      message += `     *Customer name*: ${displayName}\n`;
    }

    message += `        *Address*: ${data.address}\n`;
    message += `        *State*: ${data.state}\n`;
    message += `        *City*: ${data.city}\n`;
    message += `        *Contact#*: ${data.contactNumber}\n\n`;

    message += '*View order*\n\n';
    message += `https://orders.bakesbyish.com?q=${orderRef.id}`;

    await sendWhatsAppMessageToMerchant(message);
    await sendWhatsAppMessage(
      data.contactNumber,
      `Your Order is confirmed!!\n\n          *Order#*: _${orderRef.id}_\n\nWe will contact you shortly to inform you regarding your order\n\nThank you for shopping with *BAKES BY ISH* 😇`
    );

    return res.status(200).send(null);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal server error');
  }
},
sessionOptions);
