import { useEffect } from "react";
import { PageId } from "../types";

interface Props {
  page: PageId;
}

const PAGE_METADATA: Record<PageId, { title: string; description: string }> = {
  home: {
    title: "CreatorTools Hub – Free YouTube Title, Tags, Description & Thumbnail Tools",
    description: "All-in-one free toolkit for YouTube creators. Generate high-CTR titles, optimize SEO tags, write structured descriptions, and download HD video thumbnails.",
  },
  "title-generator": {
    title: "YouTube Title Generator (Curiosity, Search, Emotional, Shorts) – CreatorTools Hub",
    description: "Generate high-click-through-rate YouTube video titles across 5 distinct styles: Curiosity, Search-focused, Emotional, Professional, and Shorts.",
  },
  "tags-generator": {
    title: "YouTube Tags Generator & SEO Tag Finder – CreatorTools Hub",
    description: "Extract and generate targeted, high-ranking YouTube video tags. Copy individual tags or all comma-separated tags with one click.",
  },
  "description-generator": {
    title: "YouTube Description Generator with Timestamps & Hashtags – CreatorTools Hub",
    description: "Create natural, high-converting YouTube descriptions with hooks, timestamp placeholders, call-to-actions, and hashtags.",
  },
  "thumbnail-downloader": {
    title: "YouTube Thumbnail Downloader HD & 4K Preview – CreatorTools Hub",
    description: "Easily download YouTube video thumbnails in Max Resolution (1280x720), Standard Quality, and HQ from any YouTube video or Shorts URL.",
  },
  about: {
    title: "About CreatorTools Hub – Our Mission & Creator Platform",
    description: "Learn about CreatorTools Hub, our mission to empower YouTube creators with modern, free, accessible productivity tools.",
  },
  "privacy-policy": {
    title: "Privacy Policy – CreatorTools Hub",
    description: "Read the CreatorTools Hub privacy policy. We prioritize creator data privacy with no tracking of video drafts.",
  },
  "terms-of-service": {
    title: "Terms of Service – CreatorTools Hub",
    description: "Terms and conditions for utilizing CreatorTools Hub free online YouTube creator tools.",
  },
};

export function SEOHead({ page }: Props) {
  useEffect(() => {
    const meta = PAGE_METADATA[page] || PAGE_METADATA.home;
    document.title = meta.title;

    let descEl = document.querySelector('meta[name="description"]');
    if (!descEl) {
      descEl = document.createElement("meta");
      descEl.setAttribute("name", "description");
      document.head.appendChild(descEl);
    }
    descEl.setAttribute("content", meta.description);

    let ogTitleEl = document.querySelector('meta[property="og:title"]');
    if (ogTitleEl) ogTitleEl.setAttribute("content", meta.title);

    let ogDescEl = document.querySelector('meta[property="og:description"]');
    if (ogDescEl) ogDescEl.setAttribute("content", meta.description);

    // Scroll to top on navigation change
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  return null;
}
