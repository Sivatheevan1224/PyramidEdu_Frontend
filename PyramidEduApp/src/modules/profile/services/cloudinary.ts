import { Platform } from "react-native";

const CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME || "dyutsszbf";
const UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "PyramidEduProfile";

export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
}

export async function uploadImageToCloudinary(uri: string): Promise<string> {
  const formData = new FormData();

  if (Platform.OS === "web") {
    // Web: fetch the blob URI and append as a real Blob
    const blob = await fetch(uri).then((r) => r.blob());
    const ext = uri.split(".").pop()?.split("?")[0] || "jpg";
    formData.append("file", blob, `photo.${ext}`);
  } else {
    // Native (iOS/Android): use the RN-specific { uri, name, type } object
    const uriParts = uri.split(".");
    const fileType = uriParts[uriParts.length - 1] || "jpg";
    formData.append("file", {
      uri,
      name: `photo.${fileType}`,
      type: `image/${fileType === "jpg" ? "jpeg" : fileType}`,
    } as any);
  }

  // Unsigned upload — uses upload preset (no API secret needed on client)
  formData.append("upload_preset", UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Cloudinary upload failed: ${errorText}`);
  }

  const json = (await response.json()) as CloudinaryUploadResponse;
  return json.secure_url;
}
