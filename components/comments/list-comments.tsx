import { Loader } from '@components/utils/loader';
import { useCommentsContext } from '@context/comments';
import { IComment } from '@interfaces/firestore';
import { realtime } from 'config/firebase';
import {
  limitToFirst,
  onValue,
  orderByChild,
  Query,
  query,
  ref,
  startAfter,
} from 'firebase/database';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { DeleteComment } from './delete-comment';
import { LikesDislikes } from './likes-dislikes';

const LIMIT = 5;

export const ListComments = (props: { slug: string }) => {
  const { slug } = props;
  const { comments, setComments } = useCommentsContext();

  const [lastCreatedAt, setLastCreatedAt] = useState<number | null>(null);
  const [hideLoadMore, setHideLoadMore] = useState<boolean>(false);
  const [initialLoadingState, setInitialLoadingState] = useState<boolean>(true);
  const [loadMoreCommentsLoadingState, setLoadMoreCommentsLoadingState] =
    useState<boolean>(false);

  // Reference to the comments section in the realtime database
  const commentsRef = ref(realtime, `products/${slug}/comments/users`);

  const getComments = (query: Query) => {
    onValue(
      query,
      (snapshot) => {
        if (!snapshot.exists()) {
          return setHideLoadMore(true);
        }

        let commentsCount = 0;

        const commentsData = Object.keys(snapshot.val()).map((key) => {
          return { [key]: snapshot.val()[key] };
        });

        if (commentsData.length < LIMIT) {
          setHideLoadMore(true);
        }

        commentsData.map((commentData, index: number) => {
          const cid = Object.keys(commentData)[0];

          if (index === LIMIT - 1) {
            setLastCreatedAt(commentData[cid].createdAt);
          }

          if (comments.some((comment) => comment.cid === cid)) {
            return;
          }

          commentsCount++;
          const { uid, displayName, photoURL, comment } = commentData[
            cid
          ] as IComment;

          setComments((previousComments) => [
            ...previousComments,
            {
              cid,
              uid,
              displayName,
              photoURL,
              comment,
            } as IComment,
          ]);
        });

        if (commentsCount === 0) {
          setHideLoadMore(true);
        }
      },
      { onlyOnce: true }
    );
  };

  useEffect(() => {
    const commentsQuery = query(
      commentsRef,
      orderByChild('createdAt'),
      limitToFirst(LIMIT)
    );

    getComments(commentsQuery);
    setInitialLoadingState(false);

    // eslint-disable-next-line
  }, [slug]);

  const getMoreComments = () => {
    const commentsQuery = query(
      commentsRef,
      orderByChild('createdAt'),
      startAfter(lastCreatedAt),
      limitToFirst(LIMIT)
    );

    setLoadMoreCommentsLoadingState(true);
    getComments(commentsQuery);
    setLoadMoreCommentsLoadingState(false);
  };

  return !initialLoadingState ? (
    <div className="flex flex-col items-center justify-center mt-6 w-72 sm:w-[600px]">
      {comments.length ? (
        <>
          <>
            {comments.map((comment, index: number) => (
              <div
                key={index}
                className="mb-4 w-full rounded-lg py-1 px-1 border border-gray-600"
              >
                <div className="flex items-center justify-between py-2 px-3 dark:border-gray-600">
                  <section className="flex items-center justify-center gap-2">
                    <Image
                      src={comment.photoURL}
                      alt={comment.displayName}
                      width={30}
                      height={30}
                      className="rounded-full"
                    />

                    <h1>{comment.displayName}</h1>
                  </section>

                  <section className="flex items-center justify-center gap-2">
                    <DeleteComment
                      ownerUid={comment.uid}
                      cid={comment.cid}
                      slug={slug}
                    />
                    <LikesDislikes slug={slug} cid={comment.cid} />
                  </section>
                </div>
                <div className="py-2 px-4 bg-white rounded-t-lg dark:bg-gray-800">
                  <label className="sr-only">Your comment</label>
                  <p className="break-words">{comment.comment}</p>
                </div>
              </div>
            ))}
          </>

          <div>
            {!hideLoadMore ? (
              <button
                aria-label="Load more comments"
                onClick={() => getMoreComments()}
                disabled={loadMoreCommentsLoadingState}
              >
                {loadMoreCommentsLoadingState ? <Loader /> : 'Load more'}
              </button>
            ) : null}
          </div>
        </>
      ) : null}
    </div>
  ) : (
    <Loader />
  );
};
