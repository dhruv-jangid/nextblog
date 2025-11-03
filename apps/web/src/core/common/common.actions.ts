"use server";

import "server-only";
import { ZodError } from "zod";
import { getFirstZodError } from "@/lib/utils";
import { CommonService } from "./common.service";

export const contactUser = async (data: ContactUser) => {
  try {
    await CommonService.contactUser(data);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(getFirstZodError(error));
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Something went wrong");
    }
  }
};

export const subscribeNewsletter = async (data: SubscribeNewsLetter) => {
  try {
    await CommonService.subscribeNewsletter(data);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(getFirstZodError(error));
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Something went wrong");
    }
  }
};
