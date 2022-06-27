import { IBakesByIshContext } from '@interfaces/context';
import { createContext, useContext } from 'react';
import { mutate } from 'swr';

export const BakesbyIshContext = createContext<IBakesByIshContext>({
  user: null,
  validating: true,
  cartOpen: false,
  setCartOpen: () => false,
	mutate: mutate
});

export const useBakesbyIshcontext = () => {
  return useContext(BakesbyIshContext);
};
