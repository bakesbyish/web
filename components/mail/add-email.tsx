import { Loader } from '@components/utils/loader';
import { CheckCircleIcon, MailIcon, XIcon } from '@heroicons/react/solid';
import { classNames } from '@lib/utils';
import { ChangeEvent, FormEvent, useState } from 'react';

type State = 'idle' | 'loading' | 'succsess' | 'error';

export const StatusIcon = (props: { state: State }) => {
  const { state } = props;

  switch (state) {
    case 'idle':
      return <MailIcon className="w-8 h-8" />;
    case 'loading':
      return <Loader />;
    case 'succsess':
      return <CheckCircleIcon className="w-8 h-8" />;
    case 'error':
      return <XIcon className="w-8 h-8" />;
    default:
      return <MailIcon className="w-8 h-8" />;
  }
};

export const AddEmail = () => {
  const [mail, setMail] = useState<string>('');
  const [state, setState] = useState<State>('idle');
  const [error, setError] = useState<string | null>(null);

  const subscribe = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState('loading');
    setError('');

    const emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!emailRegex.test(mail)) {
      setError('The email address you entered is not an valid Email address');
      setState('error');
      setMail('');
      return;
    }

    setState('loading');
    setError(null);

    const response = await fetch('/api/mail/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: mail }),
    });

    if (Number(response.status) >= 200 && Number(response.status) < 300) {
      setState('succsess');
      setMail('');
      return;
    } else if (Number(response.status) === 400) {
      setState('error');
      setError('Email address is not valid');
      setMail('');
    } else {
      setState('error');
      setError('Something went wrong');
    }
  };

  return (
    <form
      onSubmit={subscribe}
      className="flex flex-col mt-8 space-y-3 lg:space-y-0 lg:gap-2"
    >
      <div className="flex flex-row max-w-xs gap-2 lg:gap-0 mx-auto">
        <input
          id="email"
          type="text"
          className={classNames(
            'px-4 py-2 text-gray-700 bg-white border rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600',
            'focus:border-blue-400 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-opacity-40 focus:ring-blue-300'
          )}
          placeholder="Email Address"
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            setMail(event.target.value);
            setError(null);
            setState('idle');
          }}
        />

        <button
          disabled={state === 'loading'}
          type="submit"
          aria-label="Subscribe to BAKESBYISH mailing list"
          className={classNames(
            'max-w-xs px-4 py-2 text-sm font-medium tracking-wide text-white capitalize transition-colors',
            'duration-200 transform bg-rose-400 rounded-lg lg:w-auto lg:mx-4 hover:bg-rose-400 focus:outline-none focus:bg-blue-400'
          )}
        >
          <StatusIcon state={state} />
        </button>
      </div>

      {state === 'error' && <p className="text-red-600 mx-auto">{error}</p>}
      {state === 'succsess' && (
        <p className="text-green-200 mx-auto">Subscribed successfully</p>
      )}
    </form>
  );
};
