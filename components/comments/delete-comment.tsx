import { useCommentsContext } from '@context/comments';
import { useBakesbyIshcontext } from '@context/context';
import { TrashIcon } from '@heroicons/react/outline';
import { getIndex } from '@lib/utils';
import { realtime } from 'config/firebase';
import { ref, remove } from 'firebase/database';

export const DeleteComment = (props: {
  ownerUid: string;
  cid: string;
  slug: string;
}) => {
  const { ownerUid, cid, slug } = props;
  const { user, validating } = useBakesbyIshcontext();
  const { comments, setComments } = useCommentsContext();

  const likesAndDislikesRef = ref(realtime, `comments/${cid}`);
  const commentRef = ref(realtime, `products/${slug}/comments/users/${cid}`);

  return !validating ? (
    <>
      {ownerUid === user?.uid ? (
        <TrashIcon
          type="button"
          onClick={async () => {
            await remove(likesAndDislikesRef);
            await remove(commentRef);

            setComments((previousComments) => [
              ...previousComments.slice(0, getIndex(comments, 'cid', cid)),
              ...previousComments.slice(getIndex(comments, 'cid', cid) + 1),
            ]);
          }}
          className="w-6 h-6 text-red-600 cursor-pointer"
        />
      ) : null}
    </>
  ) : null;
};
