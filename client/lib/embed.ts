export function getEmbedPath(formId: string) {
  return `/embed/${formId}`;
}

export function getEmbedUrl(formId: string, origin?: string) {
  const base = origin ?? (typeof window !== "undefined" ? window.location.origin : "");
  return `${base}${getEmbedPath(formId)}`;
}

export function getEmbedIframeCode(formId: string, origin?: string) {
  const embedUrl = getEmbedUrl(formId, origin);

  return `<iframe
  src="${embedUrl}"
  width="100%"
  height="600"
  style="border:0;"
  loading="lazy"
  title="Formly form"
></iframe>`;
}
