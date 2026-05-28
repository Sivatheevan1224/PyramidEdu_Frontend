import { NextResponse } from "next/server";

type PdfCoResponseShape = {
  body?: string;
  text?: string;
  url?: string;
  resultFileUrl?: string;
  fileUrl?: string;
};

type PdfCoUploadResponseShape = {
  url?: string;
  message?: string;
};

const extractText = async (payload: unknown): Promise<string> => {
  if (typeof payload === "string") {
    return payload;
  }

  if (!payload || typeof payload !== "object") {
    return "";
  }

  const data = payload as PdfCoResponseShape;
  const directText = data.body || data.text;
  if (directText) {
    return directText;
  }

  const downloadUrl = data.url || data.resultFileUrl || data.fileUrl;
  if (downloadUrl) {
    const response = await fetch(downloadUrl);
    return response.text();
  }

  return "";
};

export async function POST(request: Request) {
  const apiKey = process.env.PDF_CO_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "PDF.co API key is not configured." }, { status: 500 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Please upload a PDF file." }, { status: 400 });
  }

  const fileBuffer = await file.arrayBuffer();
  const base64File = Buffer.from(fileBuffer).toString("base64");

  const uploadResponse = await fetch("https://api.pdf.co/v1/file/upload/base64", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      file: base64File,
      name: file.name,
    }),
  });

  if (!uploadResponse.ok) {
    const errorText = await uploadResponse.text();
    return NextResponse.json(
      {
        error: errorText || `PDF.co upload failed with status ${uploadResponse.status}.`,
      },
      { status: uploadResponse.status }
    );
  }

  const uploadData = (await uploadResponse.json()) as PdfCoUploadResponseShape;
  const uploadedFileUrl = uploadData.url;

  if (!uploadedFileUrl) {
    return NextResponse.json({ error: "PDF.co upload did not return a temporary file URL." }, { status: 500 });
  }

  const pdfCoResponse = await fetch("https://api.pdf.co/v1/pdf/convert/to/text", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: uploadedFileUrl,
      inline: true,
    }),
  });

  if (!pdfCoResponse.ok) {
    const errorText = await pdfCoResponse.text();
    return NextResponse.json(
      {
        error: errorText || `PDF.co request failed with status ${pdfCoResponse.status}.`,
      },
      { status: pdfCoResponse.status }
    );
  }

  const contentType = pdfCoResponse.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const data = await pdfCoResponse.json();
    const text = await extractText(data);

    return NextResponse.json({
      text,
      raw: data,
    });
  }

  const text = await pdfCoResponse.text();
  return NextResponse.json({ text });
}