import { KoombiyoIcon } from '@components/icons/koombiyo';
import { PickMeIcon } from '@components/icons/pickme';
import { UberIcon } from '@components/icons/uber';
import { Loader } from '@components/utils/loader';
import { BadgeCheckIcon, UserGroupIcon } from '@heroicons/react/solid';
import { OrderStatus, ShippingProviders } from '@interfaces/firestore';

export const OrderStatusIcon = (props: {
  status: OrderStatus;
  shippingProvider: ShippingProviders | null;
}) => {
  const { status, shippingProvider } = props;

  switch (status) {
    case 'processing':
      return <Loader />;
    case 'shipping':
      switch (shippingProvider) {
        case 'uber':
          return <UberIcon width={10} height={10} />;
        case 'pickme':
          return <PickMeIcon width={0.7} height={0.8} />;
        case 'koombiyo':
          return <KoombiyoIcon width={0.7} height={0.7} />;
        case 'custom':
          return <UserGroupIcon className="w-8 h-8 text-rose-400" />
        default:
          return null;
      }
    default:
      return <BadgeCheckIcon className="w-7 h-7 text-green-600" />;
  }
};
