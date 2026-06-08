'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect, useMemo } from 'react';
import api from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, StopCircle, CheckCircle2, AlertCircle, Clock, Search, ChevronDown, Check, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const QRScanner = dynamic(() => import('@/components/QRScanner'), { ssr: false });

interface ScanResult {
  studentName: string;
  studentCode: string;
  time: string;
  feeStatus?: string;
}

interface Subject {
  id: string;
  name?: string;
  subjectName?: string;
}

interface Batch {
  id: string;
  batchName: string;
}

function DropdownPanel<T extends { id: string; name: string }>({
  label,
  placeholder,
  disabled,
  loading,
  open,
  selectedLabel,
  query,
  setQuery,
  options,
  emptyMessage,
  onToggle,
  onSelect,
}: {
  label: string;
  placeholder: string;
  disabled?: boolean;
  loading?: boolean;
  open: boolean;
  selectedLabel?: string;
  query: string;
  setQuery: (value: string) => void;
  options: T[];
  emptyMessage: string;
  onToggle: () => void;
  onSelect: (item: T) => void;
}) {
  const filteredOptions = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return options;
    return options.filter((item) => item.name.toLowerCase().includes(needle));
  }, [options, query]);

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </Label>
      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={onToggle}
          className={`flex h-10 w-full items-center justify-between rounded-md border px-3 text-left text-sm transition-all ${disabled ? "cursor-not-allowed opacity-50 bg-muted text-muted-foreground" : "bg-background border-input text-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2"}`}
        >
          <span className={selectedLabel ? "text-foreground" : "text-muted-foreground"}>
            {selectedLabel || placeholder}
          </span>
          <ChevronDown className={`h-4 w-4 opacity-50 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>

        {open && !disabled && (
          <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md outline-none">
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Search ${label.toLowerCase()}...`}
                className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="max-h-[300px] overflow-auto p-1 bg-white dark:bg-slate-950">
              {loading ? (
                <div className="py-6 text-center text-sm">
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
                    onClick={() => onSelect(item)}
                    className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                  >
                    <span className="truncate">{item.name}</span>
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
        )}
      </div>
    </div>
  );
}

export default function ScannerPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [subjectId, setSubjectId] = useState('');
  const [batchId, setBatchId] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [teachers, setTeachers] = useState<{ id: string; name: string }[]>([]);
  const [teachersLoading, setTeachersLoading] = useState(false);
  const [teacherDropdownOpen, setTeacherDropdownOpen] = useState(false);
  const [teacherQuery, setTeacherQuery] = useState('');
  const [sessionTime, setSessionTime] = useState('');
  const [sessionDate, setSessionDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('Select a subject and date to begin scanning.');
  const [log, setLog] = useState<ScanResult[]>([]);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await api.get('/subjects');
        setSubjects(res.data.data?.data || []);
      } catch (err) {
        console.error('Failed to fetch subjects', err);
      }
    };
    const fetchBatches = async () => {
      try {
        const res = await api.get('/batches?activeOnly=true');
        setBatches(res.data.data || []);
      } catch (err) {
        console.error('Failed to fetch batches', err);
      }
    };
    fetchSubjects();
    fetchBatches();
  }, []);

  useEffect(() => {
    if (!subjectId) {
      setTeachers([]);
      setTeacherId('');
      return;
    }

    const fetchTeachers = async () => {
      setTeachersLoading(true);
      try {
        const res = await api.get('/subjects/teachers', { params: { subjectId } });
        const rows = Array.isArray(res.data?.data) ? res.data.data : Array.isArray(res.data) ? res.data : [];
        const mapped = rows
          .filter((item: any) => item?.isActive !== false && item?.user?.isActive !== false)
          .map((item: any) => ({
            id: String(item.id),
            name: String(item.user?.fullName ?? item.name ?? `${item.firstName ?? ''} ${item.lastName ?? ''}`.trim()) || 'Assigned Teacher',
          }));
        setTeachers(mapped);
      } catch (err) {
        console.error('Failed to fetch teachers', err);
        setTeachers([]);
      } finally {
        setTeachersLoading(false);
      }
    };
    fetchTeachers();
    setTeacherId('');
  }, [subjectId]);

  const handleSuccess = (studentName: string, studentCode: string, feeStatus?: string) => {
    setStatus('success');
    setMessage(`PRESENT: ${studentName} (${studentCode})`);
    setLog(prev => [
      { studentName, studentCode, time: new Date().toLocaleTimeString(), feeStatus },
      ...prev.slice(0, 49)
    ]);
    setTimeout(() => setStatus('idle'), 3000);
  };

  const handleError = (errorMsg: string) => {
    setStatus('error');
    setMessage(errorMsg);
    setTimeout(() => setStatus('idle'), 3000);
  };

  return (
    <div className="w-full px-4 md:px-8 py-6 max-w-[1920px] mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Attendance Scanner</h1>
        <p className="text-muted-foreground mt-2">
          Use your webcam to scan student QR ID cards and automatically mark attendance.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 items-start">
        {/* Left Column: Configuration (Student Details Table / Settings) */}
        <div className="space-y-6">
          <Card>
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="font-semibold leading-none tracking-tight">Student Details Table / Configuration</h3>
              <p className="text-sm text-muted-foreground">Select the class session details before starting.</p>
            </div>
            <div className="p-6 pt-0 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <select
                  id="subject"
                  value={subjectId}
                  onChange={e => setSubjectId(e.target.value)}
                  disabled={started}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value=''>-- Select Subject --</option>
                  {subjects.map(sub => (
                    <option key={sub.id} value={sub.id}>{sub.name || sub.subjectName}</option>
                  ))}
                </select>
              </div>

              {subjectId && (
                <div className="animate-in fade-in slide-in-from-top-2">
                  <DropdownPanel
                    label="Teacher"
                    placeholder="-- Select Teacher --"
                    disabled={started}
                    loading={teachersLoading}
                    open={teacherDropdownOpen}
                    selectedLabel={teachers.find(t => t.id === teacherId)?.name}
                    query={teacherQuery}
                    setQuery={setTeacherQuery}
                    options={teachers}
                    emptyMessage="No teachers assigned to this subject."
                    onToggle={() => setTeacherDropdownOpen(!teacherDropdownOpen)}
                    onSelect={(t) => {
                      setTeacherId(t.id);
                      setTeacherDropdownOpen(false);
                    }}
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Session Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={sessionDate}
                    onChange={e => setSessionDate(e.target.value)}
                    disabled={started}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Session Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={sessionTime}
                    onChange={e => setSessionTime(e.target.value)}
                    disabled={started}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="batch">Batch</Label>
                <select
                  id="batch"
                  value={batchId}
                  onChange={e => setBatchId(e.target.value)}
                  disabled={started}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value=''>-- Select Batch (Optional) --</option>
                  {batches.map(b => (
                    <option key={b.id} value={b.id}>{b.batchName}</option>
                  ))}
                </select>
              </div>

              <div className="pt-4">
                {!started ? (
                  <Button 
                    className="w-full gap-2" 
                    size="lg"
                    onClick={() => {
                      if (!subjectId) { alert('Please select a subject first!'); return; }
                      setStarted(true);
                      setMessage('Scanner active. Hold QR card to camera.');
                    }}
                  >
                    <Camera className="w-5 h-5" /> Start Webcam Scanner
                  </Button>
                ) : (
                  <Button 
                    variant="destructive" 
                    className="w-full gap-2" 
                    size="lg"
                    onClick={() => {
                      setStarted(false);
                      setStatus('idle');
                      setMessage('Scanner stopped. Ready to scan again.');
                    }}
                  >
                    <StopCircle className="w-5 h-5" /> Stop Scanner
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {/* Status Message Area */}
          <div className={`p-4 rounded-xl flex items-center gap-3 transition-colors duration-300 ${
            status === 'success' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' :
            status === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
            'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400'
          }`}>
            {status === 'success' && <CheckCircle2 className="w-6 h-6 flex-shrink-0" />}
            {status === 'error' && <AlertCircle className="w-6 h-6 flex-shrink-0" />}
            {status === 'idle' && <Camera className="w-6 h-6 flex-shrink-0 opacity-70" />}
            <span className="font-semibold text-sm md:text-base">{message}</span>
          </div>
        </div>

        {/* Middle Column: Activity Log */}
        <div className="space-y-6 lg:col-span-1">
          <Card className="h-full flex flex-col min-h-[500px]">
            <div className="flex flex-col space-y-1.5 p-6 border-b">
              <h3 className="font-semibold leading-none tracking-tight flex items-center gap-2">
                <Clock className="w-5 h-5 text-muted-foreground" />
                Live Attendance Table
              </h3>
              <p className="text-sm text-muted-foreground">Live log of today's attendance entries.</p>
            </div>
            <div className="flex-1 overflow-auto max-h-[600px]">
              {log.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No scans recorded yet.</p>
                </div>
              ) : (
                <div className="w-full">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-muted-foreground uppercase bg-slate-50 dark:bg-slate-900 border-b">
                      <tr>
                        <th className="px-4 py-3">Student</th>
                        <th className="px-4 py-3">Index Number</th>
                        <th className="px-4 py-3">Attendance Time</th>
                        <th className="px-4 py-3">Fee Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {log.map((item, i) => (
                        <tr key={i} className="border-b last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors animate-in slide-in-from-top-2">
                          <td className="px-4 py-3 font-medium">{item.studentName}</td>
                          <td className="px-4 py-3">{item.studentCode}</td>
                          <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{item.time}</td>
                          <td className="px-4 py-3">
                            <Badge 
                              variant="outline" 
                              className={
                                item.feeStatus === 'PAID' ? 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800' :
                                item.feeStatus === 'PARTIALLY_PAID' || item.feeStatus === 'PARTIAL' ? 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800' :
                                item.feeStatus === 'OVERDUE' ? 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800' :
                                'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                              }
                            >
                              {item.feeStatus === 'PARTIAL' ? 'PARTIALLY_PAID' : (item.feeStatus || 'UNPAID')}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column: Scanner */}
        <div className="space-y-6 lg:col-span-1">
          {started && subjectId ? (
            <Card className="overflow-hidden border-2 border-primary/20 shadow-lg">
              <div className="flex flex-col space-y-1.5 p-6 border-b bg-white dark:bg-slate-950">
                <h3 className="font-semibold leading-none tracking-tight flex items-center gap-2">
                  <Camera className="w-5 h-5 text-muted-foreground" />
                  Camera / QR Scanner Box
                </h3>
              </div>
              <div className="flex justify-center p-4 bg-slate-50 dark:bg-slate-900 min-h-[380px] items-center">
                <QRScanner
                  subjectId={subjectId}
                  teacherId={teacherId || undefined}
                  sessionDate={sessionDate}
                  onSuccess={handleSuccess}
                  onError={handleError}
                />
              </div>
            </Card>
          ) : (
            <Card className="flex flex-col items-center justify-center h-[450px] border-dashed border-2 text-muted-foreground bg-slate-50/50 dark:bg-slate-900/20">
              <Camera className="w-12 h-12 mb-4 opacity-30" />
              <p className="font-medium">Scanner inactive</p>
              <p className="text-sm mt-2 opacity-70">Configure session and start scanner</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
