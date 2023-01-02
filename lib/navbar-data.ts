import {
  ShoppingBagIcon,
  CollectionIcon,
  UserIcon,
  ReceiptTaxIcon,
} from '@heroicons/react/outline';

export const pages = [
  {
    name: 'Shop',
    href: '/shop',
    icon: ShoppingBagIcon,
  },
  {
    name: 'Collections',
    href: '/collections',
    icon: CollectionIcon,
  },
];

export const mobilePages = [
  {
    name: 'Shop',
    href: '/shop',
    icon: ShoppingBagIcon,
    auth: false,
  },
  {
    name: 'Collections',
    href: '/collections',
    icon: CollectionIcon,
    auth: false,
  },
  {
    name: 'Profile',
    href: '/profile',
    icon: UserIcon,
    auth: true,
  },
  {
    name: 'My Orders',
    href: '/orders',
    icon: ReceiptTaxIcon,
    auth: true,
  },
];

export const profileDropDown = [
  {
    name: 'Profile',
    href: 'profile',
    icon: UserIcon,
  },
  {
    name: 'Orders',
    href: '/orders',
    icon: ReceiptTaxIcon,
  },
];

export const collections = [
  {
    name: 'Cake boards',
    href: '/collections/cake-boards',
    description:
      'The best cake boards you can buy, handmade with high-quality materials',
  },
  {
    name: 'Cake boxses',
    href: '/collections/cake-boxses',
    description: 'The best cake boxses that you can find in the market',
  },
  {
    name: 'Toppers',
    href: '/collections/cake-toppers',
    description: 'Cake toppers for decorating all your cakes',
  },
];

export const callsToAction = [
  { name: 'Browse all Collections', href: '#', icon: CollectionIcon },
];
