"use client";

import { createContext, useContext, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { ArrowRight, CheckCircle2, X } from "lucide-react";
import { ChatTeardropText, EnvelopeSimple, WhatsappLogo } from "@phosphor-icons/react";
import { inquiryAttribution, inquiryMessage, inquirySchema, SALES_EMAIL, SALES_WHATSAPP, type InquiryContext } from "@/lib/inquiries";
import styles from "./inquiry-contact.module.css";

const InquiryContextValue = createContext<(product?: InquiryContext) => void>(() => {});

export function InquiryButton({ children, className, product }: { children: ReactNode; className?: string; product?: InquiryContext }) {
  const open = useContext(InquiryContextValue);
  return <button type="button" className={className} onClick={() => open(product)} aria-haspopup="dialog">{children}</button>;
}

export function InquiryProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [request, setRequest] = useState<{ id: string; product?: InquiryContext; sourcePath: string; productSlug?: string } | null>(null);
  function open(product?: InquiryContext) {
    const context = inquiryAttribution(pathname, window.location.search, product);
    setRequest({ id: crypto.randomUUID(), sourcePath: context.sourcePath, productSlug: context.productSlug,
      product: product ? { ...product, slug: context.productSlug, brief: context.brief } : undefined });
  }
  return <InquiryContextValue.Provider value={open}>
    {children}
    <aside className={styles.rail} aria-label="Project enquiries">
      <a href={`mailto:${SALES_EMAIL}`} aria-label={`Email ${SALES_EMAIL}`} title={SALES_EMAIL}><EnvelopeSimple size={21} weight="regular" aria-hidden="true" /></a>
      <a href={SALES_WHATSAPP} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp +86 18825913441" title="WhatsApp +86 18825913441"><WhatsappLogo size={22} weight="regular" aria-hidden="true" /></a>
      <button className={styles.inquire} type="button" onClick={() => open()} aria-label="Discuss a project" aria-haspopup="dialog"><ChatTeardropText size={21} weight="regular" aria-hidden="true" /><span>Discuss a project</span></button>
    </aside>
    {request && <InquiryModal key={request.id} submissionId={request.id} product={request.product} sourcePath={request.sourcePath} productSlug={request.productSlug} onClose={() => setRequest(null)} />}
  </InquiryContextValue.Provider>;
}

function InquiryModal({ submissionId, product, sourcePath, productSlug, onClose }: { submissionId: string; product?: InquiryContext; sourcePath: string; productSlug?: string; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const submitting = useRef(false);
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [values, setValues] = useState({ email: "", countryCode: "", phone: "", name: "", companyName: "", message: inquiryMessage(product), website: "" });

  useEffect(() => {
    const element = dialog.current;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    const previousRootOverflow = document.documentElement.style.overflow;
    element?.showModal();
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => { element?.close(); document.body.style.overflow = previousOverflow; document.documentElement.style.overflow = previousRootOverflow; if (previousFocus?.isConnected) previousFocus.focus(); };
  }, []);

  function change(field: keyof typeof values, value: string) { setValues((current) => ({ ...current, [field]: value })); }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    setError("");
    const parsed = inquirySchema.safeParse({ ...values, email: values.email.trim(), submissionId, sourcePath, productSlug });
    if (!parsed.success) { setError(parsed.error.issues[0].message); return; }
    submitting.current = true;
    setBusy(true);
    try {
      const response = await fetch("/api/inquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed.data), signal: AbortSignal.timeout(20000) });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || "Your request could not be saved. Please try again.");
      setSuccess(true);
    } catch (cause) {
      setError(cause instanceof Error && cause.name !== "TimeoutError" ? cause.message : "The request timed out. Please retry; your inquiry will not be saved twice.");
    } finally { submitting.current = false; setBusy(false); }
  }

  return <dialog ref={dialog} className={styles.dialog} aria-labelledby="inquiry-title" aria-describedby={success ? "inquiry-received" : "inquiry-description"} onCancel={(event) => { event.preventDefault(); if (!busy) onClose(); }} onClick={(event) => { if (event.target === event.currentTarget && !busy) onClose(); }}>
    <div className={styles.panel}>
      <button type="button" className={styles.close} aria-label="Close inquiry" disabled={busy} onClick={onClose}><X size={23} /></button>
      {success ? <div className={styles.success} role="status">
        <CheckCircle2 size={48} aria-hidden="true" />
        <p className={styles.kicker}>A CONVERSATION BEGINS</p>
        <h2 id="inquiry-title">Your project enquiry<br />has been received.</h2>
        <p id="inquiry-received">Thank you for sharing the details. Your message and contact information have been saved for our team to review.</p>
        <button type="button" className={styles.submit} onClick={onClose}>Continue exploring <ArrowRight size={18} /></button>
      </div> : <>
        <div className={styles.intro}>
          <p className={styles.kicker}>LET’S TALK MATERIALS</p>
          <h2 id="inquiry-title">Start with<br /> an idea.</h2>
          <p id="inquiry-description" className={styles.description}>Tell us about the space, the material, and the detail you have in mind.</p>
          <div className={styles.directContact}>
            <span>Prefer a direct conversation?</span>
            <a href={`mailto:${SALES_EMAIL}`}><EnvelopeSimple size={18} aria-hidden="true" />{SALES_EMAIL}</a>
            <a href={SALES_WHATSAPP} target="_blank" rel="noopener noreferrer"><WhatsappLogo size={19} aria-hidden="true" />+86 18825913441</a>
          </div>
          <p className={styles.note}>Project context is a good place to begin. Drawings, dimensions and finish references can follow in the conversation.</p>
        </div>
        <form className={styles.form} onSubmit={submit} aria-busy={busy}>
          {product && <p className={styles.product}>{product.name}{product.sku ? ` · ${product.sku}` : ""}</p>}
          <fieldset disabled={busy} className={styles.fields}>
            <label className={`${styles.field} ${styles.fullWidth}`}><span>Email <b>*</b></span><div className={styles.inputWrap}>
              <input autoFocus name="email" type="email" autoComplete="email" required maxLength={100} placeholder="you@company.com" value={values.email} onChange={(e) => change("email", e.target.value)} />
            </div></label>
            <label className={styles.field}><span>Name <b>*</b></span><div className={styles.inputWrap}><input name="name" autoComplete="name" required maxLength={100} placeholder="Your name" value={values.name} onChange={(e) => change("name", e.target.value)} /></div></label>
            <label className={styles.field}><span>Company <em>(optional)</em></span><div className={styles.inputWrap}><input name="companyName" autoComplete="organization" maxLength={200} placeholder="Company or studio" value={values.companyName} onChange={(e) => change("companyName", e.target.value)} /></div></label>
            <div className={`${styles.field} ${styles.fullWidth}`}><label htmlFor="inquiry-phone">Mobile / WhatsApp <em>(optional)</em></label>
              <div className={styles.phoneRow}>
                <input name="countryCode" aria-label="Country calling code" type="tel" list="inquiry-country-codes" placeholder="Code" autoComplete="tel-country-code" maxLength={5} value={values.countryCode} onChange={(e) => change("countryCode", e.target.value)} />
                <datalist id="inquiry-country-codes">
                  {[["+1", "US / Canada"], ["+44", "UK"], ["+86", "China"], ["+91", "India"], ["+971", "UAE"], ["+966", "Saudi Arabia"], ["+20", "Egypt"], ["+49", "Germany"], ["+33", "France"], ["+61", "Australia"], ["+55", "Brazil"], ["+27", "South Africa"], ["+234", "Nigeria"], ["+7", "Russia / Kazakhstan"], ["+90", "Türkiye"], ["+62", "Indonesia"], ["+60", "Malaysia"], ["+65", "Singapore"], ["+81", "Japan"], ["+82", "South Korea"]].map(([code, country]) => <option key={code} value={code}>{country}</option>)}
                </datalist>
                <div className={styles.inputWrap}><input id="inquiry-phone" name="phone" type="tel" autoComplete="tel-national" maxLength={100} placeholder="Mobile number" value={values.phone} onChange={(e) => change("phone", e.target.value)} /></div>
              </div>
              <p className={styles.hint}>Select or enter your country code, e.g. +86.</p>
            </div>
            <label className={`${styles.field} ${styles.fullWidth}`}><span>Project details <b>*</b></span><div className={styles.inputWrap}><textarea name="message" required maxLength={1000} rows={product?.brief ? 8 : 5} placeholder="Share your project context, materials, approximate dimensions, and the finish you have in mind." value={values.message} onChange={(e) => change("message", e.target.value)} /><small>{values.message.length}/1000</small></div></label>
            <label className={styles.trap} aria-hidden="true">Website<input tabIndex={-1} autoComplete="off" name="website" value={values.website} onChange={(e) => change("website", e.target.value)} /></label>
          </fieldset>
          {error && <p className={styles.error} role="alert">{error}</p>}
          <button className={styles.submit} type="submit" disabled={busy}>{busy ? "Sending your enquiry…" : "Send project enquiry"}<ArrowRight size={20} aria-hidden="true" /></button>
          <p className={styles.privacy}>We use your contact details to respond to this inquiry.</p>
        </form>
      </>}
    </div>
  </dialog>;
}
