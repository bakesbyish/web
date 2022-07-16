import { Loader } from '@components/utils/loader';
import { BadgeCheckIcon } from '@heroicons/react/solid';
import { OrderStatus } from '@interfaces/firestore';

export const OrderStatusIcon = (props: { status: OrderStatus }) => {
  const { status } = props;

  switch (status) {
    case 'processing':
      return <Loader />;
    default:
      return <BadgeCheckIcon className="w-7 h-7 text-green-600" />;
  }
};
