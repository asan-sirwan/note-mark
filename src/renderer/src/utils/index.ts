import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const dateFormater = new Intl.DateTimeFormat(window.context.locale, {
  dateStyle: "short",
  timeStyle: "short",
	hour12: true
});

export const formatDateFromMs = (ms: number): string => dateFormater.format(ms);

/**
 * This function constructs className strings conditionally
 * @param args Takes an array of arguments
 * @returns The resulted className string
 */
export const cn = (...args: ClassValue[]): string => {
  return twMerge(clsx(...args));
};
