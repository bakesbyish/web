/**
 * getBaseUrl - Get the base URL
 */
export const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

/**
 * @description - Seperate tailwind utility classes with ease
 * @returns {string} - Combined one className that can be used with tailwindcss
 */
export function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(" ");
}

type StringKeys<T> = {
  [k in keyof T]: T[k] extends string ? k : never;
}[keyof T];

type OnlyString<T> = { [k in StringKeys<T>]: string };

/**
 * @description - Get the index of an array of object contaning a specific value of an object
 * @param - array - The array
 * @param - key - The key of the object that needs to be matched
 * @param - value - The value that the key needs to match to return the index
 * @returns {number} - Return the index where the key matches the object key in the array
 */
export const getIndex = <T extends OnlyString<T>>(
  array: T[],
  key: StringKeys<T>,
  value: string | number,
): number => {
  return array.findIndex((array) => array[key] === value);
};

/**
 * @description - Get the prefix when the day of the month is given
 * @param {number} day - The day that needs the prefix
 * @returns {string} - The prefix of corresponding to the day
 */
export const getPrefixForTheDay = (day: number): string => {
  switch (day) {
    case 1 || 21:
      return "st";
    case 2 || 22:
      return "nd";
    case 3 || 23:
      return "rd";
    default:
      return "th";
  }
};
