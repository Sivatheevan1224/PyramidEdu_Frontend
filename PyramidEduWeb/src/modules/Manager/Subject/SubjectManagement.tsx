"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Search, BookOpen, Layers, Users } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { AddStreamModal } from "./components/AddStreamModal";
import { AddSubjectModal } from "./components/AddSubjectModal";
import { SubjectTable } from "./components/SubjectTable";
import { StreamTable } from "./components/StreamTable";
import { BatchTable } from "../Batches/components/BatchTable";
import { AddBatchModal } from "../Batches/components/AddBatchModal";

import {
  StreamItem,
  SubjectFormValues,
  SubjectItem,
  TeacherOption,
} from "./types";
import { subjectService } from "./services/subject.service";
import { BatchItem, batchService } from "../Batches/services/batch.service";

type TabValue = "batches" | "streams" | "subjects";

export default function SubjectManagement() {
  const [activeTab, setActiveTab] = useState<TabValue>("batches");

  const [batches, setBatches] = useState<BatchItem[]>([]);
  const [streams, setStreams] = useState<StreamItem[]>([]);
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [teachers, setTeachers] = useState<TeacherOption[]>([]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [isSavingBatch, setIsSavingBatch] = useState(false);
  const [isAddBatchOpen, setIsAddBatchOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<BatchItem | null>(null);

  const [isSavingStream, setIsSavingStream] = useState(false);
  const [isAddStreamOpen, setIsAddStreamOpen] = useState(false);
  const [editingStream, setEditingStream] = useState<StreamItem | null>(null);

  const [isSavingSubject, setIsSavingSubject] = useState(false);
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<SubjectItem | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      try {
        const [batchRows, streamRows, subjectRows, teacherRows] = await Promise.all([
          batchService.getBatches(),
          subjectService.getStreams(),
          subjectService.getSubjects(),
          subjectService.getTeachers(),
        ]);

        setBatches(batchRows);
        setStreams(streamRows);
        setSubjects(subjectRows);
        setTeachers(teacherRows);
      } catch (error: any) {
        console.error("Failed to load curriculum management data", error);
        toast.error(
          error?.response?.data?.message ?? "Failed to load curriculum data",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredBatches = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return batches;
    return batches.filter((b) => b.batchName.toLowerCase().includes(query));
  }, [searchQuery, batches]);

  const filteredStreams = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return streams;
    return streams.filter((s) => s.name.toLowerCase().includes(query));
  }, [searchQuery, streams]);

  const filteredSubjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return subjects;

    const streamMap = new Map(
      streams.map((stream) => [stream.id, stream.name.toLowerCase()]),
    );

    return subjects.filter((s) => {
      const matchSearch = s.name.toLowerCase().includes(query) ||
        (streamMap.get(s.streamId) || "").includes(query);
      return matchSearch;
    });
  }, [searchQuery, streams, subjects]);

  // ── Batch handlers ──────────────────────────────────────────
  const handleSaveBatch = async (batchName: string, isActive: boolean, editingId?: string) => {
    setIsSavingBatch(true);
    try {
      if (editingId) {
        const updated = await batchService.updateBatch(editingId, batchName, isActive);
        setBatches((prev) => prev.map((b) => (b.id === editingId ? updated : b)));
        toast.success("Batch updated successfully");
      } else {
        const created = await batchService.createBatch(batchName, isActive);
        setBatches((prev) => [created, ...prev]);
        toast.success("Batch created successfully");
      }
      setIsAddBatchOpen(false);
      setEditingBatch(null);
      return true;
    } catch (error: any) {
      console.error("Failed to save batch", error);
      toast.error(error?.response?.data?.message ?? "Failed to save batch");
      return false;
    } finally {
      setIsSavingBatch(false);
    }
  };

  const handleToggleActiveBatch = async (id: string) => {
    const current = batches.find((b) => b.id === id);
    if (!current) return;
    const nextState = !current.isActive;
    setBatches((prev) => prev.map((b) => (b.id === id ? { ...b, isActive: nextState } : b)));
    try {
      const updated = await batchService.toggleBatchActive(id, nextState);
      setBatches((prev) => prev.map((b) => (b.id === id ? updated : b)));
    } catch (error: any) {
      setBatches((prev) => prev.map((b) => (b.id === id ? { ...b, isActive: current.isActive } : b)));
      toast.error(error?.response?.data?.message ?? "Failed to update status");
    }
  };

  const handleEditBatch = (id: string) => {
    const target = batches.find((b) => b.id === id);
    if (target) {
      setEditingBatch(target);
      setIsAddBatchOpen(true);
    }
  };

  const openAddBatch = () => {
    setEditingBatch(null);
    setIsAddBatchOpen(true);
  };

  // ── Stream handlers ──────────────────────────────────────────
  const handleSaveStream = async (name: string, batchIds: string[], editingId?: string) => {
    setIsSavingStream(true);
    try {
      if (editingId) {
        const updated = await subjectService.updateStream(editingId, name, batchIds);
        setStreams((prev) =>
          prev.map((s) => (s.id === editingId ? updated : s))
        );
        toast.success("Stream updated successfully.");
      } else {
        const created = await subjectService.createStream(name, batchIds);
        setStreams((prev) => [...prev, created]);
        toast.success("Stream added successfully.");
      }
      return true;
    } catch (error: any) {
      console.error("Failed to save stream", error);
      toast.error(error?.response?.data?.message ?? "Failed to save stream");
      return false;
    } finally {
      setIsSavingStream(false);
    }
  };

  const handleEditStream = (stream: StreamItem) => {
    setEditingStream(stream);
    setIsAddStreamOpen(true);
  };

  const openAddStream = () => {
    setEditingStream(null);
    setIsAddStreamOpen(true);
  };

  // ── Subject handlers ─────────────────────────────────────────
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

  const handleToggleActiveSubject = (subjectId: string) => {
    const current = subjects.find((subject) => subject.id === subjectId);
    if (!current) return;

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

  const handleEditSubject = (subjectId: string) => {
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
      {/* Header and Tabs */}
      <Card className="rounded-2xl border border-border bg-card p-4 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={activeTab === "batches" ? "default" : "outline"}
            onClick={() => setActiveTab("batches")}
            className="rounded-xl font-semibold"
          >
            <Users className="w-4 h-4 mr-2" />
            Batches
          </Button>
          <Button
            variant={activeTab === "streams" ? "default" : "outline"}
            onClick={() => setActiveTab("streams")}
            className="rounded-xl font-semibold"
          >
            <Layers className="w-4 h-4 mr-2" />
            Streams
          </Button>
          <Button
            variant={activeTab === "subjects" ? "default" : "outline"}
            onClick={() => setActiveTab("subjects")}
            className="rounded-xl font-semibold"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Subjects
          </Button>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={`Search ${activeTab}...`}
              className="h-10 rounded-xl pl-9"
            />
          </div>
          
          {activeTab === "batches" && (
            <Button className="h-10 rounded-xl bg-cyan-600 px-4 font-semibold hover:bg-cyan-700 text-white flex-shrink-0" onClick={openAddBatch}>
              <Plus className="mr-1 h-4 w-4" /> Add Batch
            </Button>
          )}
          {activeTab === "streams" && (
            <Button className="h-10 rounded-xl bg-emerald-600 px-4 font-semibold hover:bg-emerald-700 text-white flex-shrink-0" onClick={openAddStream}>
              <Plus className="mr-1 h-4 w-4" /> Add Stream
            </Button>
          )}
          {activeTab === "subjects" && (
            <Button className="h-10 rounded-xl bg-indigo-600 px-4 font-semibold hover:bg-indigo-700 text-white flex-shrink-0" onClick={openAddSubject}>
              <Plus className="mr-1 h-4 w-4" /> Add Subject
            </Button>
          )}
        </div>
      </Card>

      {isLoading ? (
        <Card className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground shadow-sm">
          Loading {activeTab}...
        </Card>
      ) : (
        <>
          {activeTab === "batches" && (
            <BatchTable
              batches={filteredBatches}
              onToggleActive={handleToggleActiveBatch}
              onEdit={handleEditBatch}
            />
          )}

          {activeTab === "streams" && (
            <StreamTable streams={filteredStreams} batches={batches} onEdit={handleEditStream} />
          )}

          {activeTab === "subjects" && (
            <SubjectTable
              subjects={filteredSubjects}
              streams={streams}
              onToggleActive={handleToggleActiveSubject}
              onEdit={handleEditSubject}
            />
          )}
        </>
      )}

      {/* Modals */}
      <AddBatchModal
        isOpen={isAddBatchOpen}
        isSaving={isSavingBatch}
        initialValues={editingBatch}
        onClose={() => {
          setIsAddBatchOpen(false);
          setEditingBatch(null);
        }}
        onSave={handleSaveBatch}
      />

      <AddStreamModal
        isOpen={isAddStreamOpen}
        editingStream={editingStream}
        batches={batches}
        onClose={() => {
          setIsAddStreamOpen(false);
          setEditingStream(null);
        }}
        onSave={handleSaveStream}
      />

      <AddSubjectModal
        isOpen={isAddSubjectOpen}
        streams={streams}
        batches={batches}
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
