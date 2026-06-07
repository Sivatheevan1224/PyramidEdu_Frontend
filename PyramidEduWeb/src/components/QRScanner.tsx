'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import api from '@/lib/api';

interface Props {
  subjectId: string;
  sessionDate: string;
  onSuccess: (studentName: string, studentCode: string) => void;
  onError: (errorCode: string) => void;
}

export default function QRScanner({ subjectId, sessionDate, onSuccess, onError }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scannedSet = useRef<Set<string>>(new Set());
  const [active, setActive] = useState(false);
  const [cameras, setCameras] = useState<{ id: string, label: string }[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>('');

  useEffect(() => {
    let html5QrCode: Html5Qrcode | null = null;
    let isMounted = true;
    let startPromise: Promise<any> | null = null;

    const initScanner = async () => {
      try {
        console.log('[QRScanner] Initializing...');
        // 1. Enumerate devices
        const devices = await Html5Qrcode.getCameras();
        console.log('[QRScanner] Available cameras:', devices);
        
        let defaultCam;
        if (isMounted && devices && devices.length > 0) {
          setCameras(devices);
          // Prefer a front camera or default to the first one
          defaultCam = devices.find(d => d.label.toLowerCase().includes('front')) || devices[0];
          setSelectedCamera(defaultCam.id);
        } else if (isMounted) {
          onError('No camera found on this device.');
          return;
        }

        if (!isMounted) return;

        // 2. Initialize scanner
        const targetCameraId = defaultCam ? defaultCam.id : { facingMode: 'user' };
        html5QrCode = new Html5Qrcode('qr-reader');
        
        // 3. Start scanner
        startPromise = html5QrCode.start(
          targetCameraId,
          { fps: 10, qrbox: { width: 300, height: 300 } },
          async (decodedToken: string) => {
            if (scannedSet.current.has(decodedToken)) return;
            
            scannedSet.current.add(decodedToken);
            setActive(true);
            
            try {
              const res = await api.post('/attendance/qr', {
                token: decodedToken,
                subjectId,
                sessionDate,
              });
              
              const data = res.data;
              if (data.success) {
                onSuccess(data.studentName, data.studentCode);
              } else {
                onError(data.error || 'Unknown error');
              }
            } catch (error: any) {
              if (error.response?.data?.message) {
                 onError(error.response.data.message);
              } else {
                 onError('Network error or invalid QR');
              }
            }

            setTimeout(() => {
              scannedSet.current.delete(decodedToken);
              setActive(false);
            }, 3000);
          },
          () => {} // silent error for frames without QR
        );

        await startPromise;
        console.log('[QRScanner] Started successfully');

        // If component unmounted while we were starting, stop it immediately.
        if (!isMounted) {
           console.log('[QRScanner] Component unmounted during startup, stopping now...');
           await html5QrCode.stop();
           html5QrCode.clear();
        }

      } catch (err: any) {
        console.warn('[QRScanner] Error starting:', err);
        
        if (!isMounted) return;

        let errorMessage = 'Could not access camera. Please ensure permissions are granted.';
        if (err?.name === 'NotReadableError' || String(err).includes('NotReadableError')) {
          errorMessage = 'Camera is in use by another application. Please close other apps using the webcam and try again.';
        } else if (err?.name === 'NotAllowedError' || String(err).includes('NotAllowedError')) {
          errorMessage = 'Camera access denied. Please grant camera permissions in your browser settings.';
        } else if (err?.name === 'NotFoundError' || String(err).includes('NotFoundError')) {
          errorMessage = 'No camera found on this device.';
        } else if (err?.name === 'OverconstrainedError' || String(err).includes('OverconstrainedError')) {
           // Fallback to specific camera ID if facingMode fails
           if (cameras.length > 0) {
             console.log('[QRScanner] Falling back to specific camera ID...');
             // This would normally trigger a retry, but for simplicity we report the error.
             errorMessage = 'Camera constraint failed. Please select a camera from the dropdown if available, or refresh.';
           }
        }
        onError(errorMessage);
      }
    };

    // Delay initialization to completely bypass React 18 Strict Mode double-invocations
    const timeoutId = setTimeout(() => {
      initScanner();
    }, 250);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      console.log('[QRScanner] Cleanup triggered');
      
      if (html5QrCode) {
        if (html5QrCode.isScanning) {
          console.log('[QRScanner] Stopping active scanner...');
          html5QrCode.stop().then(() => {
            html5QrCode?.clear();
            console.log('[QRScanner] Stopped and cleared');
          }).catch(err => console.warn('[QRScanner] Error stopping:', err));
        } else if (startPromise) {
          // It's currently starting up. We must wait for it to finish starting, THEN stop it.
          console.log('[QRScanner] Waiting for startup to complete before stopping...');
          startPromise.then(() => {
            console.log('[QRScanner] Startup finished, now stopping...');
            return html5QrCode?.stop();
          }).then(() => {
            html5QrCode?.clear();
            console.log('[QRScanner] Stopped and cleared after delayed startup');
          }).catch(err => console.warn('[QRScanner] Error stopping delayed scanner:', err));
        }
      }
    };
  }, [subjectId, sessionDate, onSuccess, onError]);

  return (
    <div className="flex flex-col items-center">
      {/* 
        This div must always be in the DOM for Html5Qrcode to attach to.
        Do not conditionally render it, or html5-qrcode will crash.
      */}
      <div
        id="qr-reader"
        ref={containerRef}
        style={{ width: '380px', borderRadius: '12px', border: '3px solid #4F46E5', overflow: 'hidden' }}
      />
      {active && <p className="text-amber-600 font-bold mt-2">Processing...</p>}
      
      {cameras.length > 1 && (
         <div className="mt-4 text-xs text-muted-foreground text-center">
            Multiple cameras detected. If you see a black screen, ensure your browser has permission.
         </div>
      )}
    </div>
  );
}
