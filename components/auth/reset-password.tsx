import { yupResolver } from '@hookform/resolvers/yup';
import { classNames } from '@lib/utils';
import { auth } from 'config/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

export const ResetPassword = (props: {
  setResetPassword: Dispatch<SetStateAction<boolean>>;
}) => {
  const { setResetPassword } = props;

  const formSchema = yup.object().shape({
    email: yup
      .string()
      .required('Enter an email to reset your password')
      .email('The email address is not valid')
      .max(255, 'Email should not be greater than 255 characters'),
  });

  interface IFormInputs {
    email: string;
  }

  const { register, handleSubmit, formState } = useForm<IFormInputs>({
    resolver: yupResolver(formSchema),
  });

  const { errors } = formState;

  const onFormSubmit = (data: IFormInputs) => {
    const { email } = data;

    // Send password reset email link
    sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log('Password reset email is sent');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 shadow rounded lg:w-1/3  md:w-1/2 w-full p-10 mt-16">
      <p
        tabIndex={0}
        role="heading"
        aria-level={1}
        aria-label="Login to your account"
        className="text-2xl font-extrabold leading-6 text-gray-800 dark:text-white"
      >
        Forgot your password ??
      </p>

      <p className="text-sm mt-4 font-medium leading-none text-gray-500 dark:text-white">
        <button
          tabIndex={0}
          role="button"
          aria-label="back"
          onClick={() => setResetPassword(false)}
          className="text-sm font-medium leading-none underline text-rose-400 cursor-pointer"
        >
          {' '}
          back
        </button>
      </p>

      <form onSubmit={handleSubmit(onFormSubmit)} className="mt-8">
        <div>
          <label className="text-sm font-medium leading-none text-gray-800 dark:text-white">
            Email
          </label>
          <input
            aria-label="enter email adress"
            role="input"
            type="email"
            {...register('email')}
            className="bg-gray-200 border rounded focus:outline-none text-xs font-medium leading-none text-gray-800 py-3 w-full pl-3 mt-2"
          />

          {errors.email && (
            <p className="text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div className="mt-8">
          <button
            role="button"
            type="submit"
            aria-label="create my account"
            className={classNames(
              'focus:ring-2 focus:ring-offset-2 focus:ring-rose-400 text-sm font-semibold leading-none text-black',
              'focus:outline-none bg-rose-400 border rounded hover:bg-rose-400 py-4 w-full'
            )}
          >
            Reset my password
          </button>
        </div>
      </form>
    </div>
  );
};
