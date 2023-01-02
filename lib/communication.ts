import { ICheckoutForm } from './forms';

/**
 * @description - Notify the merchant and the customers regarding the order
 * @param {any} items - The items in the users cart
 * @param {ICheckoutForm} data - The data obtained from the user filling the form
 * @param {string | null} discountCode - The discount code if it exsists
 */
export const notifyOrder = async (
  items: any,
  data: ICheckoutForm,
  discountCode: string | number
) => {
  const response = await fetch('/api/orders/notify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ items, data, discountCode }),
  });
};
