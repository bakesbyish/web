import { ISessionOptions } from "@interfaces/session";

export const sessionOptions: ISessionOptions = {
  cookieName: '__session',
  password: process.env.SESSION_PASSWORD,
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};
