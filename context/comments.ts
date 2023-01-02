import { ICommentsContext } from "@interfaces/context";
import { createContext, useContext } from "react";

export const CommentsContext = createContext<ICommentsContext>({
	comments: [],
	setComments: () => []
})


export const useCommentsContext = () => {
	return useContext(CommentsContext)
}
