/**
 * AddManagerForm - Form for adding new manager
 */

"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
    watch,
  } = useForm<AddManagerInput>({
    resolver: zodResolver(addManagerSchema),
  });

  const passwordValue = watch("password");

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
            placeholder="John Doe"
            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
              errors.fullName ? "border-red-500" : "border-gray-200"
            }`}
          />
        </FormField>
      </motion.div>

      {/* Department */}
      <motion.div variants={formVariants}>
        <FormField
          label="Department"
          error={errors.department?.message}
          required
        >
          <input
            type="text"
            {...register("department")}
            placeholder="e.g., School Administration"
            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
              errors.department ? "border-red-500" : "border-gray-200"
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
            placeholder="john@example.com"
            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
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
            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
              errors.phoneNumber ? "border-red-500" : "border-gray-200"
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
            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
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
            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
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
          className="w-full px-4 py-2.5 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 disabled:bg-emerald-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
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
