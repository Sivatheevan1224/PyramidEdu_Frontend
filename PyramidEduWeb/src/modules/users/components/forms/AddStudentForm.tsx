/**
 * AddStudentForm - Form for adding new student
 */

"use client";

import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Copy, RefreshCw } from "lucide-react";
import {
  addStudentSchema,
  AddStudentInput,
} from "../../validation/user.schema";
import { FormField } from "./FormField";
import { motion } from "framer-motion";

interface AddStudentFormProps {
  onSubmit: (data: AddStudentInput) => Promise<void>;
  isLoading: boolean;
}

export const AddStudentForm: React.FC<AddStudentFormProps> = ({
  onSubmit,
  isLoading,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddStudentInput>({
    resolver: zodResolver(addStudentSchema),
  });

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

  const [previewPassword, setPreviewPassword] = useState("");
  const [copyMessage, setCopyMessage] = useState("");

  const inputClass = useMemo(
    () =>
      "w-full px-4 py-2.5 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all",
    [],
  );

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
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="rounded-xl border border-green-100 bg-green-50/60 p-4 text-sm text-green-800">
        Student accounts use a backend-generated temporary password. You do not need to enter one here.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div variants={formVariants}>
          <FormField label="First Name" error={errors.firstName?.message} required>
            <input
              type="text"
              {...register("firstName")}
              placeholder="Alex"
              className={`${inputClass} ${errors.firstName ? "border-red-500" : "border-gray-200"}`}
            />
          </FormField>
        </motion.div>

        <motion.div variants={formVariants}>
          <FormField label="Last Name" error={errors.lastName?.message} required>
            <input
              type="text"
              {...register("lastName")}
              placeholder="Johnson"
              className={`${inputClass} ${errors.lastName ? "border-red-500" : "border-gray-200"}`}
            />
          </FormField>
        </motion.div>

        <motion.div variants={formVariants}>
          <FormField label="Index Number" error={errors.indexNumber?.message} required>
            <input
              type="text"
              {...register("indexNumber")}
              placeholder="STD2024001"
              className={`${inputClass} ${errors.indexNumber ? "border-red-500" : "border-gray-200"}`}
            />
          </FormField>
        </motion.div>

        <motion.div variants={formVariants}>
          <FormField label="Date of Birth" error={errors.dateOfBirth?.message} required>
            <input
              type="date"
              {...register("dateOfBirth")}
              className={`${inputClass} ${errors.dateOfBirth ? "border-red-500" : "border-gray-200"}`}
            />
          </FormField>
        </motion.div>

        <motion.div variants={formVariants} className="md:col-span-2">
          <FormField label="Address" error={errors.address?.message} required>
            <textarea
              {...register("address")}
              placeholder="123 Main Street, City, State 12345"
              rows={2}
              className={`${inputClass} resize-none ${errors.address ? "border-red-500" : "border-gray-200"}`}
            />
          </FormField>
        </motion.div>

        <motion.div variants={formVariants}>
          <FormField label="Email Address" error={errors.email?.message} required>
            <input
              type="email"
              {...register("email")}
              placeholder="alex@example.com"
              className={`${inputClass} ${errors.email ? "border-red-500" : "border-gray-200"}`}
            />
          </FormField>
        </motion.div>

        <motion.div variants={formVariants}>
          <FormField label="Phone Number" error={errors.phoneNumber?.message} required>
            <input
              type="tel"
              {...register("phoneNumber")}
              placeholder="0771234567"
              className={`${inputClass} ${errors.phoneNumber ? "border-red-500" : "border-gray-200"}`}
            />
          </FormField>
        </motion.div>
      </div>

      <motion.div variants={formVariants} className="rounded-xl border border-gray-200 p-4 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-gray-700">Temporary Password Preview</p>
          <button
            type="button"
            onClick={generatePreviewPassword}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-green-700 bg-green-100 hover:bg-green-200 rounded-lg"
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
            className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm"
          />
          <button
            type="button"
            onClick={copyPreviewPassword}
            disabled={!previewPassword}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-slate-700 hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed rounded-lg"
          >
            <Copy className="w-4 h-4" />
            Copy
          </button>
        </div>
        {copyMessage ? <p className="text-xs text-green-700">{copyMessage}</p> : null}
      </motion.div>

      {/* Submit Button */}
      <motion.div variants={formVariants} className="pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Creating...
            </>
          ) : (
            "Register Student"
          )}
        </button>
      </motion.div>
    </motion.form>
  );
};
