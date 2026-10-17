"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useCallback, useRef, useState, type ReactNode } from "react";
import { saveCaseStudy, deleteCaseStudy } from "@/actions/case-studies";
import { ImagePreviewButton } from "@/components/admin/image-preview";
import { CaseStudyVideoField } from "@/components/admin/case-study-video-field";
import { CaseStudyImageGalleryField } from "@/components/admin/case-study-image-gallery-field";
import { AiImageEditorModal } from "@/components/admin/ai-image-editor-modal";
import { CASE_STUDY_EDITOR_VERSION, getCaseSectionImages, type AdminCaseStudy, type CaseStudyContent, type CaseFormState, type CaseStudyImage } from "@/lib/case-study-content";
import type { AdminProductImageInput } from "@/types/admin-product";

const input = "mt-2 w-full rounded-lg border border-[#ccd3ce] bg-white px-3 py-3 text-sm font-normal";
const small = "rounded-lg border border-[#ccd3ce] px-3 py-2 text-sm font-bold hover:bg-[#eef0ed] disabled:opacity-50";
const empty: CaseStudyContent = { introduction: "", stats: [], sections: [{ id: "project-brief", title: "", navLabel: "Project brief", paragraphs: [""] }], conclusion: "", relatedLinks: [] };
type AiImageTarget =
  | { kind: "cover"; sourceImage: CaseStudyImage | undefined }
  | { kind: "chapter"; sectionKey: string; imageIndex: number; sourceImage: CaseStudyImage };

function replaceSectionImage(section: CaseStudyContent["sections"][number], index: number, sourceUrl: string, replacementUrl: string) {
  let position = 0;
  const replace = (image: CaseStudyImage) => position++ === index && image.url === sourceUrl ? { ...image, url: replacementUrl } : image;
  // Keep legacy slots, captions, alt text, videos and other section data intact.
  return {
    ...section,
    ...(section.image ? { image: replace(section.image) } : {}),
    ...(section.images ? { images: section.images.map(replace) } : {}),
    ...(section.gallery ? { gallery: section.gallery.map(replace) } : {}),
  };
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return <section className="rounded-2xl border border-[#d7dcd8] bg-white p-5 sm:p-7"><h2 className="mb-5 text-xl font-bold">{title}</h2>{children}</section>;
}
function Field({ label, value, onChange, multiline = false, required = true }: { label: string; value: string; onChange: (value: string) => void; multiline?: boolean; required?: boolean }) {
  return <label className="block text-sm font-bold">{label}{multiline ? <textarea className={input} rows={5} value={value} onChange={e => onChange(e.target.value)} required={required} /> : <input className={input} value={value} onChange={e => onChange(e.target.value)} required={required} />}</label>;
}
function ImageField({ value, onChange, onAiEdit, slug, onBusy, showCaption = true }: { value?: { url: string; alt: string; caption: string }; onChange: (image: { url: string; alt: string; caption: string } | undefined) => void; onAiEdit: () => void; slug: string; onBusy: (busy: boolean) => void; showCaption?: boolean }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function upload(file?: File) {
    if (!file) return;
    setBusy(true); onBusy(true); setError("");
    try {
      const form = new FormData(); form.set("image", file); form.set("slug", slug); form.set("alt", value?.alt || file.name.replace(/\.[^.]+$/, ""));
      const res = await fetch("/api/admin/case-study-images", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok || !data.image) throw new Error(data.error || "Image upload failed.");
      onChange({ url: data.image.url, alt: data.image.alt, caption: value?.caption ?? "" });
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Image upload failed."); }
    finally { setBusy(false); onBusy(false); }
  }
  return <div className="space-y-4 rounded-xl border border-dashed border-[#ccd3ce] p-4">
    {value?.url && <ImagePreviewButton src={value.url} alt={value.alt || "Case study image"} className="rounded-lg"><Image src={value.url} alt={value.alt} width={900} height={600} unoptimized className="max-h-64 w-full rounded-lg object-contain" /></ImagePreviewButton>}
    <Field label="Image URL" value={value?.url ?? ""} required={false} onChange={url => onChange(url ? { url, alt: value?.alt ?? "", caption: value?.caption ?? "" } : undefined)} />
    {value && <><Field label="Image alt text" value={value.alt} onChange={alt => onChange({ ...value, alt })} />{showCaption && <Field label="Image caption" value={value.caption} required={false} onChange={caption => onChange({ ...value, caption })} />}</>}
    <label className="block text-sm font-bold">Upload image<input className="mt-2 block w-full text-sm" type="file" accept="image/*" disabled={busy} onChange={event => { void upload(event.target.files?.[0]); event.target.value = ""; }} /></label>
    <div className="flex flex-wrap gap-2"><button type="button" className={small} disabled={busy} aria-label="AI edit cover image" onClick={onAiEdit}>{value?.url ? "AI 编辑" : "AI 生成图片"}</button>{value && <button type="button" className={small} onClick={() => onChange(undefined)}>Remove image</button>}</div>
    {busy && <p role="status">Uploading image…</p>}{error && <p role="alert" className="text-red-800">{error}</p>}
  </div>;
}

export function CaseStudyForm({ post }: { post?: AdminCaseStudy }) {
  const [state, action, pending] = useActionState<CaseFormState, FormData>(saveCaseStudy.bind(null, post?.id ?? null), {});
  const [body, setBody] = useState<CaseStudyContent>(post?.content ?? empty);
  const [sectionKeys, setSectionKeys] = useState(() => (post?.content ?? empty).sections.map((_, index) => `chapter-${index}`));
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [title, setTitle] = useState(post?.title ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [category, setCategory] = useState(post?.category ?? "Hospitality · Custom glassware");
  const [status, setStatus] = useState(post?.status ?? "DRAFT");
  const [publishedDate, setPublishedDate] = useState(post?.publishedDate ?? "");
  const [uploads, setUploads] = useState(0);
  const [cover, setCover] = useState<{ url: string; alt: string; caption: string } | undefined>(post?.coverImage ? { url: post.coverImage, alt: post.coverImageAlt ?? "", caption: "" } : undefined);
  const [aiImageTarget, setAiImageTarget] = useState<AiImageTarget | null>(null);
  const aiImageTargetRef = useRef<AiImageTarget | null>(null);
  const busy = useCallback((value: boolean) => setUploads(count => Math.max(0, count + (value ? 1 : -1))), []);
  const closeAiImageEditor = useCallback(() => {
    if (!aiImageTargetRef.current) return;
    aiImageTargetRef.current = null;
    setAiImageTarget(null);
    busy(false);
  }, [busy]);
  function openAiImageEditor(target: AiImageTarget) {
    if (pending || uploads > 0 || aiImageTargetRef.current) return;
    aiImageTargetRef.current = target;
    setAiImageTarget(target);
    busy(true);
  }
  function finishAiImageEdit(target: AiImageTarget, replacement: AdminProductImageInput) {
    if (aiImageTargetRef.current !== target) return;
    if (target.kind === "cover") {
      setCover(current => current?.url === target.sourceImage?.url
        ? current ? { ...current, url: replacement.url } : { url: replacement.url, alt: replacement.alt, caption: "" }
        : current);
    } else {
      const sectionIndex = sectionKeys.indexOf(target.sectionKey);
      setBody(current => ({ ...current, sections: current.sections.map((item, index) => index === sectionIndex
        ? replaceSectionImage(item, target.imageIndex, target.sourceImage.url, replacement.url)
        : item) }));
    }
    closeAiImageEditor();
  }
  function section(index: number, patch: Partial<CaseStudyContent["sections"][number]>) { setBody(current => ({ ...current, sections: current.sections.map((item, n) => n === index ? { ...item, ...patch } : item) })); }
  function sectionImages(index: number, update: (images: CaseStudyImage[]) => CaseStudyImage[]) {
    setBody(current => ({ ...current, sections: current.sections.map((item, n) => n === index
      ? { ...item, image: undefined, gallery: undefined, images: update(getCaseSectionImages(item)) }
      : item) }));
  }
  function moveSection(index: number, direction: number) {
    setBody(current => { const sections = [...current.sections]; const target = index + direction; [sections[index], sections[target]] = [sections[target], sections[index]]; return { ...current, sections }; });
    setSectionKeys(current => { const keys = [...current]; const target = index + direction; [keys[index], keys[target]] = [keys[target], keys[index]]; return keys; });
  }
  function removeSection(index: number) {
    setBody(current => ({ ...current, sections: current.sections.filter((_, n) => n !== index) }));
    setSectionKeys(current => current.filter((_, n) => n !== index));
  }
  function addSection() {
    const key = crypto.randomUUID();
    setBody(current => ({ ...current, sections: [...current.sections, { id: `section-${key}`, title: "", navLabel: "", paragraphs: [""] }] }));
    setSectionKeys(current => [...current, key]);
  }
  return <div className="mt-7 space-y-6">
    <form action={action} className="space-y-6" onSubmit={event => { if (uploads > 0) event.preventDefault(); }}>
      <input type="hidden" name="contentVersion" value={CASE_STUDY_EDITOR_VERSION} />
      <input type="hidden" name="content" value={JSON.stringify(body)} />
      <input type="hidden" name="updatedAt" value={post?.updatedAt ?? ""} />
      <input type="hidden" name="coverImage" value={cover?.url ?? ""} />
      <input type="hidden" name="coverImageAlt" value={cover?.alt ?? ""} />
      {state.error && <p role="alert" className="whitespace-pre-line rounded-xl bg-red-50 p-5 text-sm text-red-900">{state.error}</p>}
      <fieldset disabled={pending || uploads > 0} className="min-w-0 space-y-6">
      <Card title="Case information"><div className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-bold sm:col-span-2">Case title<input className={input} name="title" value={title} onChange={e => setTitle(e.target.value)} maxLength={180} required /></label>
        <label className="text-sm font-bold">URL slug<input className={input} name="slug" value={slug} onChange={e => setSlug(e.target.value.toLowerCase())} pattern="[a-z0-9]+(?:-[a-z0-9]+)*" required maxLength={180} /><span className="mt-1 block text-xs font-normal text-[var(--ink-muted)]">/case-studies/{slug || "your-case-title"}</span></label>
        <label className="text-sm font-bold">Category<input className={input} name="category" value={category} onChange={e => setCategory(e.target.value)} required maxLength={80} /></label>
        <label className="text-sm font-bold sm:col-span-2">Excerpt<textarea className={input} name="excerpt" value={excerpt} onChange={e => setExcerpt(e.target.value)} maxLength={500} rows={3} required /></label>
        <label className="text-sm font-bold">Status<select className={input} name="status" value={status} onChange={e => setStatus(e.target.value as typeof status)}><option value="DRAFT">Draft</option><option value="PUBLISHED">Published</option><option value="ARCHIVED">Archived</option></select></label>
        <label className="text-sm font-bold">Publication date (UTC)<input className={input} type="date" name="publishedDate" value={publishedDate} onChange={e => setPublishedDate(e.target.value)} /><span className="mt-1 block text-xs font-normal">Leave blank to use the date you publish.</span></label>
      </div></Card>
      <Card title="Cover image"><ImageField value={cover} onChange={setCover} onAiEdit={() => openAiImageEditor({ kind: "cover", sourceImage: cover })} slug={slug} onBusy={busy} showCaption={false} /></Card>
      <Card title="Project introduction"><Field label="Introduction" multiline value={body.introduction} onChange={introduction => setBody(current => ({ ...current, introduction }))} /></Card>
      <Card title="Project video"><fieldset disabled={pending}><CaseStudyVideoField value={body.video} onChange={video => setBody(current => ({ ...current, video }))} slug={slug} onBusy={busy} /></fieldset></Card>
      <Card title="Project at a glance"><div className="space-y-4">
        {body.stats.map((stat, index) => <div className="grid items-end gap-3 sm:grid-cols-[1fr_2fr_auto]" key={index}>
          <Field label={`Metric ${index + 1} value`} value={stat.value} onChange={value => setBody(current => ({ ...current, stats: current.stats.map((s, i) => i === index ? { ...s, value } : s) }))} />
          <Field label={`Metric ${index + 1} label`} value={stat.label} onChange={label => setBody(current => ({ ...current, stats: current.stats.map((s, i) => i === index ? { ...s, label } : s) }))} />
          <button type="button" className={small} onClick={() => setBody(current => ({ ...current, stats: current.stats.filter((_, i) => i !== index) }))}>Remove metric</button>
        </div>)}
        <button type="button" className={small} disabled={body.stats.length >= 8} onClick={() => setBody(current => ({ ...current, stats: [...current.stats, { value: "", label: "" }] }))}>Add metric</button>
      </div></Card>
      {body.sections.map((item, index) => <Card title={`Chapter ${index + 1}`} key={sectionKeys[index]}>
        <div className="mb-5 flex flex-wrap gap-2"><button type="button" className={small} disabled={uploads > 0 || pending || index === 0} onClick={() => moveSection(index, -1)}>Move up</button><button type="button" className={small} disabled={uploads > 0 || pending || index === body.sections.length - 1} onClick={() => moveSection(index, 1)}>Move down</button><button type="button" className={small} disabled={uploads > 0 || pending || body.sections.length === 1} onClick={() => removeSection(index)}>Remove chapter</button></div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2"><Field label="Chapter title" value={item.title} onChange={title => section(index, { title })} /></div>
          <Field label="Contents label" value={item.navLabel} onChange={navLabel => section(index, { navLabel })} />
          <Field label="Section anchor" value={item.id} onChange={id => section(index, { id })} />
          <div className="sm:col-span-2"><Field label="Paragraphs (separate with a blank line)" multiline value={item.paragraphs.join("\n\n")} onChange={text => section(index, { paragraphs: text.split(/\n\n/) })} /></div>
          <div className="sm:col-span-2"><CaseStudyImageGalleryField images={getCaseSectionImages(item)} onChange={update => sectionImages(index, update)} onAiEdit={imageIndex => openAiImageEditor({ kind: "chapter", sectionKey: sectionKeys[index], imageIndex, sourceImage: getCaseSectionImages(item)[imageIndex] })} slug={slug} onBusy={busy} disabled={pending || uploads > 0} /></div>
          <fieldset disabled={pending} className="space-y-4 rounded-xl border border-[#ccd3ce] p-4 sm:col-span-2">
            <legend className="px-2 text-sm font-bold">Chapter video</legend>
            <CaseStudyVideoField value={item.video} onChange={video => section(index, { video })} slug={slug} onBusy={busy} placement="chapter" />
          </fieldset>
        </div>
        <div className="mt-6 space-y-4">
          {item.points?.map((point, pointIndex) => <div className="space-y-3 border-l-2 border-[#ccd3ce] pl-4" key={pointIndex}>
            <Field label="Key point title" value={point.title} onChange={title => section(index, { points: item.points?.map((p, n) => n === pointIndex ? { ...p, title } : p) })} />
            <Field label="Key point text" value={point.text} multiline onChange={text => section(index, { points: item.points?.map((p, n) => n === pointIndex ? { ...p, text } : p) })} />
            <button type="button" className={small} onClick={() => section(index, { points: item.points?.filter((_, n) => n !== pointIndex) })}>Remove point</button>
          </div>)}
          <button type="button" className={small} onClick={() => section(index, { points: [...(item.points ?? []), { title: "", text: "" }] })}>Add key point</button>
        </div>
        {item.table ? <div className="mt-6 space-y-4">
          <Field label="Table caption" value={item.table.caption} onChange={caption => section(index, { table: { ...item.table!, caption } })} />
          <div className="overflow-x-auto"><table className="w-full min-w-[540px]"><thead><tr>{item.table.headings.map((heading, c) => <th key={c} className="p-1"><input aria-label={`Column ${c + 1} heading`} className={input} value={heading} required onChange={e => section(index, { table: { ...item.table!, headings: item.table!.headings.map((h, n) => n === c ? e.target.value : h) } })} /></th>)}<th /></tr></thead>
          <tbody>{item.table.rows.map((row, r) => <tr key={r}>{row.map((cell, c) => <td key={c} className="p-1"><textarea aria-label={`Row ${r + 1} column ${c + 1}`} className={input} rows={2} value={cell} onChange={e => section(index, { table: { ...item.table!, rows: item.table!.rows.map((cells, n) => n === r ? cells.map((v, k) => k === c ? e.target.value : v) : cells) } })} /></td>)}<td><button type="button" className={small} disabled={item.table!.rows.length === 1} onClick={() => section(index, { table: { ...item.table!, rows: item.table!.rows.filter((_, n) => n !== r) } })}>Remove row</button></td></tr>)}</tbody></table></div>
          <div className="flex flex-wrap gap-2"><button type="button" className={small} onClick={() => section(index, { table: { ...item.table!, rows: [...item.table!.rows, item.table!.headings.map(() => "")] } })}>Add row</button><button type="button" className={small} disabled={item.table.headings.length >= 8} onClick={() => section(index, { table: { ...item.table!, headings: [...item.table!.headings, ""], rows: item.table!.rows.map(row => [...row, ""]) } })}>Add column</button><button type="button" className={small} disabled={item.table.headings.length === 1} onClick={() => section(index, { table: { ...item.table!, headings: item.table!.headings.slice(0, -1), rows: item.table!.rows.map(row => row.slice(0, -1)) } })}>Remove last column</button><button type="button" className={small} onClick={() => section(index, { table: undefined })}>Remove table</button></div>
        </div> : <button type="button" className={`${small} mt-6`} onClick={() => section(index, { table: { caption: "", headings: ["Item", "Detail"], rows: [["", ""]] } })}>Add table</button>}
      </Card>)}
      <button type="button" className={small} disabled={uploads > 0 || pending || body.sections.length >= 20} onClick={addSection}>Add chapter</button>
      <Card title="Closing and related links"><div className="space-y-5">
        <Field label="Closing paragraph" multiline value={body.conclusion} onChange={conclusion => setBody(current => ({ ...current, conclusion }))} />
        {body.relatedLinks.map((link, index) => <div className="grid items-end gap-3 sm:grid-cols-[1fr_1fr_auto]" key={index}><Field label="Link label" value={link.label} onChange={label => setBody(current => ({ ...current, relatedLinks: current.relatedLinks.map((l, i) => i === index ? { ...l, label } : l) }))} /><Field label="Link URL" value={link.href} onChange={href => setBody(current => ({ ...current, relatedLinks: current.relatedLinks.map((l, i) => i === index ? { ...l, href } : l) }))} /><button type="button" className={small} onClick={() => setBody(current => ({ ...current, relatedLinks: current.relatedLinks.filter((_, i) => i !== index) }))}>Remove link</button></div>)}
        <button type="button" className={small} onClick={() => setBody(current => ({ ...current, relatedLinks: [...current.relatedLinks, { label: "", href: "" }] }))}>Add related link</button>
      </div></Card>
      <div className="sticky bottom-4 z-10 flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-white/95 p-4 shadow-lg"><p className="text-xs">Drafts and archived cases are visible only to administrators.</p><div className="flex gap-3"><Link className={small} href="/admin/case-studies">Cancel</Link>{post && <Link className={small} href={`/admin/case-studies/${post.id}/preview`} target="_blank">Preview saved draft</Link>}<button className="button-primary" disabled={pending || uploads > 0}>{pending ? "Saving…" : post ? "Save changes" : "Create case study"}</button></div></div>
      </fieldset>
    </form>
    {post && <form action={deleteCaseStudy.bind(null, post.id)} className="rounded-xl border border-red-200 bg-red-50 p-5" onSubmit={e => { if (uploads > 0 || pending || !window.confirm(`Delete “${post.title}”? This cannot be undone.`)) e.preventDefault(); }}><input type="hidden" name="updatedAt" value={post.updatedAt} /><p className="mb-3 text-sm text-red-900">Permanently remove this case study.</p><button disabled={uploads > 0 || pending} className="rounded-lg bg-red-800 px-4 py-2 text-sm font-bold text-white disabled:opacity-50">Delete case study</button></form>}
    {aiImageTarget && <AiImageEditorModal open usage="case-study" sourceImage={aiImageTarget.sourceImage?.url ? aiImageTarget.sourceImage : null} slug={slug} onClose={closeAiImageEditor} onFinish={replacement => finishAiImageEdit(aiImageTarget, replacement)} />}
  </div>;
}
