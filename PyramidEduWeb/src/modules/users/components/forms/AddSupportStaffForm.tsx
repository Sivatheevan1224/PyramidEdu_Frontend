/**
 * AddSupportStaffForm - Form for adding support staff
 */

"use client";

import React, { useMemo } from "react";
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
      className="space-y-5"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="rounded-xl border border-orange-100 bg-orange-50/60 p-4 text-sm text-orange-800">
        Support staff are created without dashboard access. No password is
        required or shown.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
