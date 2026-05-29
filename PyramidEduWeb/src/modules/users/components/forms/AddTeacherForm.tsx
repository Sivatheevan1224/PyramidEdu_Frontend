/**
 * AddTeacherForm - Form for adding new teacher
 */

"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  addTeacherSchema,
  AddTeacherInput,
} from "../../validation/user.schema";
import { FormField } from "./FormField";
import { api } from "@/lib/api";
import { motion } from "framer-motion";
import { Copy, RefreshCw } from "lucide-react";

interface AddTeacherFormProps {
  onSubmit: (data: AddTeacherInput) => Promise<void>;
  isLoading: boolean;
}

export const AddTeacherForm: React.FC<AddTeacherFormProps> = ({
  onSubmit,
  isLoading,
}) => {
  const [previewPassword, setPreviewPassword] = useState("");
  const [copyMessage, setCopyMessage] = useState("");
  const [subjects, setSubjects] = useState<
    Array<{
      id: number;
      name: string;
      streams?: string[];
      feePerMonth?: number;
    }>
  >([]);
  const [subjectsLoading, setSubjectsLoading] = useState(false);
  const [subjectsAuthError, setSubjectsAuthError] = useState(false);
  const [subjectQuery, setSubjectQuery] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState<number[]>([]);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AddTeacherInput>({
    resolver: zodResolver(addTeacherSchema),
  });

  const [submitErrors, setSubmitErrors] = useState<string[]>([]);
  const [isSubmittingLocal, setIsSubmittingLocal] = useState(false);

  const handleInvalid = (errs: any) => {
    const messages: string[] = [];
    const keys = Object.keys(errs || {});
    for (let i = 0; i < Math.min(5, keys.length); i++) {
      const k = keys[i];
      const msg = errs[k]?.message || `${k} is invalid`;
      messages.push(msg);
    }
    setSubmitErrors(messages);

    if (keys.length > 0) {
      const first = document.querySelector(
        `[name="${keys[0]}"]`,
      ) as HTMLElement | null;
      if (first && typeof first.focus === "function") first.focus();
    }
  };

  const inputClass = useMemo(
    () =>
      "w-full px-4 py-2.5 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all",
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

  useEffect(() => {
    let mounted = true;
    setSubjectsLoading(true);

    api
      .get("/subjects/available")
      .then((res) => {
        if (!mounted) return;
        const payload = res.data;
        if (Array.isArray(payload)) {
          setSubjects(payload as any);
        } else if (payload?.data && Array.isArray(payload.data)) {
          setSubjects(payload.data as any);
        } else {
          setSubjects([]);
        }
      })
      .catch((err) => {
        if (!mounted) return;
        setSubjects([]);
        if (err?.response?.status === 401) {
          setSubjectsAuthError(true);
          console.warn("Unauthorized fetching available subjects");
        } else {
          setSubjectsAuthError(false);
        }
      })
      .finally(() => mounted && setSubjectsLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

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

  const filteredSubjects = subjects.filter((s) =>
    s.name.toLowerCase().includes(subjectQuery.toLowerCase()),
  );

  const toggleSelectSubject = (id: number) => {
    setSelectedSubjects((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
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

  const onFormSubmit = async (data: AddTeacherInput) => {
    console.log("AddTeacherForm: submit invoked", data, { selectedSubjects });
    setSubmitErrors([]);
    setIsSubmittingLocal(true);
    try {
      await onSubmit({ ...data, subjects: selectedSubjects });
      console.log("AddTeacherForm: onSubmit completed");
    } catch (err: any) {
      console.error("AddTeacherForm: onSubmit error", err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create teacher";
      setSubmitErrors([String(msg)]);
    } finally {
      setIsSubmittingLocal(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit(onFormSubmit, handleInvalid)}
      className="space-y-5"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {submitErrors.length > 0 && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          <strong className="block font-medium">
            Please fix the following:
          </strong>
          <ul className="mt-1 list-disc pl-5">
            {submitErrors.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 text-sm text-indigo-800">
        Backend generates the final temporary password after creation. You can
        use the generator below to share a preview password format.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              placeholder="Doe"
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
              className={`${inputClass} ${errors.gender ? "border-red-500" : "border-gray-200"}`}
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
              className={`${inputClass} ${errors.address ? "border-red-500" : "border-gray-200"}`}
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

        <motion.div variants={formVariants}></motion.div>

        <motion.div variants={formVariants} className="md:col-span-2">
          <FormField label="Available Subjects" error={undefined}>
            <div className="relative" ref={dropdownRef}>
              <input
                type="text"
                value={subjectQuery}
                onChange={(e) => {
                  setSubjectQuery(e.target.value);
                  setIsDropdownOpen(true);
                }}
                onFocus={() => setIsDropdownOpen(true)}
                placeholder={
                  subjectsLoading ? "Loading subjects..." : "Search subjects"
                }
                className={`${inputClass} ${subjectsLoading ? "opacity-70" : ""}`}
              />

              {isDropdownOpen && (
                <div className="absolute z-20 mt-1 max-h-48 w-full overflow-auto rounded-lg border bg-white p-2 shadow-lg">
                  {subjectsLoading ? (
                    <div className="p-2 text-sm text-slate-500">Loading...</div>
                  ) : subjectsAuthError ? (
                    <div className="p-2 text-sm text-red-600">
                      Sign in to load available subjects.
                    </div>
                  ) : filteredSubjects.length === 0 ? (
                    <div className="p-2 text-sm text-slate-500">
                      No subjects found.
                    </div>
                  ) : (
                    filteredSubjects.map((s) => (
                      <label
                        key={s.id}
                        className="flex items-center gap-2 px-2 py-1 hover:bg-slate-50 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={selectedSubjects.includes(s.id)}
                          onChange={() => toggleSelectSubject(s.id)}
                        />
                        <div className="flex-1 text-sm">
                          <div className="font-medium">{s.name}</div>
                          <div className="text-xs text-slate-500">
                            {(s.streams || []).join(", ")}
                          </div>
                        </div>
                      </label>
                    ))
                  )}
                </div>
              )}

              <div className="mt-2 flex flex-wrap gap-2">
                {selectedSubjects.map((id) => {
                  const s = subjects.find((x) => x.id === id);
                  if (!s) return null;
                  return (
                    <div
                      key={id}
                      className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm"
                    >
                      <span>{s.name}</span>
                      <button
                        type="button"
                        onClick={() => toggleSelectSubject(id)}
                        className="-mr-1 ml-1 text-slate-500"
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </FormField>
        </motion.div>

        <motion.div variants={formVariants}>
          <FormField label="Salary (Optional)" error={errors.salary?.message}>
            <input
              type="number"
              {...register("salary", { valueAsNumber: true })}
              placeholder="50000"
              className={`${inputClass} ${errors.salary ? "border-red-500" : "border-gray-200"}`}
            />
          </FormField>
        </motion.div>
      </div>

      <motion.div
        variants={formVariants}
        className="rounded-xl border border-gray-200 p-4 space-y-3"
      >
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-gray-700">
            Temporary Password Preview
          </p>
          <button
            type="button"
            onClick={generatePreviewPassword}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-indigo-700 bg-indigo-100 hover:bg-indigo-200 rounded-lg"
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
        {copyMessage ? (
          <p className="text-xs text-emerald-700">{copyMessage}</p>
        ) : null}
      </motion.div>

      {/* Submit Button */}
      <motion.div variants={formVariants} className="pt-4">
        <button
          type="submit"
          disabled={isLoading || isSubmittingLocal}
          className="w-full px-4 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {isLoading || isSubmittingLocal ? (
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
