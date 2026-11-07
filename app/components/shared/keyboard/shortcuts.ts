import { useEffect } from "react";

// Single-key shortcuts, like a terminal app. WCAG 2.1.4 requires a way to turn
// single-key shortcuts off (speech input can trigger them), so the footer has
// a switch and the choice is remembered.
const STORAGE_KEY = "poststream:shortcuts";

export const shortcutsEnabled = (): boolean => {
  try {
    return localStorage.getItem(STORAGE_KEY) !== "off";
  } catch {
    return true; // storage blocked (private mode): fall back to the default
  }
};

export const setShortcutsEnabled = (enabled: boolean) => {
  try {
    localStorage.setItem(STORAGE_KEY, enabled ? "on" : "off");
  } catch {
    // Storage blocked: the switch still works until the page reloads
  }
};

const isTyping = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));

const moveBetweenPosts = (step: 1 | -1) => {
  const posts = [...document.querySelectorAll<HTMLElement>("main article")];
  if (posts.length === 0) return;
  const current = posts.indexOf(document.activeElement?.closest("article") as HTMLElement);
  const next = posts[Math.min(posts.length - 1, Math.max(0, current === -1 ? 0 : current + step))];
  next.focus();
  next.scrollIntoView({ block: "nearest" });
};

// j / k: next / previous post. n: new post. r: reply to the selected post.
export const useKeyboardShortcuts = (isEnabled: () => boolean = shortcutsEnabled) => {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!isEnabled() || event.metaKey || event.ctrlKey || event.altKey || isTyping(event.target)) {
        return;
      }
      if (event.key === "j") moveBetweenPosts(1);
      else if (event.key === "k") moveBetweenPosts(-1);
      else if (event.key === "n") document.getElementById("new-post")?.focus();
      else if (event.key === "r") {
        const post = document.activeElement?.closest("article");
        const reply = [...(post?.querySelectorAll("button") ?? [])].find((b) => b.textContent === "reply");
        reply?.click();
      } else return;
      event.preventDefault();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isEnabled]);
};
