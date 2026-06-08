import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, QrCode, Plus } from "lucide-react";
import Link from "next/link";
import { useSessionList } from "../hooks/useSessionList";
import { DropdownPanel } from "./DropdownPanel";

export const SessionList = () => {
  const {
    sessionDate,
    setSessionDate,
    sessions,
    sessionId,
    setSessionId,
    sessionQuery,
    setSessionQuery,
    sessionDropdownOpen,
    setSessionDropdownOpen,
    sessionsLoading,
    students,
    studentsLoading,
    selectedStudents,
    submitting,
    handleLoadStudents,
    handleCheckboxChange,
    handleMarkAll,
    handleSubmit
  } = useSessionList();

  const getTeacherName = (t: any) => {
    if (!t) return "Unknown Teacher";
    return t.user?.fullName || t.name || `${t.firstName || ''} ${t.lastName || ''}`.trim() || "Unknown Teacher";
  };

  const mappedSessions = sessions.map((s) => ({
    id: s.id,
    name: `[${s.sessionTime}] ${s.subject?.name || s.subject?.subjectName} - ${getTeacherName(s.teacher)} ${s.batch ? `(${s.batch.batchName})` : ''}`,
  }));

  const selectedSessionItem = mappedSessions.find((s) => s.id === sessionId);

  return (
    <div className="w-full px-4 md:px-8 py-6 max-w-[1920px] mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manual Attendance</h1>
          <p className="text-muted-foreground mt-2">
            Select a class session to load students and manually mark attendance.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/manager/attendance/create">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Class
            </Button>
          </Link>
          <Link href="/attendance/scanner">
            <Button variant="outline" className="gap-2">
              <QrCode className="h-4 w-4" />
              Open Scanner
            </Button>
          </Link>
        </div>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Select Session</h2>
        
        <div className="flex flex-wrap gap-4 items-end">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={sessionDate}
              onChange={(e) => setSessionDate(e.target.value)}
            />
          </div>

          <DropdownPanel
            label="Class Session"
            placeholder={sessionsLoading ? "Loading sessions..." : "-- Select Class --"}
            open={sessionDropdownOpen}
            onToggle={() => setSessionDropdownOpen(!sessionDropdownOpen)}
            loading={sessionsLoading}
            selectedLabel={selectedSessionItem?.name}
            query={sessionQuery}
            setQuery={setSessionQuery}
            options={mappedSessions}
            emptyMessage="No classes found for this date."
            onSelect={(item) => {
              setSessionId(item.id);
              setSessionQuery("");
            }}
          />

          <Button 
            onClick={handleLoadStudents} 
            disabled={!sessionId || studentsLoading}
            className="min-w-[150px]"
          >
            {studentsLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Load Students
          </Button>
        </div>
      </Card>

      {students.length > 0 && (
        <Card className="overflow-hidden border border-border/50 shadow-sm">
          <div className="p-4 border-b border-border/50 bg-muted/20 flex justify-between items-center">
            <h3 className="font-semibold text-lg">Student List</h3>
            <span className="text-sm text-muted-foreground">
              {Object.values(selectedStudents).filter(Boolean).length} / {students.length} Present
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="text-xs uppercase bg-muted/40">
                <tr>
                  <th className="px-6 py-4 border-b font-medium text-left">Student Name</th>
                  <th className="px-6 py-4 border-b font-medium text-center">Index Number</th>
                  <th className="px-6 py-4 border-b font-medium text-center">Payment Status</th>
                  <th className="px-6 py-4 border-b">
                    <div className="flex items-center justify-center gap-2">
                      <Checkbox 
                        id="selectAll"
                        checked={students.length > 0 && students.every(s => selectedStudents[s.studentId] === true)}
                        onCheckedChange={(checked) => handleMarkAll(checked as boolean)}
                      />
                      <label htmlFor="selectAll" className="cursor-pointer font-medium text-sm">Mark All Present</label>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr 
                    key={student.studentId} 
                    className="border-b hover:bg-muted/10 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium">{student.studentName}</td>
                    <td className="px-6 py-4 text-center font-mono text-sm text-muted-foreground">{student.indexNumber || 'N/A'}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        student.feeStatus === 'PAID' 
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300' 
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300'
                      }`}>
                        {student.feeStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 w-40 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Checkbox 
                          checked={selectedStudents[student.studentId] === true}
                          onCheckedChange={(checked) => handleCheckboxChange(student.studentId, checked as boolean)}
                        />
                        <span className={`text-xs font-medium ${
                          selectedStudents[student.studentId] === true ? 'text-emerald-600 dark:text-emerald-400' : 
                          selectedStudents[student.studentId] === false ? 'text-rose-600 dark:text-rose-400' : 
                          'text-muted-foreground'
                        }`}>
                          {selectedStudents[student.studentId] === true ? 'Present' : 
                           selectedStudents[student.studentId] === false ? 'Absent' : 
                           'Unmarked'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-muted/10 flex justify-end">
            <Button onClick={handleSubmit} disabled={submitting} className="min-w-[200px]">
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Attendance"
              )}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
