export type PageId =
  | "home"
  | "title-generator"
  | "tags-generator"
  | "description-generator"
  | "thumbnail-downloader"
  | "about"
  | "privacy-policy"
  | "terms-of-service";

export interface TitleResults {
  curiosity: string[];
  search: string[];
  emotional: string[];
  professional: string[];
  shorts: string[];
}

export interface TagsResult {
  tags: string[];
}

export interface DescriptionResult {
  hook: string;
  mainDescription: string;
  keywordsList: string[];
  callToAction: string;
  hashtags: string[];
  fullFormattedText: string;
}

export interface ThumbnailOption {
  key: "maxres" | "hq" | "mq" | "sd";
  label: string;
  resolution: string;
  aspectRatio: string;
  url: string;
  filename: string;
  badge: string;
  note?: string;
}

export interface ExtractedVideoInfo {
  videoId: string;
  originalUrl: string;
  thumbnails: ThumbnailOption[];
}
