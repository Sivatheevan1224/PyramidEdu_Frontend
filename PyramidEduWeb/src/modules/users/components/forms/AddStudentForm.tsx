/**
 * AddStudentForm - Form for adding new student
 */

"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Copy, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { addStudentSchema, AddStudentInput } from "../../validation/user.schema";
import { FormField } from "./FormField";
import { StreamSubjectPicker } from "./StreamSubjectPicker";

interface AddStudentFormProps {
  onSubmit: (data: AddStudentInput) => Promise<void>;
  isLoading: boolean;
}

type AvailableSubject = {
  id: number;
  name: string;
  streams?: string[];
};

export const AddStudentForm: React.FC<AddStudentFormProps> = ({
  onSubmit,
  isLoading,
}) => {
  const [previewPassword, setPreviewPassword] = useState("");
  const [copyMessage, setCopyMessage] = useState("");
  const [subjects, setSubjects] = useState<AvailableSubject[]>([]);
  const [subjectsLoading, setSubjectsLoading] = useState(false);
  const [subjectsAuthError, setSubjectsAuthError] = useState(false);
  const [subjectQuery, setSubjectQuery] = useState("");
  const [selectedStream, setSelectedStream] = useState("");
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<number[]>([]);
  const [submitErrors, setSubmitErrors] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
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

  const inputClass = useMemo(
    () =>
      "w-full px-4 py-2.5 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all",
    [],
  );

  const availableStreams = useMemo(
    () =>
      Array.from(new Set(subjects.flatMap((subject) => subject.streams ?? []))).sort(
        (left, right) => left.localeCompare(right),
      ),
    [subjects],
  );

  useEffect(() => {
    let mounted = true;
    setSubjectsLoading(true);

    api
      .get("/subjects/available")
      .then((res) => {
        if (!mounted) return;

        const payload = res.data;
        let rows: AvailableSubject[] = [];

        if (Array.isArray(payload)) {
          rows = payload;
        } else if (Array.isArray(payload?.data)) {
          rows = payload.data;
        }

        setSubjects(rows);
      })
      .catch((error) => {
        if (!mounted) return;

        setSubjects([]);
        setSubjectsAuthError(error?.response?.status === 401);
      })
      .finally(() => {
        if (mounted) setSubjectsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    setSubjectQuery("");
    setSelectedSubjectIds([]);
    setValue("subjectIds", [], {
      shouldDirty: true,
      shouldValidate: true,
    });
  }, [selectedStream, setValue]);

  useEffect(() => {
    setValue("subjectIds", selectedSubjectIds, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }, [selectedSubjectIds, setValue]);

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

  const toggleSelectSubject = (id: number) => {
    setSelectedSubjectIds((previous) =>
      previous.includes(id)
        ? previous.filter((subjectId) => subjectId !== id)
        : [...previous, id],
    );
  };

  const handleInvalid = (errs: Record<string, { message?: string }>) => {
    const messages = Object.keys(errs || {})
      .slice(0, 5)
      .map((key) => errs[key]?.message || `${key} is invalid`);

    setSubmitErrors(messages);
  };

  const onFormSubmit = async (data: AddStudentInput) => {
    if (selectedSubjectIds.length === 0) {
      setSubmitErrors(["Select at least one course to enroll the student."]);
      return;
    }

    setSubmitErrors([]);
    await onSubmit({ ...data, subjectIds: selectedSubjectIds });
  };

  return (
    <motion.form
      onSubmit={handleSubmit(onFormSubmit, handleInvalid)}
      className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl ring-1 ring-slate-100"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {submitErrors.length > 0 && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-4 text-sm text-rose-800 shadow-sm">
          <strong className="block font-medium">Please fix the following:</strong>
          <ul className="mt-1 list-disc pl-5">
            {submitErrors.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-2xl border border-green-100 bg-gradient-to-r from-green-50 via-white to-emerald-50 p-4 text-sm text-green-800 shadow-sm">
        Student accounts use a backend-generated temporary password. Select the
        courses the student should enroll in below.
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
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
          <FormField
            label="Index Number"
            error={errors.indexNumber?.message}
            required
          >
            <input
              type="text"
              {...register("indexNumber")}
              placeholder="STD2024001"
              className={`${inputClass} ${errors.indexNumber ? "border-red-500" : "border-gray-200"}`}
            />
          </FormField>
        </motion.div>

        <motion.div variants={formVariants}>
          <FormField
            label="Date of Birth"
            error={errors.dateOfBirth?.message}
            required
          >
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

        <input type="hidden" {...register("subjectIds")} />

        <StreamSubjectPicker
          label="Select Courses"
          selectedStream={selectedStream}
          onStreamChange={setSelectedStream}
          streams={availableStreams}
          subjects={subjects}
          subjectQuery={subjectQuery}
          onSubjectQueryChange={setSubjectQuery}
          isLoading={subjectsLoading}
          isAuthError={subjectsAuthError}
          selectedIds={selectedSubjectIds}
          onToggleSubject={toggleSelectSubject}
          inputClass={inputClass}
        />
      </div>

      <motion.div
        variants={formVariants}
        className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 shadow-sm"
      >
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-slate-700">
            Temporary Password Preview
          </p>
          <button
            type="button"
            onClick={generatePreviewPassword}
            className="inline-flex items-center gap-2 rounded-xl bg-green-100 px-3 py-2 text-sm font-semibold text-green-700 shadow-sm transition-colors hover:bg-green-200"
          >
            <RefreshCw className="h-4 w-4" />
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
            <Copy className="h-4 w-4" />
            Copy
          </button>
        </div>

        {copyMessage ? <p className="text-xs text-green-700">{copyMessage}</p> : null}
      </motion.div>

      <motion.div variants={formVariants} className="pt-2">
        <button
          type="submit"
          disabled={isLoading || subjectsLoading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 font-semibold text-white shadow-lg shadow-green-200 transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-400"
        >
          {isLoading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
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