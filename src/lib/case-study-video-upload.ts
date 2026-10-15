export const MAX_CASE_VIDEO_BYTES = 50 * 1024 * 1024;
export const CASE_VIDEO_ACCEPT = ".mp4,.webm,video/mp4,video/webm";

// Leave room for the multipart boundary, filename and slug, while also bounding
// requests that omit Content-Length or include unexpected extra form fields.
export const MAX_CASE_VIDEO_REQUEST_BYTES = MAX_CASE_VIDEO_BYTES + 64 * 1024;

export type CaseVideoFormat = "mp4" | "webm";

type CaseVideoFile = { name: string; type: string; size: number };

export class CaseVideoUploadError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = "CaseVideoUploadError";
  }
}

export function getCaseVideoFormat(filename: string): CaseVideoFormat | undefined {
  const extension = /\.(mp4|webm)$/i.exec(filename)?.[1]?.toLowerCase();
  return extension === "mp4" || extension === "webm" ? extension : undefined;
}

export function validateCaseVideoFile(file: CaseVideoFile): string | undefined {
  if (!Number.isFinite(file.size) || file.size <= 0) return "Select a video to upload.";
  if (file.size > MAX_CASE_VIDEO_BYTES) return "The video must be 50 MB or smaller.";

  const format = getCaseVideoFormat(file.name);
  if (!format) return "Only MP4 and WebM video files can be uploaded.";

  const mimeType = file.type.trim().toLowerCase();
  if (mimeType && mimeType !== "application/octet-stream" && mimeType !== `video/${format}`) {
    return "The video file type does not match its MP4 or WebM extension.";
  }
}

function ascii(data: Uint8Array, start: number, end: number) {
  return String.fromCharCode(...data.subarray(start, end));
}

function hasMp4Signature(data: Uint8Array) {
  if (data.length < 16 || ascii(data, 4, 8) !== "ftyp") return false;
  const boxSize = new DataView(data.buffer, data.byteOffset, data.byteLength).getUint32(0);
  if (boxSize < 16 || boxSize > data.length || boxSize % 4 !== 0) return false;

  // The ISO base media container also includes non-video formats such as AVIF.
  // Require an MP4-compatible brand, not just the shared "ftyp" marker.
  const isMp4Brand = (brand: string) => /^(?:isom|iso[2-9]|mp4[12]|avc1|M4V |MSNV|dash|cmf[cs])$/.test(brand);
  if (isMp4Brand(ascii(data, 8, 12))) return true;
  for (let offset = 16; offset + 4 <= boxSize; offset += 4) {
    if (isMp4Brand(ascii(data, offset, offset + 4))) return true;
  }
  return false;
}

function readEbmlInteger(data: Uint8Array, offset: number, keepMarker = false) {
  const first = data[offset];
  if (!first) return undefined;
  let width = 1;
  let marker = 0x80;
  while (!(first & marker) && width <= 8) {
    width += 1;
    marker >>= 1;
  }
  if (width > (keepMarker ? 4 : 8) || offset + width > data.length) return undefined;
  let value = keepMarker ? first : first & (marker - 1);
  for (let index = 1; index < width; index += 1) value = value * 256 + data[offset + index];
  return Number.isSafeInteger(value) ? { value, width } : undefined;
}

function hasWebmSignature(data: Uint8Array) {
  if (data.length < 5 || data[0] !== 0x1a || data[1] !== 0x45 || data[2] !== 0xdf || data[3] !== 0xa3) return false;
  const headerSize = readEbmlInteger(data, 4);
  if (!headerSize || headerSize.value > 4096) return false;
  let offset = 4 + headerSize.width;
  const headerEnd = offset + headerSize.value;
  if (headerEnd > data.length) return false;

  while (offset < headerEnd) {
    const id = readEbmlInteger(data, offset, true);
    if (!id) return false;
    offset += id.width;
    const size = readEbmlInteger(data, offset);
    if (!size) return false;
    offset += size.width;
    if (offset + size.value > headerEnd) return false;
    if (id.value === 0x4282) {
      return size.value === 4 && ascii(data, offset, offset + size.value) === "webm";
    }
    offset += size.value;
  }
  return false;
}

export function hasCaseVideoSignature(data: Uint8Array, format: CaseVideoFormat) {
  return format === "mp4" ? hasMp4Signature(data) : hasWebmSignature(data);
}

export async function readCaseVideoFormData(request: Request): Promise<FormData> {
  const contentType = request.headers.get("content-type") ?? "";
  if (!/^multipart\/form-data\s*;/i.test(contentType)) {
    throw new CaseVideoUploadError("Upload the video using multipart form data.", 415);
  }
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_CASE_VIDEO_REQUEST_BYTES) {
    throw new CaseVideoUploadError("The video must be 50 MB or smaller.", 413);
  }
  if (!request.body) throw new CaseVideoUploadError("Select a video to upload.", 400);

  let receivedBytes = 0;
  const boundedBody = request.body.pipeThrough(new TransformStream<Uint8Array, Uint8Array>({
    transform(chunk, controller) {
      receivedBytes += chunk.byteLength;
      if (receivedBytes > MAX_CASE_VIDEO_REQUEST_BYTES) {
        throw new CaseVideoUploadError("The video must be 50 MB or smaller.", 413);
      }
      controller.enqueue(chunk);
    },
  }));

  try {
    return await new Response(boundedBody, { headers: { "content-type": contentType } }).formData();
  } catch (error) {
    if (error instanceof CaseVideoUploadError) throw error;
    throw new CaseVideoUploadError("The upload data could not be read. Select the video and try again.", 400);
  }
}
