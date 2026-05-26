/**
 * AddSupportStaffForm - Form for adding support staff
 */

"use client";

import React from "react";
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
      className="space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Full Name */}
      <motion.div variants={formVariants}>
        <FormField label="Full Name" error={errors.fullName?.message} required>
          <input
            type="text"
            {...register("fullName")}
            placeholder="Jane Smith"
            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${
              errors.fullName ? "border-red-500" : "border-gray-200"
            }`}
          />
        </FormField>
      </motion.div>

      {/* Role Type */}
      <motion.div variants={formVariants}>
        <FormField label="Role Type" error={errors.roleType?.message} required>
          <input
            type="text"
            {...register("roleType")}
            placeholder="e.g., Librarian, Counselor, Maintenance"
            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${
              errors.roleType ? "border-red-500" : "border-gray-200"
            }`}
          />
        </FormField>
      </motion.div>

      {/* Email */}
      <motion.div variants={formVariants}>
        <FormField label="Email Address" error={errors.email?.message} required>
          <input
            type="email"
            {...register("email")}
            placeholder="jane@example.com"
            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${
              errors.email ? "border-red-500" : "border-gray-200"
            }`}
          />
        </FormField>
      </motion.div>

      {/* Phone */}
      <motion.div variants={formVariants}>
        <FormField
          label="Phone Number"
          error={errors.phoneNumber?.message}
          required
        >
          <input
            type="tel"
            {...register("phoneNumber")}
            placeholder="+1 (555) 123-4567"
            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${
              errors.phoneNumber ? "border-red-500" : "border-gray-200"
            }`}
          />
        </FormField>
      </motion.div>

      {/* Salary */}
      <motion.div variants={formVariants}>
        <FormField label="Salary (Optional)" error={errors.salary?.message}>
          <input
            type="number"
            {...register("salary", { valueAsNumber: true })}
            placeholder="35000"
            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${
              errors.salary ? "border-red-500" : "border-gray-200"
            }`}
          />
        </FormField>
      </motion.div>

      {/* Password */}
      <motion.div variants={formVariants}>
        <FormField
          label="Password"
          error={errors.password?.message}
          required
          hint="Min 8 chars with uppercase, lowercase, number, and special character"
        >
          <input
            type="password"
            {...register("password")}
            placeholder="••••••••"
            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${
              errors.password ? "border-red-500" : "border-gray-200"
            }`}
          />
        </FormField>
      </motion.div>

      {/* Confirm Password */}
      <motion.div variants={formVariants}>
        <FormField
          label="Confirm Password"
          error={errors.confirmPassword?.message}
          required
        >
          <input
            type="password"
            {...register("confirmPassword")}
            placeholder="••••••••"
            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${
              errors.confirmPassword ? "border-red-500" : "border-gray-200"
            }`}
          />
        </FormField>
      </motion.div>

      {/* Submit Button */}
      <motion.div variants={formVariants} className="pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2.5 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 disabled:bg-orange-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
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
