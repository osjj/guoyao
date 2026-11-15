# Inquiry conversion measurement

User request: complete inquiry conversion measurement and leave deployment to the user. This implements the conversion-measurement action approved in the SEO review.

Use the existing Guoyao Google tag and inquiry API. Emit the recommended `generate_lead` event only after a successful API acknowledgement that the inquiry is saved. Deduplicate by the existing submission UUID in page memory, including successful idempotent retries. Analytics failures must never alter the successful inquiry UI.

Record actual sales email and WhatsApp link activations as `contact_email` and `contact_whatsapp`. Keep these as contact-intent events, not successful inquiry key events. A single delegated listener covers the footer, contact rail, modal and page links; opening the WhatsApp picker does not count.

Use only fixed form, page-type and contact-location values. Never send customer fields, submission UUIDs, link URLs, phone numbers or query strings as custom event parameters. Do not invent a monetary value. Preserve development exclusion and do not send duplicate page views.

In GA4 property 560660345, register only `generate_lead` as a key event, once per event, using the code-based event flow. Keep the existing purchase setting untouched. No deployment, production form submissions, email messages, schema migrations or unrelated homepage changes.

Alternatives: automatic `form_submit` does not prove persistence; a server Measurement Protocol integration requires additional credentials and attribution work. The existing browser success callback is the smallest reliable integration. Separate email/WhatsApp event names make the two channels readable without adding custom dimensions.

Acceptance: success/retry deduplication, rejected responses, tracker failure isolation, contact allowlisting and parameter privacy pass automated tests. Verify a production build and browser behavior locally with analytics and inquiry requests intercepted. Production receipt is verified only after the user deploys.
