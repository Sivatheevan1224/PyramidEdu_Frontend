/**
 * AddSupportStaffForm - Form for adding support staff
 */

"use client";

import React, { useMemo, useEffect } from "react";
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
    setValue,
    watch,
    formState: { errors },
  } = useForm<AddSupportStaffInput>({
    resolver: zodResolver(addSupportStaffSchema),
    defaultValues: {
      email: "placeholder@pyramidedu.com",
    },
  });

  const firstName = watch("firstName");
  const lastName = watch("lastName");
  const nicNumber = watch("nicNumber");

  useEffect(() => {
    if (firstName && lastName && nicNumber) {
      const generatedEmail = `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${nicNumber.toLowerCase()}@pyramidedu.com`.replace(/\s+/g, '');
      setValue("email", generatedEmail, { shouldValidate: true });
    }
  }, [firstName, lastName, nicNumber, setValue]);

  const onFormSubmit = async (data: AddSupportStaffInput) => {
    await onSubmit(data);
  };

  const inputClass = useMemo(
    () =>
      "w-full px-4 py-2.5 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all",
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
      className="space-y-6 rounded-3xl border border-border bg-card p-6 shadow-sm"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-4 text-sm text-orange-800 dark:text-orange-300 shadow-sm">
        Support staff do not use this dashboard, so no password is entered here. The backend will create the account without exposing a login-password field in the form.
      </div>

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
              className={`${inputClass} ${errors.firstName ? "border-red-500" : "border-border"}`}
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
              className={`${inputClass} ${errors.lastName ? "border-red-500" : "border-border"}`}
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
              className={`${inputClass} ${errors.address ? "border-red-500" : "border-border"}`}
            />
          </FormField>
        </motion.div>

        <motion.div variants={formVariants}>
          <FormField label="Role" error={errors.roleType?.message} required>
            <input
              type="text"
              {...register("roleType")}
              placeholder="e.g., Librarian, Counselor, Maintenance"
              className={`${inputClass} ${errors.roleType ? "border-red-500" : "border-border"}`}
            />
          </FormField>
        </motion.div>

        <motion.div variants={formVariants}>
          <FormField label="Salary (Optional)" error={errors.salary?.message}>
            <input
              type="number"
              {...register("salary", { valueAsNumber: true })}
              placeholder="35000"
              className={`${inputClass} ${errors.salary ? "border-red-500" : "border-border"}`}
            />
          </FormField>
        </motion.div>

        <input type="hidden" {...register("email")} />

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
              className={`${inputClass} ${errors.phoneNumber ? "border-red-500" : "border-border"}`}
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
