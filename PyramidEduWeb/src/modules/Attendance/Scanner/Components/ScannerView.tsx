import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Camera, StopCircle, RefreshCcw, UserCheck, QrCode, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";
import { useAttendanceScanner } from "../hooks/useAttendanceScanner";
import { DropdownPanel } from "./DropdownPanel";

export const ScannerView = () => {
  const {
    sessionDate, setSessionDate,
    sessions,
    sessionId, setSessionId,
    sessionQuery, setSessionQuery,
    sessionDropdownOpen, setSessionDropdownOpen,
    sessionsLoading,
    status,
    message,
    log,
    started,
    sessionStatusLoading,
    currentSession,
    handleStartCamera,
    handleStopCamera
  } = useAttendanceScanner();

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
    <div className="w-full px-4 py-8 md:px-8 max-w-[1920px] mx-auto min-h-[calc(100vh-4rem)] flex flex-col space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">QR Attendance Scanner</h1>
          <p className="text-muted-foreground mt-1">Select a class session and start scanning student IDs.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/manager/attendance/create">
            <Button variant="outline" className="gap-2">
              <Clock className="w-4 h-4" />
              Create Session
            </Button>
          </Link>
          <Link href="/manager/attendance">
            <Button variant="outline" className="gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Manual Attendance
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* Left Column: Configuration & Status */}
        <div className="lg:col-span-1 space-y-6 flex flex-col">
          
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Class Selection</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={sessionDate}
                  onChange={(e) => setSessionDate(e.target.value)}
                  disabled={started}
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
                disabled={started}
                onSelect={(item) => {
                  setSessionId(item.id);
                  setSessionQuery("");
                }}
              />
            </div>

            <div className="mt-6 pt-6 border-t border-border/50">
              {currentSession && currentSession.status === 'COMPLETED' ? (
                <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border text-center space-y-3">
                  <Badge variant="secondary" className="mb-2">COMPLETED</Badge>
                  <p className="text-sm text-muted-foreground">This session has already ended. Absentees have been marked.</p>
                </div>
              ) : !started ? (
                <Button 
                  className="w-full gap-2 h-12 text-md" 
                  onClick={handleStartCamera}
                  disabled={!sessionId || sessionStatusLoading}
                >
                  {sessionStatusLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
                  {!sessionId ? 'Select Session' : currentSession?.status === 'CREATED' ? 'Start Session & Camera' : 'Resume Scanning'}
                </Button>
              ) : (
                <Button 
                  variant="destructive" 
                  className="w-full gap-2 h-12 text-md" 
                  onClick={handleStopCamera}
                  disabled={sessionStatusLoading}
                >
                  {sessionStatusLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <StopCircle className="w-5 h-5" />}
                  End Session & Mark Absentees
                </Button>
              )}
            </div>
          </Card>

          <Card className="p-6 flex-1 flex flex-col">
            <h2 className="text-lg font-semibold mb-4">Status Log</h2>
            
            <div className={`
              w-full p-4 rounded-xl border-2 flex flex-col items-center justify-center text-center transition-colors mb-4
              ${status === 'idle' ? 'bg-secondary/20 border-secondary/30' : ''}
              ${status === 'success' ? 'bg-emerald-50 border-emerald-500/50 dark:bg-emerald-950/20' : ''}
              ${status === 'error' ? 'bg-rose-50 border-rose-500/50 dark:bg-rose-950/20' : ''}
            `}>
              {status === 'idle' && <QrCode className="w-8 h-8 mb-2 text-muted-foreground" />}
              {status === 'success' && <UserCheck className="w-8 h-8 mb-2 text-emerald-600" />}
              {status === 'error' && <RefreshCcw className="w-8 h-8 mb-2 text-rose-600" />}
              <p className={`font-semibold ${status === 'error' ? 'text-rose-600' : status === 'success' ? 'text-emerald-700 dark:text-emerald-400' : 'text-muted-foreground'}`}>
                {message}
              </p>
            </div>

            <div className="flex-1 overflow-auto border rounded-md bg-muted/10 min-h-[200px]">
              {log.length === 0 ? (
                <div className="h-full flex items-center justify-center text-muted-foreground text-sm p-4 text-center">
                  Recent scans will appear here
                </div>
              ) : (
                <div className="divide-y divide-border/50">
                  {log.map((entry) => (
                    <div key={entry.id} className="p-3 text-sm hover:bg-muted/30 transition-colors flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="font-medium">{entry.studentName}</span>
                        <span className="text-xs text-muted-foreground">{entry.studentCode}</span>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs font-mono text-muted-foreground">{entry.time}</span>
                        {entry.feeStatus && (
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-sm font-medium ${
                            entry.feeStatus === 'PAID' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 
                            'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                          }`}>
                            {entry.feeStatus}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

        </div>

        {/* Right Column: Scanner Viewport */}
        <div className="lg:col-span-2 flex flex-col">
          <Card className="flex-1 p-2 md:p-6 flex flex-col overflow-hidden relative min-h-[500px]">
            <div className="absolute top-4 right-4 z-10 flex gap-2">
              {currentSession?.status === 'ACTIVE' && (
                <Badge className="bg-emerald-500 animate-pulse text-white px-3 py-1 shadow-md">
                  SESSION ACTIVE
                </Badge>
              )}
            </div>
            
            <div className="flex-1 bg-black rounded-lg overflow-hidden flex items-center justify-center relative shadow-inner ring-1 ring-border/50">
              {!started ? (
                <div className="text-center p-8 flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-secondary/20 flex items-center justify-center mb-6">
                    <Camera className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-medium text-muted-foreground mb-2">Camera is off</h3>
                  <p className="text-sm text-muted-foreground/60 max-w-sm">
                    Select a class session and click Start to begin scanning QR codes for attendance.
                  </p>
                </div>
              ) : (
                <div className="w-full max-w-2xl mx-auto bg-white text-black p-4 rounded-lg" id="qr-reader"></div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
