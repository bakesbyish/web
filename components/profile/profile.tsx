import { Loader } from '@components/utils/loader';
import { useBakesbyIshcontext } from '@context/context';
import { useProfileContext } from '@context/profile';
import { BadgeCheckIcon, XCircleIcon } from '@heroicons/react/solid';
import { yupResolver } from '@hookform/resolvers/yup';
import { database } from '@interfaces/firestore';
import { updateSession } from '@lib/auth';
import { uploadToStorage } from '@lib/storage';
import { classNames } from '@lib/utils';
import { db } from 'config/firebase';
import { doc, onSnapshot, updateDoc, writeBatch } from 'firebase/firestore';
import debounce from 'lodash.debounce';
import Image from 'next/image';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import * as yup from 'yup';

export const Profile = () => {
  const { user } = useProfileContext();
  const { mutate } = useBakesbyIshcontext();

  interface IFormData {
    username: string;
    about: string | null;
    profilePicture: FileList | null;
    coverPicture: File[] | null;
  }

  const formSchema = yup.object().shape(
    {
      username: yup
        .string()
        .required()
        .max(40, 'Username cannot be greater than 40 characters')
        .min(3, 'Username cannot be smaller than 3 characters'),
      about: yup
        .string()
        .nullable()
        .notRequired()
        .when('about', {
          is: (value: { length: null | number }) => value?.length,
          then: (rule) =>
            rule
              .min(20, 'About should not be less than 20 characters')
              .max(200, 'About should not be greater than 200 characters'),
        }),
    },
    [['about', 'about']]
  );

  const {
    register,
    watch,
    handleSubmit,
    setError,
    clearErrors,
    formState,
    setValue,
    control,
    reset,
  } = useForm<IFormData>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      username: user!.username,
      about: user?.about,
    },
  });
  const { errors } = formState;

  const { dirtyFields } = useFormState({
    control,
  });

  const username = watch('username');
  const profilePicture = watch('profilePicture');
  const coverPicture = watch('coverPicture');

  const [loading, setLoading] = useState<boolean>(false);

  const [usernameValid, setUsernameValid] = useState<boolean>(true);
  const [usernameValidating, setUsernameValidating] = useState<boolean>(false);

  // eslint-disable-next-line
  const checkUsername = useCallback(
    debounce((username: string) => {
      let unsubscribe: unknown;
      setUsernameValidating(true);

      if (username.length >= 3) {
        unsubscribe = onSnapshot(
          doc(db, database.usernames, username),
          (doc) => {
            if (doc.exists()) {
              setUsernameValidating(false);
              setUsernameValid(false);
              dirtyFields.username &&
                setError('username', {
                  type: 'manual',
                  message: 'This username is already taken',
                });
            } else {
              setUsernameValidating(false);
              setUsernameValid(true);
              clearErrors();
            }
          }
        );
      }

      return unsubscribe;
    }, 500),
    []
  );

  useEffect(() => {
    checkUsername(username);
    // eslint-disable-next-line
  }, [username, checkUsername]);

  const profilePictureUploadRef = useRef<HTMLInputElement>(null);

  const formSubmit = async (data: IFormData) => {
    const userRef = doc(db, database.users, user!.uid);
    const ref = database.collections.users;

    setLoading(true);

    if (data.username !== user!.username) {
      const oldUsernameRef = doc(db, database.usernames, user!.username);
      const newUsernameRef = doc(db, database.usernames, data.username);

      const batch = writeBatch(db);

      batch.update(userRef, {
        [ref.username]: data.username,
      });
      batch.set(newUsernameRef, {
        [ref.uid]: user!.uid,
      });
      batch.delete(oldUsernameRef);

      await batch.commit();
      await updateSession('username', data.username);

      mutate();
    }

    if (data.about !== user!.about) {
      await updateDoc(userRef, {
        [ref.about]: data.about,
      });
    }

    if (data.profilePicture?.length) {
      const downloadURL = await uploadToStorage(
        data.profilePicture[0],
        `users/${user!.uid}/profile`,
        'profile.jpg'
      );

      if (downloadURL) {
        await updateDoc(userRef, {
          [ref.photoURL]: downloadURL,
        });
        await updateSession('photoURL', downloadURL);

        mutate();
      }
    }

    if (data.coverPicture?.length) {
      const downloadURL = await uploadToStorage(
        data.coverPicture[0],
        `users/${user!.uid}/profile`,
        'cover.jpg'
      );

      if (downloadURL) {
        await updateDoc(userRef, {
          [ref.coverPhoto]: downloadURL,
        });
      }
    }

    reset({
      username: data.username ? data.username : user?.username,
      about: data.about ? data.about : user?.about ? user.about : null,
      profilePicture: null,
      coverPicture: null,
    });
    setLoading(false);
  };

  return (
    <div>
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
              Profile
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-white/80">
              This information will be displayed publicly so be careful what you
              share.
            </p>
          </div>
        </div>
        <div className="mt-5 md:mt-0 md:col-span-2">
          <form onSubmit={handleSubmit(formSubmit)}>
            <div className="shadow sm:rounded-md sm:overflow-hidden">
              <div className="px-4 py-5 bg-white dark:bg-gray-900 space-y-6 sm:p-6">
                <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-3 sm:col-span-2">
                    <label
                      htmlFor="company-website"
                      className="block text-sm font-medium text-gray-700 dark:text-white"
                    >
                      Username
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <input
                        type="text"
                        id="username"
                        {...register('username', {
                          min: 3,
                          max: 20,
                        })}
                        className={classNames(
                          'focus:ring-rose-400 focus:border-rose-400 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300',
                          'dark:text-black',
                          dirtyFields.username ? '' : 'rounded-r-md'
                        )}
                        placeholder="Enter a username"
                      />
                      {dirtyFields.username ? (
                        <span
                          className={classNames(
                            'inline-flex items-center px-3 rounded-r-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm'
                          )}
                        >
                          {usernameValidating ? (
                            <Loader width={6} height={6} />
                          ) : (
                            <>
                              {usernameValid ? (
                                <BadgeCheckIcon className="w-7 h-7 text-green-600" />
                              ) : (
                                <XCircleIcon className="w-7 h-7 text-red-600" />
                              )}
                            </>
                          )}
                        </span>
                      ) : null}
                    </div>
                    {errors.username ? (
                      <label className="block text-sm font-medium text-red-600 mt-2">
                        {errors.username?.message}
                      </label>
                    ) : null}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="about"
                    className="block text-sm font-medium text-gray-700 dark:text-white"
                  >
                    About
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="about"
                      rows={3}
                      {...register('about', {
                        min: 20,
                        max: 200,
                      })}
                      className={classNames(
                        'shadow-sm focus:ring-rose-400 focus:border-rose-400 mt-1 block w-full sm:text-sm',
                        'border border-gray-300 rounded-md dark:text-black'
                      )}
                      placeholder="Tell us about your self"
                      defaultValue={''}
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500 dark:text-white/80">
                    Brief description for your profile. URLs are hyperlinked.
                  </p>

                  {errors.about ? (
                    <label className="block text-sm font-medium text-red-600 mt-2">
                      {errors.about?.message}
                    </label>
                  ) : null}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white">
                    Photo
                  </label>
                  <div className="mt-1 flex items-center">
                    <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                      <Image
                        src={user!.photoURL}
                        alt={user!.displayName}
                        width={50}
                        height={50}
                        className="rounded-full"
                      />
                    </span>
                    <input
                      type="file"
                      accept="image/png, image/jpg. image/jpeg"
                      ref={profilePictureUploadRef}
                      onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        event.currentTarget.files instanceof FileList &&
                          setValue('profilePicture', event.currentTarget.files);
                      }}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => profilePictureUploadRef.current?.click()}
                      className={classNames(
                        'ml-5 bg-rose-400 py-2 px-3 border border-rose-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700',
                        'hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-400'
                      )}
                    >
                      Change
                    </button>
                  </div>

                  {profilePicture?.length ? (
                    <p className="text-sm text-gray-700 dark:text-white/80">
                      {profilePicture[0].name}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white">
                    Cover photo
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600 dark:text-white/80">
                        <label
                          htmlFor="file-upload"
                          className={classNames(
                            'relative cursor-pointer bg-white dark:bg-gray-900 rounded-md font-medium text-rose-400 hover:text-rose-400',
                            'focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-rose-400'
                          )}
                        >
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            type="file"
                            accept="image/png, image/jpg, image/jpeg"
                            {...register('coverPicture')}
                            className="sr-only"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-white/80">
                        PNG, JPG, GIF up to 10MB
                      </p>
                      {coverPicture?.length ? (
                        <p className="text-xs text-gray-500 dark:text-white/80">
                          {coverPicture[0].name}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 dark:border-t dark:border-slate-600 bg-gray-50 dark:bg-gray-900 text-right sm:px-6">
                <button
                  type="submit"
                  disabled={(dirtyFields.username && !usernameValid) || loading}
                  className={classNames(
                    'inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium',
                    'rounded-md text-white bg-rose-400 hover:bg-rose-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-400'
                  )}
                >
                  {loading ? (
                    <Loader width={5} height={5} />
                  ) : (
                    <span>Save</span>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
