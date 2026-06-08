"use client";

import { useState, useEffect, useRef } from 'react';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, Check, Loader2, QrCode, Camera, StopCircle, RefreshCcw, UserCheck, CreditCard, Clock, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface ClassSession {
  id: string;
  subjectId: string;
  teacherId: string;
  sessionDate: string;
  sessionTime: string;
  status: 'CREATED' | 'ACTIVE' | 'COMPLETED';
  subject?: { name: string; subjectName?: string };
  teacher?: { user?: { fullName?: string }; name?: string; firstName?: string; lastName?: string };
  batch?: { batchName?: string };
}

interface ScanResult {
  id: string;
  studentName: string;
  studentCode: string;
  time: string;
  feeStatus?: string;
}

function DropdownPanel({
  label,
  placeholder,
  open,
  onToggle,
  disabled = false,
  selectedLabel,
  query,
  setQuery,
  options,
  emptyMessage,
  onSelect,
  loading = false,
}: {
  label: string;
  placeholder: string;
  open: boolean;
  onToggle: () => void;
  disabled?: boolean;
  selectedLabel?: string;
  query: string;
  setQuery: (val: string) => void;
  options: { id: string; name: string }[];
  emptyMessage: string;
  onSelect: (item: { id: string; name: string }) => void;
  loading?: boolean;
}) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (open) onToggle();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onToggle]);

  const filteredOptions = options.filter((o) =>
    o.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-2 flex-1 min-w-[250px] relative" ref={dropdownRef}>
      <Label className="text-sm font-medium">{label}</Label>
      <button
        type="button"
        disabled={disabled}
        onClick={onToggle}
        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className={selectedLabel ? "text-foreground" : "text-muted-foreground truncate"}>
          {selectedLabel || placeholder}
        </span>
        <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
      </button>

      {open && (
        <div className="absolute z-50 w-full mt-1 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80 zoom-in-95">
          <div className="p-1">
            <Input
              placeholder={`Search ${label.toLowerCase()}...`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-8 mb-1"
            />
            <div className="max-h-[200px] overflow-auto">
              {loading ? (
                <div className="py-6 text-center">
                  <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                </div>
              ) : filteredOptions.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  {emptyMessage}
                </div>
              ) : (
                filteredOptions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onSelect(item);
                      onToggle();
                    }}
                    className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                  >
                    <span className="truncate text-left">{item.name}</span>
                    {selectedLabel === item.name && (
                      <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
                        <Check className="h-4 w-4 text-primary" />
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ScannerPage() {
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().split("T")[0]);
  const [sessions, setSessions] = useState<ClassSession[]>([]);
  const [sessionId, setSessionId] = useState("");
  const [sessionQuery, setSessionQuery] = useState("");
  const [sessionDropdownOpen, setSessionDropdownOpen] = useState(false);
  const [sessionsLoading, setSessionsLoading] = useState(false);

  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('Select class session to begin scanning.');
  const [log, setLog] = useState<ScanResult[]>([]);
  
  const [started, setStarted] = useState(false);
  const [sessionStatusLoading, setSessionStatusLoading] = useState(false);

  const scannerRef = useRef<any>(null);
  const isScanningRef = useRef(false);
  
  const currentSession = sessions.find(s => s.id === sessionId);
  const sessionRef = useRef(currentSession);

  useEffect(() => {
    sessionRef.current = currentSession;
  }, [currentSession]);

  useEffect(() => {
    if (!sessionDate) return;
    
    const fetchSessions = async () => {
      setSessionsLoading(true);
      try {
        const res = await api.get("/attendance/sessions", {
          params: { sessionDate },
        });
        setSessions(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch sessions", err);
        setSessions([]);
      } finally {
        setSessionsLoading(false);
      }
    };
    
    fetchSessions();
    setSessionId(""); // Reset selection on date change
    setLog([]);
    setStarted(false);
  }, [sessionDate]);



  const handleStartCamera = async () => {
    if (!currentSession) {
      toast.error("Please select a class session.");
      return;
    }

    setSessionStatusLoading(true);
    try {
      if (currentSession.status === 'CREATED') {
        const res = await api.patch(`/attendance/sessions/${currentSession.id}/start`);
        if (res.data.success) {
          toast.success("Attendance session started.");
          // Update local state
          setSessions(sessions.map(s => s.id === currentSession.id ? { ...s, status: 'ACTIVE' } : s));
        }
      }
      setStarted(true);
      setMessage('Scanner active. Hold QR card to camera.');
      setStatus('idle');
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to start attendance session.");
    } finally {
      setSessionStatusLoading(false);
    }
  };

  const handleStopCamera = async () => {
    if (!currentSession) return;
    
    setSessionStatusLoading(true);
    try {
      const res = await api.patch(`/attendance/sessions/${currentSession.id}/end`);
      if (res.data.success) {
        toast.success(`Session completed. System auto-marked ${res.data.data.absenteesMarked} absentees.`);
        setSessions(sessions.map(s => s.id === currentSession.id ? { ...s, status: 'COMPLETED' } : s));
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to end attendance session.");
    } finally {
      setSessionStatusLoading(false);
      setStarted(false);
      setStatus('idle');
      setMessage('Scanner stopped. Session marked as Completed.');
    }
  };

  const handleSuccess = (studentName: string, studentCode: string, feeStatus?: string) => {
    setStatus('success');
    setMessage(`PRESENT: ${studentName} (${studentCode})`);
    
    const newLog: ScanResult = {
      id: Date.now().toString(),
      studentName,
      studentCode,
      time: new Date().toLocaleTimeString(),
      feeStatus,
    };
    setLog(prev => [newLog, ...prev].slice(0, 50));
  };

  const handleError = (errorMsg: string) => {
    setStatus('error');
    setMessage(`Error: ${errorMsg}`);
  };

  const handleScan = async (result: string) => {
    const activeSession = sessionRef.current;
    if (isScanningRef.current || !activeSession || activeSession.status !== 'ACTIVE') return;
    
    isScanningRef.current = true;
    try {
      const res = await api.post('/attendance/qr', { 
        token: result,
        subjectId: activeSession.subjectId,
        sessionDate: activeSession.sessionDate
      });
      const { studentName, studentCode, feeStatus } = res.data;
      handleSuccess(
        studentName,
        studentCode,
        feeStatus
      );
      
    } catch (err: any) {
      handleError(err.response?.data?.message || "Invalid QR Code or already marked.");
    } finally {
      setTimeout(() => {
        isScanningRef.current = false;
        if (started) {
          setStatus('idle');
          setMessage('Scanner active. Hold QR card to camera.');
        }
      }, 2500);
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (started && currentSession?.status === 'ACTIVE') {
      import('html5-qrcode').then((Html5QrcodeScanner) => {
        if (!isMounted) return;
        
        // Prevent double initialization in strict mode
        if (!scannerRef.current) {
          scannerRef.current = new Html5QrcodeScanner.Html5QrcodeScanner(
            "qr-reader",
            { fps: 10, qrbox: {width: 250, height: 250} },
            false
          );
          scannerRef.current.render(handleScan, (err: any) => {
            // ignore scan errors
          });
        }
      }).catch(err => {
        console.error("Failed to load html5-qrcode", err);
      });
    }

    return () => {
      isMounted = false;
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
        scannerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, currentSession?.status]);

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
}
