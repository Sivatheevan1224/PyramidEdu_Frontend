"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// Use live API data by default; remove hardcoded fallback
import { AddStreamModal } from "./components/AddStreamModal";
import { AddSubjectModal } from "./components/AddSubjectModal";
import { SubjectTable } from "./components/SubjectTable";
import {
  StreamItem,
  SubjectFormValues,
  SubjectItem,
  TeacherOption,
} from "./types";
import { subjectService } from "./services/subject.service";

export default function SubjectManagement() {
  const [streams, setStreams] = useState<StreamItem[]>([]);
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [teachers, setTeachers] = useState<TeacherOption[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingSubject, setIsSavingSubject] = useState(false);

  const [isAddStreamOpen, setIsAddStreamOpen] = useState(false);
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<SubjectItem | null>(
    null,
  );

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      try {
        const [subjectRows, streamRows, teacherRows] = await Promise.all([
          subjectService.getSubjects(),
          subjectService.getStreams(),
          subjectService.getTeachers(),
        ]);

        setSubjects(subjectRows);
        setStreams(streamRows);
        setTeachers(teacherRows);
      } catch (error: any) {
        console.error("Failed to load subject management data", error);
        toast.error(
          error?.response?.data?.message ?? "Failed to load subjects",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredSubjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return subjects;
    }

    const streamMap = new Map(
      streams.map((stream) => [stream.id, stream.name.toLowerCase()]),
    );

    return subjects.filter((subject) => {
      const byName = subject.name.toLowerCase().includes(query);
      const byStream = subject.streamIds.some((streamId) =>
        streamMap.get(streamId)?.includes(query),
      );
      return byName || byStream;
    });
  }, [searchQuery, streams, subjects]);

  const handleAddStream = async (name: string) => {
    try {
      const created = await subjectService.createStream(name);
      setStreams((previous) => [...previous, created]);
      toast.success("Stream added successfully.");
      return true;
    } catch (error: any) {
      console.error("Failed to create stream", error);
      toast.error(error?.response?.data?.message ?? "Failed to create stream");
      return false;
    }
  };

  const handleSaveSubject = async (
    values: SubjectFormValues,
    editingId?: string,
  ) => {
    setIsSavingSubject(true);

    try {
      const saved = editingId
        ? await subjectService.updateSubject(editingId, values)
        : await subjectService.createSubject(values);

      setSubjects((previous) => {
        if (editingId) {
          return previous.map((subject) =>
            subject.id === editingId ? saved : subject,
          );
        }
        return [saved, ...previous];
      });

      toast.success(
        editingId
          ? "Subject updated successfully."
          : "Subject added successfully.",
      );
      setEditingSubject(null);
      return true;
    } catch (error: any) {
      console.error("Failed to save subject", error);
      toast.error(error?.response?.data?.message ?? "Failed to save subject");
      return false;
    } finally {
      setIsSavingSubject(false);
    }
  };

  const handleToggleActive = (subjectId: string) => {
    const current = subjects.find((subject) => subject.id === subjectId);
    if (!current) {
      return;
    }

    const nextActiveState = !current.isActive;

    setSubjects((previous) =>
      previous.map((subject) =>
        subject.id === subjectId
          ? { ...subject, isActive: nextActiveState }
          : subject,
      ),
    );

    const run = async () => {
      try {
        const updated = await subjectService.toggleSubjectActive(
          subjectId,
          nextActiveState,
        );

        setSubjects((previous) =>
          previous.map((subject) =>
            subject.id === subjectId ? updated : subject,
          ),
        );
      } catch (error: any) {
        setSubjects((previous) =>
          previous.map((subject) =>
            subject.id === subjectId
              ? { ...subject, isActive: current.isActive }
              : subject,
          ),
        );
        toast.error(
          error?.response?.data?.message ?? "Failed to update subject status",
        );
      }
    };

    run();
  };

  const handleEdit = (subjectId: string) => {
    const target = subjects.find((subject) => subject.id === subjectId) ?? null;
    setEditingSubject(target);
    setIsAddSubjectOpen(true);
  };

  const openAddSubject = () => {
    setEditingSubject(null);
    setIsAddSubjectOpen(true);
  };

  return (
    <div className="space-y-5 p-4 sm:p-6 lg:p-8">
      <Card className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            className="h-9 rounded-xl bg-cyan-600 px-4 text-sm font-semibold hover:bg-cyan-700"
            onClick={openAddSubject}
          >
            <Plus className="mr-1 h-4 w-4" />
            Add Subject
          </Button>

          <Button
            type="button"
            variant="outline"
            className="h-9 rounded-xl border-emerald-200 bg-emerald-50 px-4 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-400 dark:hover:bg-emerald-900/40"
            onClick={() => setIsAddStreamOpen(true)}
          >
            <Plus className="mr-1 h-4 w-4" />
            Add Stream
          </Button>

          <div className="relative min-w-[240px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search subjects or streams"
              className="h-9 rounded-xl border-border bg-background text-foreground pl-9"
            />
          </div>
        </div>
      </Card>

      <SubjectTable
        subjects={filteredSubjects}
        streams={streams}
        onToggleActive={handleToggleActive}
        onEdit={handleEdit}
      />

      {isLoading && (
        <Card className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground shadow-sm">
          Loading subjects...
        </Card>
      )}

      <AddStreamModal
        isOpen={isAddStreamOpen}
        onClose={() => setIsAddStreamOpen(false)}
        onSave={handleAddStream}
      />

      <AddSubjectModal
        isOpen={isAddSubjectOpen}
        streams={streams}
        teachers={teachers}
        isSaving={isSavingSubject}
        initialValues={editingSubject}
        onClose={() => {
          setIsAddSubjectOpen(false);
          setEditingSubject(null);
        }}
        onSave={handleSaveSubject}
      />
    </div>
  );
}
