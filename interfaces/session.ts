import { IronSession } from "iron-session";
import { IUser } from "./firestore";

export type Session = 'uid' | 'username' | 'email' | 'displayName' | 'photoURL';

export interface ISessionOptions {
  cookieName: string;
  password: string;
  cookieOptions: {
    secure: boolean;
  };
}

export type ISession = IronSession & IUser;
