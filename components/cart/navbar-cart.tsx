import { useBakesbyIshcontext } from '@context/context';
import { ShoppingBagIcon } from '@heroicons/react/solid';
import { classNames } from '@lib/utils';
import { useCart } from 'react-use-cart';

export const Cart = () => {
  const { items } = useCart();
  const { setCartOpen } = useBakesbyIshcontext();

  return (
    <button
      onClick={() => {
        setCartOpen(true);
      }}
      className={classNames(
        'py-4 px-1 mr-0 sm:mr-2 relative border-2 border-transparent text-pink-400 rounded-full hover:text-rose-400',
        'transition duration-150 ease-in-out'
      )}
      aria-label="Cart"
    >
      <ShoppingBagIcon className="w-8 h-8" />

      {items.length ? (
        <span className="absolute inset-0 object-right-top -mr-6">
          <div
            className={classNames(
              'animate-pulse',
              'inline-flex items-center px-1.5 py-0.5 border-2 border-white rounded-full text-xs font-semibold leading-4 bg-rose-300 text-black'
            )}
          >
            {items.length}
          </div>
        </span>
      ) : null}
    </button>
  );
};
