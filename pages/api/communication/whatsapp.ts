import { NextApiRequest, NextApiResponse } from "next";

const accountSid = "ACb771fa0c82b17cb1d5043068cc9f0bbd";
const authToken = "f564b2c7f357afe9d656d3e835c47e40";
const client = require("twilio")(accountSid, authToken);

export default async function whatsApp(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Handle invalid methods
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  const { message, contactNumber } = req.body;

  try {
    await client.messages.create({
      body: message,
      from: "whatsapp:+14155238886",
      to: `whatsapp:+94${contactNumber}`,
    });

    return res.status(200).send("Message send");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal server error");
  }
}
