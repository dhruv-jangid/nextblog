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
import { Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { titleFont } from "@/lib/static/fonts";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { contactUser } from "@/actions/handle-user";
import { contactSchema } from "@/lib/schemas/other";
import { zodResolver } from "@hookform/resolvers/zod";

type contact = z.infer<typeof contactSchema>;

export const ContactClient = () => {
  const form = useForm<contact>({
    resolver: zodResolver(contactSchema),
    defaultValues: { subject: "", message: "" },
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (values: contact) => {
    setLoading(true);
    try {
      await contactUser(values);

      toast.success("We've received your inquiry");
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
    <div className="flex flex-col items-center justify-center w-full min-h-[92dvh] backdrop-blur-2xl">
      <div className="w-2/3 md:w-1/2 lg:w-1/3 mx-auto">
        <div className={`${titleFont.className} text-3xl mb-6 text-center`}>
          Talk to us
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Subject"
                      maxLength={255}
                      disabled={loading}
                      required
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      className="min-h-52 resize-none"
                      id="message"
                      placeholder="Message"
                      maxLength={255}
                      disabled={loading}
                      required
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-end">
              <Button type="submit" variant="outline" disabled={loading}>
                {loading ? "..." : "Send"} <Send />
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
