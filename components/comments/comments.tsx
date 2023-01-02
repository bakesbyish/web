import { CommentsContext } from '@context/comments';
import { IComment } from '@interfaces/firestore';
import { useState } from 'react';
import { ListComments } from './list-comments';
import { WriteComments } from './write-comments';

export const Comments = (props: { slug: string }) => {
  const { slug } = props;
  const [comments, setComments] = useState<IComment[]>([]);

  return (
    <CommentsContext.Provider
      value={{
        comments,
        setComments,
      }}
    >
      <WriteComments slug={slug} />
      <ListComments slug={slug} />
    </CommentsContext.Provider>
  );
};
