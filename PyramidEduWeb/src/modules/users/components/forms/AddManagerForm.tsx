/**
 * AddManagerForm - Form for adding new manager
 */

"use client";

import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Copy, RefreshCw } from "lucide-react";
import {
  addManagerSchema,
  AddManagerInput,
} from "../../validation/user.schema";
import { FormField } from "./FormField";
import { motion } from "framer-motion";

interface AddManagerFormProps {
  onSubmit: (data: AddManagerInput) => Promise<void>;
  isLoading: boolean;
}

export const AddManagerForm: React.FC<AddManagerFormProps> = ({
  onSubmit,
  isLoading,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddManagerInput>({
    resolver: zodResolver(addManagerSchema),
  });

  const [previewPassword, setPreviewPassword] = useState("");
  const [copyMessage, setCopyMessage] = useState("");

  const inputClass = useMemo(
    () =>
      "w-full px-4 py-2.5 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all",
    [],
  );

  const formVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const generatePreviewPassword = () => {
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const digits = "0123456789";
    const specials = "!@#$%^&*()_+-=[]{}|;:,.?";
    const all = upper + lower + digits + specials;

    const required = [
      upper[Math.floor(Math.random() * upper.length)],
      lower[Math.floor(Math.random() * lower.length)],
      digits[Math.floor(Math.random() * digits.length)],
      specials[Math.floor(Math.random() * specials.length)],
    ];

    const chars = [...required];
    for (let i = 0; i < 8; i++) {
      chars.push(all[Math.floor(Math.random() * all.length)]);
    }

    for (let i = chars.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = chars[i];
      chars[i] = chars[j];
      chars[j] = temp;
    }

    setPreviewPassword(chars.join(""));
    setCopyMessage("");
  };

  const onFormSubmit = async (data: AddManagerInput) => {
    // Require a generated password before submitting
    if (!previewPassword) {
      setCopyMessage("Please generate a password first");
      return;
    }

    // Submit using the previewed password
    const result = await onSubmit({ ...data, password: previewPassword });
    // No extra UI handling needed; backend stores the password
  };

  const copyPreviewPassword = async () => {
    if (!previewPassword) return;

    try {
      await navigator.clipboard.writeText(previewPassword);
      setCopyMessage("Copied");
      setTimeout(() => setCopyMessage(""), 1500);
    } catch {
      setCopyMessage("Copy failed");
      setTimeout(() => setCopyMessage(""), 1500);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit(onFormSubmit)}
      className="space-y-6 rounded-3xl border border-border bg-card p-6 shadow-sm"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm text-emerald-800 dark:text-emerald-300 shadow-sm">
        Generate the manager password here. The value you generate will be stored and used for first login.
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <motion.div variants={formVariants}>
          <FormField label="First Name" error={errors.firstName?.message} required>
            <input
              type="text"
              {...register("firstName")}
              placeholder="John"
              className={`${inputClass} ${errors.firstName ? "border-red-500" : "border-border"}`}
            />
          </FormField>
        </motion.div>

        <motion.div variants={formVariants}>
          <FormField label="Last Name" error={errors.lastName?.message} required>
            <input
              type="text"
              {...register("lastName")}
              placeholder="Doe"
              className={`${inputClass} ${errors.lastName ? "border-red-500" : "border-border"}`}
            />
          </FormField>
        </motion.div>

        <motion.div variants={formVariants}>
          <FormField label="NIC Number" error={errors.nicNumber?.message} required>
            <input
              type="text"
              {...register("nicNumber")}
              placeholder="200012345678 or 901234567V"
              className={`${inputClass} ${errors.nicNumber ? "border-red-500" : "border-border"}`}
            />
          </FormField>
        </motion.div>

        <motion.div variants={formVariants}>
          <FormField label="Gender" error={errors.gender?.message} required>
            <select
              {...register("gender")}
              defaultValue=""
              className={`${inputClass} ${errors.gender ? "border-red-500" : "border-border"}`}
            >
              <option value="" disabled>Select gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </FormField>
        </motion.div>

        <motion.div variants={formVariants} className="md:col-span-2">
          <FormField label="Address" error={errors.address?.message} required>
            <input
              type="text"
              {...register("address")}
              placeholder="123, Main Street, City"
              className={`${inputClass} ${errors.address ? "border-red-500" : "border-border"}`}
            />
          </FormField>
        </motion.div>

        <motion.div variants={formVariants}>
          <FormField label="Salary (Optional)" error={errors.salary?.message}>
            <input
              type="number"
              {...register("salary", { valueAsNumber: true })}
              placeholder="50000"
              className={`${inputClass} ${errors.salary ? "border-red-500" : "border-border"}`}
            />
          </FormField>
        </motion.div>

        <motion.div variants={formVariants}>
          <FormField label="Email Address" error={errors.email?.message} required>
            <input
              type="email"
              {...register("email")}
              placeholder="john@example.com"
              className={`${inputClass} ${errors.email ? "border-red-500" : "border-border"}`}
            />
          </FormField>
        </motion.div>

        <motion.div variants={formVariants}>
          <FormField label="Phone Number" error={errors.phoneNumber?.message} required>
            <input
              type="tel"
              {...register("phoneNumber")}
              placeholder="0771234567"
              className={`${inputClass} ${errors.phoneNumber ? "border-red-500" : "border-border"}`}
            />
          </FormField>
        </motion.div>
      </div>

      <motion.div variants={formVariants} className="space-y-4 rounded-2xl border border-border bg-muted/20 p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-muted-foreground">Temporary Password Preview</p>
          <button
            type="button"
            onClick={generatePreviewPassword}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/10 px-3 py-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300 shadow-sm transition-colors hover:bg-emerald-500/20"
          >
            <RefreshCw className="w-4 h-4" />
            Generate Password
          </button>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={previewPassword}
            placeholder="Click Generate Password"
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm shadow-sm"
          />
          <button
            type="button"
            onClick={copyPreviewPassword}
            disabled={!previewPassword}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-700 dark:bg-slate-800 px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800 dark:hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-muted"
          >
            <Copy className="w-4 h-4" />
            Copy
          </button>
        </div>
        {copyMessage ? <p className="text-xs text-emerald-700 dark:text-emerald-400">{copyMessage}</p> : null}
      </motion.div>

      <motion.div variants={formVariants} className="pt-2">
        <button
          type="submit"
          disabled={isLoading || !previewPassword}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white shadow-lg shadow-emerald-200/20 dark:shadow-none transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-400"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Creating...
            </>
          ) : (
            "Create Manager"
          )}
        </button>

      </motion.div>
    </motion.form>
  );
};
