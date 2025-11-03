import { z, type ZodError } from "zod";
import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const getFirstZodError = (error: ZodError): string => {
  const flat = z.flattenError(error);
  const fieldError = Object.values(flat.fieldErrors).flat()[0] as string;
  const formError = flat.formErrors[0];

  return fieldError || formError || "Validation Error";
};
