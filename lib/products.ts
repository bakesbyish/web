/**
 * @description - Get the discount corresponding to the code is exsists
 * @param {string} code - The discount code
 * @returns {number} discount - The discount corresponding to the code if the code is not valid this will be 0
 * @returns {boolean} exsists - The exsistance of the discount document
 * */
export const validateDiscount = async (
  code: string
): Promise<{ discount: number; exsists: boolean }> => {
  const response = await fetch(`/api/discounts/discount?code=${code}`, {
    method: 'GET',
  });

  const { discount, exsists } = await response.json();
  return { discount, exsists };
};
