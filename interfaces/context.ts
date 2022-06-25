import { Dispatch, SetStateAction } from "react";

export interface IBakesByIshContext {
	cartOpen: boolean;
	setCartOpen: Dispatch<SetStateAction<boolean>>
}
