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

export const database = {
  users: 'users',
  usernames: 'usernames',
  collections: {
    users: Users,
    usernames: Usernames,
  },
};
