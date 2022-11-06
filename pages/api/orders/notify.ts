import { database } from '@interfaces/firestore';
import { firebaseAdmin } from 'config/firebase-admin';
import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from 'config/session';
import { ISession } from '@interfaces/session';
import { firestore } from 'firebase-admin';
import { ICheckoutForm } from '@lib/forms';
import nodemailer, { Transporter } from 'nodemailer';

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

    await fetch(
      `https://graph.facebook.com/v15.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_ACCSESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: process.env.WHATSAPP_RECEIPENT_PHONE_NUMBER,
          type: 'template',
          template: {
            name: 'order',
            language: {
              code: 'en_US',
            },
            components: [
              {
                type: 'body',
                parameters: [
                  {
                    type: 'text',
                    text: orderRef.id,
                  },
                  {
                    type: 'text',
                    text: displayName,
                  },
                  {
                    type: 'text',
                    text: data.address,
                  },
                  {
                    type: 'text',
                    text: data.state,
                  },
                  {
                    type: 'text',
                    text: data.city,
                  },
                  {
                    type: 'text',
                    text: data.contactNumber,
                  },
                ],
              },
            ],
          },
        }),
      }
    );

    const transporter: Transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    try {
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: 'vinuka.airbus@gmail.com',
        subject: 'New Order from bakesbyish',
        html: message,
      });
    } catch (error) {
      console.error(error);
    }

    res.status(200).send('');
    return;
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal server error');
  }
},
sessionOptions);
