import React, { useState } from "react";
import {
  Tag,
  Copy,
  Check,
  Plus,
  X,
  RefreshCw,
  Sparkles,
  ArrowRight,
  AlertCircle,
  FileText,
} from "lucide-react";
import { TagsResult } from "../types";
import { copyToClipboard } from "../utils/youtube";

interface TagsGeneratorProps {
  onShowToast: (msg: string, type?: "success" | "error" | "info") => void;
}

export const TagsGenerator: React.FC<TagsGeneratorProps> = ({ onShowToast }) => {
  const [topic, setTopic] = useState("");
  const [keyword, setKeyword] = useState("");
  const [generationRun, setGenerationRun] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [newCustomTag, setNewCustomTag] = useState("");
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedSingleIndex, setCopiedSingleIndex] = useState<number | null>(null);

  const sampleTopics = [
    { topic: "How to edit videos with CapCut on desktop", kw: "CapCut tutorial" },
    { topic: "Budget meal prep for muscle building", kw: "high protein meal prep" },
    { topic: "Passive income ideas for beginners in 2025", kw: "make money online" },
    { topic: "Mechanical keyboard build guide step by step", kw: "custom keyboard" },
  ];

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!topic.trim()) {
      setError("Please enter a video topic or title to generate tags.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/generate-tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic.trim(),
          keyword: keyword.trim() || undefined,
          variationSeed: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate tags. Please try again.");
      }

      const data: TagsResult = await response.json();
      setTags(data.tags || []);
      setGenerationRun((prev) => prev + 1);
      onShowToast(`Generated ${data.tags?.length || 0} fresh YouTube tags!`, "success");
    } catch (err: any) {
      setError(err.message || "An error occurred while generating tags.");
      onShowToast("Error generating tags", "error");
    } finally {
      setLoading(false);
    }
  };

  const commaSeparatedTags = tags.join(", ");
  const characterCount = commaSeparatedTags.length;
  const isOverLimit = characterCount > 500; // YouTube limit is 500 characters

  const handleCopyAll = async () => {
    if (tags.length === 0) return;
    const success = await copyToClipboard(commaSeparatedTags);
    if (success) {
      setCopiedAll(true);
      onShowToast("Copied all tags to clipboard!", "success");
      setTimeout(() => setCopiedAll(false), 2000);
    } else {
      onShowToast("Could not copy tags", "error");
    }
  };

  const handleCopySingle = async (tag: string, index: number) => {
    const success = await copyToClipboard(tag);
    if (success) {
      setCopiedSingleIndex(index);
      onShowToast(`Copied "${tag}"!`, "success");
      setTimeout(() => setCopiedSingleIndex(null), 2000);
    }
  };

  const handleRemoveTag = (index: number) => {
    const updated = tags.filter((_, i) => i !== index);
    setTags(updated);
  };

  const handleAddCustomTag = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newCustomTag.trim();
    if (!clean) return;
    if (tags.includes(clean.toLowerCase())) {
      onShowToast("Tag already in the list", "info");
      return;
    }
    setTags([...tags, clean]);
    setNewCustomTag("");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-3">
          <Tag className="w-3.5 h-3.5" />
          <span>YouTube Tags Generator</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Extract and Generate Targeted YouTube Video Tags
        </h1>
        <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed">
          Generate relevant keyword tags to help YouTube understand your video context and improve search discoverability.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" /> Video Details
            </h2>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label htmlFor="tags-topic-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Video Topic or Title <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="tags-topic-input"
                  rows={3}
                  value={topic}
                  onChange={(e) => {
                    setTopic(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="e.g. Best budget video editing setup for YouTube creators in 2025"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-slate-900 placeholder:text-slate-400 resize-none transition-shadow"
                />
              </div>

              <div>
                <label htmlFor="tags-keyword-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Focus Keyword <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  id="tags-keyword-input"
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="e.g. Video editing setup"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-slate-900 placeholder:text-slate-400 transition-shadow"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                id="generate-tags-btn"
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-600/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Generating Tags...
                  </>
                ) : (
                  <>
                    <Tag className="w-4 h-4" />
                    Generate Video Tags
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Quick Examples */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2.5">
              Quick Try Prompts
            </span>
            <div className="space-y-2">
              {sampleTopics.map((s, idx) => (
                <button
                  key={idx}
                  id={`sample-tags-prompt-${idx}`}
                  onClick={() => {
                    setTopic(s.topic);
                    setKeyword(s.kw);
                  }}
                  className="w-full text-left p-2.5 rounded-lg bg-white border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-colors text-xs text-slate-700 flex items-center justify-between group"
                >
                  <span className="truncate pr-2 font-medium">{s.topic}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Output Column */}
        <div className="lg:col-span-7">
          {tags.length === 0 && !loading && (
            <div className="h-full min-h-[420px] rounded-2xl border-2 border-dashed border-slate-200 bg-white p-8 flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <Tag className="w-7 h-7" />
              </div>
              <h3 className="text-base font-semibold text-slate-800">No Tags Generated Yet</h3>
              <p className="text-sm text-slate-500 max-w-sm mt-1 mb-5">
                Type your video title or subject above to get 15-20 curated search tags with YouTube's 500-char meter and one-click copy.
              </p>
              <button
                onClick={() => {
                  setTopic(sampleTopics[0].topic);
                  setKeyword(sampleTopics[0].kw);
                }}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
              >
                Load Sample Topic
              </button>
            </div>
          )}

          {loading && (
            <div className="h-full min-h-[420px] rounded-2xl border border-slate-200 bg-white p-8 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-12 h-12 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin" />
              <div>
                <p className="text-sm font-semibold text-slate-900">Finding high-intent YouTube tags...</p>
                <p className="text-xs text-slate-500 mt-1">Extracting search terms, broad category tags, and long-tail phrases.</p>
              </div>
            </div>
          )}

          {tags.length > 0 && !loading && (
            <div className="space-y-6">
              {/* Stats Bar and Copy All */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-slate-900">{tags.length} Tags Generated</span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          isOverLimit ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {characterCount} / 500 chars (YouTube Limit)
                      </span>
                      <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full border border-slate-200">
                        Run #{generationRun} · Varied
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Click any tag to copy it individually, or click the X to remove it.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      id="regenerate-fresh-tags-btn"
                      onClick={() => handleGenerate()}
                      className="px-3.5 py-2.5 rounded-xl font-semibold text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center gap-1.5 transition-colors"
                      title="Generate an alternative set of fresh tags"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Fresh Variation</span>
                    </button>

                    <button
                      id="copy-all-tags-btn"
                      onClick={handleCopyAll}
                      className={`px-4 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-2 shadow-sm transition-all ${
                        copiedAll
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-900 hover:bg-slate-800 text-white"
                      }`}
                    >
                      {copiedAll ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-200" />
                          <span>Copied All Tags!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy All Tags (Comma-Separated)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {isOverLimit && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                    <span>
                      Notice: Total character length ({characterCount}) exceeds YouTube's 500-character box limit. Click the (X) on less relevant tags below to bring it under 500.
                    </span>
                  </div>
                )}

                {/* Individual Tags Display */}
                <div className="pt-2 flex flex-wrap gap-2">
                  {tags.map((tag, idx) => {
                    const isCopied = copiedSingleIndex === idx;
                    return (
                      <div
                        key={idx}
                        className={`group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                          isCopied
                            ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                            : "bg-slate-50 text-slate-800 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50"
                        }`}
                      >
                        <button
                          id={`copy-tag-${idx}`}
                          onClick={() => handleCopySingle(tag, idx)}
                          className="flex items-center gap-1 focus:outline-none"
                          title="Click to copy tag"
                        >
                          {isCopied ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Tag className="w-3 h-3 text-slate-400 group-hover:text-emerald-600" />
                          )}
                          <span>{tag}</span>
                        </button>
                        <button
                          onClick={() => handleRemoveTag(idx)}
                          className="text-slate-400 hover:text-red-500 p-0.5 rounded transition-colors ml-1"
                          title="Remove tag"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Add Custom Tag Form */}
                <form onSubmit={handleAddCustomTag} className="pt-2 flex gap-2">
                  <input
                    type="text"
                    value={newCustomTag}
                    onChange={(e) => setNewCustomTag(e.target.value)}
                    placeholder="Add a custom tag (e.g. brand name, creator name)..."
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium rounded-xl flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </form>
              </div>

              {/* Single Comma-Separated Textarea Box */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-emerald-600" />
                    Comma-Separated Version (Paste directly into YouTube Studio)
                  </span>
                  <button
                    onClick={handleCopyAll}
                    className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" /> Copy Box
                  </button>
                </div>
                <textarea
                  id="comma-separated-tags-box"
                  rows={4}
                  readOnly
                  value={commaSeparatedTags}
                  className="w-full p-3 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl text-slate-700 resize-none focus:outline-none"
                  onClick={(e) => (e.target as HTMLTextAreaElement).select()}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
