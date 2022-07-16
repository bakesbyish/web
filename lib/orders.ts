import { OrderStatus } from '@interfaces/firestore';

/**
 * @description - Get the order status name when the order status is given
 * @param {OrderStatus} status - The status of the order
 * @returns {string} - The order status
 **/
export const getOrderStatus = (status: OrderStatus): string => {
  switch (status) {
    case 'processing':
      return 'Processing order';
    case 'shipping':
      return 'Shipping';
    case 'shipped':
      return 'Shipped';
  }
};

/**
 * @description - Get the Description related to the order status
 * @param {OrderStatus} status - The status of the order
 * @returns {string | null} description - The description related to the order status
 **/
export const getOrderDetails = (
  status: OrderStatus
): { description: string | null } => {
  let description: string | null = null;
  switch (status) {
    case 'processing':
      description = 'We may call/text to confirm';
      return { description };
    case 'shipping':
      description = 'Your package will arrive within 2hours';
      return { description };
    case 'shipped':
      description = "Your order has been shipped";
      return { description };
  }
};
