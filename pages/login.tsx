import { Layout } from '@components/layout/layout';
import { EyeIcon } from '@heroicons/react/outline';
import { FacebookIcon } from '@components/icons/facebook';
import { ReactElement, useState } from 'react';
import { TwitterIcon } from '@components/icons/twitter';
import { GoogleIcon } from '@components/icons/google';
import { Loader } from '@components/utils/loader';
import { useProvider } from '@hooks/use-provider';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithRedirect,
  TwitterAuthProvider,
} from 'firebase/auth';
import { auth } from 'config/firebase';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { createSession } from '@lib/auth';
import { ResetPassword } from '@components/auth/reset-password';
import Link from 'next/link';
import { useBakesbyIshcontext } from '@context/context';
import { useRouter } from 'next/router';
import { classNames } from '@lib/utils';
import { DefaultSeo } from '@components/seo/default';

export default function Login() {
  const { mutate } = useBakesbyIshcontext();

  const [passwordVisible, setPasswordVisble] = useState<boolean>(false);
  const [resetPassword, setResetPassword] = useState<boolean>(false);
  const [logginIn, setLogginIn] = useState<boolean>(false);

  const [loading] = useProvider();

  const router = useRouter();

  const formSchema = yup.object().shape({
    email: yup
      .string()
      .required('Enter an Email address')
      .max(255, 'The email should not be greater than 255 characters'),
    password: yup.string().required('Enter a password'),
  });

  interface IFormInputs {
    email: string;
    password: string;
  }

  const { register, handleSubmit, formState } = useForm<IFormInputs>({
    resolver: yupResolver(formSchema),
  });

  const { errors } = formState;

  const onFormSubmit = (data: IFormInputs) => {
    const { email, password } = data;
    setLogginIn(true);

    signInWithEmailAndPassword(auth, email, password)
      .then(async (result) => {
        const idToken = await result.user.getIdToken();

        try {
          await createSession(idToken);
          mutate();
          router.push('/');
        } catch (error) {
          setLogginIn(false);
          console.error(error);
        }
      })
      .catch((error) => {
        setLogginIn(false);
        console.error(error);
      });
  };

  return !loading ? (
    <>
      <DefaultSeo
        title={'Login'}
        description={'Login to your account'}
        paths={[
          {
            name: 'login',
            url: '/login',
          },
        ]}
        url={'/login'}
      />

      <main>
        <div className="min-h-screen bg-white dark:bg-gray-800 w-full pt-0 pb-16 sm:py-16 px-4">
          <div className="flex flex-col items-center justify-center">
            {!resetPassword ? (
              <div className="bg-gray-100 dark:bg-gray-900 shadow rounded lg:w-1/3  md:w-1/2 w-full p-10">
                <p
                  tabIndex={0}
                  role="heading"
                  aria-level={1}
                  aria-label="Login to your account"
                  className="text-2xl font-extrabold leading-6 text-gray-800 dark:text-white"
                >
                  Login to your account
                </p>
                <p className="text-sm mt-4 font-medium leading-none text-gray-500 dark:text-white">
                  Dont have account?{' '}
                  <Link href="/register">
                    <a
                      tabIndex={0}
                      role="link"
                      aria-label="Sign up here"
                      className="text-sm font-medium leading-none underline text-rose-400 cursor-pointer"
                    >
                      {' '}
                      Sign up here
                    </a>
                  </Link>
                </p>
                <button
                  aria-label="Continue with google"
                  role="button"
                  onClick={() =>
                    signInWithRedirect(auth, new GoogleAuthProvider())
                  }
                  className={classNames(
                    'focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-700 py-3.5 px-4 border rounded-lg',
                    'border-gray-700 flex items-center w-full mt-10'
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
                    'focus:outline-none  focus:ring-2 focus:ring-offset-1 focus:ring-gray-700 py-3.5 px-4 border rounded-lg',
                    'border-gray-700 flex items-center w-full mt-4'
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
                    'focus:outline-none  focus:ring-2 focus:ring-offset-1 focus:ring-gray-700 py-3.5 px-4 border rounded-lg border-gray-700',
                    'flex items-center w-full mt-4'
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
                      Password
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
                          onClick={() => setPasswordVisble(!passwordVisible)}
                          className="w-5 h-5 text-black dark:text-gray-50"
                        />
                      </div>
                    </div>

                    {errors.password && (
                      <p className="text-red-600">{errors.password.message}</p>
                    )}
                  </div>
                  <div className="mt-8">
                    <button
                      role="button"
                      aria-label="Login"
                      disabled={logginIn}
                      className={classNames(
                        'focus:ring-2 focus:ring-offset-2 focus:ring-rose-400 text-sm font-semibold leading-none',
                        'text-black focus:outline-none bg-rose-400 border rounded hover:bg-rose-400 py-4 w-full'
                      )}
                    >
                      {logginIn ? <Loader width={4} height={4} /> : 'Login'}
                    </button>
                  </div>
                </form>
                <div className="flex flex-col items-center justify-center mt-2">
                  <button
                    role="button"
                    aria-label="Reset password"
                    onClick={async () => setResetPassword(true)}
                    className="text-rose-400 underline"
                  >
                    Forgot password
                  </button>
                </div>
              </div>
            ) : (
              <ResetPassword setResetPassword={setResetPassword} />
            )}
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

Login.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
