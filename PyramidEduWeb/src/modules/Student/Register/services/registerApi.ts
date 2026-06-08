import api from "@/lib/api";
import type {
  BatchOption,
  CourseOption,
  StreamOption,
  TeacherApiItem,
  TeacherOption,
  VerifyOtpPayload,
} from "../types";
import type { RegisterFormValues } from "../types";

// ─── Helper: map raw API teacher to TeacherOption ───────────────────────────
function toTeacherOption(item: TeacherApiItem): TeacherOption {
  return {
    id: String(item.id),
    name:
      String(
        item.user?.fullName ??
          item.name ??
          `${item.firstName ?? ""} ${item.lastName ?? ""}`.trim(),
      ) || "Assigned Teacher",
    qualification: String(item.qualification ?? item.specialization ?? ""),
    profileImage: item.user?.profileImage || undefined,
  };
}

// ─── Fetch Batches ───────────────────────────────────────────────────────────
export async function fetchBatches(): Promise<BatchOption[]> {
  const response = await api.get("/batches", { params: { activeOnly: true } });
  const rows = Array.isArray(response.data?.data)
    ? response.data.data
    : Array.isArray(response.data)
      ? response.data
      : [];

  return rows.map((batch: any) => ({
    id: String(batch.id),
    name: String(batch.batchName),
  }));
}

// ─── Fetch Streams ───────────────────────────────────────────────────────────
export async function fetchStreams(): Promise<StreamOption[]> {
  const response = await api.get("/subjects/streams");
  const rows = Array.isArray(response.data?.data)
    ? response.data.data
    : Array.isArray(response.data)
      ? response.data
      : [];

  return rows.map((stream: any) => ({
    id: String(stream.id),
    name: String(stream.streamName || stream.name),
    batchIds: Array.isArray(stream.batches) ? stream.batches.map((b: any) => String(b.id)) : [],
    courses: [],
  }));
}

// ─── Fetch Subjects ──────────────────────────────────────────────────────────
export async function fetchSubjects(): Promise<CourseOption[]> {
  const { data } = await api.get("/subjects/available");

  const rows = Array.isArray(data?.data?.data)
    ? data.data.data
    : Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data)
        ? data
        : [];

  return rows.map(
    (subject: any): CourseOption => ({
      id: String(subject.id),
      name: String(subject.name),
      monthlyFee: Number(subject.feePerMonth ?? 0),
      description: String(subject.description ?? ""),
      streamNames: Array.isArray(subject.streams) && subject.streams.length > 0
        ? subject.streams.map((s: any) => String(s.name ?? s.streamName ?? s))
        : subject.streamName ? [String(subject.streamName)] : [],
      streamIds: Array.isArray(subject.streams) && subject.streams.length > 0
        ? subject.streams.map((s: any) => String(s.id ?? s)) 
        : subject.streamId ? [String(subject.streamId)] : [],
      teachers: [],
    }),
  );
}

// ─── Fetch Teachers for a Subject ───────────────────────────────────────────
export async function fetchTeachersForSubject(
  subjectId: string,
): Promise<TeacherOption[]> {
  const response = await api.get("/subjects/teachers", {
    params: { subjectId },
  });

  const rows = Array.isArray(response.data?.data)
    ? response.data.data
    : Array.isArray(response.data)
      ? response.data
      : [];

  return rows
    .filter(
      (item: TeacherApiItem) =>
        item?.isActive !== false && item?.user?.isActive !== false,
    )
    .map((item: TeacherApiItem) => toTeacherOption(item));
}

// ─── Initiate Registration ───────────────────────────────────────────────────
export async function initiateRegistration(
  values: RegisterFormValues,
): Promise<void> {
  await api.post("/students/register/initiate", values);
}

export async function verifyOtpAndRegister(
  payload: VerifyOtpPayload,
): Promise<string> {
  const response = await api.post("/students/register/verify", payload);
  return response.data?.data?.regNumber ?? "PE-GEN-0000";
}

// ─── Resend OTP ─────────────────────────────────────────────────────────────
export async function resendOtp(email: string): Promise<void> {
  await api.post("/students/register/resend-otp", { email });
}
