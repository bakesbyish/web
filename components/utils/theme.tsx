import { useEffect, useState } from 'react';
import { Switch, Transition } from '@headlessui/react';
import { MoonIcon, SunIcon } from '@heroicons/react/outline';
import { useTheme } from 'next-themes';

export const Theme = () => {
  const { systemTheme, theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const currentTheme = theme === 'system' ? systemTheme : theme;

  return (
    <Switch.Group>
      <div className="flex item-center">
        <Switch.Label className="mr-4">
          {currentTheme === 'dark' ? (
            <SunIcon className="w-6 h-6" />
          ) : (
            <MoonIcon className="w-6 h-6" />
          )}
        </Switch.Label>
        <Switch
          checked={currentTheme === 'dark'}
          onChange={() => {
            currentTheme === 'dark' ? setTheme('light') : setTheme('dark');
          }}
          className={`${
            currentTheme === 'dark' ? 'bg-rose-400' : 'bg-gray-200'
          } relative inline-flex h-6 w-11 items-center rounded-full`}
        >
          <span className="sr-only">Enable notifications</span>
          <span
            className={`transform transition ease-in-out duration-200 inline-block h-4 w-4 rounded-full bg-white
						${currentTheme === 'dark' ? 'translate-x-6 ' : 'translate-x-1'}
					`}
          />
        </Switch>
      </div>
    </Switch.Group>
  );
};
