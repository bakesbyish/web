import { IronSession } from "iron-session";

export interface ISessionOptions {
  cookieName: string;
  password: string;
  cookieOptions: {
    secure: boolean;
  };
}

export type ISession = IronSession & {
  uid: string;
  username: string;
	email: string;
	displayName: string;
	photoURL: string;
};
