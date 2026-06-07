'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, StopCircle, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const QRScanner = dynamic(() => import('@/components/QRScanner'), { ssr: false });

interface ScanResult {
  studentName: string;
  studentCode: string;
  time: string;
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

export default function ScannerPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [subjectId, setSubjectId] = useState('');
  const [batchId, setBatchId] = useState('');
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

  const handleSuccess = (studentName: string, studentCode: string) => {
    setStatus('success');
    setMessage(`PRESENT: ${studentName} (${studentCode})`);
    setLog(prev => [
      { studentName, studentCode, time: new Date().toLocaleTimeString() },
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
    <div className="container mx-auto p-6 max-w-5xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Attendance Scanner</h1>
        <p className="text-muted-foreground mt-2">
          Use your webcam to scan student QR ID cards and automatically mark attendance.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column: Controls & Scanner */}
        <div className="space-y-6">
          <Card>
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="font-semibold leading-none tracking-tight">Scanner Configuration</h3>
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

          {started && subjectId && (
            <Card className="overflow-hidden border-2 border-primary/20 shadow-lg">
              <div className="flex justify-center p-4 bg-slate-50 dark:bg-slate-900">
                <QRScanner
                  subjectId={subjectId}
                  sessionDate={sessionDate}
                  onSuccess={handleSuccess}
                  onError={handleError}
                />
              </div>
            </Card>
          )}

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

        {/* Right Column: Activity Log */}
        <div>
          <Card className="h-full flex flex-col">
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="font-semibold leading-none tracking-tight flex items-center gap-2">
                <Clock className="w-5 h-5 text-muted-foreground" />
                Recent Scans
              </h3>
              <p className="text-sm text-muted-foreground">Live log of today's attendance entries.</p>
            </div>
            <div className="p-6 pt-0 flex-1 overflow-y-auto max-h-[600px] pr-2">
              <div className="space-y-3">
                {log.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>No scans recorded yet.</p>
                  </div>
                ) : (
                  log.map((item, i) => (
                    <div 
                      key={i} 
                      className="flex items-center justify-between p-3 rounded-lg border bg-card text-card-foreground shadow-sm transition-all animate-in slide-in-from-top-2"
                    >
                      <div>
                        <p className="font-semibold">{item.studentName}</p>
                        <p className="text-xs text-muted-foreground">Index: {item.studentCode}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600">PRESENT</Badge>
                        <span className="text-[10px] text-muted-foreground font-medium">{item.time}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
