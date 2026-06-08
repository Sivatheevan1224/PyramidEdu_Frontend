import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useCreateSession } from "../hooks/useCreateSession";
import { DropdownPanel } from "./DropdownPanel";

export const CreateSession = () => {
  const {
    subjects,
    batches,
    teachers,
    subjectId, setSubjectId,
    batchId, setBatchId,
    teacherId, setTeacherId,
    sessionDate, setSessionDate,
    sessionTime, setSessionTime,
    subjectQuery, setSubjectQuery,
    batchQuery, setBatchQuery,
    teacherQuery, setTeacherQuery,
    subjectDropdownOpen, setSubjectDropdownOpen,
    batchDropdownOpen, setBatchDropdownOpen,
    teacherDropdownOpen, setTeacherDropdownOpen,
    teachersLoading,
    submitting,
    handleCreateClass
  } = useCreateSession();

  const mappedSubjects = subjects.map((s) => ({
    id: s.id,
    name: s.name || s.subjectName || "Unnamed Subject",
  }));
  const mappedBatches = batches.map((b) => ({
    id: b.id,
    name: b.batchName,
  }));

  const selectedSubject = mappedSubjects.find((s) => s.id === subjectId);
  const selectedBatch = mappedBatches.find((b) => b.id === batchId);
  const selectedTeacher = teachers.find((t) => t.id === teacherId);

  return (
    <div className="w-full px-4 md:px-8 py-6 max-w-[1000px] mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link href="/manager/attendance" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">Create Class Session</h1>
          </div>
          <p className="text-muted-foreground">
            Configure a new class session to track attendance.
          </p>
        </div>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Class Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DropdownPanel
            label="Subject *"
            placeholder="-- Select Subject --"
            open={subjectDropdownOpen}
            onToggle={() => {
              setSubjectDropdownOpen(!subjectDropdownOpen);
              setBatchDropdownOpen(false);
              setTeacherDropdownOpen(false);
            }}
            selectedLabel={selectedSubject?.name}
            query={subjectQuery}
            setQuery={setSubjectQuery}
            options={mappedSubjects}
            emptyMessage="No subjects found."
            onSelect={(item) => {
              setSubjectId(item.id);
              setSubjectQuery("");
            }}
          />

          <div className="animate-in fade-in slide-in-from-left-2">
            <DropdownPanel
              label="Teacher *"
              placeholder={subjectId ? "-- Select Teacher --" : "-- Select Subject First --"}
              disabled={!subjectId}
              open={teacherDropdownOpen}
              onToggle={() => {
                setTeacherDropdownOpen(!teacherDropdownOpen);
                setSubjectDropdownOpen(false);
                setBatchDropdownOpen(false);
              }}
              loading={teachersLoading}
              selectedLabel={selectedTeacher?.name}
              query={teacherQuery}
              setQuery={setTeacherQuery}
              options={teachers}
              emptyMessage="No teachers assigned to this subject."
              onSelect={(item) => {
                setTeacherId(item.id);
                setTeacherQuery("");
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Session Date *</Label>
            <Input
              id="date"
              type="date"
              value={sessionDate}
              onChange={(e) => setSessionDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Session Time *</Label>
            <Input
              id="time"
              type="time"
              value={sessionTime}
              onChange={(e) => setSessionTime(e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <DropdownPanel
              label="Batch (Optional)"
              placeholder="-- Select Batch --"
              open={batchDropdownOpen}
              onToggle={() => {
                setBatchDropdownOpen(!batchDropdownOpen);
                setSubjectDropdownOpen(false);
                setTeacherDropdownOpen(false);
              }}
              selectedLabel={selectedBatch?.name}
              query={batchQuery}
              setQuery={setBatchQuery}
              options={mappedBatches}
              emptyMessage="No batches found."
              onSelect={(item) => {
                setBatchId(item.id);
                setBatchQuery("");
              }}
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button onClick={handleCreateClass} disabled={submitting} className="min-w-[150px]">
            {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Create Class Session
          </Button>
        </div>
      </Card>
    </div>
  );
};
