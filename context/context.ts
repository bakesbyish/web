import { IBakesByIshContext } from '@interfaces/context';
import { createContext, useContext } from 'react';

export const BakesbyIshContext = createContext<IBakesByIshContext>({
  cartOpen: false,
  setCartOpen: () => false,
});

export const useBakesbyIshcontext = () => {
  return useContext(BakesbyIshContext);
};
