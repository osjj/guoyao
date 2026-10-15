"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ImagePreviewButton } from "@/components/admin/image-preview";
import { caseImageUrl, MAX_CASE_SECTION_IMAGES, type CaseStudyImage } from "@/lib/case-study-content";

const MAX_IMAGE_BYTES = 12 * 1024 * 1024;
const input = "mt-2 w-full rounded-lg border border-[#ccd3ce] bg-white px-3 py-2 text-sm font-normal";
const button = "rounded-lg border border-[#ccd3ce] px-3 py-2 text-sm font-bold hover:bg-[#eef0ed] disabled:opacity-50";

type FailedUpload = { file: File; message: string };
type UploadProgress = { completed: number; total: number; uploaded: number; failed: number };

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function validateFile(file: File): string | undefined {
  if (!file.size) return "The image file is empty.";
  if (file.size > MAX_IMAGE_BYTES) return "The image must be 12 MB or smaller.";
  if (file.type && !file.type.startsWith("image/")) return "Only image files can be uploaded.";
}

async function uploadImage(file: File, slug: string, signal: AbortSignal): Promise<CaseStudyImage> {
  const form = new FormData();
  form.set("image", file);
  form.set("slug", slug);
  form.set("alt", file.name.replace(/\.[^.]+$/, "").trim().slice(0, 200) || "Case study image");
  const response = await fetch("/api/admin/case-study-images", { method: "POST", body: form, signal });
  const data: unknown = await response.json().catch(() => null);
  const responseError = record(data) && typeof data.error === "string" ? data.error.trim().slice(0, 300) : "";
  if (!response.ok) {
    throw new Error(responseError || (response.status === 413
      ? "The server rejected the image size. Try a smaller image (up to 12 MB)."
      : response.status === 401
        ? "Your admin session has expired. Sign in again before retrying."
        : "The image could not be uploaded. Please try again."));
  }
  const image = record(data) && record(data.image) ? data.image : null;
  const url = caseImageUrl.safeParse(image?.url);
  const alt = typeof image?.alt === "string" ? image.alt.trim() : "";
  if (!url.success || !alt || alt.length > 200) {
    throw new Error("The server returned an invalid image. Please try again.");
  }
  return { url: url.data, alt, caption: "" };
}

export function CaseStudyImageGalleryField({ images, onChange, slug, onBusy, disabled = false }: {
  images: CaseStudyImage[];
  onChange: (update: (current: CaseStudyImage[]) => CaseStudyImage[]) => void;
  slug: string;
  onBusy: (busy: boolean) => void;
  disabled?: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [failures, setFailures] = useState<FailedUpload[]>([]);
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const busyRef = useRef(false);
  const mountedRef = useRef(true);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      abortRef.current?.abort();
    };
  }, []);

  async function upload(files: File[], retry = false) {
    if (!files.length || busyRef.current || disabled) return;
    const remaining = MAX_CASE_SECTION_IMAGES - images.length;
    if (files.length > remaining) {
      const message = `This chapter has room for ${Math.max(0, remaining)} more images. Your ${files.length}-image selection was not uploaded. Remove images or split the selection across chapters.`;
      setError(message);
      // Keep every file so the full selection can be retried after making room.
      if (!retry) setFailures(current => [...current, ...files.map(file => ({ file, message: "Not uploaded: the selection exceeds this chapter's remaining capacity." }))]);
      return;
    }

    busyRef.current = true;
    const controller = new AbortController();
    abortRef.current = controller;
    const retainedFailures = retry ? [] : failures;
    const batchFailures: FailedUpload[] = [];
    const nextProgress: UploadProgress = { completed: 0, total: files.length, uploaded: 0, failed: 0 };
    setBusy(true);
    setError("");
    setFailures(retainedFailures);
    setProgress({ ...nextProgress });
    onBusy(true);
    try {
      // One request per image avoids a large multipart body and keeps selection order.
      for (const file of files) {
        if (controller.signal.aborted || !mountedRef.current) break;
        try {
          const validationError = validateFile(file);
          if (validationError) throw new Error(validationError);
          const uploadedImage = await uploadImage(file, slug, controller.signal);
          if (controller.signal.aborted || !mountedRef.current) break;
          // Commit each success immediately; a later failure cannot discard it.
          onChange(current => [...current, uploadedImage]);
          nextProgress.uploaded += 1;
        } catch (cause) {
          if (controller.signal.aborted || !mountedRef.current) break;
          batchFailures.push({ file, message: cause instanceof Error ? cause.message : "The image could not be uploaded. Please try again." });
          nextProgress.failed += 1;
        }
        nextProgress.completed += 1;
        setProgress({ ...nextProgress });
        setFailures([...retainedFailures, ...batchFailures]);
      }
    } finally {
      busyRef.current = false;
      abortRef.current = null;
      if (mountedRef.current) setBusy(false);
      onBusy(false);
    }
  }

  function updateImage(index: number, patch: Partial<CaseStudyImage>) {
    onChange(current => current.map((image, position) => position === index ? { ...image, ...patch } : image));
  }

  function moveImage(index: number, direction: -1 | 1) {
    onChange(current => {
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const reordered = [...current];
      [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
      return reordered;
    });
  }

  return <div className="space-y-4 rounded-xl border border-dashed border-[#ccd3ce] p-4">
    <div className="space-y-1">
      <h3 className="text-base font-bold">Chapter images ({images.length}/{MAX_CASE_SECTION_IMAGES})</h3>
      <p className="text-sm leading-6 text-[var(--ink-muted)]">Select multiple images at once, up to 12 MB each. Images appear in selection order. You can reorder them and edit their descriptions below.</p>
    </div>
    <fieldset disabled={busy || disabled} className="min-w-0 space-y-4 disabled:opacity-60">
      <div className="flex flex-wrap items-end gap-3">
        <label className="block min-w-0 flex-1 text-sm font-bold">Upload chapter images
          <input
            className="mt-2 block w-full text-sm font-normal"
            type="file"
            accept="image/*"
            multiple
            disabled={images.length >= MAX_CASE_SECTION_IMAGES}
            onChange={event => {
              const files = Array.from(event.target.files ?? []);
              event.target.value = "";
              void upload(files);
            }}
          />
        </label>
        <button type="button" className={button} disabled={images.length >= MAX_CASE_SECTION_IMAGES} onClick={() => onChange(current => current.length < MAX_CASE_SECTION_IMAGES ? [...current, { url: "", alt: "", caption: "" }] : current)}>Add image URL</button>
      </div>
      {images.length > 0 && <div className="grid gap-4 lg:grid-cols-2">
        {images.map((image, index) => <div key={index} className="min-w-0 rounded-xl border border-[#d7dcd8] bg-white p-3">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-bold">Image {index + 1}</p>
            <div className="flex flex-wrap gap-1">
              <button type="button" className={button} aria-label={`Move image ${index + 1} up`} disabled={index === 0} onClick={() => moveImage(index, -1)}>↑</button>
              <button type="button" className={button} aria-label={`Move image ${index + 1} down`} disabled={index === images.length - 1} onClick={() => moveImage(index, 1)}>↓</button>
              <button type="button" className={button} aria-label={`Remove image ${index + 1}`} onClick={() => onChange(current => current.filter((_, position) => position !== index))}>Remove</button>
            </div>
          </div>
          {image.url && caseImageUrl.safeParse(image.url).success && <ImagePreviewButton src={image.url} alt={image.alt || `Chapter image ${index + 1}`} className="mb-3 rounded-lg bg-[#f4f5f2]">
            <Image src={image.url} alt={image.alt} width={480} height={270} unoptimized className="h-36 w-full object-contain" />
          </ImagePreviewButton>}
          <div className="space-y-3">
            <label className="block text-sm font-bold">Image {index + 1} URL
              <input className={input} value={image.url} maxLength={2000} required placeholder="https://media.example.com/project.webp" onChange={event => updateImage(index, { url: event.target.value })} />
            </label>
            <label className="block text-sm font-bold">Image {index + 1} alt text
              <input className={input} value={image.alt} maxLength={200} required onChange={event => updateImage(index, { alt: event.target.value })} />
            </label>
            <label className="block text-sm font-bold">Image {index + 1} caption (optional)
              <textarea className={input} rows={2} value={image.caption} maxLength={500} onChange={event => updateImage(index, { caption: event.target.value })} />
            </label>
          </div>
        </div>)}
      </div>}
      {failures.length > 0 && <div className="space-y-3 rounded-lg border border-red-200 bg-red-50 p-3">
        <p className="text-sm font-bold text-red-900">{failures.length} images need attention. Successful uploads are already in the gallery.</p>
        <ul className="max-h-48 space-y-2 overflow-y-auto text-sm text-red-900">
          {failures.map(({ file, message }, index) => <li key={index} className="break-words"><span className="font-bold">{file.name}:</span> {message}</li>)}
        </ul>
        <div className="flex flex-wrap gap-2">
          <button type="button" className={button} onClick={() => { void upload(failures.map(({ file }) => file), true); }}>Retry failed images ({failures.length})</button>
          <button type="button" className={button} onClick={() => { setFailures([]); setError(""); }}>Clear failed selection</button>
        </div>
        <p className="text-xs text-red-900">Retry uploads only these files and appends them to the gallery. Keep this page open to retain the failed selection.</p>
      </div>}
    </fieldset>
    {progress && <p role="status" aria-live="polite" className="text-sm">
      {busy ? `Uploading images: ${progress.completed}/${progress.total} processed` : `Batch complete: ${progress.completed}/${progress.total} processed`}
      {` · ${progress.uploaded} uploaded · ${progress.failed} failed.`}
      {busy && " Keep this page open until the upload finishes."}
    </p>}
    {error && <p role="alert" className="text-sm text-red-800">{error}</p>}
  </div>;
}
