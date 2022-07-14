/**
 * @description - Seperate tailwind utility classes with ease
 * @returns {string} - Combined one className that can be used with tailwindcss
 * */
export function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(' ');
}

type StringKeys<T> = {
  [k in keyof T]: T[k] extends string ? k : never;
}[keyof T];

type OnlyString<T> = { [k in StringKeys<T>]: string };

/**
 * @description - Get the index of an array of object contaning a specific value of an object
 * @params - array - The array
 * @params - key - The key of the object that needs to be matched
 * @params - value - The value that the key needs to match to return the index
 * @returns {number} - Return the index where the key matches the object key in the array
 * */
export const getIndex = <T extends OnlyString<T>>(
  array: T[],
  key: StringKeys<T>,
  value: string | number
): number => {
  return array.findIndex((array) => array[key] === value);
};
