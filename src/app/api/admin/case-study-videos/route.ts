import { randomUUID } from "node:crypto";
import { getCurrentAdmin } from "@/lib/admin-auth";
import {
  CaseVideoUploadError,
  getCaseVideoFormat,
  hasCaseVideoSignature,
  MAX_CASE_VIDEO_BYTES,
  readCaseVideoFormData,
  validateCaseVideoFile,
} from "@/lib/case-study-video-upload";
import { uploadVideoToR2 } from "@/lib/r2";

export const runtime = "nodejs";

const SAFE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function errorResponse(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

export async function POST(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return errorResponse("Your admin session has expired. Sign in again.", 401);

    const formData = await readCaseVideoFormData(request);
    const video = formData.get("video");
    if (!(video instanceof File) || video.size === 0) {
      return errorResponse("Select a video to upload.", 400);
    }

    const validationError = validateCaseVideoFile(video);
    if (validationError) return errorResponse(validationError, video.size > MAX_CASE_VIDEO_BYTES ? 413 : 415);
    const format = getCaseVideoFormat(video.name)!;
    const data = Buffer.from(await video.arrayBuffer());
    if (!hasCaseVideoSignature(data, format)) {
      return errorResponse("This file is not a valid MP4 or WebM container. Export the video again and retry.", 415);
    }

    const requestedSlug = String(formData.get("slug") ?? "").trim().toLowerCase();
    const folder = requestedSlug.length <= 160 && SAFE_SLUG.test(requestedSlug) ? requestedSlug : "unassigned";
    const title = video.name.replace(/\.[^.]+$/, "").trim().slice(0, 200) || "Case study video";
    const uploaded = await uploadVideoToR2({
      data,
      key: `case-studies/${folder}/videos/${Date.now()}-${randomUUID()}.${format}`,
      format,
    });

    return Response.json({ video: { url: uploaded.url, title } });
  } catch (error) {
    if (error instanceof CaseVideoUploadError) return errorResponse(error.message, error.status);
    console.error("Case study video upload failed", error instanceof Error ? error.name : "UnknownError");
    return errorResponse("The video could not be uploaded. Check the file and try again.", 500);
  }
}
