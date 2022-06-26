import { Loader } from '@components/utils/loader';
import dynamic from 'next/dynamic';

const CheckoutComponent = dynamic<any>(
  () => import('@components/cart/checkout').then((mod) => mod.Checkout),
  { ssr: false, loading: () => <Loader /> }
);

export default function Checkout() {
  return (
    <div className="flex flex-col item-center justify-center min-h-screen">
      <CheckoutComponent />
    </div>
  );
}
