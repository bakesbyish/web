import { Layout } from '@components/layout/layout';
import { EyeIcon } from '@heroicons/react/outline';
import { FacebookIcon } from '@components/icons/facebook';
import { ReactElement, useState } from 'react';
import { TwitterIcon } from '@components/icons/twitter';
import { GoogleIcon } from '@components/icons/google';
import Link from 'next/link';
import { useProvider } from '@hooks/use-provider';
import { Loader } from '@components/utils/loader';
import {
  createUserWithEmailAndPassword,
  FacebookAuthProvider,
  GoogleAuthProvider,
  sendEmailVerification,
  signInWithRedirect,
  TwitterAuthProvider,
} from 'firebase/auth';
import { auth } from 'config/firebase';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { commitUserData, createSession } from '@lib/auth';
import { useBakesbyIshcontext } from '@context/context';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { classNames } from '@lib/utils';
import { DefaultSeo } from '@components/seo/default';

export default function Register() {
  const { mutate } = useBakesbyIshcontext();

  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [creatingAccount, setCreatingAccount] = useState<boolean>(false);

  const [loading] = useProvider();

  const router = useRouter();

  const formSchema = yup.object().shape({
    email: yup
      .string()
      .required('Enter an Email address')
      .email('Must be a valid email address')
      .max(255, 'The email should not be greater than 255 characters'),
    password: yup
      .string()
      .required('Enter a password')
      .min(8, 'The password should be greater than 8 characters')
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character'
      ),
    passwordConfirm: yup
      .string()
      .required('Confirm password is required')
      .oneOf([yup.ref('password')], 'Passwords should match'),
  });

  interface IFormInputs {
    email: string;
    password: string;
    passwordConfirm: string;
  }

  const { register, handleSubmit, formState } = useForm<IFormInputs>({
    resolver: yupResolver(formSchema),
  });

  const { errors } = formState;

  const onFormSubmit = (data: IFormInputs) => {
    const { email, password } = data;
    toast.loading('Creating account');
    setCreatingAccount(true);

    createUserWithEmailAndPassword(auth, email, password).then(
      async (result) => {
        const { user } = result;

        // Send email verification
        sendEmailVerification(user);

        const { uid } = user;
        const name = email.match(/^.+(?=@)/)![0];

        const displayName = name
          .replaceAll('.', ' ')
          .replaceAll('-', ' ')
          .replaceAll('_', ' ');
        const username =
          name.toLowerCase().replaceAll('.', '-').replaceAll('_', '-') +
          Date.now().toString();
        const photoURL = `https://avatars.dicebear.com/api/adventurer/${uid}.svg`;

        try {
          await commitUserData(uid, username, email, displayName, photoURL);
          const idToken = await user.getIdToken();

          await createSession(idToken);
          toast.dismiss();
          toast.success('Account created succsessfully');
          mutate();
          router.push('/');
        } catch (error) {
          toast.error(
            'An error occurred while creating the account,please try again'
          );
          setCreatingAccount(false);
          console.log(error);
        }
      }
    );
  };

  return !loading ? (
    <>
      <DefaultSeo
        title={'Register'}
        description={
          'Register with Bakes By Ish to easily manage, review and schedule your baking orders'
        }
        paths={[
          {
            name: 'register',
            url: '/regsiter',
          },
        ]}
        url={'/register'}
      />
      <main>
        <div className="h-full bg-white dark:bg-gray-800 w-full pt-0 pb-16 sm:py-16 px-4">
          <div className="flex flex-col items-center justify-center">
            <div className="bg-gray-100 dark:bg-gray-900 shadow rounded lg:w-1/3  md:w-1/2 w-full p-10">
              <p
                tabIndex={0}
                role="heading"
                aria-level={1}
                aria-label="Login to your account"
                className="text-2xl font-extrabold leading-6 text-gray-800 dark:text-white"
              >
                Create your account
              </p>
              <p className="text-sm mt-4 font-medium leading-none text-gray-500 dark:text-white">
                Already have an Account?{' '}
                <span
                  tabIndex={0}
                  role="link"
                  aria-label="Sign up here"
                  className="text-sm font-medium leading-none underline text-rose-400 cursor-pointer"
                >
                  {' '}
                  <Link href="/login">
                    <a>Login here</a>
                  </Link>
                </span>
              </p>
              <button
                aria-label="Continue with google"
                role="button"
                onClick={() =>
                  signInWithRedirect(auth, new GoogleAuthProvider())
                }
                className={classNames(
                  'focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-700 py-3.5 px-4 border rounded-lg border-gray-700',
                  'flex items-center w-full mt-10'
                )}
              >
                <GoogleIcon width={5} height={5} />
                <p className="text-base font-medium ml-4 text-gray-700 dark:text-white">
                  Continue with Google
                </p>
              </button>
              <button
                aria-label="Continue with github"
                role="button"
                onClick={() =>
                  signInWithRedirect(auth, new FacebookAuthProvider())
                }
                className={classNames(
                  'focus:outline-none  focus:ring-2 focus:ring-offset-1 focus:ring-gray-700 py-3.5 px-4 border',
                  'rounded-lg border-gray-700 flex items-center w-full mt-4'
                )}
              >
                <FacebookIcon height={5} width={5} />
                <p className="text-base font-medium ml-4 text-gray-700 dark:text-white">
                  Continue with Facebook
                </p>
              </button>
              <button
                aria-label="Continue with twitter"
                role="button"
                onClick={() =>
                  signInWithRedirect(auth, new TwitterAuthProvider())
                }
                className={classNames(
                  'focus:outline-none  focus:ring-2 focus:ring-offset-1 focus:ring-gray-700 py-3.5 px-4 border rounded-lg',
                  'border-gray-700 flex items-center w-full mt-4'
                )}
              >
                <TwitterIcon width={5} height={5} />
                <p className="text-base font-medium ml-4 text-gray-700 dark:text-white">
                  Continue with Twitter
                </p>
              </button>
              <div className="w-full flex items-center justify-between py-5">
                <hr className="w-full bg-gray-400" />
                <p className="text-base font-medium leading-4 px-2.5 text-gray-400">
                  OR
                </p>
                <hr className="w-full bg-gray-400  " />
              </div>

              <form onSubmit={handleSubmit(onFormSubmit)}>
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
                <div className="mt-6  w-full">
                  <label className="text-sm font-medium leading-none text-gray-800 dark:text-white">
                    Enter a password
                  </label>
                  <div className="relative flex items-center justify-center">
                    <input
                      aria-label="enter Password"
                      role="input"
                      type={passwordVisible ? 'text' : 'password'}
                      {...register('password')}
                      className="bg-gray-200 border rounded focus:outline-none text-xs font-medium leading-none text-gray-800 py-3 w-full pl-3 mt-2"
                    />
                    <div className="absolute right-0 mt-2 mr-3 cursor-pointer">
                      <EyeIcon
                        onClick={() => setPasswordVisible(!passwordVisible)}
                        className="w-5 h-5 text-black dark:text-gray-50"
                      />
                    </div>
                  </div>

                  {errors.password && (
                    <p className="text-red-600">{errors.password.message}</p>
                  )}
                </div>
                <div className="mt-6 w-full">
                  <label className="text-sm font-medium leading-none text-gray-800 dark:text-white">
                    Re-enter the password
                  </label>
                  <div className="relative flex items-center justify-center">
                    <input
                      aria-label="re-enter Password"
                      role="input"
                      type={passwordVisible ? 'text' : 'password'}
                      {...register('passwordConfirm')}
                      className="bg-gray-200 border rounded focus:outline-none text-xs font-medium leading-none text-gray-800 py-3 w-full pl-3 mt-2"
                    />
                    <div className="absolute right-0 mt-2 mr-3 cursor-pointer">
                      <EyeIcon
                        onClick={() => setPasswordVisible(!passwordVisible)}
                        className="w-5 h-5 text-black dark:text-gray-50"
                      />
                    </div>
                  </div>

                  {errors.passwordConfirm && (
                    <p className="text-red-600">
                      {errors.passwordConfirm.message}
                    </p>
                  )}
                </div>
                <div className="mt-8">
                  <button
                    role="button"
                    aria-label="create my account"
                    className={classNames(
                      'focus:ring-2 focus:ring-offset-2 focus:ring-rose-400 text-sm font-semibold leading-none text-black',
                      'focus:outline-none bg-rose-400 border rounded hover:bg-rose-400 py-4 w-full'
                    )}
                  >
                    {creatingAccount ? (
                      <Loader width={4} height={4} />
                    ) : (
                      'Create an Account'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  ) : (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <Loader />
    </main>
  );
}

Register.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
