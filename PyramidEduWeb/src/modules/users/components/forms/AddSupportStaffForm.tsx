/**
 * AddSupportStaffForm - Form for adding support staff
 */

"use client";

import React, { useMemo } from "react";
import { Copy, RefreshCw } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  addSupportStaffSchema,
  AddSupportStaffInput,
} from "../../validation/user.schema";
import { FormField } from "./FormField";
import { motion } from "framer-motion";

interface AddSupportStaffFormProps {
  onSubmit: (data: AddSupportStaffInput) => Promise<void>;
  isLoading: boolean;
}

export const AddSupportStaffForm: React.FC<AddSupportStaffFormProps> = ({
  onSubmit,
  isLoading,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddSupportStaffInput>({
    resolver: zodResolver(addSupportStaffSchema),
  });

  const [previewPassword, setPreviewPassword] = React.useState("");
  const [copyMessage, setCopyMessage] = React.useState("");

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
    for (let index = 0; index < 8; index += 1) {
      chars.push(all[Math.floor(Math.random() * all.length)]);
    }

    for (let index = chars.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      const temp = chars[index];
      chars[index] = chars[swapIndex];
      chars[swapIndex] = temp;
    }

    setPreviewPassword(chars.join(''));
    setCopyMessage("");
  };

  const copyPreviewPassword = async () => {
    if (!previewPassword) return;
    try {
      await navigator.clipboard.writeText(previewPassword);
      setCopyMessage('Copied');
      setTimeout(() => setCopyMessage(''), 1500);
    } catch {
      setCopyMessage('Copy failed');
      setTimeout(() => setCopyMessage(''), 1500);
    }
  };

  const onFormSubmit = async (data: AddSupportStaffInput) => {
    const password = previewPassword || (() => {
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
      for (let index = 0; index < 8; index += 1) {
        chars.push(all[Math.floor(Math.random() * all.length)]);
      }

      for (let index = chars.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        const temp = chars[index];
        chars[index] = chars[swapIndex];
        chars[swapIndex] = temp;
      }

      return chars.join('');
    })();

    if (!previewPassword) setPreviewPassword(password);

    await onSubmit({ ...data, password });
  };

  const inputClass = useMemo(
    () =>
      "w-full px-4 py-2.5 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all",
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
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl ring-1 ring-slate-100"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="rounded-2xl border border-orange-100 bg-linear-to-r from-orange-50 via-white to-amber-50 p-4 text-sm text-orange-800 shadow-sm">
        Generate the support staff password here. The value you generate will be stored and can be copied for provisioning.
      </div>

      <motion.div variants={containerVariants} className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-slate-700">Temporary Password Preview</p>
          <button
            type="button"
            onClick={generatePreviewPassword}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-100 px-3 py-2 text-sm font-semibold text-amber-700 shadow-sm transition-colors hover:bg-amber-200"
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
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm"
          />
          <button
            type="button"
            onClick={copyPreviewPassword}
            disabled={!previewPassword}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-700 px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            <RefreshCw className="h-4 w-4" />
            Copy
          </button>
        </div>
        {copyMessage ? <p className="text-xs text-green-700">{copyMessage}</p> : null}
      </motion.div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <motion.div variants={formVariants}>
          <FormField
            label="First Name"
            error={errors.firstName?.message}
            required
          >
            <input
              type="text"
              {...register("firstName")}
              placeholder="Jane"
              className={`${inputClass} ${errors.firstName ? "border-red-500" : "border-gray-200"}`}
            />
          </FormField>
        </motion.div>

        <motion.div variants={formVariants}>
          <FormField
            label="Last Name"
            error={errors.lastName?.message}
            required
          >
            <input
              type="text"
              {...register("lastName")}
              placeholder="Smith"
              className={`${inputClass} ${errors.lastName ? "border-red-500" : "border-gray-200"}`}
            />
          </FormField>
        </motion.div>

        <motion.div variants={formVariants}>
          <FormField
            label="NIC Number"
            error={errors.nicNumber?.message}
            required
          >
            <input
              type="text"
              {...register("nicNumber")}
              placeholder="200012345678 or 901234567V"
              className={`${inputClass} ${errors.nicNumber ? "border-red-500" : "border-gray-200"}`}
            />
          </FormField>
        </motion.div>

        <motion.div variants={formVariants}>
          <FormField label="Gender" error={errors.gender?.message} required>
            <select
              {...register("gender")}
              defaultValue=""
              className={`${inputClass} ${errors.gender ? "border-red-500" : "border-gray-200"}`}
            >
              <option value="" disabled>
                Select gender
              </option>
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
              className={`${inputClass} ${errors.address ? "border-red-500" : "border-gray-200"}`}
            />
          </FormField>
        </motion.div>

        <motion.div variants={formVariants}>
          <FormField label="Role" error={errors.roleType?.message} required>
            <input
              type="text"
              {...register("roleType")}
              placeholder="e.g., Librarian, Counselor, Maintenance"
              className={`${inputClass} ${errors.roleType ? "border-red-500" : "border-gray-200"}`}
            />
          </FormField>
        </motion.div>

        <motion.div variants={formVariants}>
          <FormField label="Salary (Optional)" error={errors.salary?.message}>
            <input
              type="number"
              {...register("salary", { valueAsNumber: true })}
              placeholder="35000"
              className={`${inputClass} ${errors.salary ? "border-red-500" : "border-gray-200"}`}
            />
          </FormField>
        </motion.div>

        <motion.div variants={formVariants}>
          <FormField
            label="Email Address"
            error={errors.email?.message}
            required
          >
            <input
              type="email"
              {...register("email")}
              placeholder="jane@example.com"
              className={`${inputClass} ${errors.email ? "border-red-500" : "border-gray-200"}`}
            />
          </FormField>
        </motion.div>

        <motion.div variants={formVariants}>
          <FormField
            label="Phone Number"
            error={errors.phoneNumber?.message}
            required
          >
            <input
              type="tel"
              {...register("phoneNumber")}
              placeholder="0771234567"
              className={`${inputClass} ${errors.phoneNumber ? "border-red-500" : "border-gray-200"}`}
            />
          </FormField>
        </motion.div>
      </div>

      <motion.div variants={formVariants} className="pt-2">
        <button
          type="button"
          onClick={handleSubmit(onFormSubmit)}
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-3 font-semibold text-white shadow-lg shadow-orange-200 transition-colors hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-orange-400"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Creating...
            </>
          ) : (
            "Add Support Staff"
          )}
        </button>
      </motion.div>
    </motion.form>
  );
};
