/**
 * AddStudentForm - Form for adding new student
 */

"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
            placeholder="Alex"
            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${
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
            placeholder="Johnson"
            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${
              errors.lastName ? "border-red-500" : "border-gray-200"
            }`}
          />
        </FormField>
      </motion.div>

      {/* Index Number */}
      <motion.div variants={formVariants}>
        <FormField
          label="Index Number"
          error={errors.indexNumber?.message}
          required
        >
          <input
            type="text"
            {...register("indexNumber")}
            placeholder="STD2024001"
            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${
              errors.indexNumber ? "border-red-500" : "border-gray-200"
            }`}
          />
        </FormField>
      </motion.div>

      {/* Parent Name */}
      <motion.div variants={formVariants}>
        <FormField
          label="Parent Name"
          error={errors.parentName?.message}
          required
        >
          <input
            type="text"
            {...register("parentName")}
            placeholder="Robert Johnson"
            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${
              errors.parentName ? "border-red-500" : "border-gray-200"
            }`}
          />
        </FormField>
      </motion.div>

      {/* Parent Phone */}
      <motion.div variants={formVariants}>
        <FormField
          label="Parent Phone"
          error={errors.parentPhone?.message}
          required
        >
          <input
            type="tel"
            {...register("parentPhone")}
            placeholder="+1 (555) 987-6543"
            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${
              errors.parentPhone ? "border-red-500" : "border-gray-200"
            }`}
          />
        </FormField>
      </motion.div>

      {/* Address */}
      <motion.div variants={formVariants}>
        <FormField label="Address" error={errors.address?.message} required>
          <textarea
            {...register("address")}
            placeholder="123 Main Street, City, State 12345"
            rows={2}
            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all resize-none ${
              errors.address ? "border-red-500" : "border-gray-200"
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
            placeholder="alex@example.com"
            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${
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
            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${
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
            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${
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
            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${
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
