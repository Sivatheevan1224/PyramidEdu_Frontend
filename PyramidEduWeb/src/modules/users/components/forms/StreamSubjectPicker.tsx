/**
 * StreamSubjectPicker - Shared stream-first subject selector for user forms
 */

"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { FormField } from "./FormField";

type SubjectItem = {
  id: string;
  name: string;
  streams?: string[];
  streamName?: string;
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
  selectedIds: string[];
  onToggleSubject: (id: string) => void;
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
        const subjectStreams = subject.streamName
          ? [subject.streamName]
          : (subject.streams ?? []);
        const matchesStream =
          selectedStream.length === 0 ||
          subjectStreams.includes(selectedStream);
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
      <div className="p-2 text-sm text-muted-foreground">Choose a stream first.</div>
    );
  } else if (isLoading) {
    subjectDropdownContent = <div className="p-2 text-sm text-muted-foreground">Loading...</div>;
  } else if (isAuthError) {
    subjectDropdownContent = (
      <div className="p-2 text-sm text-red-600">
        Sign in to load available subjects.
      </div>
    );
  } else if (filteredSubjects.length === 0) {
    subjectDropdownContent = (
      <div className="p-2 text-sm text-muted-foreground">No subjects found.</div>
    );
  } else {
    subjectDropdownContent = filteredSubjects.map((subject) => {
      const checkboxId = `stream-subject-${subject.id}`;

      return (
        <label
          key={subject.id}
          className="flex items-center gap-2 rounded px-2 py-1 hover:bg-muted"
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
            <div className="text-xs text-muted-foreground">
              {subject.streamName || (subject.streams || []).join(", ")}
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
          className="space-y-5 rounded-2xl border border-border bg-card p-5 shadow-sm"
          ref={dropdownRef}
        >
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Stream
            </p>
            <select
              aria-label="Stream"
              value={selectedStream}
              onChange={(event) => onStreamChange(event.target.value)}
              className={`${inputClass} border-border bg-background shadow-sm transition-shadow focus:shadow-md`}
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
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
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
                className={`${inputClass} border-border bg-background shadow-sm transition-shadow focus:shadow-md ${isLoading ? "opacity-70" : ""} ${hasSelectedStream ? "" : "cursor-not-allowed bg-muted text-muted-foreground"}`}
              />

              {isDropdownOpen && (
                <div className="absolute z-20 mt-2 max-h-56 w-full overflow-auto rounded-2xl border border-border bg-card p-2 shadow-2xl">
                  {subjectDropdownContent}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
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
                    className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-sm font-medium text-emerald-800 dark:text-emerald-300 shadow-sm transition-colors hover:bg-emerald-500/20 hover:shadow"
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
