import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchSessionsData, startSessionData, endSessionData, scanQrCodeData } from '../services/api';
import { ClassSession, ScanResult } from '../types';
import { toast } from 'sonner';

export const useAttendanceScanner = () => {
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
        const data = await fetchSessionsData(sessionDate);
        setSessions(data);
      } catch (err) {
        console.error("Failed to fetch sessions", err);
        setSessions([]);
      } finally {
        setSessionsLoading(false);
      }
    };
    
    fetchSessions();
    setSessionId("");
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
        const res = await startSessionData(currentSession.id);
        if (res.success) {
          toast.success("Attendance session started.");
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
      const res = await endSessionData(currentSession.id);
      if (res.success) {
        toast.success(`Session completed. System auto-marked ${res.data.absenteesMarked} absentees.`);
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

  const handleScan = useCallback(async (result: string) => {
    const activeSession = sessionRef.current;
    if (isScanningRef.current || !activeSession || activeSession.status !== 'ACTIVE') return;
    
    isScanningRef.current = true;
    try {
      const data = await scanQrCodeData({ 
        token: result,
        subjectId: activeSession.subjectId,
        sessionDate: activeSession.sessionDate
      });
      handleSuccess(
        data.studentName,
        data.studentCode,
        data.feeStatus
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
  }, [started]);

  useEffect(() => {
    let isMounted = true;
    if (started && currentSession?.status === 'ACTIVE') {
      import('html5-qrcode').then((Html5QrcodeScanner) => {
        if (!isMounted) return;
        
        if (!scannerRef.current) {
          scannerRef.current = new Html5QrcodeScanner.Html5QrcodeScanner(
            "qr-reader",
            { fps: 10, qrbox: {width: 250, height: 250} },
            false
          );
          scannerRef.current.render(handleScan, (err: any) => {});
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
  }, [started, currentSession?.status, handleScan]);

  return {
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
  };
};
