"use client";

import {
  Form,
  FormItem,
  FormField,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod/v3";
import { toast } from "sonner";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { CornerDownRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { contactUser } from "@/actions/handle-user";
import { contactSchema } from "@/lib/schemas/other";
import { zodResolver } from "@hookform/resolvers/zod";

type contact = z.infer<typeof contactSchema>;

export const ContactClient = () => {
  const form = useForm<contact>({
    resolver: zodResolver(contactSchema),
    defaultValues: { email: "" },
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (values: contact) => {
    setLoading(true);
    try {
      await contactUser(values);

      toast.success("We will contact you back shortly.");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col xl:flex-row gap-24 m-4 xl:m-8 p-8 pt-24 xl:pt-32 min-h-[96dvh] xl:min-h-[94dvh] backdrop-blur-2xl border rounded-2xl bg-accent">
      <div className="space-y-4">
        <div className="text-sm text-orange-500">TALK TO US</div>
        <div className="text-4xl xl:text-5xl tracking-tighter w-xs xl:w-md">
          What&apos;s an email we can reach you out?
        </div>
      </div>
      <div className="xl:w-md">
        <div>EMAIL ADDRESS</div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter your email address"
                      maxLength={255}
                      disabled={loading}
                      className="border-0 shadow-none h-24 pl-4 border-b text-xl xl:text-2xl rounded-none bg-transparent!"
                      required
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-end">
              <Button
                size="lg"
                type="submit"
                disabled={loading}
                className="text-xl h-12 xl:w-36"
              >
                {loading ? (
                  "..."
                ) : (
                  <>
                    Submit <CornerDownRight className="size-5 xl:size-6" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
