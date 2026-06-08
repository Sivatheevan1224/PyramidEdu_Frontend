import React, { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { X, Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  studentName: string;
  indexNumber: string | null;
  stream: string;
  qrCode: string | null;
  onClose: () => void;
}

export default function StudentQRCodeModal({ studentName, indexNumber, stream, qrCode, onClose }: Props) {
  const qrRef = useRef<SVGSVGElement>(null);

  const handleDownload = () => {
    if (!qrRef.current) return;
    const svgData = new XMLSerializer().serializeToString(qrRef.current);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      // Set canvas size (adding padding)
      const padding = 40;
      canvas.width = img.width + padding * 2;
      canvas.height = img.height + padding * 2;
      
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, padding, padding);
        
        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = `QR_${indexNumber || studentName}.png`;
        downloadLink.href = `${pngFile}`;
        downloadLink.click();
      }
    };
    img.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgData)))}`;
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    
    const svgData = qrRef.current ? new XMLSerializer().serializeToString(qrRef.current) : "";

    printWindow.document.write(`
      <html>
        <head>
          <title>Print QR Code - ${studentName}</title>
          <style>
            body { font-family: 'Inter', sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background-color: white; }
            .card { border: 2px solid #000; border-radius: 16px; padding: 40px; text-align: center; max-width: 400px; }
            .logo { font-size: 24px; font-weight: 900; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 2px; }
            .name { font-size: 20px; font-weight: bold; margin-bottom: 5px; }
            .index { font-size: 16px; color: #555; margin-bottom: 15px; }
            .stream { font-size: 14px; color: #777; margin-bottom: 30px; font-weight: 600; text-transform: uppercase; }
            .qr-container { display: flex; justify-content: center; margin-bottom: 20px; }
            @media print {
              body { -webkit-print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="logo">PyramidEdu</div>
            <div class="name">${studentName}</div>
            <div class="index">ID: ${indexNumber || "Pending"}</div>
            <div class="stream">${stream}</div>
            <div class="qr-container">${svgData}</div>
            <p style="font-size: 12px; color: #888;">Scan to verify attendance</p>
          </div>
          <script>
            window.onload = () => {
              window.print();
              setTimeout(() => window.close(), 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
          <h2 className="text-xl font-bold">Student QR Code</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-8 flex flex-col items-center justify-center space-y-4">
          <div className="text-center mb-2">
            <h3 className="font-bold text-lg">{studentName}</h3>
            <p className="text-sm text-muted-foreground">{indexNumber || "Pending Index"}</p>
          </div>
          
          <div className="bg-white p-4 rounded-xl border-4 border-slate-100 shadow-sm">
            {qrCode ? (
              <QRCodeSVG
                value={qrCode}
                size={200}
                level="H"
                includeMargin={false}
                ref={qrRef}
              />
            ) : (
              <div className="w-[200px] h-[200px] flex items-center justify-center bg-slate-50 text-slate-400 text-sm text-center p-4">
                QR Code Not Generated
              </div>
            )}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 flex gap-3">
          <Button 
            className="flex-1 gap-2" 
            variant="outline" 
            onClick={handleDownload}
            disabled={!qrCode}
          >
            <Download className="h-4 w-4" /> Download
          </Button>
          <Button 
            className="flex-1 gap-2 bg-primary text-primary-foreground hover:bg-primary/90" 
            onClick={handlePrint}
            disabled={!qrCode}
          >
            <Printer className="h-4 w-4" /> Print
          </Button>
        </div>
      </div>
    </div>
  );
}
