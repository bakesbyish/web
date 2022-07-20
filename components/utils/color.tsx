import { RadioGroup } from '@headlessui/react';
import { classNames } from '@lib/utils';
import { Dispatch, SetStateAction } from 'react';

export const Color = (props: {
  colors: { color: string }[] | undefined;
  value: string;
  setValue: Dispatch<SetStateAction<string | null>>;
}) => {
  const { colors, value, setValue } = props;

  return colors ? (
    <div>
      <h3 className="text-sm text-gray-900 dark:text-white font-medium">
        Color
      </h3>

      <RadioGroup value={value} onChange={setValue} className="mt-4">
        <RadioGroup.Label className="sr-only">Choose a color</RadioGroup.Label>
        <div className="flex items-center space-x-3">
          {colors.map((option: { color: string }, index: number) => (
            <RadioGroup.Option
              key={index}
              value={option.color}
              className={({ active, checked }) =>
                classNames(
                  'ring-gray-400',
                  active && checked ? 'ring ring-offset-1' : '',
                  !active && checked ? 'ring-2' : '',
                  '-m-0.5 relative p-0.5 rounded-full flex items-center justify-center cursor-pointer focus:outline-none'
                )
              }
            >
              <RadioGroup.Label as="span" className="sr-only">
                {option.color}
              </RadioGroup.Label>
              <span
                aria-hidden="true"
                style={{ backgroundColor: `${option.color}` }}
                className="h-8 w-8 border border-black border-opacity-10 rounded-full"
              />
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
    </div>
  ) : null;
};
