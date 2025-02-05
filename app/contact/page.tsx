"use client";

import { Button } from "@/components/button";
import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(formData);
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 lg:p-12">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl lg:text-4xl font-bold">Get in Touch</h1>
          <p className="text-gray-400 text-lg">
            Have questions? We&apos;d love to hear from you.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-lg font-medium">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full py-2 px-3 bg-[#191919] border border-gray-500 rounded-lg focus:outline-none focus:border-[#EEEEEE]"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-lg font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full py-2 px-3 bg-[#191919] border border-gray-500 rounded-lg focus:outline-none focus:border-[#EEEEEE]"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="subject" className="text-lg font-medium">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                className="w-full py-2 px-3 bg-[#191919] border border-gray-500 rounded-lg focus:outline-none focus:border-[#EEEEEE]"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="text-lg font-medium">
                Message
              </label>
              <textarea
                id="message"
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                rows={5}
                className="w-full py-2 px-3 bg-[#191919] border border-gray-500 rounded-lg focus:outline-none focus:border-[#EEEEEE] resize-none"
                required
              />
            </div>
          </div>

          <div className="flex justify-center">
            <Button type="submit">Send Message</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
