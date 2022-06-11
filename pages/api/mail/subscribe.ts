import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Handle invalid methods
  if (req.method !== 'POST') {
    return res.status(405).send('Method not allowed');
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).send('Insufficent data');
  }

  // Email regex validation
  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!emailRegex.test(email)) {
    return res.status(400).send('Email format is incorrect');
  }

  try {
    const response = await fetch(
      'https://api.sendgrid.com/v3/marketing/contacts',
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${process.env.SEND_GRID_API}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contacts: [{ email: email }] }),
      }
    );

    return res.status(response.status).send({
      succsess: response.status >= 200 && response.status < 300 ? true : false,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal server error');
  }
}
