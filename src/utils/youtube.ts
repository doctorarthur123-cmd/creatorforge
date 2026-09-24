import { ThumbnailOption } from "../types";

/**
 * Extracts YouTube 11-character Video ID from virtually any YouTube URL format:
 * - standard: https://www.youtube.com/watch?v=ID
 * - short: https://youtu.be/ID
 * - shorts: https://youtube.com/shorts/ID
 * - embed: https://youtube.com/embed/ID
 * - live: https://youtube.com/live/ID
 * - mobile: https://m.youtube.com/watch?v=ID
 * - direct 11-character video ID
 */
export function extractYouTubeVideoId(input: string): string | null {
  if (!input || typeof input !== "string") return null;

  const trimmed = input.trim();

  // If user pasted raw 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Regex patterns covering standard, shorts, live, embed, youtu.be
  const patterns = [
    /(?:https?:\/\/)?(?:www\.|m\.)?youtube\.com\/watch\?(?:.*&)?v=([a-zA-Z0-9_-]{11})/,
    /(?:https?:\/\/)?(?:www\.|m\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    /(?:https?:\/\/)?(?:www\.|m\.)?youtube\.com\/live\/([a-zA-Z0-9_-]{11})/,
    /(?:https?:\/\/)?(?:www\.|m\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /(?:https?:\/\/)?(?:www\.|m\.)?youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
    /(?:https?:\/\/)?youtu\.be\/([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  // Fallback URL parser for irregular query strings
  try {
    const url = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
    if (url.hostname.includes("youtube.com")) {
      const v = url.searchParams.get("v");
      if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v;

      const pathParts = url.pathname.split("/").filter(Boolean);
      if (pathParts.length > 0) {
        const lastPart = pathParts[pathParts.length - 1];
        if (/^[a-zA-Z0-9_-]{11}$/.test(lastPart)) return lastPart;
      }
    } else if (url.hostname === "youtu.be") {
      const id = url.pathname.replace(/^\//, "");
      if (/^[a-zA-Z0-9_-]{11}$/.test(id)) return id;
    }
  } catch {
    // ignore URL parse errors
  }

  return null;
}

/**
 * Returns the list of standard resolution thumbnail options for a given YouTube Video ID
 */
export function getThumbnailOptions(videoId: string): ThumbnailOption[] {
  return [
    {
      key: "maxres",
      label: "Max Resolution",
      resolution: "1280 × 720 (HD)",
      aspectRatio: "16:9",
      url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      filename: `youtube-${videoId}-maxres-1280x720.jpg`,
      badge: "Best Quality",
      note: "Standard for HD 720p/1080p uploads",
    },
    {
      key: "sd",
      label: "Standard Quality",
      resolution: "640 × 480 (SD)",
      aspectRatio: "4:3",
      url: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
      filename: `youtube-${videoId}-standard-640x480.jpg`,
      badge: "Standard",
      note: "Clear 480p preview",
    },
    {
      key: "hq",
      label: "High Quality",
      resolution: "480 × 360",
      aspectRatio: "4:3",
      url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      filename: `youtube-${videoId}-hq-480x360.jpg`,
      badge: "Universal",
      note: "Available on 100% of YouTube videos",
    },
    {
      key: "mq",
      label: "Medium Quality",
      resolution: "320 × 180",
      aspectRatio: "16:9",
      url: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
      filename: `youtube-${videoId}-mq-320x180.jpg`,
      badge: "Compact",
      note: "Fast-loading mobile format",
    },
  ];
}

/**
 * Safely copies text to clipboard with modern API and execCommand fallback
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!text) return false;
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (err) {
    console.warn("Clipboard API failed, trying fallback execCommand:", err);
  }

  // Fallback for older browsers or sandboxed iframe environments
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);
    return successful;
  } catch (fallbackErr) {
    console.error("Fallback copy failed:", fallbackErr);
    return false;
  }
}

/**
 * Triggers direct browser download of the thumbnail image
 */
export async function triggerThumbnailDownload(imageUrl: string, filename: string): Promise<void> {
  // Method 1: Backend proxy endpoint which guarantees attachment header and avoids CORS
  const proxyUrl = `/api/download-thumbnail?url=${encodeURIComponent(imageUrl)}&filename=${encodeURIComponent(filename)}`;

  try {
    const response = await fetch(proxyUrl);
    if (response.ok) {
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
      return;
    }
  } catch (e) {
    console.warn("Proxy download failed, trying direct anchor download:", e);
  }

  // Method 2: Direct anchor with download attribute or new tab
  const a = document.createElement("a");
  a.href = imageUrl;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
