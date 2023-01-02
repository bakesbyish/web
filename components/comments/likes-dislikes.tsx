import { useBakesbyIshcontext } from '@context/context';
import { realtime } from 'config/firebase';
import {
  DatabaseReference,
  get,
  increment,
  ref,
  remove,
  set,
  update,
} from 'firebase/database';
import {
  ThumbUpIcon as SolidThumbUpIcon,
  ThumbDownIcon as SolidThumbDownIcon,
} from '@heroicons/react/solid';
import {
  ThumbUpIcon as OutlineThumbUpIcon,
  ThumbDownIcon as OutlineThumbDownIcon,
} from '@heroicons/react/outline';
import { Loader } from '@components/utils/loader';
import { useObject, useObjectVal } from 'react-firebase-hooks/database';

export const LikesDislikes = (props: { slug: string; cid: string }) => {
  const { slug, cid } = props;
  const { user, validating } = useBakesbyIshcontext();

  const likesRef = ref(
    realtime,
    `comments/${cid}/likes/${user?.uid as string}`
  );
  const dislikesRef = ref(
    realtime,
    `comments/${cid}/dislikes/${user?.uid as string}`
  );
  const likesCountRef = ref(
    realtime,
    `products/${slug}/comments/users/${cid}/likes`
  );
  const dislikesCountRef = ref(
    realtime,
    `products/${slug}/comments/users/${cid}/dislikes`
  );

  const [like, likeLoading] = useObject(likesRef);
  const [dislike, dislikeLoading] = useObject(dislikesRef);
  const [likeCount, likeCountLoading] = useObjectVal(likesCountRef);
  const [dislikeCount, dislikeCountloading] = useObjectVal(dislikesCountRef);

  const removeLike = async (likeRef: DatabaseReference) => {
    if (!user) {
      return;
    }

    await remove(likeRef);
    const updates: any = {};
    updates['likes'] = increment(-1);
    await update(likesCountRef, updates);
  };

  const removeDislike = async (dislikeRef: DatabaseReference) => {
    if (!user) {
      return;
    }

    await remove(dislikeRef);
    const updates: any = {};
    updates['dislikes'] = increment(-1);
    await update(dislikesCountRef, updates);
  };

  const addLike = async () => {
    if (!user) {
      return;
    }

    const likeDoc = await get(likesRef);
    if (likeDoc.exists()) {
      return removeLike(likesRef);
    }

    const dislikeDoc = await get(dislikesRef);
    if (dislikeDoc.exists()) {
      await removeDislike(dislikesRef);
    }

    await set(likesRef, {
      uid: user.uid,
    });
    const updates: any = {};
    updates['likes'] = increment(1);
    await update(likesCountRef, updates);
  };

  const addDislike = async () => {
    if (!user) {
      return;
    }

    const dislikeDoc = await get(dislikesRef);
    if (dislikeDoc.exists()) {
      return removeDislike(dislikesRef);
    }

    const likeDoc = await get(likesRef);
    if (likeDoc.exists()) {
      await removeLike(likesRef);
    }

    await set(dislikesRef, {
      uid: user.uid,
    });
    const updates: any = {};
    updates['dislikes'] = increment(1);
    await update(dislikesCountRef, updates);
  };

  return validating || likeCountLoading || dislikeCountloading ? (
    <Loader />
  ) : (
    <>
      {user ? (
        <div className="flex items-center justify-center gap-2">
          <>
            {likeLoading ? (
              <Loader />
            ) : (
              <>
                {like?.exists() ? (
                  <>
                    <SolidThumbUpIcon
                      type="button"
                      onClick={async () => await addLike()}
                      className="w-6 h-6"
                    />
                    <span className="ml-1 cursor-pointer">
                      {(likeCount as any)?.likes}
                    </span>
                  </>
                ) : (
                  <>
                    <OutlineThumbUpIcon
                      type="button"
                      onClick={async () => await addLike()}
                      className="w-6 h-6"
                    />
                    <span className="ml-1 cursor-pointer">
                      {(likeCount as any)?.likes}
                    </span>
                  </>
                )}
              </>
            )}
          </>

          <>
            {dislikeLoading ? (
              <Loader />
            ) : (
              <>
                {dislike?.exists() ? (
                  <>
                    <SolidThumbDownIcon
                      type="button"
                      onClick={async () => await addDislike()}
                      className="w-6 h-6 cursor-pointer"
                    />
                    <span className="ml-1">
                      {(dislikeCount as any)?.dislikes}
                    </span>
                  </>
                ) : (
                  <>
                    <OutlineThumbDownIcon
                      type="button"
                      onClick={async () => await addDislike()}
                      className="w-6 h-6 cursor-pointer"
                    />
                    <span className="ml-1">
                      {(dislikeCount as any)?.dislikes}
                    </span>
                  </>
                )}
              </>
            )}
          </>
        </div>
      ) : (
        <div className="flex item-center justify-center gap-2">
          <OutlineThumbUpIcon
            type="button"
            onClick={() => console.log('Log in to like or dislike')}
            className="w-6 h-6 cursor-pointer"
          />
          <span className="ml-1">{(likeCount as any)?.likes}</span>
          <OutlineThumbDownIcon
            type="button"
            onClick={() => console.log('Log in to like or dislike')}
            className="w-6 h-6 cursor-pointer"
          />
          <span className="ml-1">{(dislikeCount as any)?.dislikes}</span>
        </div>
      )}
    </>
  );
};
