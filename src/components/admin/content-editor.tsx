"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { ImagePlus, Link2, Loader2 } from "lucide-react";
import type EditorJS from "@editorjs/editorjs";
import type { ArticleEditorData } from "@/lib/article-content";
import { ImagePreviewDialog } from "@/components/admin/image-preview";
import { AiImageEditorModal } from "@/components/admin/ai-image-editor-modal";
import type { AdminProductImageInput } from "@/types/admin-product";

export type ContentEditorRef = {
  save: () => Promise<ArticleEditorData | null>;
};

type ContentEditorProps = {
  value: ArticleEditorData;
  slug: string;
  imageAlt: string;
  placeholder?: string;
  uploadEndpoint?: "/api/admin/blog-images" | "/api/admin/product-images";
  contentLabel?: string;
  enableImagePreview?: boolean;
  enableAiImageEditing?: boolean;
  onAiEditingChange?: (editing: boolean) => void;
  disabled?: boolean;
};

function validImageUrl(value: string) {
  return value.startsWith("/") || /^https?:\/\//i.test(value);
}

export const ContentEditor = forwardRef<ContentEditorRef, ContentEditorProps>(
  function ContentEditor(
    {
      value,
      slug,
      imageAlt,
      placeholder = "Start writing your article…",
      uploadEndpoint = "/api/admin/blog-images",
      contentLabel = "article",
      enableImagePreview = false,
      enableAiImageEditing = false,
      onAiEditingChange,
      disabled = false,
    },
    ref,
  ) {
    const holderId = useId().replaceAll(":", "-");
    const editorRef = useRef<EditorJS | null>(null);
    const initialValueRef = useRef(value);
    const uploadContextRef = useRef({ slug, imageAlt });
    const [ready, setReady] = useState(false);
    const [imageUrl, setImageUrl] = useState("");
    const [imageError, setImageError] = useState<string | null>(null);
    const [previewImage, setPreviewImage] = useState<{ src: string; alt: string } | null>(null);
    const [aiTarget, setAiTarget] = useState<{ blockId: string; image: AdminProductImageInput } | null>(null);
    const aiTargetRef = useRef<typeof aiTarget>(null);
    const aiOpeningRef = useRef(false);
    const aiContextRef = useRef({ disabled, onAiEditingChange });

    useEffect(() => {
      aiContextRef.current = { disabled, onAiEditingChange };
    }, [disabled, onAiEditingChange]);

    const closeAiEditor = useCallback(() => {
      aiOpeningRef.current = false;
      aiTargetRef.current = null;
      setAiTarget(null);
      aiContextRef.current.onAiEditingChange?.(false);
    }, []);

    async function finishAiImageEdit(replacement: AdminProductImageInput) {
      const editor = editorRef.current;
      if (!editor || !aiTarget || aiTargetRef.current !== aiTarget) throw new Error("The selected image is no longer available.");
      const block = editor.blocks.getById(aiTarget.blockId);
      const saved = await block?.save();
      if (aiTargetRef.current !== aiTarget || editorRef.current !== editor) return;
      if (!saved || saved.data.file?.url !== aiTarget.image.url) {
        throw new Error("This image changed while the AI editor was open. Close and select it again.");
      }
      await editor.blocks.update(aiTarget.blockId, {
        ...saved.data,
        file: { ...saved.data.file, ...replacement },
      });
      if (aiTargetRef.current === aiTarget) closeAiEditor();
    }

    useEffect(() => {
      uploadContextRef.current = { slug, imageAlt };
    }, [slug, imageAlt]);

    useImperativeHandle(ref, () => ({
      async save() {
        if (!editorRef.current) return null;
        return (await editorRef.current.save()) as ArticleEditorData;
      },
    }));

    useEffect(() => {
      let editor: EditorJS | null = null;
      let cancelled = false;

      async function initialize() {
        await new Promise((resolve) => window.setTimeout(resolve, 0));
        if (cancelled || !document.getElementById(holderId)) return;

        const Editor = (await import("@editorjs/editorjs")).default;
        const Header = (await import("@editorjs/header")).default;
        const List = (await import("@editorjs/list")).default;
        const Paragraph = (await import("@editorjs/paragraph")).default;
        const Delimiter = (await import("@editorjs/delimiter")).default;
        const Quote = (await import("@editorjs/quote")).default;
        const ImageTool = (await import("@editorjs/image")).default;
        if (cancelled) return;

        editor = new Editor({
          holder: holderId,
          placeholder,
          data: initialValueRef.current,
          minHeight: 360,
          tools: {
            header: {
              class: Header as never,
              config: {
                placeholder: "Enter a heading",
                levels: [2, 3, 4],
                defaultLevel: 2,
              },
            },
            paragraph: { class: Paragraph as never, inlineToolbar: true },
            list: {
              class: List as never,
              inlineToolbar: true,
              config: { defaultStyle: "unordered" },
            },
            quote: {
              class: Quote as never,
              inlineToolbar: true,
              config: {
                quotePlaceholder: "Enter a quote",
                captionPlaceholder: "Quote source (optional)",
              },
            },
            delimiter: Delimiter as never,
            image: {
              class: ImageTool as never,
              config: {
                features: { caption: "optional" },
                uploader: {
                  async uploadByFile(file: File) {
                    try {
                      const formData = new FormData();
                      formData.set("image", file);
                      formData.set("slug", uploadContextRef.current.slug);
                      formData.set(
                        "alt",
                        uploadContextRef.current.imageAlt || file.name.replace(/\.[^.]+$/, ""),
                      );
                      const response = await fetch(uploadEndpoint, {
                        method: "POST",
                        body: formData,
                      });
                      const payload = (await response.json().catch(() => null)) as
                        | { image?: { url: string }; error?: string }
                        | null;
                      if (!response.ok || !payload?.image?.url) {
                        throw new Error(
                          payload?.error || `The ${contentLabel} image could not be uploaded.`,
                        );
                      }
                      setImageError(null);
                      return { success: 1, file: { url: payload.image.url } };
                    } catch (error) {
                      setImageError(
                        error instanceof Error
                          ? error.message
                          : `The ${contentLabel} image could not be uploaded.`,
                      );
                      return { success: 0, file: { url: "" } };
                    }
                  },
                  async uploadByUrl(url: string) {
                    const trimmed = url.trim();
                    if (!validImageUrl(trimmed)) {
                      setImageError("Use an http(s) image URL or a site path beginning with /.");
                      return { success: 0, file: { url: "" } };
                    }
                    setImageError(null);
                    return { success: 1, file: { url: trimmed } };
                  },
                },
              },
            },
          },
        });

        await editor.isReady;
        if (cancelled) {
          editor.destroy();
          return;
        }
        editorRef.current = editor;
        setReady(true);
      }

      void initialize().catch((error) => {
        console.error(`${contentLabel} editor failed to initialize`, error);
        setImageError(`The ${contentLabel} editor could not be loaded. Refresh the page and try again.`);
      });

      return () => {
        cancelled = true;
        setReady(false);
        if (editor) {
          try {
            editor.destroy();
          } catch {
            // EditorJS may already have torn down during Fast Refresh.
          }
        }
        editorRef.current = null;
      };
    }, [contentLabel, holderId, placeholder, uploadEndpoint]);

    useEffect(() => {
      if (!enableImagePreview || !ready) return;
      const holder = document.getElementById(holderId);
      if (!holder) return;

      const selector = "img.image-tool__image-picture";
      const attributes = ["role", "tabindex", "aria-label", "aria-haspopup", "title"];
      const originalAttributes = new Map<HTMLImageElement, (string | null)[]>();

      const prepareImages = () => {
        holder.querySelectorAll<HTMLImageElement>(selector).forEach((image) => {
          if (originalAttributes.has(image)) return;
          originalAttributes.set(image, attributes.map((attribute) => image.getAttribute(attribute)));
          image.setAttribute("role", "button");
          image.tabIndex = 0;
          image.setAttribute("aria-label", "Enlarge image");
          image.setAttribute("aria-haspopup", "dialog");
          image.title = "Click to enlarge image";
        });
      };

      const openImage = (event: Event) => {
        const target = event.target;
        if (!(target instanceof HTMLImageElement) || !holder.contains(target) || !target.matches(selector)) return;
        if (event instanceof KeyboardEvent && event.key !== "Enter" && event.key !== " ") return;
        const src = target.currentSrc || target.getAttribute("src");
        if (!src) return;

        // Keep preview activation out of EditorJS shortcuts and the surrounding form.
        event.preventDefault();
        event.stopPropagation();
        target.focus({ preventScroll: true });
        const caption = target.closest(".image-tool")?.querySelector(".image-tool__caption")?.textContent;
        setPreviewImage({ src, alt: target.alt || caption?.trim() || imageAlt || "Article image" });
      };

      // EditorJS owns these nodes, including images added after the editor becomes ready.
      prepareImages();
      const observer = new MutationObserver(prepareImages);
      observer.observe(holder, { childList: true, subtree: true });
      holder.addEventListener("click", openImage, true);
      // EditorJS also captures keys on document, so intercept preview keys at window first.
      window.addEventListener("keydown", openImage, true);

      return () => {
        observer.disconnect();
        holder.removeEventListener("click", openImage, true);
        window.removeEventListener("keydown", openImage, true);
        originalAttributes.forEach((values, image) => {
          attributes.forEach((attribute, index) => {
            const originalValue = values[index];
            if (originalValue === null) image.removeAttribute(attribute);
            else image.setAttribute(attribute, originalValue);
          });
        });
      };
    }, [enableImagePreview, holderId, imageAlt, ready]);

    useEffect(() => {
      if (!enableAiImageEditing || !ready) return;
      const holder = document.getElementById(holderId);
      if (!holder) return;
      let cancelled = false;
      const buttons = new Set<HTMLButtonElement>();
      const prepareImages = () => {
        holder.querySelectorAll<HTMLElement>(".image-tool").forEach((tool) => {
          if (!tool.querySelector("img.image-tool__image-picture") || tool.querySelector("[data-ai-image-edit]")) return;
          const button = document.createElement("button");
          button.type = "button";
          button.dataset.aiImageEdit = "true";
          button.textContent = "AI 编辑";
          button.setAttribute("aria-haspopup", "dialog");
          button.className = "button-secondary my-3";
          button.disabled = aiContextRef.current.disabled;
          tool.append(button);
          buttons.add(button);
        });
      };
      const openAiEditor = async (event: Event) => {
        const target = event.target;
        if (!(target instanceof Element)) return;
        const button = target.closest<HTMLButtonElement>("[data-ai-image-edit]");
        if (!button || !holder.contains(button)) return;
        if (event instanceof KeyboardEvent && event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        event.stopPropagation();
        if (aiContextRef.current.disabled || aiOpeningRef.current) return;
        const block = editorRef.current?.blocks.getBlockByElement(button);
        if (!block || block.name !== "image") return;
        button.focus({ preventScroll: true });
        aiOpeningRef.current = true;
        aiContextRef.current.onAiEditingChange?.(true);
        try {
          const saved = await block.save();
          if (cancelled) return;
          const url = saved?.data.file?.url;
          if (typeof url !== "string" || !url) throw new Error("Select an image before using AI editing.");
          const caption = button.closest(".image-tool")?.querySelector(".image-tool__caption")?.textContent;
          const target = { blockId: block.id, image: { url, alt: saved?.data.file?.alt || caption?.trim() || uploadContextRef.current.imageAlt || "Article image" } };
          aiTargetRef.current = target;
          setAiTarget(target);
          setImageError(null);
        } catch (error) {
          if (cancelled) return;
          closeAiEditor();
          setImageError(error instanceof Error ? error.message : "The image could not be opened.");
        }
      };
      prepareImages();
      const observer = new MutationObserver(prepareImages);
      observer.observe(holder, { childList: true, subtree: true });
      holder.addEventListener("click", openAiEditor, true);
      window.addEventListener("keydown", openAiEditor, true);
      return () => {
        cancelled = true;
        observer.disconnect();
        holder.removeEventListener("click", openAiEditor, true);
        window.removeEventListener("keydown", openAiEditor, true);
        buttons.forEach(button => button.remove());
        if (aiOpeningRef.current) {
          aiOpeningRef.current = false;
          aiTargetRef.current = null;
          aiContextRef.current.onAiEditingChange?.(false);
        }
      };
    }, [closeAiEditor, enableAiImageEditing, holderId, ready]);

    useEffect(() => {
      document.getElementById(holderId)?.querySelectorAll<HTMLButtonElement>("[data-ai-image-edit]").forEach(button => {
        button.disabled = disabled;
      });
    }, [disabled, holderId]);

    const insertImageUrl = useCallback(() => {
      const trimmed = imageUrl.trim();
      if (!validImageUrl(trimmed)) {
        setImageError("Use an http(s) image URL or a site path beginning with /.");
        return;
      }
      if (!editorRef.current) {
        setImageError("Wait for the editor to finish loading.");
        return;
      }

      editorRef.current.blocks.insert("image", {
        file: { url: trimmed },
        caption: "",
        withBorder: false,
        withBackground: false,
        stretched: false,
      });
      setImageUrl("");
      setImageError(null);
    }, [imageUrl]);

    return (
      <div className="space-y-4">
        <div className="flex flex-col gap-3 rounded-2xl border border-[#d7dcd8] bg-[#f8f9f7] p-4 lg:flex-row lg:items-end">
          <label className="min-w-0 flex-1 text-sm font-black">
            Add {contentLabel} image from URL
            <span className="relative mt-2 block">
              <Link2 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--ink-muted)]" />
              <input
                className="h-11 w-full rounded-xl border border-[#ccd3ce] bg-white pl-10 pr-3 text-sm shadow-sm focus:border-[var(--accent)]"
                type="url"
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    insertImageUrl();
                  }
                }}
                placeholder="https://example.com/detail-image.jpg"
              />
            </span>
          </label>
          <button
            type="button"
            className="button-secondary h-11 shrink-0"
            onClick={insertImageUrl}
            disabled={!ready}
          >
            <ImagePlus className="size-4" /> Add to content
          </button>
        </div>

        {imageError ? (
          <p role="alert" className="text-sm font-bold text-[#a33c32]">
            {imageError}
          </p>
        ) : null}

        <div
          className={`article-editor-shell relative min-h-[28rem] rounded-2xl border border-[#ccd3ce] bg-white px-3 py-5 shadow-sm sm:px-6 ${enableImagePreview ? "[&_img.image-tool__image-picture]:cursor-zoom-in [&_img.image-tool__image-picture:focus-visible]:outline-2 [&_img.image-tool__image-picture:focus-visible]:outline-offset-[-2px] [&_img.image-tool__image-picture:focus-visible]:outline-[var(--accent)]" : ""}`}
        >
          {!ready ? (
            <div className="absolute inset-x-0 top-6 flex items-center justify-center gap-2 text-sm font-bold text-[var(--ink-muted)]">
              <Loader2 className="size-4 animate-spin" /> Loading article editor…
            </div>
          ) : null}
          <div id={holderId} />
        </div>

        <p className="text-xs leading-5 text-[var(--ink-muted)]">
          Select text for bold, italic, or link tools. Use the + button for headings, lists,
          quotes, dividers, and image upload. Image files are converted to WebP and require R2;
          image URLs work without R2.
          {enableImagePreview ? " Click an image to enlarge it." : null}
        </p>
        {enableImagePreview && previewImage ? (
          <ImagePreviewDialog
            src={previewImage.src}
            alt={previewImage.alt}
            onClose={() => setPreviewImage(null)}
          />
        ) : null}
        {aiTarget ? (
          <AiImageEditorModal
            open
            usage="blog"
            sourceImage={aiTarget.image}
            slug={slug}
            onClose={closeAiEditor}
            onFinish={finishAiImageEdit}
          />
        ) : null}
      </div>
    );
  },
);
