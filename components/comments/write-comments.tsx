import { Loader } from '@components/utils/loader';
import { useCommentsContext } from '@context/comments';
import { useBakesbyIshcontext } from '@context/context';
import { yupResolver } from '@hookform/resolvers/yup';
import { database, IComment } from '@interfaces/firestore';
import { classNames } from '@lib/utils';
import { realtime } from 'config/firebase';
import { ref, serverTimestamp, set } from 'firebase/database';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

export const WriteComments = (props: { slug: string }) => {
  const { user, validating } = useBakesbyIshcontext();
	const { setComments } = useCommentsContext();
  const [loading, setLoading] = useState<boolean>(false);

  const formSchema = yup.object().shape({
    comment: yup
      .string()
      .required('Enter a comment')
      .min(50, 'Comment must be larger than 50 characters')
      .max(300, 'Comment should not be larger than 300 characters'),
  });

  interface IFormInput {
    comment: string;
  }

  const { register, handleSubmit, formState } = useForm<IFormInput>({
    resolver: yupResolver(formSchema),
  });

  const { errors } = formState;

  const onSubmit = async (data: IFormInput) => {
    const { comment } = data;
    setLoading(true);
    if (user) {
      const cid = user.uid + Date.now().toString();

      await set(
        ref(
          realtime,
          `${database.products}/${props.slug}/${database.collections.products.comments}/${database.collections.products.users}/${cid}`
        ),
        {
          uid: user.uid,
          cid,
          comment: comment,
          displayName: user.displayName,
          photoURL: user.photoURL,
          createdAt: serverTimestamp(),
          likes: {
            likes: 0,
          },
          dislikes: {
            dislikes: 0,
          },
        }
      );

			setComments(previousComments => [...previousComments, {
				cid,
				uid: user.uid,
				displayName: user.displayName,
				photoURL: user.photoURL,
				comment
			} as IComment])

    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full px-5 sm:px-20">
      <div className="mb-4 w-full bg-gray-50 rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
        <div className="py-2 px-4 bg-white rounded-t-lg dark:bg-gray-800">
          <label className="sr-only">Your comment</label>
          <textarea
            id="comment"
            rows={4}
            className="px-0 w-full text-sm text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
            placeholder="Write a comment..."
            {...register('comment')}
          ></textarea>
          {errors.comment && (
            <p className="text-red-600">{errors.comment.message}</p>
          )}
        </div>
        <div className="flex justify-between items-center py-2 px-3 border-t dark:border-gray-600">
          <button
            type="submit"
            disabled={user ? false : true}
            className={classNames(
              'inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-black bg-rose-300 rounded-lg',
              'focus:ring-4 focus:ring-rose-400 hover:bg-rose-400'
            )}
          >
            {validating ? (
              <Loader width={6} height={6} />
            ) : (
              <>
                {user ? (
                  <>
                    {loading ? <Loader width={6} height={6} /> : 'Post comment'}
                  </>
                ) : (
                  <Link href="/register">
                    <p>Login / Register to comment</p>
                  </Link>
                )}
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};
