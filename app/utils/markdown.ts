import { Remarkable } from "remarkable";

const escapeHtml = (text: string) =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

// Posts are markdown, but PostStream has no images: `![alt](url)` renders as
// a plain link, so nothing loads from a third-party server. Raw HTML stays
// escaped (Remarkable's default) and javascript: links are refused.
const markdown = new Remarkable();

markdown.renderer.rules.image = (tokens, idx) => {
  const { src, alt } = tokens[idx] as { src: string; alt: string };
  return `<a href="${escapeHtml(src)}">${escapeHtml(alt || src)}</a>`;
};

export const renderPostHtml = (body: string) => markdown.render(body);
