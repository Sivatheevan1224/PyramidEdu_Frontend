"use client";

import { useState } from "react";
import emailjs from "@emailjs/browser";
import { ArrowRight, Bot, FileCheck2, FileText, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const EMAILJS_SERVICE_ID = "service_y6q77rp";
const EMAILJS_TEMPLATE_ID = "template_9hp1lcg";
const EMAILJS_PUBLIC_KEY = "6HRNkeja1FYzkws4k";
const INSTITUTE_EMAIL = "pyramideducation06@gmail.com";

type ContactFormState = {
  name: string;
  email: string;
  subjectCategory: string;
  customSubject: string;
  message: string;
};

const subjectOptions = [
  "Admission and Student Support",
  "Attendance and Academic Records",
  "Fee and Payment Inquiry",
  "Teacher or Manager Assistance",
  "Website or System Feedback",
  "Others",
];

const initialState: ContactFormState = {
  name: "",
  email: "",
  subjectCategory: "Admission and Student Support",
  customSubject: "",
  message: "",
};

export function ContactUsForm() {
  const [formState, setFormState] = useState<ContactFormState>(initialState);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  const resolvedSubject =
    formState.subjectCategory === "Others"
      ? formState.customSubject.trim() || "Others"
      : formState.subjectCategory;

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setFormState((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("sending");
    setFeedback("Sending your message...");

    const formattedMessage = [
      "Name:",
      formState.name,
      "",
      "Mail:",
      formState.email,
      "",
      "Subject:",
      resolvedSubject,
      "",
      "Message:",
      formState.message,
    ].join("\n");

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          name: formState.name,
          mail: formState.email,
          email: formState.email,
          subject: resolvedSubject,
          message: formattedMessage,
          raw_message: formState.message,
          reply_to: formState.email,
          to_email: INSTITUTE_EMAIL,
          email_title: `New contact message from ${formState.name}`,
          email_summary: formattedMessage,
          formatted_message: formattedMessage,
        },
        {
          publicKey: EMAILJS_PUBLIC_KEY,
        },
      );

      setStatus("success");
      setFeedback("Message sent successfully to pyramideducation06@gmail.com.");
      setFormState(initialState);
    } catch (error) {
      setStatus("error");
      setFeedback("Message could not be sent. Please try again.");
      console.error("EmailJS contact form error:", error);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="relative group">
          <input
            name="name"
            value={formState.name}
            onChange={handleChange}
            type="text"
            placeholder="Your Name"
            required
            className="peer w-full rounded-lg border border-slate-200 bg-slate-50 p-3 pl-10 text-sm transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-500 dark:border-slate-700 dark:bg-slate-800/50"
          />
          <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors peer-focus:text-violet-500" />
        </div>
        <div className="relative group">
          <input
            name="email"
            value={formState.email}
            onChange={handleChange}
            type="email"
            placeholder="Your Email"
            required
            className="peer w-full rounded-lg border border-slate-200 bg-slate-50 p-3 pl-10 text-sm transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-500 dark:border-slate-700 dark:bg-slate-800/50"
          />
          <Bot className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors peer-focus:text-violet-500" />
        </div>
      </div>

      <div className="relative group">
        <label
          htmlFor="subjectCategory"
          className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500"
        >
          Subject Category
        </label>
        <select
          id="subjectCategory"
          name="subjectCategory"
          value={formState.subjectCategory}
          onChange={handleChange}
          required
          className="peer w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 p-3 pl-10 text-sm transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-500 dark:border-slate-700 dark:bg-slate-800/50"
        >
          {subjectOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <FileText className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors peer-focus:text-violet-500" />
      </div>

      {formState.subjectCategory === "Others" ? (
        <div className="relative group">
          <input
            name="customSubject"
            value={formState.customSubject}
            onChange={handleChange}
            type="text"
            placeholder="Enter your subject"
            required
            className="peer w-full rounded-lg border border-slate-200 bg-slate-50 p-3 pl-10 text-sm transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-500 dark:border-slate-700 dark:bg-slate-800/50"
          />
          <FileText className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors peer-focus:text-violet-500" />
        </div>
      ) : null}

      <div className="relative group">
        <textarea
          name="message"
          value={formState.message}
          onChange={handleChange}
          placeholder="Your Message"
          rows={5}
          required
          className="peer w-full rounded-lg border border-slate-200 bg-slate-50 p-3 pl-10 text-sm transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-500 dark:border-slate-700 dark:bg-slate-800/50"
        />
        <FileCheck2 className="absolute left-3 top-4 h-4 w-4 text-slate-400 transition-colors peer-focus:text-violet-500" />
      </div>

      <div className="text-center">
        <Button
          type="submit"
          disabled={status === "sending"}
          className="group h-12 rounded-full bg-[#4f46e5] px-8 text-xs font-bold text-white transition-all duration-300 hover:bg-[#4338ca] hover:shadow-[0_12px_24px_-4px_rgba(79,70,229,0.5)] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === "sending" ? "Sending..." : "Send Message"}
          <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </Button>
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
          Messages are delivered directly through EmailJS to {INSTITUTE_EMAIL}.
        </p>

        {feedback ? (
          <p
            className={`mt-3 text-sm font-medium ${
              status === "success"
                ? "text-emerald-600 dark:text-emerald-400"
                : status === "error"
                  ? "text-rose-600 dark:text-rose-400"
                  : "text-slate-500 dark:text-slate-400"
            }`}
          >
            {feedback}
          </p>
        ) : null}
      </div>
    </form>
  );
}
