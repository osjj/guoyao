"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  ImageIcon,
  Loader2,
  Plus,
  RotateCcw,
  Save,
  Settings2,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import type { AdminProductImageInput } from "@/types/admin-product";
import { MagnifiableImage } from "@/components/admin/magnifiable-image";

const SIZE_OPTIONS = [
  "1024x1024",
  "1024x1536",
  "1536x1024",
  "2048x2048",
  "2048x1152",
  "auto",
] as const;
const QUALITY_OPTIONS = ["low", "medium", "high", "auto"] as const;
const OUTPUT_FORMAT_OPTIONS = ["jpeg", "png", "webp"] as const;
const BACKGROUND_OPTIONS = [
  { value: "original", label: "保持原背景", prompt: "" },
  { value: "dining", label: "餐桌", prompt: "温馨雅致的餐桌，亚麻桌布与简洁餐具，柔和自然光" },
  { value: "bar", label: "酒吧桌", prompt: "高级酒吧的深色木质吧台，暖色氛围灯，背景酒架虚化" },
  { value: "cafe", label: "咖啡馆", prompt: "明亮咖啡馆的木桌，窗边自然光，咖啡馆背景柔和虚化" },
  { value: "marble", label: "大理石台面", prompt: "浅色大理石台面，干净现代的室内背景，柔和侧光" },
  { value: "kitchen", label: "厨房台面", prompt: "整洁现代的厨房台面，明亮自然光，背景简洁" },
  { value: "restaurant", label: "西餐厅", prompt: "精致西餐厅餐桌，白色桌布与低调餐具，优雅暖光" },
  { value: "garden", label: "户外花园桌", prompt: "户外花园木桌，自然绿植背景虚化，柔和日光" },
  { value: "hotel", label: "酒店宴会桌", prompt: "高端酒店宴会餐桌，简洁花艺与柔和灯光，优雅布置" },
  { value: "studio", label: "纯白摄影棚", prompt: "纯白无缝摄影棚背景与白色台面，柔和棚拍光和自然接触阴影" },
] as const;

type ImageSize = (typeof SIZE_OPTIONS)[number];
type ImageQuality = (typeof QUALITY_OPTIONS)[number];
type OutputFormat = (typeof OUTPUT_FORMAT_OPTIONS)[number];
type ReferenceImage = "none" | "glarivo-blue-logo";

type PromptTemplate = {
  id: string;
  label: string;
  prompt: string;
  referenceImage: ReferenceImage;
  useSourceImage?: boolean;
};

type GeneratedImage = {
  b64Json: string;
  mimeType: string;
  format: OutputFormat;
  width: number;
  height: number;
};

type AiImageEditorModalProps = {
  open: boolean;
  sourceImage: AdminProductImageInput | null;
  slug: string;
  usage?: "product" | "blog" | "case-study";
  onClose: () => void;
  onFinish: (image: AdminProductImageInput) => void | Promise<void>;
};

const REMOVE_ICON_PROMPT =
  "去除图片中的品牌 Logo、文字水印和其他图标，保持产品主体、颜色、材质、比例、背景和构图不变，自然修复被遮挡区域。";
const REPLACE_ICON_PROMPT =
  "去除第一张产品原图中的品牌 Logo、文字水印和其他图标，自然修复被遮挡区域，再添加第二张参考图里的蓝色 GLARIVO GLASSWARE Logo。图标放左上角，与图片边缘保持适当留白，不遮挡产品主体。保持蓝色 Logo 的图形、文字、颜色和比例准确。只保留一个 GLARIVO Logo，产品主体、颜色、材质、比例、背景和构图不得改变。";
const PROMPT_TEMPLATES_STORAGE_KEY = "glarivo:ai-image-editor:prompt-templates:v1";
const DEFAULT_PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: "remove-icon",
    label: "去除图标",
    prompt: REMOVE_ICON_PROMPT,
    referenceImage: "none",
  },
  {
    id: "replace-icon",
    label: "替换图标",
    prompt: REPLACE_ICON_PROMPT,
    referenceImage: "glarivo-blue-logo",
  },
];
const EDITORIAL_TEMPLATES_STORAGE_KEY = "guoyao:ai-image-editor:editorial-templates:v1";
const EDITORIAL_PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: "editorial-enhance",
    label: "优化图片",
    prompt: "优化这张图片的清晰度、光线和色彩，保持原有主体、场景、物品数量及真实细节不变，不添加文字、品牌标识或不存在的事实。",
    referenceImage: "none",
    useSourceImage: true,
  },
  {
    id: "editorial-clean",
    label: "清理文字与水印",
    prompt: "去除图片中的文字水印和品牌标识，自然修复被遮挡区域。保持主体、材质、颜色、背景和构图不变。",
    referenceImage: "none",
    useSourceImage: true,
  },
  {
    id: "editorial-new",
    label: "生成文章配图",
    prompt: "为以下主题创作一张简洁、专业的文章配图，构图清晰，突出主题，不添加文字、Logo 或认证标识。主题：",
    referenceImage: "none",
    useSourceImage: false,
  },
];

const UPLOAD_ENDPOINTS = {
  product: "/api/admin/product-images",
  blog: "/api/admin/blog-images",
  "case-study": "/api/admin/case-study-images",
};

function isReferenceImage(value: unknown): value is ReferenceImage {
  return value === "none" || value === "glarivo-blue-logo";
}

function parsePromptTemplates(value: string | null): PromptTemplate[] | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) return null;
    const templates = parsed.filter(
      (template): template is PromptTemplate =>
        typeof template === "object" &&
        template !== null &&
        typeof (template as PromptTemplate).id === "string" &&
        typeof (template as PromptTemplate).label === "string" &&
        typeof (template as PromptTemplate).prompt === "string" &&
        isReferenceImage((template as PromptTemplate).referenceImage) &&
        ((template as PromptTemplate).useSourceImage === undefined ||
          typeof (template as PromptTemplate).useSourceImage === "boolean"),
    );
    const uniqueIds = new Set(templates.map((template) => template.id));
    return templates.length === parsed.length && uniqueIds.size === templates.length
      ? templates
      : null;
  } catch {
    return null;
  }
}

function createPromptTemplateId() {
  return `template-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function isOutputFormat(value: unknown): value is OutputFormat {
  return OUTPUT_FORMAT_OPTIONS.includes(value as OutputFormat);
}

function normalizeBase64(value: string) {
  if (!value.startsWith("data:")) return value;
  const separator = value.indexOf(",");
  return separator >= 0 ? value.slice(separator + 1) : value;
}

function base64ToFile(image: GeneratedImage) {
  const binary = window.atob(normalizeBase64(image.b64Json));
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  const extension = image.format === "jpeg" ? "jpg" : image.format;
  return new File([bytes], "ai-edited-" + Date.now() + "." + extension, {
    type: image.mimeType,
  });
}

function isolateDialogKey(event: KeyboardEvent, dialog: HTMLElement | null, close: () => void) {
  // EditorJS has document capture listeners. Stop them at window while retaining
  // native text input, selection, copy/paste shortcuts and checkbox activation.
  event.stopPropagation();
  if (event.key === "Escape") {
    event.preventDefault();
    close();
    return;
  }
  if (event.key !== "Tab" || !dialog) return;
  const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(
    'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
  )).filter((element) => element.getClientRects().length > 0);
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (!first || !last) {
    event.preventDefault();
    dialog.focus();
  } else if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

export function AiImageEditorModal(props: AiImageEditorModalProps) {
  if (!props.open) return null;
  return (
    <AiImageEditorSession
      key={`${props.usage ?? "product"}:${props.sourceImage?.url ?? "new"}`}
      {...props}
    />
  );
}

function AiImageEditorSession({
  sourceImage,
  slug,
  usage = "product",
  onClose,
  onFinish,
}: AiImageEditorModalProps) {
  const isProduct = usage === "product";
  const contentLabel = isProduct ? "product" : usage === "blog" ? "article" : "case study";
  const defaultTemplates = isProduct ? DEFAULT_PROMPT_TEMPLATES : EDITORIAL_PROMPT_TEMPLATES;
  const storageKey = isProduct ? PROMPT_TEMPLATES_STORAGE_KEY : EDITORIAL_TEMPLATES_STORAGE_KEY;
  const titleId = useId();
  const dialogRef = useRef<HTMLElement>(null);
  // Capture before the opening render disables the caller's form controls.
  const returnFocusRef = useRef<HTMLElement | null>(
    typeof document !== "undefined" && document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null,
  );
  const promptRef = useRef<HTMLTextAreaElement>(null);
  const operationAbortRef = useRef<AbortController | null>(null);
  const callbacksRef = useRef({ onClose, onFinish });
  const [mounted, setMounted] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [size, setSize] = useState<ImageSize>("auto");
  const [quality, setQuality] = useState<ImageQuality>("auto");
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("webp");
  const [referenceImage, setReferenceImage] = useState<ReferenceImage>("none");
  const [useSourceImage, setUseSourceImage] = useState(Boolean(sourceImage?.url));
  const [background, setBackground] = useState<string>("original");
  const [promptTemplates, setPromptTemplates] = useState<PromptTemplate[]>(
    defaultTemplates,
  );
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [configuringTemplates, setConfiguringTemplates] = useState(false);
  const [templateDrafts, setTemplateDrafts] = useState<PromptTemplate[]>([]);
  const [templateConfigError, setTemplateConfigError] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [generating, setGenerating] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    callbacksRef.current = { onClose, onFinish };
  }, [onClose, onFinish]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setMounted(true);
      try {
        const storedTemplates = parsePromptTemplates(
          window.localStorage.getItem(storageKey),
        );
        if (storedTemplates) {
          setPromptTemplates(storedTemplates.map((template) => ({
            ...template,
            referenceImage: isProduct ? template.referenceImage : "none",
          })));
        }
      } catch {
        // Keep the defaults when browser storage is unavailable.
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [storageKey, isProduct]);

  useEffect(() => {
    if (!mounted) return;
    const frame = window.requestAnimationFrame(() => promptRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    const portal = dialogRef.current?.parentElement;
    const siblings = Array.from(document.body.children)
      .filter((element): element is HTMLElement => element instanceof HTMLElement && element !== portal)
      .map((element) => ({ element, inert: element.inert }));
    siblings.forEach(({ element }) => { element.inert = true; });
    const handleKeyDown = (event: KeyboardEvent) => isolateDialogKey(event, dialogRef.current, () => {
      operationAbortRef.current?.abort();
      operationAbortRef.current = null;
      callbacksRef.current.onClose();
    });
    const stopPropagation = (event: Event) => event.stopPropagation();
    const preventTransfer = (event: Event) => {
      event.preventDefault();
      event.stopPropagation();
    };
    window.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener("keyup", stopPropagation, true);
    window.addEventListener("paste", stopPropagation, true);
    window.addEventListener("cut", stopPropagation, true);
    window.addEventListener("drop", preventTransfer, true);
    window.addEventListener("dragover", preventTransfer, true);
    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
      window.removeEventListener("keyup", stopPropagation, true);
      window.removeEventListener("paste", stopPropagation, true);
      window.removeEventListener("cut", stopPropagation, true);
      window.removeEventListener("drop", preventTransfer, true);
      window.removeEventListener("dragover", preventTransfer, true);
      siblings.forEach(({ element, inert }) => { element.inert = inert; });
    };
  }, [mounted]);

  useEffect(() => {
    if (!generating && !finishing) return;
    const active = document.activeElement;
    if (!dialogRef.current?.contains(active) || active?.matches(":disabled")) {
      dialogRef.current?.querySelector<HTMLButtonElement>("button:not([disabled])")?.focus();
    }
  }, [generating, finishing]);

  useEffect(() => {
    const previousFocus = returnFocusRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      operationAbortRef.current?.abort();
      operationAbortRef.current = null;
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, []);

  function dismiss() {
    operationAbortRef.current?.abort();
    operationAbortRef.current = null;
    callbacksRef.current.onClose();
  }

  function openTemplateConfiguration() {
    setTemplateDrafts(promptTemplates.map((template) => ({ ...template })));
    setTemplateConfigError(null);
    setConfiguringTemplates(true);
  }

  function saveTemplateConfiguration() {
    const normalizedTemplates = templateDrafts.map((template) => ({
      ...template,
      label: template.label.trim(),
      prompt: template.prompt.trim(),
    }));
    if (normalizedTemplates.some((template) => !template.label || !template.prompt)) {
      setTemplateConfigError("Each template needs a button name and prompt.");
      return;
    }
    if (normalizedTemplates.some((template) => template.label.length > 40)) {
      setTemplateConfigError("Button names cannot exceed 40 characters.");
      return;
    }
    if (normalizedTemplates.some((template) => template.prompt.length > 4000)) {
      setTemplateConfigError("Template prompts cannot exceed 4000 characters.");
      return;
    }

    setPromptTemplates(normalizedTemplates);
    setSelectedTemplateId(null);
    try {
      window.localStorage.setItem(
        storageKey,
        JSON.stringify(normalizedTemplates),
      );
      setConfiguringTemplates(false);
      setTemplateConfigError(null);
    } catch {
      setTemplateConfigError(
        "Templates were applied for this session, but this browser could not save them.",
      );
    }
  }

  function applyPromptTemplate(template: PromptTemplate) {
    setPrompt(template.prompt);
    setReferenceImage(isProduct ? template.referenceImage : "none");
    setUseSourceImage(Boolean(sourceImage?.url) && template.useSourceImage !== false);
    setSelectedTemplateId(template.id);
    setGeneratedImage(null);
    setError(null);
    promptRef.current?.focus();
  }

  async function generateImage() {
    const selectedBackground = BACKGROUND_OPTIONS.find((option) => option.value === background);
    const backgroundPrompt = isProduct && selectedBackground?.prompt
      ? `背景要求（优先于上述保持背景或构图不变的要求）：将产品置于${selectedBackground.prompt}。保持产品数量、外形、比例、材质、颜色和细节，玻璃透明度、折射、反射及接触阴影应与新场景自然一致。产品作为清晰主体，不添加文字、图标或额外品牌标识。`
      : "";
    const finalPrompt = [prompt.trim(), backgroundPrompt].filter(Boolean).join("\n\n");
    if (!finalPrompt) return;
    if (finalPrompt.length > 4000) {
      setError("提示词与背景要求合计不能超过 4000 字，请缩短提示词。");
      return;
    }
    operationAbortRef.current?.abort();
    const controller = new AbortController();
    operationAbortRef.current = controller;
    setGenerating(true);
    setGeneratedImage(null);
    setError(null);

    try {
      const response = await fetch("/api/admin/product-image-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(useSourceImage && sourceImage?.url ? { sourceUrl: sourceImage.url } : {}),
          prompt: finalPrompt,
          size,
          quality,
          outputFormat,
          referenceImage: isProduct ? referenceImage : "none",
        }),
        signal: controller.signal,
      });
      const payload = (await response.json().catch(() => null)) as
        | {
            image?: {
              b64Json?: unknown;
              mimeType?: unknown;
              format?: unknown;
              width?: unknown;
              height?: unknown;
            };
            error?: unknown;
          }
        | null;
      if (!response.ok) {
        throw new Error(
          typeof payload?.error === "string" ? payload.error : "The image could not be generated.",
        );
      }
      if (
        typeof payload?.image?.b64Json !== "string" ||
        !payload.image.b64Json ||
        typeof payload.image.mimeType !== "string" ||
        !isOutputFormat(payload.image.format) ||
        payload.image.mimeType !== `image/${payload.image.format}` ||
        typeof payload.image.width !== "number" ||
        !Number.isFinite(payload.image.width) || payload.image.width <= 0 ||
        typeof payload.image.height !== "number" ||
        !Number.isFinite(payload.image.height) || payload.image.height <= 0
      ) {
        throw new Error("The image service returned an incomplete result.");
      }

      if (controller.signal.aborted || operationAbortRef.current !== controller) return;
      setGeneratedImage({
        b64Json: normalizeBase64(payload.image.b64Json),
        mimeType: payload.image.mimeType,
        format: payload.image.format,
        width: payload.image.width,
        height: payload.image.height,
      });
    } catch (caughtError) {
      if (controller.signal.aborted || operationAbortRef.current !== controller) return;
      if (caughtError instanceof DOMException && caughtError.name === "AbortError") return;
      setError(
        caughtError instanceof Error ? caughtError.message : "The image could not be generated.",
      );
    } finally {
      if (!controller.signal.aborted && operationAbortRef.current === controller) {
        operationAbortRef.current = null;
        setGenerating(false);
      }
    }
  }

  async function finishEditing() {
    if (!generatedImage) return;
    operationAbortRef.current?.abort();
    const controller = new AbortController();
    operationAbortRef.current = controller;
    setFinishing(true);
    setError(null);

    try {
      const uploadData = new FormData();
      uploadData.set("image", base64ToFile(generatedImage));
      uploadData.set("slug", slug);
      uploadData.set("alt", sourceImage?.alt || `${contentLabel} image`);
      uploadData.set("aiGenerated", "true");
      uploadData.set("outputFormat", generatedImage.format);

      const response = await fetch(UPLOAD_ENDPOINTS[usage], {
        method: "POST",
        body: uploadData,
        signal: controller.signal,
      });
      const payload = (await response.json().catch(() => null)) as
        | { image?: AdminProductImageInput; error?: unknown }
        | null;
      if (
        !response.ok ||
        !payload?.image ||
        typeof payload.image.url !== "string" ||
        !/^https?:\/\//i.test(payload.image.url) ||
        (payload.image.alt !== undefined && typeof payload.image.alt !== "string")
      ) {
        throw new Error(
          typeof payload?.error === "string"
            ? payload.error
            : "The generated image could not be saved.",
        );
      }

      if (controller.signal.aborted || operationAbortRef.current !== controller) return;
      await callbacksRef.current.onFinish({
        ...payload.image,
        alt: sourceImage?.alt || payload.image.alt || `${contentLabel} image`,
      });
    } catch (caughtError) {
      if (controller.signal.aborted || operationAbortRef.current !== controller) return;
      if (caughtError instanceof DOMException && caughtError.name === "AbortError") return;
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "The generated image could not be saved.",
      );
    } finally {
      if (!controller.signal.aborted && operationAbortRef.current === controller) {
        operationAbortRef.current = null;
        setFinishing(false);
      }
    }
  }

  if (!mounted) return null;

  const generatedPreview = generatedImage
    ? "data:" + generatedImage.mimeType + ";base64," + generatedImage.b64Json
    : null;
  const busy = generating || finishing;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#071427]/70 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        event.stopPropagation();
        if (event.target === event.currentTarget) dismiss();
      }}
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
      onKeyUp={(event) => event.stopPropagation()}
      onPaste={(event) => event.stopPropagation()}
      onDrop={(event) => { event.preventDefault(); event.stopPropagation(); }}
      onDragOver={(event) => { event.preventDefault(); event.stopPropagation(); }}
    >
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-busy={busy}
        tabIndex={-1}
        className="flex max-h-[calc(100vh-1.5rem)] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-white/20 bg-white shadow-[0_30px_100px_rgba(0,0,0,0.35)] sm:max-h-[calc(100vh-3rem)]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="flex items-start justify-between gap-4 border-b border-[#e4e7e3] bg-[#f8f9f7] px-5 py-4 sm:px-7 sm:py-5">
          <div className="flex min-w-0 items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-[var(--ink)] text-[var(--acid)]">
              <Sparkles className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h2 id={titleId} className="text-xl font-black tracking-[-0.03em]">
                AI image editor
              </h2>
              <p className="mt-1 text-sm leading-5 text-[var(--ink-muted)]">
                {`Edit or generate an image for this ${contentLabel}, review the preview, then use it in the form.`}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="grid size-10 shrink-0 place-items-center rounded-xl text-[var(--ink-muted)] transition hover:bg-white hover:text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            onClick={dismiss}
            aria-label="Close AI image editor"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-7">
          <div className="grid gap-5 lg:grid-cols-2">
            <figure>
              <figcaption className="mb-2 text-sm font-black">Original image</figcaption>
              {sourceImage?.url ? (
                <MagnifiableImage key={sourceImage.url} src={sourceImage.url} alt={sourceImage.alt || `Original ${contentLabel} image`} />
              ) : (
                <div className="grid aspect-square place-items-center rounded-2xl border border-[#d7dcd8] bg-[#eef0ed] p-6 text-center text-sm text-[var(--ink-muted)]">
                  No reference image. Describe the image you want to generate.
                </div>
              )}
            </figure>

            <figure>
              <figcaption className="mb-2 flex items-center justify-between gap-3 text-sm font-black">
                <span>Generated image</span>
                {generatedImage ? (
                  <span className="text-xs font-bold text-[var(--ink-muted)]">
                    {generatedImage.width} × {generatedImage.height} · {generatedImage.format}
                  </span>
                ) : null}
              </figcaption>
                {generatedPreview ? (
                  <MagnifiableImage
                    key={generatedPreview}
                    src={generatedPreview}
                    alt={`AI-generated ${contentLabel} image preview`}
                  />
                ) : (
                  <div className="grid aspect-square place-items-center rounded-2xl border border-[#d7dcd8] bg-[#eef0ed] p-6 text-center text-sm text-[var(--ink-muted)]">
                    <div>
                      {generating ? (
                        <Loader2 className="mx-auto size-8 animate-spin text-[var(--accent-dark)]" />
                      ) : (
                        <ImageIcon className="mx-auto size-8" aria-hidden="true" />
                      )}
                      <p className="mt-3 font-bold">
                        {generating ? "Generating image…" : "Your generated preview will appear here."}
                      </p>
                    </div>
                  </div>
                )}
            </figure>
          </div>

          <label className="mt-5 flex items-start gap-3 rounded-xl border border-[#d7dcd8] bg-[#f8f9f7] p-4 text-sm">
            <input
              type="checkbox"
              className="mt-0.5 size-4 accent-[var(--accent-dark)]"
              checked={useSourceImage}
              disabled={busy || !sourceImage?.url}
              onChange={(event) => {
                setUseSourceImage(event.target.checked);
                setSelectedTemplateId(null);
                setGeneratedImage(null);
                setError(null);
              }}
            />
            <span>
              <span className="block font-black">引用当前图片作为参考</span>
              <span className="mt-1 block text-xs leading-5 text-[var(--ink-muted)]">
                {useSourceImage ? "会将当前图片发送给 AI 作为上下文。" : "不会发送当前图片；AI 将根据提示词生成新图片。"}
              </span>
            </span>
          </label>

          <label className="mt-6 block text-sm font-black">
            Editing instructions
            <textarea
              ref={promptRef}
              className="mt-2 min-h-28 w-full rounded-xl border border-[#ccd3ce] bg-white p-4 text-sm font-normal leading-6 text-[var(--ink)] shadow-sm transition focus:border-[var(--accent)]"
              value={prompt}
              onChange={(event) => {
                setPrompt(event.target.value);
                setSelectedTemplateId(null);
                setGeneratedImage(null);
              }}
              placeholder="Describe what should change and what must remain unchanged…"
              maxLength={4000}
              disabled={busy}
            />
          </label>

          <div className="mt-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--ink-muted)]">
                Prompt templates
              </p>
              <button
                type="button"
                className="inline-flex min-h-9 items-center gap-2 rounded-lg px-2.5 text-xs font-black text-[var(--accent-dark)] transition hover:bg-[#edf4ff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                onClick={
                  configuringTemplates
                    ? () => setConfiguringTemplates(false)
                    : openTemplateConfiguration
                }
                disabled={busy}
                aria-expanded={configuringTemplates}
              >
                <Settings2 className="size-4" aria-hidden="true" />
                {configuringTemplates ? "Close configuration" : "Configure"}
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {promptTemplates.map((template) => {
                const selected = selectedTemplateId === template.id;
                return (
                  <button
                    key={template.id}
                    type="button"
                    className={`inline-flex min-h-10 items-center gap-2 rounded-xl border px-3 text-sm font-black transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${
                      selected
                        ? "border-[var(--accent)] bg-[#edf4ff] text-[var(--accent-dark)]"
                        : "border-[#c9d0ca] bg-[#f8f9f7] text-[var(--ink)] hover:border-[var(--accent)] hover:bg-white"
                    }`}
                    onClick={() => applyPromptTemplate(template)}
                    disabled={busy}
                    aria-pressed={selected}
                  >
                    {template.referenceImage === "glarivo-blue-logo" ? (
                      <ImageIcon className="size-4" aria-hidden="true" />
                    ) : (
                      <Sparkles
                        className="size-4 text-[var(--accent-dark)]"
                        aria-hidden="true"
                      />
                    )}
                    {template.label}
                  </button>
                );
              })}
              {!promptTemplates.length ? (
                <p className="py-2 text-sm text-[var(--ink-muted)]">
                  No templates configured. Select Configure to add one.
                </p>
              ) : null}
            </div>
            {configuringTemplates ? (
              <div className="mt-3 rounded-2xl border border-[#ccd3ce] bg-[#f8f9f7] p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-black">Configure prompt templates</h3>
                    <p className="mt-1 text-xs leading-5 text-[var(--ink-muted)]">
                      {isProduct
                        ? "Changes are saved in this browser and reused for every product image."
                        : "模板保存在当前浏览器中，博客和案例图片共用。"}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="inline-flex min-h-9 items-center gap-2 rounded-lg px-2.5 text-xs font-black text-[var(--ink-muted)] transition hover:bg-white hover:text-[var(--ink)]"
                    onClick={() => {
                      setTemplateDrafts(
                        defaultTemplates.map((template) => ({ ...template })),
                      );
                      setTemplateConfigError(null);
                    }}
                  >
                    <RotateCcw className="size-4" aria-hidden="true" />
                    Restore defaults
                  </button>
                </div>

                <div className="mt-4 space-y-3">
                  {templateDrafts.map((template, index) => (
                    <div
                      key={template.id}
                      className="rounded-xl border border-[#d7dcd8] bg-white p-3"
                    >
                      <div className="flex items-start gap-3">
                        <div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]">
                          <label className="text-xs font-black">
                            Button name
                            <input
                              className="mt-1.5 h-10 w-full rounded-lg border border-[#ccd3ce] px-3 text-sm font-normal focus:border-[var(--accent)]"
                              value={template.label}
                              onChange={(event) =>
                                setTemplateDrafts((current) =>
                                  current.map((item, itemIndex) =>
                                    itemIndex === index
                                      ? { ...item, label: event.target.value }
                                      : item,
                                  ),
                                )
                              }
                              maxLength={40}
                            />
                          </label>
                          {isProduct ? <label className="text-xs font-black">
                            Reference image
                            <select
                              className="mt-1.5 h-10 w-full rounded-lg border border-[#ccd3ce] bg-white px-3 text-sm font-normal focus:border-[var(--accent)]"
                              value={template.referenceImage}
                              onChange={(event) =>
                                setTemplateDrafts((current) =>
                                  current.map((item, itemIndex) =>
                                    itemIndex === index
                                      ? {
                                          ...item,
                                          referenceImage: event.target.value as ReferenceImage,
                                        }
                                      : item,
                                  ),
                                )
                              }
                            >
                              <option value="none">None</option>
                              <option value="glarivo-blue-logo">Blue GLARIVO logo</option>
                            </select>
                          </label> : null}
                          <label className="flex items-center gap-2 text-xs font-black">
                            <input
                              type="checkbox"
                              className="size-4 accent-[var(--accent-dark)]"
                              checked={template.useSourceImage !== false}
                              onChange={(event) => setTemplateDrafts((current) =>
                                current.map((item, itemIndex) => itemIndex === index
                                  ? { ...item, useSourceImage: event.target.checked }
                                  : item),
                              )}
                            />
                            引用当前图片作为参考
                          </label>
                        </div>
                        <button
                          type="button"
                          className="mt-5 grid size-9 shrink-0 place-items-center rounded-lg text-[#a33c32] transition hover:bg-[#fff0ee]"
                          onClick={() =>
                            setTemplateDrafts((current) =>
                              current.filter((_, itemIndex) => itemIndex !== index),
                            )
                          }
                          aria-label={`Delete ${template.label || `template ${index + 1}`}`}
                        >
                          <Trash2 className="size-4" aria-hidden="true" />
                        </button>
                      </div>
                      <label className="mt-3 block text-xs font-black">
                        Prompt
                        <textarea
                          className="mt-1.5 min-h-24 w-full rounded-lg border border-[#ccd3ce] p-3 text-sm font-normal leading-5 focus:border-[var(--accent)]"
                          value={template.prompt}
                          onChange={(event) =>
                            setTemplateDrafts((current) =>
                              current.map((item, itemIndex) =>
                                itemIndex === index
                                  ? { ...item, prompt: event.target.value }
                                  : item,
                              ),
                            )
                          }
                          maxLength={4000}
                        />
                      </label>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    className="button-secondary"
                    onClick={() => {
                      setTemplateDrafts((current) => [
                        ...current,
                        {
                          id: createPromptTemplateId(),
                          label: "New template",
                          prompt: "",
                          referenceImage: "none",
                          useSourceImage,
                        },
                      ]);
                      setTemplateConfigError(null);
                    }}
                  >
                    <Plus className="size-4" aria-hidden="true" />
                    Add template
                  </button>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="button-secondary"
                      onClick={() => {
                        setConfiguringTemplates(false);
                        setTemplateConfigError(null);
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="button-primary"
                      onClick={saveTemplateConfiguration}
                    >
                      <Save className="size-4" aria-hidden="true" />
                      Save templates
                    </button>
                  </div>
                </div>
                {templateConfigError ? (
                  <p role="alert" className="mt-3 text-sm font-bold text-[#a33c32]">
                    {templateConfigError}
                  </p>
                ) : null}
              </div>
            ) : null}
            {isProduct && referenceImage === "glarivo-blue-logo" ? (
              <div className="mt-3 flex items-center gap-3 rounded-xl border border-[#d8e5f7] bg-[#f7faff] p-3">
                <span className="relative h-10 w-20 shrink-0 overflow-hidden rounded-lg bg-white">
                  <Image
                    src="/brand/glarivo-logo-blue.png"
                    alt="Blue GLARIVO GLASSWARE logo reference"
                    fill
                    unoptimized
                    sizes="80px"
                    className="object-contain p-1"
                  />
                </span>
                <p className="text-xs font-bold leading-5 text-[var(--ink-muted)]">
                  This blue GLARIVO logo is attached as an additional reference image.
                </p>
              </div>
            ) : null}
          </div>

          {isProduct ? <label className="mt-5 block text-sm font-black">
            背景选择
            <select
              className="mt-2 h-11 w-full rounded-xl border border-[#ccd3ce] bg-white px-3 text-sm font-normal shadow-sm focus:border-[var(--accent)]"
              value={background}
              onChange={(event) => {
                setBackground(event.target.value);
                setGeneratedImage(null);
                setError(null);
              }}
              disabled={busy}
            >
              {BACKGROUND_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
            <span className="mt-2 block text-xs font-normal text-[var(--ink-muted)]">可单独更换背景，也可搭配去除图标或替换图标。鼠标移入预览图片可放大查看细节。</span>
          </label> : null}

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <label className="text-sm font-black">
              Image size
              <select
                className="mt-2 h-11 w-full rounded-xl border border-[#ccd3ce] bg-white px-3 text-sm font-normal shadow-sm focus:border-[var(--accent)]"
                value={size}
                onChange={(event) => {
                  setSize(event.target.value as ImageSize);
                  setGeneratedImage(null);
                }}
                disabled={busy}
              >
                {SIZE_OPTIONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>
            <label className="text-sm font-black">
              Quality
              <select
                className="mt-2 h-11 w-full rounded-xl border border-[#ccd3ce] bg-white px-3 text-sm font-normal shadow-sm focus:border-[var(--accent)]"
                value={quality}
                onChange={(event) => {
                  setQuality(event.target.value as ImageQuality);
                  setGeneratedImage(null);
                }}
                disabled={busy}
              >
                {QUALITY_OPTIONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>
            <label className="text-sm font-black">
              Output format
              <select
                className="mt-2 h-11 w-full rounded-xl border border-[#ccd3ce] bg-white px-3 text-sm font-normal shadow-sm focus:border-[var(--accent)]"
                value={outputFormat}
                onChange={(event) => {
                  setOutputFormat(event.target.value as OutputFormat);
                  setGeneratedImage(null);
                }}
                disabled={busy}
              >
                {OUTPUT_FORMAT_OPTIONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>
          </div>

          {error ? (
            <p
              role="alert"
              className="mt-5 rounded-xl border border-[#e7aaa3] bg-[#fff1ef] px-4 py-3 text-sm font-bold text-[#7d2e27]"
            >
              {error}
            </p>
          ) : null}
        </div>

        <footer className="flex flex-col-reverse gap-3 border-t border-[#e4e7e3] bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <p className="text-xs leading-5 text-[var(--ink-muted)]">
            Choose Use image to upload the result and {sourceImage ? "replace this image" : "add it"} in the form.
            {` Save the ${contentLabel} to persist the change.`}
          </p>
          <div className="flex shrink-0 flex-wrap justify-end gap-3">
            <button type="button" className="button-secondary" onClick={dismiss}>
              Cancel
            </button>
            <button
              type="button"
              className="button-secondary"
              onClick={generateImage}
              disabled={(!prompt.trim() && (!isProduct || background === "original")) || busy}
            >
              {generating ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <Sparkles className="size-4" aria-hidden="true" />
              )}
              {generating ? "Generating…" : generatedImage ? "Generate again" : "Generate"}
            </button>
            <button
              type="button"
              className="button-primary"
              onClick={finishEditing}
              disabled={!generatedImage || busy}
            >
              {finishing ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
              {finishing ? "Saving…" : "Use image"}
            </button>
          </div>
        </footer>
      </section>
    </div>,
    document.body,
  );
}
