/**
 * StreamSubjectPicker - Shared stream-first subject selector for user forms
 */

"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { FormField } from "./FormField";

type SubjectItem = {
  id: number;
  name: string;
  streams?: string[];
};

interface StreamSubjectPickerProps {
  label: string;
  selectedStream: string;
  onStreamChange: (value: string) => void;
  streams: string[];
  subjects: SubjectItem[];
  subjectQuery: string;
  onSubjectQueryChange: (value: string) => void;
  isLoading: boolean;
  isAuthError: boolean;
  selectedIds: number[];
  onToggleSubject: (id: number) => void;
  inputClass: string;
}

export const StreamSubjectPicker: React.FC<StreamSubjectPickerProps> = ({
  label,
  selectedStream,
  onStreamChange,
  streams,
  subjects,
  subjectQuery,
  onSubjectQueryChange,
  isLoading,
  isAuthError,
  selectedIds,
  onToggleSubject,
  inputClass,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const hasSelectedStream = selectedStream.length > 0;
  const filteredSubjects = useMemo(
    () =>
      subjects.filter((subject) => {
        const matchesStream =
          selectedStream.length === 0 ||
          (subject.streams ?? []).includes(selectedStream);
        const matchesQuery = subject.name
          .toLowerCase()
          .includes(subjectQuery.toLowerCase());

        return matchesStream && matchesQuery;
      }),
    [selectedStream, subjectQuery, subjects],
  );

  let subjectSearchPlaceholder = "Select a stream first";
  if (hasSelectedStream) {
    subjectSearchPlaceholder = isLoading ? "Loading..." : "Search";
  }

  let subjectDropdownContent: React.ReactNode;
  if (!hasSelectedStream) {
    subjectDropdownContent = (
      <div className="p-2 text-sm text-slate-500">Choose a stream first.</div>
    );
  } else if (isLoading) {
    subjectDropdownContent = <div className="p-2 text-sm text-slate-500">Loading...</div>;
  } else if (isAuthError) {
    subjectDropdownContent = (
      <div className="p-2 text-sm text-red-600">
        Sign in to load available subjects.
      </div>
    );
  } else if (filteredSubjects.length === 0) {
    subjectDropdownContent = (
      <div className="p-2 text-sm text-slate-500">No subjects found.</div>
    );
  } else {
    subjectDropdownContent = filteredSubjects.map((subject) => {
      const checkboxId = `stream-subject-${subject.id}`;

      return (
        <label
          key={subject.id}
          className="flex items-center gap-2 rounded px-2 py-1 hover:bg-slate-50"
          htmlFor={checkboxId}
        >
          <input
            id={checkboxId}
            type="checkbox"
            checked={selectedIds.includes(subject.id)}
            onChange={() => onToggleSubject(subject.id)}
            aria-label={subject.name}
          />
          <div className="flex-1 text-sm">
            <div className="font-medium">{subject.name}</div>
            <div className="text-xs text-slate-500">
              {(subject.streams || []).join(", ")}
            </div>
          </div>
        </label>
      );
    });
  }

  return (
    <div className="md:col-span-2">
      <FormField label={label} error={undefined} required>
        <div
          className="space-y-5 rounded-2xl border border-slate-200 bg-linear-to-b from-white to-slate-50/80 p-5 shadow-sm ring-1 ring-slate-100"
          ref={dropdownRef}
        >
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Stream
            </p>
            <select
              aria-label="Stream"
              value={selectedStream}
              onChange={(event) => onStreamChange(event.target.value)}
              className={`${inputClass} border-slate-200 bg-white shadow-sm transition-shadow focus:shadow-md`}
            >
              <option value="">Select stream</option>
              {streams.map((stream) => (
                <option key={stream} value={stream}>
                  {stream}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Subjects
            </p>
            <div className="relative">
              <input
                type="text"
                value={subjectQuery}
                onChange={(event) => {
                  onSubjectQueryChange(event.target.value);
                  setIsDropdownOpen(true);
                }}
                onFocus={() => setIsDropdownOpen(true)}
                disabled={!hasSelectedStream}
                placeholder={subjectSearchPlaceholder}
                className={`${inputClass} border-slate-200 bg-white shadow-sm transition-shadow focus:shadow-md ${isLoading ? "opacity-70" : ""} ${hasSelectedStream ? "" : "cursor-not-allowed bg-slate-100 text-slate-400"}`}
              />

              {isDropdownOpen && (
                <div className="absolute z-20 mt-2 max-h-56 w-full overflow-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl">
                  {subjectDropdownContent}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Selected subjects
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedIds.map((id) => {
                const subject = subjects.find((item) => item.id === id);
                if (!subject) return null;

                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => onToggleSubject(id)}
                    className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-800 shadow-sm transition-colors hover:bg-emerald-100 hover:shadow"
                  >
                    <span>{subject.name}</span>
                    <span className="text-emerald-500">×</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </FormField>
    </div>
  );
};
