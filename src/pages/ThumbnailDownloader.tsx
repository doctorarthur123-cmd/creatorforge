import React, { useState } from "react";
import {
  ImageDown,
  ExternalLink,
  Download,
  Copy,
  Check,
  AlertCircle,
  Play,
  ArrowRight,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { ExtractedVideoInfo, ThumbnailOption } from "../types";
import {
  extractYouTubeVideoId,
  getThumbnailOptions,
  triggerThumbnailDownload,
  copyToClipboard,
} from "../utils/youtube";

interface ThumbnailDownloaderProps {
  onShowToast: (msg: string, type?: "success" | "error" | "info") => void;
}

export const ThumbnailDownloader: React.FC<ThumbnailDownloaderProps> = ({ onShowToast }) => {
  const [urlInput, setUrlInput] = useState("");
  const [videoInfo, setVideoInfo] = useState<ExtractedVideoInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [downloadingKey, setDownloadingKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const sampleUrls = [
    { label: "Standard Video", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    { label: "Short URL (youtu.be)", url: "https://youtu.be/jNQXAC9IVRw" },
    { label: "YouTube Shorts", url: "https://www.youtube.com/shorts/3-W5K_W3f7s" },
  ];

  const handleProcessUrl = (urlToUse?: string) => {
    const raw = (urlToUse !== undefined ? urlToUse : urlInput).trim();
    if (!raw) {
      setError("Please paste a YouTube video or Shorts link.");
      setVideoInfo(null);
      return;
    }

    const videoId = extractYouTubeVideoId(raw);
    if (!videoId) {
      setError(
        "Could not detect a valid YouTube video ID. Please check the URL format (e.g. https://www.youtube.com/watch?v=..., https://youtu.be/..., or https://youtube.com/shorts/...)."
      );
      setVideoInfo(null);
      return;
    }

    setError(null);
    setFailedImages({});
    const thumbs = getThumbnailOptions(videoId);
    setVideoInfo({
      videoId,
      originalUrl: raw,
      thumbnails: thumbs,
    });
    onShowToast(`Found video (${videoId})! Loading thumbnail options...`, "success");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleProcessUrl();
  };

  const handleDownload = async (thumb: ThumbnailOption) => {
    setDownloadingKey(thumb.key);
    try {
      await triggerThumbnailDownload(thumb.url, thumb.filename);
      onShowToast(`Downloading ${thumb.label}...`, "success");
    } catch {
      onShowToast("Failed to initiate download", "error");
    } finally {
      setDownloadingKey(null);
    }
  };

  const handleCopyUrl = async (thumb: ThumbnailOption) => {
    const success = await copyToClipboard(thumb.url);
    if (success) {
      setCopiedKey(thumb.key);
      onShowToast(`Copied ${thumb.label} URL!`, "success");
      setTimeout(() => setCopiedKey(null), 2000);
    } else {
      onShowToast("Could not copy URL", "error");
    }
  };

  const handleImageError = (key: string) => {
    setFailedImages((prev) => ({ ...prev, [key]: true }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 mb-3">
          <ImageDown className="w-3.5 h-3.5" />
          <span>YouTube Thumbnail Downloader</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Preview and Download YouTube Thumbnails in Full HD
        </h1>
        <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed">
          Grab high-resolution cover images from any YouTube video, Shorts, or livestream URL. Supports Maximum Resolution (1080p/720p), Standard, and HQ qualities.
        </p>
      </div>

      {/* URL Input Form */}
      <div className="max-w-3xl mx-auto mb-10">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="thumbnail-url-input"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2"
              >
                Enter YouTube Video, Shorts, or youtu.be Link
              </label>
              <div className="flex flex-col sm:flex-row gap-2.5">
                <input
                  id="thumbnail-url-input"
                  type="text"
                  value={urlInput}
                  onChange={(e) => {
                    setUrlInput(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm text-slate-900 placeholder:text-slate-400"
                />
                <button
                  id="get-thumbnails-btn"
                  type="submit"
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm rounded-xl shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 transition-colors shrink-0"
                >
                  <ImageDown className="w-4 h-4" />
                  <span>Get Thumbnails</span>
                </button>
              </div>
            </div>

            {/* Error banner */}
            {error && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            {/* Quick sample URLs */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="font-medium">Try sample video:</span>
              {sampleUrls.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  id={`sample-thumb-btn-${idx}`}
                  onClick={() => {
                    setUrlInput(s.url);
                    handleProcessUrl(s.url);
                  }}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors font-medium"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </form>
        </div>
      </div>

      {/* Results Section */}
      {videoInfo && (
        <div className="space-y-8">
          {/* Video summary header */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-red-600 text-white text-[11px] font-bold uppercase">
                  YouTube ID
                </span>
                <span className="font-mono text-sm font-semibold">{videoInfo.videoId}</span>
              </div>
              <p className="text-xs text-slate-400 truncate max-w-md">
                Source: {videoInfo.originalUrl}
              </p>
            </div>
            <a
              href={`https://www.youtube.com/watch?v=${videoInfo.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 flex items-center gap-1.5 transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-current" /> Watch on YouTube
            </a>
          </div>

          {/* Thumbnail Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {videoInfo.thumbnails.map((thumb) => {
              const isFailed = failedImages[thumb.key];
              const isDownloading = downloadingKey === thumb.key;
              const isCopied = copiedKey === thumb.key;

              return (
                <div
                  key={thumb.key}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between"
                >
                  {/* Top info */}
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900">{thumb.label}</h3>
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full">
                          {thumb.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {thumb.resolution} ({thumb.aspectRatio}) · {thumb.note}
                      </p>
                    </div>
                  </div>

                  {/* Image Preview Container */}
                  <div className="relative bg-slate-900 aspect-video flex items-center justify-center overflow-hidden group">
                    {isFailed ? (
                      <div className="text-center p-6 text-slate-400">
                        <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-500" />
                        <p className="text-xs font-medium">Resolution not available for this upload</p>
                        <p className="text-[11px] text-slate-500 mt-1">
                          YouTube generates MaxRes thumbnails only for videos uploaded in 720p or above. Use Standard or HQ below.
                        </p>
                      </div>
                    ) : (
                      <>
                        <img
                          src={thumb.url}
                          alt={`${thumb.label} thumbnail preview`}
                          referrerPolicy="no-referrer"
                          onError={() => handleImageError(thumb.key)}
                          className="w-full h-full object-contain"
                        />
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <a
                            href={thumb.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 rounded-xl bg-white/90 hover:bg-white text-slate-900 text-xs font-semibold flex items-center gap-1.5 shadow-lg backdrop-blur-xs transition-transform transform scale-95 group-hover:scale-100"
                          >
                            <ExternalLink className="w-3.5 h-3.5" /> Open Full Image
                          </a>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      id={`copy-url-${thumb.key}`}
                      onClick={() => handleCopyUrl(thumb)}
                      disabled={isFailed}
                      className="px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700 flex items-center gap-1.5 disabled:opacity-40 transition-colors"
                      title="Copy Direct Image URL"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy URL</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-2">
                      <a
                        id={`open-tab-${thumb.key}`}
                        href={thumb.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700 flex items-center gap-1.5 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">View</span>
                      </a>

                      <button
                        id={`download-thumb-${thumb.key}`}
                        onClick={() => handleDownload(thumb)}
                        disabled={isFailed || isDownloading}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm disabled:opacity-40 transition-colors"
                      >
                        {isDownloading ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Downloading...</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-3.5 h-3.5" />
                            <span>Download Image</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State Instructions */}
      {!videoInfo && (
        <div className="max-w-3xl mx-auto rounded-2xl border-2 border-dashed border-slate-200 bg-white p-10 text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
            <ImageDown className="w-7 h-7" />
          </div>
          <h3 className="text-base font-semibold text-slate-800">Ready to Download Thumbnails</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-6">
            Paste any YouTube video link into the box above to extract and download high quality cover art for your inspiration, thumbnails redesign, or study.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left max-w-lg mx-auto">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-700 block mb-1">Max Resolution</span>
              <span className="text-xs text-slate-500">1280 × 720 HD format for crisp displays</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-700 block mb-1">Universal HQ</span>
              <span className="text-xs text-slate-500">Available across 100% of YouTube uploads</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-700 block mb-1">Shorts Ready</span>
              <span className="text-xs text-slate-500">Works with youtube.com/shorts URLs</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
