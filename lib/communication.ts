import { ICheckoutForm } from './forms';

/**
 * @description - Send WhatsApp message to given number with the given message
 * @params {string} contactNumber - The contact number that you need to send the message to
 * @params {string} message - The message that needs to be sent
 */
export const sendWhatsAppMessage = async (
  contactNumber: string,
  message: string
) => {
  const domain =
    process.env.NODE_ENV === 'production'
      ? 'https://bakesbyish.com'
      : 'http://localhost:3000';

  await fetch(`${domain}/api/communication/whatsapp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ contactNumber, message }),
  });
};

/**
 * @description - Send WhatsApp message to the merchant WhatsappAccount
 * @params {string} message - The message that needs to be sent
 */
export const sendWhatsAppMessageToMerchant = async (message: string) => {
  const domain =
    process.env.NODE_ENV === 'production'
      ? 'https://bakesbyish.com'
      : 'http://localhost:3000';

  const contactNumber = '760471427';

  await fetch(`${domain}/api/communication/whatsapp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ contactNumber, message }),
  });
};

/**
 * @description - Notify the merchant and the customers regarding the order
 * @param {any} items - The items in the users cart
 * @param {ICheckoutForm} data - The data obtained from the user filling the form
 * @param {string | null} discountCode - The discount code if it exsists
 * @returns {number} - The status code of the operation
 */
export const notifyOrder = async (
  items: any,
  data: ICheckoutForm,
  discountCode: string | number
): Promise<number> => {
  const response = await fetch('/api/orders/notify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ items, data, discountCode }),
  });

  return response.status;
};
