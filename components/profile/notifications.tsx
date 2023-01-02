import { Loader } from '@components/utils/loader';
import { useProfileContext } from '@context/profile';
import { database } from '@interfaces/firestore';
import { classNames } from '@lib/utils';
import { db } from 'config/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { ChangeEvent, FormEvent, useState } from 'react';

export const Notifications = () => {
  const { user } = useProfileContext();

  const [value, setValue] = useState<boolean | undefined>(user?.notifications);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const userRef = doc(db, database.users, user!.uid);
    const ref = database.collections.users;

    if (value !== user?.notifications) {
      await updateDoc(userRef, {
        [ref.notifications]: value,
      });
    }

    setLoading(false);
  };

  return (
    <div className="mt-10 sm:mt-0">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
              Notifications
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-white/80">
              Decide which communications you&apos;d like to receive and how.
            </p>
          </div>
        </div>
        <div className="mt-5 md:mt-0 md:col-span-2">
          <form>
            <div className="shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 bg-white dark:bg-gray-900 space-y-6 sm:p-6">
                <fieldset>
                  <legend className="sr-only">By Email</legend>
                  <div
                    className="text-base font-medium text-gray-900 dark:text-white"
                    aria-hidden="true"
                  >
                    By Email
                  </div>
                  <div className="mt-4 space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="offers"
                          name="offers"
                          type="checkbox"
                          defaultChecked={value}
                          onChange={() => setValue(!value)}
                          disabled={loading}
                          className="focus:ring-rose-400 h-4 w-4 text-rose-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="offers"
                          className="font-medium text-gray-700 dark:text-white"
                        >
                          Offers
                        </label>
                        <p className="text-gray-500 dark:text-white/80">
                          Get notified about new promotions, custom offers and
                          more via email
                        </p>
                      </div>
                    </div>
                  </div>
                </fieldset>
              </div>
              <div className="px-4 py-3 dark:border-t dark:border-slate-600 bg-gray-50 dark:bg-gray-900 text-right sm:px-6">
                <button
                  type="submit"
                  disabled={loading}
                  className={classNames(
                    'inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-rose-400',
                    'hover:bg-rose-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-400'
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
