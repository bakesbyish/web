import { Dispatch, SetStateAction } from 'react';
import { KeyedMutator } from 'swr';
import { IComment, IUser, IUserDocument } from './firestore';

export interface IBakesByIshContext {
  user: IUser | null;
  validating: boolean;
  cartOpen: boolean;
  setCartOpen: Dispatch<SetStateAction<boolean>>;
  mutate: KeyedMutator<any>;
}

export interface ICommentsContext {
  comments: IComment[];
  setComments: Dispatch<SetStateAction<IComment[]>>;
}

export interface IProfileContext {
  user: IUserDocument | undefined;
}
