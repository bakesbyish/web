import { ICart } from './products';

export interface IUser {
  uid: string;
  username: string;
  email: string;
  displayName: string;
  photoURL: string;
}

export interface IAddress {
  address: string;
  city: string;
  state: string;
}

export interface IUserDocument {
  uid: string;
  username: string;
  displayName: string;
  email: string;
  about: string | null;
  photoURL: string;
  coverPhoto: string | null;
  contactNumber: string | null;
  address: IAddress | null;
  notifications?: boolean;
}

export type ITimestamp = {
  seconds: number;
  nanoseconds: number;
};

export type OrderStatus = 'processing' | 'shipping' | 'shipped';
export type ShippingProviders = 'pickme' | 'uber' | 'koombiyo' | 'custom';

export interface IOrder {
  items: ICart[];
  oid: string;
  address: string;
  state: string;
  city: string;
  contactNumber: string;
  orderedAt: ITimestamp | number;
  uid: string;
  discount: string | null;
  discountCode: string | null;
  orderStatus: OrderStatus;
  visible: boolean;
  shippingProvider: ShippingProviders;
  shippingPrice: number | null;
  deliveryTime: number;
}

enum Users {
  uid = 'uid',
  username = 'username',
  email = 'email',
  displayName = 'displayName',
  photoURL = 'photoURL',
  contactNumber = 'contactNumber',
  address = 'address.address',
  state = 'address.state',
  city = 'address.city',
  about = 'about',
  coverPhoto = 'coverPhoto',
  notifications = 'notifications',
}

enum Usernames {
  uid = 'uid',
}

enum Products {
  hearts = 'hearts',
  comments = 'comments',
  users = 'users',
}

enum Orders {
  oid = 'oid',
  address = 'address',
  state = 'state',
  city = 'city',
  contactNumber = 'contactNumber',
  items = 'items',
  orderedAt = 'orderedAt',
  discount = 'discount',
  discountCode = 'discountCode',
  uid = 'uid',
  orderStatus = 'orderStatus',
  visible = 'visible',
  shippingProvider = 'shippingProvider',
  shippingPrice = 'shippingPrice',
  deliveryTime = 'deliveryTime',
}

export const database = {
  users: 'users',
  usernames: 'usernames',
  products: 'products',
  discounts: 'discounts',
  orders: 'orders',
  collections: {
    users: Users,
    usernames: Usernames,
    products: Products,
    orders: Orders,
  },
};

export interface IComment {
  uid: string;
  cid: string;
  comment: string;
  displayName: string;
  photoURL: string;
  createdAt: number;
}
