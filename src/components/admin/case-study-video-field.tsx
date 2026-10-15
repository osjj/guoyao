"use client";

import { useState } from "react";
import { CaseStudyVideoPlayer } from "@/components/site/case-study-video";
import { caseVideoUrl, caseVideoPosterUrl, type CaseStudyVideo } from "@/lib/case-study-content";
import { CASE_VIDEO_ACCEPT, validateCaseVideoFile } from "@/lib/case-study-video-upload";

const input = "mt-2 w-full rounded-lg border border-[#ccd3ce] bg-white px-3 py-3 text-sm font-normal";
const button = "rounded-lg border border-[#ccd3ce] px-3 py-2 text-sm font-bold hover:bg-[#eef0ed] disabled:opacity-50";

export function CaseStudyVideoField({ value, onChange, slug, onBusy }: {
  value?: CaseStudyVideo;
  onChange: (video: CaseStudyVideo | undefined) => void;
  slug: string;
  onBusy: (busy: boolean) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function upload(file?: File) {
    if (!file) return;
    setError("");
    const validationError = validateCaseVideoFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    setBusy(true);
    onBusy(true);
    try {
      const form = new FormData();
      form.set("video", file);
      form.set("slug", slug);
      const response = await fetch("/api/admin/case-study-videos", { method: "POST", body: form });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.video?.url) {
        throw new Error(data?.error || (response.status === 413
          ? "The server rejected the video size. Try a smaller file or paste a video URL."
          : "The video could not be uploaded. Please try again."));
      }
      onChange({
        url: data.video.url,
        title: value?.title || data.video.title || file.name.replace(/\.[^.]+$/, ""),
        caption: value?.caption ?? "",
        ...(value?.poster ? { poster: value.poster } : {}),
      });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The video could not be uploaded. Please try again.");
    } finally {
      setBusy(false);
      onBusy(false);
    }
  }

  const validUrl = value && caseVideoUrl.safeParse(value.url).success;
  const validPoster = !value?.poster || caseVideoPosterUrl.safeParse(value.poster).success;

  return <div className="space-y-4">
    <p className="text-sm leading-6 text-[var(--ink-muted)]">Add an optional project video above the case chapters. Upload an MP4 or WebM file (up to 50 MB), or paste a direct video URL. MP4 with H.264 is recommended for browser compatibility.</p>
    <fieldset disabled={busy} className="space-y-4 disabled:opacity-60">
      <label className="block text-sm font-bold">Upload video
        <input className="mt-2 block w-full text-sm font-normal" type="file" accept={CASE_VIDEO_ACCEPT} onChange={event => { void upload(event.target.files?.[0]); event.target.value = ""; }} />
      </label>
      {value ? <>
        <label className="block text-sm font-bold">Video URL
          <input className={input} value={value.url} maxLength={2000} required placeholder="https://media.example.com/project.mp4" onChange={event => onChange({ ...value, url: event.target.value })} />
          <span className="mt-1 block text-xs font-normal text-[var(--ink-muted)]">Use a direct .mp4 or .webm file URL, rather than a video platform page.</span>
        </label>
        {value.url && !validUrl && <p role="alert" className="text-sm text-red-800">Enter an HTTP(S) URL or site path ending in .mp4 or .webm.</p>}
        <label className="block text-sm font-bold">Video title
          <input className={input} value={value.title} maxLength={240} required onChange={event => onChange({ ...value, title: event.target.value })} />
        </label>
        <label className="block text-sm font-bold">Video description (optional)
          <textarea className={input} rows={3} value={value.caption} maxLength={1000} onChange={event => onChange({ ...value, caption: event.target.value })} />
        </label>
        <label className="block text-sm font-bold">Video poster image URL (optional)
          <input className={input} value={value.poster ?? ""} maxLength={2000} onChange={event => onChange({ ...value, poster: event.target.value || undefined })} />
        </label>
        {!validPoster && <p role="alert" className="text-sm text-red-800">Enter an HTTP(S) image URL or site path for the poster.</p>}
        <button type="button" className={button} onClick={() => { onChange(undefined); setError(""); }}>Remove video</button>
      </> : <button type="button" className={button} onClick={() => { onChange({ url: "", title: "Project video", caption: "" }); setError(""); }}>Add video URL</button>}
    </fieldset>
    {busy && <p role="status" className="text-sm">Uploading video… Keep this page open until the upload finishes.</p>}
    {error && <p role="alert" className="text-sm text-red-800">{error}</p>}
    {value && validUrl && validPoster && <div className="max-w-3xl space-y-3">
      <p className="text-sm font-bold">Video preview</p>
      <CaseStudyVideoPlayer key={value.url} video={{ ...value, title: value.title || "Project video" }} />
    </div>}
  </div>;
}
