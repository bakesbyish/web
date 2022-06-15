import { ShoppingBagIcon, CollectionIcon } from '@heroicons/react/outline';

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

export const collections = [
  {
    name: 'Cake boards',
    href: '#',
    description:
      'The best cake boards you can buy, handmade with high-quality materials',
  },
  {
    name: 'Cake boxses',
    href: '#',
    description: 'The best cake boxses that you can find in the market',
  },
  {
    name: 'Toppers',
    href: '#',
    description: 'Cake toppers for decorating all your cakes',
  },
];

export const callsToAction = [
  { name: 'Browse all Collections', href: '#', icon: CollectionIcon },
];

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
