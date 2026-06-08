/**
 * AddTeacherForm - Form for adding new teacher
 */

"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Copy, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { addTeacherSchema, AddTeacherInput } from "../../validation/user.schema";
import { FormField } from "./FormField";
import { StreamSubjectPicker } from "./StreamSubjectPicker";

interface AddTeacherFormProps {
  onSubmit: (data: AddTeacherInput) => Promise<void>;
  isLoading: boolean;
}

type AvailableSubject = {
  id: string;
  name: string;
  streams?: string[];
  streamName?: string;
  feePerMonth?: number;
};

export const AddTeacherForm: React.FC<AddTeacherFormProps> = ({
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
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [submitErrors, setSubmitErrors] = useState<string[]>([]);
  const [isSubmittingLocal, setIsSubmittingLocal] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
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

  const inputClass = useMemo(
    () =>
      "w-full px-4 py-2.5 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all",
    [],
  );

  const availableStreams = useMemo(
    () => {
      const streamSet = new Set<string>();
      subjects.forEach((subject) => {
        if (Array.isArray(subject.streams) && subject.streams.length > 0) {
          subject.streams.forEach((s: any) => {
            const name = s.name || s.streamName || s;
            if (name) streamSet.add(name);
          });
        } else if (subject.streamName) {
          streamSet.add(subject.streamName);
        }
      });
      return Array.from(streamSet).sort((left, right) => left.localeCompare(right));
    },
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
    setSelectedSubjects([]);
    setValue("subject", "", {
      shouldDirty: true,
      shouldValidate: true,
    });
  }, [selectedStream, setValue]);

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

  const toggleSelectSubject = (id: string) => {
    setSelectedSubjects((previous) =>
      previous.includes(id)
        ? previous.filter((subjectId) => subjectId !== id)
        : [...previous, id],
    );
  };

  useEffect(() => {
    const selectedNames = selectedSubjects
      .map((id) => subjects.find((subject) => subject.id === id)?.name)
      .filter((name): name is string => Boolean(name));

    setValue("subject", selectedNames.join(", "), {
      shouldDirty: true,
      shouldValidate: true,
    });
  }, [selectedSubjects, subjects, setValue]);

  const handleInvalid = (errs: Record<string, { message?: string }>) => {
    const messages = Object.keys(errs || {})
      .slice(0, 5)
      .map((key) => errs[key]?.message || `${key} is invalid`);

    setSubmitErrors(messages);
  };

  const onFormSubmit = async (data: AddTeacherInput) => {
    setSubmitErrors([]);
    setIsSubmittingLocal(true);

    try {
      // Require generated password before submitting
      if (!previewPassword) {
        setSubmitErrors(["Please generate a password first"]);
        return;
      }
      const password = previewPassword;
      await onSubmit({ ...data, subjects: selectedSubjects, password });
    } catch (error: any) {
      const message =
        error?.response?.data?.message || error?.message || "Failed to create teacher";
      setSubmitErrors([String(message)]);
    } finally {
      setIsSubmittingLocal(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit(onFormSubmit, handleInvalid)}
      className="space-y-6 rounded-3xl border border-border bg-card p-6 shadow-sm"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {submitErrors.length > 0 && (
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4 text-sm text-rose-800 dark:text-rose-300 shadow-sm">
          <strong className="block font-medium">Please fix the following:</strong>
          <ul className="mt-1 list-disc pl-5">
            {submitErrors.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-4 text-sm text-indigo-800 dark:text-indigo-300 shadow-sm">
        Generate the teacher password here. The value you generate is sent to the backend, hashed, and used for first login.
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <input type="hidden" {...register("subject")} />

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
              className={`${inputClass} ${errors.gender ? "border-red-500" : "border-border"}`}
              defaultValue=""
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
          <FormField
            label="Email Address"
            error={errors.email?.message}
            required
          >
            <input
              type="email"
              {...register("email")}
              placeholder="john@example.com"
              className={`${inputClass} ${errors.email ? "border-red-500" : "border-border"}`}
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
              className={`${inputClass} ${errors.phoneNumber ? "border-red-500" : "border-border"}`}
            />
          </FormField>
        </motion.div>

        <StreamSubjectPicker
          label="Available Subjects"
          selectedStream={selectedStream}
          onStreamChange={setSelectedStream}
          streams={availableStreams}
          subjects={subjects}
          subjectQuery={subjectQuery}
          onSubjectQueryChange={setSubjectQuery}
          isLoading={subjectsLoading}
          isAuthError={subjectsAuthError}
          selectedIds={selectedSubjects}
          onToggleSubject={toggleSelectSubject}
          inputClass={inputClass}
        />

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
      </div>

      <motion.div
        variants={formVariants}
        className="space-y-4 rounded-2xl border border-border bg-muted/20 p-4 shadow-sm"
      >
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-muted-foreground">
            Temporary Password Preview
          </p>
          <button
            type="button"
            onClick={generatePreviewPassword}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-500/10 px-3 py-2 text-sm font-semibold text-indigo-700 dark:text-indigo-300 shadow-sm transition-colors hover:bg-indigo-500/20"
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
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm shadow-sm"
          />
          <button
            type="button"
            onClick={copyPreviewPassword}
            disabled={!previewPassword}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-700 dark:bg-slate-800 px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800 dark:hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-muted"
          >
            <Copy className="h-4 w-4" />
            Copy
          </button>
        </div>
        {copyMessage ? <p className="text-xs text-green-700 dark:text-green-400">{copyMessage}</p> : null}
      </motion.div>

      <motion.div variants={formVariants} className="pt-2">
          <button
            type="submit"
            disabled={isLoading || isSubmittingLocal || !previewPassword}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white shadow-lg shadow-indigo-200 transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
          >
          {isLoading || isSubmittingLocal ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
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