export interface IUser {
  uid: string;
  username: string;
  email: string;
  displayName: string;
  photoURL: string;
}

export interface IUserDocument {
  uid: string;
  username: string;
  displayName: string;
  email: string;
  photoURL: string;
  contactNumber?: number;
  address?: {
    address: string;
    city: string;
    state: string;
  };
}

enum Users {
  uid = 'uid',
  username = 'username',
  email = 'email',
  displayName = 'displayName',
  photoURL = 'photoURL',
  contactNumber = 'contactNumber',
  address = 'address',
}

enum Usernames {
  uid = 'uid',
}

enum Products {
  hearts = 'hearts',
  comments = 'comments',
  users = 'users',
}

export const database = {
  users: 'users',
  usernames: 'usernames',
  products: 'products',
  collections: {
    users: Users,
    usernames: Usernames,
    products: Products,
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
