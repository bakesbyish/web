/**
 * @description - Take the logic based classNames and convert them into individual classNames
 * */
export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
