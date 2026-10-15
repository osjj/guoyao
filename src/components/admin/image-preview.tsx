"use client";

import Image from "next/image";
import { X, ZoomIn } from "lucide-react";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

export function ImagePreviewDialog({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const trigger = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();

    // EditorJS listens on document capture, before React's dialog handlers.
    // Stop editor shortcuts here while retaining the dialog's native key behavior.
    const isolateKeyboard = (event: KeyboardEvent) => {
      event.stopPropagation();
      if (event.key === "Tab") {
        event.preventDefault();
        closeButtonRef.current?.focus();
      }
    };
    const isolateTransfer = (event: Event) => {
      event.preventDefault();
      event.stopPropagation();
    };
    window.addEventListener("keydown", isolateKeyboard, true);
    window.addEventListener("keyup", isolateKeyboard, true);
    window.addEventListener("paste", isolateTransfer, true);
    window.addEventListener("cut", isolateTransfer, true);
    window.addEventListener("drop", isolateTransfer, true);
    window.addEventListener("dragover", isolateTransfer, true);

    return () => {
      window.removeEventListener("keydown", isolateKeyboard, true);
      window.removeEventListener("keyup", isolateKeyboard, true);
      window.removeEventListener("paste", isolateTransfer, true);
      window.removeEventListener("cut", isolateTransfer, true);
      window.removeEventListener("drop", isolateTransfer, true);
      window.removeEventListener("dragover", isolateTransfer, true);
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (trigger instanceof HTMLElement && trigger.isConnected) {
        trigger.focus({ preventScroll: true });
      }
    };
  }, []);

  return createPortal(
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none bg-transparent p-3 text-white backdrop:bg-black/80 open:flex sm:p-6"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        event.stopPropagation();
        if (event.target === event.currentTarget) onClose();
      }}
      onKeyDown={(event) => event.stopPropagation()}
      onKeyUp={(event) => event.stopPropagation()}
      onPaste={(event) => event.stopPropagation()}
      onDrop={(event) => { event.preventDefault(); event.stopPropagation(); }}
      onDragOver={(event) => { event.preventDefault(); event.stopPropagation(); }}
    >
      <div className="m-auto flex h-full max-h-[960px] w-full max-w-7xl flex-col overflow-hidden rounded-2xl bg-[#161916] shadow-2xl">
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-white/15 px-4 py-2">
          <h2 id={titleId} className="text-sm font-bold">Image preview</h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close image preview"
            className="grid size-11 shrink-0 place-items-center rounded-full hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
        <div className="relative min-h-0 flex-1">
          {failed ? (
            <p role="alert" className="grid h-full place-items-center p-6 text-center text-sm">
              This image could not be loaded. Close the preview and check the image URL.
            </p>
          ) : (
            <Image
              src={src}
              alt={alt}
              fill
              unoptimized
              sizes="100vw"
              className="object-contain"
              draggable={false}
              onError={() => setFailed(true)}
            />
          )}
        </div>
      </div>
    </dialog>,
    document.body,
  );
}

export function ImagePreviewButton({
  src,
  alt,
  children,
  className = "",
}: {
  src: string;
  alt: string;
  children: ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-label={`Enlarge image: ${alt || "Image preview"}`}
        className={`relative block w-full cursor-zoom-in overflow-hidden text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${className}`}
        onClick={() => setOpen(true)}
      >
        {children}
        <span aria-hidden="true" className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1.5 text-xs font-bold text-white">
          <ZoomIn className="size-4" /> Enlarge
        </span>
      </button>
      {open && <ImagePreviewDialog key={src} src={src} alt={alt} onClose={() => setOpen(false)} />}
    </>
  );
}
