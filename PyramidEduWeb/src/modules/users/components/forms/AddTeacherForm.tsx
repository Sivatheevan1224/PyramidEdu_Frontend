/**
 * AddTeacherForm - Form for adding new teacher
 */

"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  addTeacherSchema,
  AddTeacherInput,
} from "../../validation/user.schema";
import { FormField } from "./FormField";
import { motion } from "framer-motion";

interface AddTeacherFormProps {
  onSubmit: (data: AddTeacherInput) => Promise<void>;
  isLoading: boolean;
}

export const AddTeacherForm: React.FC<AddTeacherFormProps> = ({
  onSubmit,
  isLoading,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<AddTeacherInput>({
    resolver: zodResolver(addTeacherSchema),
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
      {/* First Name */}
      <motion.div variants={formVariants}>
        <FormField
          label="First Name"
          error={errors.firstName?.message}
          required
        >
          <input
            type="text"
            {...register("firstName")}
            placeholder="John"
            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
              errors.firstName ? "border-red-500" : "border-gray-200"
            }`}
          />
        </FormField>
      </motion.div>

      {/* Last Name */}
      <motion.div variants={formVariants}>
        <FormField label="Last Name" error={errors.lastName?.message} required>
          <input
            type="text"
            {...register("lastName")}
            placeholder="Doe"
            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
              errors.lastName ? "border-red-500" : "border-gray-200"
            }`}
          />
        </FormField>
      </motion.div>

      {/* Subject Specialization */}
      <motion.div variants={formVariants}>
        <FormField
          label="Subject Specialization"
          error={errors.subject?.message}
          required
        >
          <input
            type="text"
            {...register("subject")}
            placeholder="e.g., Mathematics, English, Science"
            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
              errors.subject ? "border-red-500" : "border-gray-200"
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
            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
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
            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
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
            placeholder="50000"
            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
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
            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
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
            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
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
          className="w-full px-4 py-2.5 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Creating...
            </>
          ) : (
            "Create Teacher"
          )}
        </button>
      </motion.div>
    </motion.form>
  );
};
