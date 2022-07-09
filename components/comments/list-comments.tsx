import { useCommentsContext } from "@context/comments";
import { useState } from "react";


export const ListComments = (props: { slug: string }) => {
	const { slug } = props;
	const { comments, setComments } = useCommentsContext();

	return null

}
