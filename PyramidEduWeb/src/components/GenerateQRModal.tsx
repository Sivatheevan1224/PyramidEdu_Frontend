'use client';

import { useState, useEffect } from 'react';
import { X, QrCode, Printer, Loader2, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';

interface Props {
  studentId: string;
  studentName: string;
  studentCode: string;
  onClose: () => void;
  onQRGenerated?: (token: string) => void;
}

export default function GenerateQRModal({ studentId, studentName, studentCode, onClose, onQRGenerated }: Props) {
  const [qrBase64, setQrBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchExistingQR = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get(`/qr/${studentId}`);
        if (res.data.success && res.data.data.qrImageBase64) {
          setQrBase64(res.data.data.qrImageBase64);
        }
      } catch (err: any) {
        if (err.response?.status !== 404) {
          setError(err.response?.data?.message || 'Failed to fetch existing QR code.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchExistingQR();
  }, [studentId]);

  const generateQR = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post(`/qr/generate/${studentId}`);
      if (res.data.success) {
        setQrBase64(res.data.data.qrImageBase64);
        if (onQRGenerated) {
          onQRGenerated(res.data.data.token);
        }
      } else {
        setError('Failed to generate QR');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (!qrBase64) return;
    try {
      const base64Data = qrBase64.split(',')[1];
      const byteCharacters = atob(base64Data);
      const byteArrays = [];
      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }
      const blob = new Blob(byteArrays, { type: 'image/png' });
      const file = new File([blob], `${studentName}_QR.png`, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `${studentName} QR ID Card`,
          text: `QR ID Card for ${studentName} (${studentCode})`,
        });
      } else {
        alert('Your browser does not support file sharing. You can right-click or long-press the QR code to save it.');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 no-print">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2"><QrCode className="h-5 w-5"/> QR ID Card</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 flex flex-col items-center">
          <h3 className="font-bold text-lg text-center mb-1">{studentName}</h3>
          <p className="text-muted-foreground text-sm mb-6">Index: {studentCode}</p>

          {!qrBase64 && (
             <Button onClick={generateQR} disabled={loading} className="w-full mb-4">
               {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <QrCode className="mr-2 h-4 w-4" />}
               {loading ? 'Generating...' : 'Generate New QR Card'}
             </Button>
          )}
          
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          {qrBase64 && (
            <div className="flex flex-col items-center w-full">
               <div id="id-card" className="bg-white border-2 border-primary rounded-xl p-4 flex flex-col items-center shadow-sm w-full max-w-[260px] print-only-card mb-6">
                  <p className="font-bold text-primary text-xs text-center mb-2 uppercase tracking-wide">Pyramid Education</p>
                  <img src={qrBase64} alt="Student QR" className="w-40 h-40 object-contain mb-2" />
                  <p className="font-bold text-slate-900 text-sm text-center">{studentName}</p>
                  <p className="text-slate-500 text-xs text-center">{studentCode}</p>
               </div>
               
               <div className="flex gap-3 w-full">
                  <Button variant="outline" className="flex-1" onClick={generateQR} disabled={loading}>
                    Regenerate
                  </Button>
                  <Button variant="secondary" className="flex-1" onClick={handleShare}>
                    <Share2 className="mr-2 h-4 w-4" /> Share
                  </Button>
                  <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700" onClick={handlePrint}>
                    <Printer className="mr-2 h-4 w-4" /> Print
                  </Button>
               </div>
            </div>
          )}
          <p className="text-xs text-center text-muted-foreground mt-4 max-w-xs">
            Note: Generating a new QR code will immediately invalidate any previously printed cards for this student.
          </p>
        </div>
      </div>

      {/* Print styles injected directly or via globals.css */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden;
          }
          #id-card, #id-card * {
            visibility: visible;
          }
          #id-card {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            margin: 0;
            box-shadow: none;
            width: 2.2in;
            height: 3.4in;
          }
          .no-print {
            background: transparent !important;
          }
        }
      `}} />
    </div>
  );
}
