import { Loader } from '@components/utils/loader';
import { useBakesbyIshcontext } from '@context/context';
import { useProfileContext } from '@context/profile';
import { yupResolver } from '@hookform/resolvers/yup';
import { database } from '@interfaces/firestore';
import { updateSession } from '@lib/auth';
import { classNames } from '@lib/utils';
import { db } from 'config/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

export const PersonalInformation = () => {
  const { user } = useProfileContext();
  const { mutate } = useBakesbyIshcontext();

  const [loading, setLoading] = useState<boolean>(false);

  const formSchema = yup.object().shape({
    firstName: yup
      .string()
      .required()
      .min(5, 'firstname should be longer than 5 characters')
      .max(20, 'firstname cannot be longer than 20 characters'),
    lastName: yup
      .string()
      .required()
      .min(5, 'lastname should be longer than 5 characters')
      .max(20, 'lastname cannot be longer than 20 characters'),
    email: yup
      .string()
      .required()
      .email()
      .min(5, 'email should be longer than 5 characters')
      .max(40, 'email should not be greater than 40 characters'),
    address: yup
      .string()
      .required()
      .min(10, 'Address must be greater than 10 characters')
      .max(60, 'Address must not be greater than 60 characters'),
    city: yup
      .string()
      .required()
      .min(2, 'City must be greater than 2 characters')
      .max(20, 'City must be smaller than 20 characters'),
    state: yup
      .string()
      .required()
      .min(2, 'City must be greater than 2 characters'),
    contactNumber: yup
      .string()
      .matches(
        /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
        'Contact number is invalid'
      )
      .required(),
  });

  interface IFormInterface {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    city: string;
    state: string;
    contactNumber: string;
  }

  const { register, formState, handleSubmit, reset } = useForm<IFormInterface>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      firstName: user?.displayName ? user.displayName.split(' ')[0] : undefined,
      lastName: user?.displayName ? user.displayName.split(' ')[1] : undefined,
      email: user?.email ? user.email : undefined,
      address: user?.address?.address ? user.address.address : undefined,
      city: user?.address?.city ? user.address.city : undefined,
      state: user?.address?.state ? user.address.state : undefined,
      contactNumber: user?.contactNumber ? user.contactNumber : undefined,
    },
  });
  const { errors } = formState;

  const formSubmit = async (data: IFormInterface) => {
    setLoading(true);
    const userRef = doc(db, database.users, user!.uid);
    const ref = database.collections.users;

    const displayName = `${data.firstName} ${data.lastName}`;

    if (displayName !== user!.displayName) {
      await updateDoc(userRef, {
        [ref.displayName]: displayName,
      });

      await updateSession('displayName', displayName);
      mutate();
    }

    if (data.email !== user!.email) {
      await updateDoc(userRef, {
        [ref.email]: data.email,
      });

      await updateSession('email', data.email);
      mutate();
    }

    if (data.address !== user?.address?.address) {
      await updateDoc(userRef, {
        [ref.address]: data.address,
      });
    }

    if (data.state !== user?.address?.state) {
      await updateDoc(userRef, {
        [ref.state]: data.state,
      });
    }

    if (data.city !== user?.address?.city) {
      await updateDoc(userRef, {
        [ref.city]: data.city,
      });
    }

    if (data.contactNumber !== user?.contactNumber) {
      await updateDoc(userRef, {
        [ref.contactNumber]: data.contactNumber,
      });
    }

    reset({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      address: data.address,
      state: data.state,
      city: data.city,
      contactNumber: data.contactNumber,
    });
    setLoading(false);
  };

  return (
    <div className="mt-10 sm:mt-0">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
              Personal Information
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-white/80">
              Use a permanent address where you can receive an order.
            </p>
          </div>
        </div>
        <div className="mt-5 md:mt-0 md:col-span-2">
          <form onSubmit={handleSubmit(formSubmit)}>
            <div className="shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 bg-white dark:bg-gray-900 sm:p-6">
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="first-name"
                      className="block text-sm font-medium text-gray-700 dark:text-white"
                    >
                      First name
                    </label>
                    <input
                      type="text"
                      id="first-name"
                      {...register('firstName')}
                      autoComplete="given-name"
                      className="mt-1 focus:ring-rose-400 focus:border-rose-400 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md dark:text-black"
                    />
                    {errors.firstName && (
                      <p className="text-sm text-red-600 mt-2">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="last-name"
                      className="block text-sm font-medium text-gray-700 dark:text-white"
                    >
                      Last name
                    </label>
                    <input
                      type="text"
                      id="last-name"
                      {...register('lastName')}
                      autoComplete="family-name"
                      className="mt-1 focus:ring-rose-400 focus:border-rose-400 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md dark:text-black"
                    />
                    {errors.lastName && (
                      <p className="text-sm text-red-600 mt-2">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>

                  <div className="col-span-6 sm:col-span-4">
                    <label
                      htmlFor="email-address"
                      className="block text-sm font-medium text-gray-700 dark:text-white"
                    >
                      Email address
                    </label>
                    <input
                      type="text"
                      id="email-address"
                      {...register('email')}
                      autoComplete="email"
                      className="mt-1 focus:ring-rose-400 focus:border-rose-400 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md dark:text-black"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-600 mt-2">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="col-span-6">
                    <label
                      htmlFor="street-address"
                      className="block text-sm font-medium text-gray-700 dark:text-white"
                    >
                      Street address
                    </label>
                    <input
                      type="text"
                      id="street-address"
                      {...register('address')}
                      autoComplete="street-address"
                      className="mt-1 focus:ring-rose-400 focus:border-rose-400 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md dark:text-black"
                    />
                    {errors.address && (
                      <p className="text-sm text-red-600 mt-2">
                        {errors.address.message}
                      </p>
                    )}
                  </div>

                  <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-gray-700 dark:text-white"
                    >
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      {...register('city')}
                      autoComplete="address-level2"
                      className="mt-1 focus:ring-rose-400 focus:border-rose-400 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md dark:text-black"
                    />
                    {errors.city && (
                      <p className="text-sm text-red-600 mt-2">
                        {errors.city.message}
                      </p>
                    )}
                  </div>

                  <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                    <label
                      htmlFor="region"
                      className="block text-sm font-medium text-gray-700 dark:text-white"
                    >
                      Province
                    </label>
                    <input
                      type="text"
                      id="province"
                      {...register('state')}
                      autoComplete="address-level1"
                      className="mt-1 focus:ring-rose-400 focus:border-rose-400 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md dark:text-black"
                    />
                    {errors.state && (
                      <p className="text-sm text-red-600 mt-2">
                        {errors.state.message}
                      </p>
                    )}
                  </div>

                  <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                    <label
                      htmlFor="region"
                      className="block text-sm font-medium text-gray-700 dark:text-white"
                    >
                      Contact number
                    </label>
                    <input
                      type="text"
                      id="province"
                      {...register('contactNumber')}
                      autoComplete="contact-number"
                      className="mt-1 focus:ring-rose-400 focus:border-rose-400 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md dark:text-black"
                    />
                    {errors.contactNumber && (
                      <p className="text-sm text-red-600 mt-2">
                        {errors.contactNumber.message}
                      </p>
                    )}
                  </div>
                </div>
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
