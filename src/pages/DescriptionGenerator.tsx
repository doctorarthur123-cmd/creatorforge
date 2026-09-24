import React, { useState } from "react";
import {
  FileText,
  Copy,
  Check,
  RefreshCw,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Hash,
  Share2,
  ListOrdered,
  Eye,
  Edit3,
} from "lucide-react";
import { DescriptionResult } from "../types";
import { copyToClipboard } from "../utils/youtube";

interface DescriptionGeneratorProps {
  onShowToast: (msg: string, type?: "success" | "error" | "info") => void;
}

export const DescriptionGenerator: React.FC<DescriptionGeneratorProps> = ({ onShowToast }) => {
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [cta, setCta] = useState("");
  const [creativeAngle, setCreativeAngle] = useState("auto");
  const [generationRun, setGenerationRun] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DescriptionResult | null>(null);
  const [editableFullText, setEditableFullText] = useState("");
  const [activeTab, setActiveTab] = useState<"preview" | "breakdown">("preview");
  const [copiedFull, setCopiedFull] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const samplePresets = [
    {
      title: "How I Built a $10k/Month Software in 30 Days (Solo Developer)",
      topic: "Solo SaaS development journey and marketing stack",
      kw: "micro saas, solo developer, build in public, indiehacker",
      cta: "Grab the free Notion development roadmap template linked below!",
    },
    {
      title: "The Ultimate Guide to Color Grading in Premiere Pro",
      topic: "Complete color correction and LUT tutorial for filmmakers",
      kw: "color grading, premiere pro tutorial, lumetri color, cinematic look",
      cta: "Download my 5 free cinematic LUTs in the description!",
    },
    {
      title: "10 Coffee Brewing Mistakes You're Making Every Morning",
      topic: "Home barista techniques for better espresso and pour-over",
      kw: "coffee brewing, pour over tips, espresso grind size, specialty coffee",
      cta: "Drop a comment with your favorite coffee bean origin!",
    },
  ];

  const handleGenerate = async (e?: React.FormEvent, forcedAngle?: string) => {
    if (e) e.preventDefault();
    if (!title.trim() || !topic.trim()) {
      setError("Please provide both a video title and topic.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const activeAngle = forcedAngle || creativeAngle;
      const response = await fetch("/api/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          topic: topic.trim(),
          keywords: keywords.trim() || undefined,
          cta: cta.trim() || undefined,
          creativeAngle: activeAngle,
          variationSeed: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate description. Please try again.");
      }

      const data: DescriptionResult = await response.json();
      setResult(data);
      setEditableFullText(data.fullFormattedText);
      setGenerationRun((prev) => prev + 1);
      onShowToast("Generated fresh YouTube description!", "success");
    } catch (err: any) {
      setError(err.message || "An error occurred while generating description.");
      onShowToast("Error generating description", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyFull = async () => {
    const textToCopy = editableFullText || result?.fullFormattedText || "";
    if (!textToCopy) return;

    const success = await copyToClipboard(textToCopy);
    if (success) {
      setCopiedFull(true);
      onShowToast("Copied full description to clipboard!", "success");
      setTimeout(() => setCopiedFull(false), 2000);
    } else {
      onShowToast("Could not copy description", "error");
    }
  };

  const handleCopyPart = async (text: string, sectionId: string, name: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedSection(sectionId);
      onShowToast(`Copied ${name}!`, "success");
      setTimeout(() => setCopiedSection(null), 2000);
    }
  };

  const wordCount = editableFullText.trim() ? editableFullText.trim().split(/\s+/).length : 0;
  const charCount = editableFullText.length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-3">
          <FileText className="w-3.5 h-3.5" />
          <span>YouTube Description Generator</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Write Natural, High-Converting YouTube Descriptions
        </h1>
        <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed">
          Craft complete descriptions featuring opening hooks, structured video overviews, timestamp markers, calls to action, and strategic hashtags.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" /> Description Parameters
            </h2>

            <form onSubmit={handleGenerate} className="space-y-4">
              {/* Title */}
              <div>
                <label htmlFor="desc-title-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Video Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="desc-title-input"
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="e.g. 10 Essential Productivity Habits for Creators"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-slate-900 placeholder:text-slate-400 transition-shadow"
                />
              </div>

              {/* Topic */}
              <div>
                <label htmlFor="desc-topic-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Video Topic & Main Summary <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="desc-topic-input"
                  rows={3}
                  value={topic}
                  onChange={(e) => {
                    setTopic(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Briefly explain what happens in the video, tools demonstrated, key results..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-slate-900 placeholder:text-slate-400 resize-none transition-shadow"
                />
              </div>

              {/* Keywords */}
              <div>
                <label htmlFor="desc-keywords-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Keywords to Include <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  id="desc-keywords-input"
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="e.g. productivity tips, creator workflow, time management"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-slate-900 placeholder:text-slate-400 transition-shadow"
                />
              </div>

              {/* CTA */}
              <div>
                <label htmlFor="desc-cta-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Custom Call to Action <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  id="desc-cta-input"
                  type="text"
                  value={cta}
                  onChange={(e) => setCta(e.target.value)}
                  placeholder="e.g. Subscribe and grab the free cheat sheet template below!"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-slate-900 placeholder:text-slate-400 transition-shadow"
                />
              </div>

              {/* Narrative Angle Selector */}
              <div>
                <label htmlFor="desc-angle-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Narrative Angle & Tone <span className="text-slate-400 font-normal">(Freshness Driver)</span>
                </label>
                <select
                  id="desc-angle-input"
                  value={creativeAngle}
                  onChange={(e) => setCreativeAngle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-slate-900 bg-white transition-shadow"
                >
                  <option value="auto">🎲 Auto (Fresh & Varied Every Run)</option>
                  <option value="Tactical walkthrough and actionable execution">⚡ Tactical Walkthrough & Action Steps</option>
                  <option value="Step-by-step masterclass with clear milestones">🎓 Step-by-Step Masterclass with Milestones</option>
                  <option value="Myth-busting and solving critical roadblocks">🛡️ Myth-Busting & Critical Roadblocks</option>
                  <option value="Candid case study and real-world results">🔬 Candid Case Study & Tangible Results</option>
                </select>
                <p className="text-[11px] text-slate-400 mt-1">
                  Prevents generic templates. Ensures varied hooks, outline structures, and vocabulary on each run.
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                id="generate-description-btn"
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-600/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Generating Fresh Description...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    Generate Fresh Description
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Presets */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2.5">
              Quick Presets
            </span>
            <div className="space-y-2">
              {samplePresets.map((p, idx) => (
                <button
                  key={idx}
                  id={`sample-desc-preset-${idx}`}
                  onClick={() => {
                    setTitle(p.title);
                    setTopic(p.topic);
                    setKeywords(p.kw);
                    setCta(p.cta);
                  }}
                  className="w-full text-left p-2.5 rounded-lg bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-colors text-xs text-slate-700 flex items-center justify-between group"
                >
                  <span className="truncate pr-2 font-medium">{p.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Output Column */}
        <div className="lg:col-span-7">
          {!result && !loading && (
            <div className="h-full min-h-[440px] rounded-2xl border-2 border-dashed border-slate-200 bg-white p-8 flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <FileText className="w-7 h-7" />
              </div>
              <h3 className="text-base font-semibold text-slate-800">No Description Drafted Yet</h3>
              <p className="text-sm text-slate-500 max-w-sm mt-1 mb-5">
                Fill in your video title and topic on the left. We'll generate an opening hook, structured chapters outline, CTA, and hashtags.
              </p>
              <button
                onClick={() => {
                  setTitle(samplePresets[0].title);
                  setTopic(samplePresets[0].topic);
                  setKeywords(samplePresets[0].kw);
                  setCta(samplePresets[0].cta);
                }}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
              >
                Load Sample Video Preset
              </button>
            </div>
          )}

          {loading && (
            <div className="h-full min-h-[440px] rounded-2xl border border-slate-200 bg-white p-8 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
              <div>
                <p className="text-sm font-semibold text-slate-900">Drafting full YouTube description...</p>
                <p className="text-xs text-slate-500 mt-1">Formulating opening hook, key takeaways, timestamp guide, and hashtags.</p>
              </div>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-4">
              {/* Header Bar with Tabs and Copy All Button */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                  <button
                    id="desc-tab-preview"
                    onClick={() => setActiveTab("preview")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      activeTab === "preview" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Full Description & Editor
                  </button>
                  <button
                    id="desc-tab-breakdown"
                    onClick={() => setActiveTab("breakdown")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      activeTab === "breakdown" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <ListOrdered className="w-3.5 h-3.5" /> Structured Sections
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 px-2 py-1 rounded-full border border-blue-200 hidden md:inline">
                    Run #{generationRun} · Anti-Duplicate Active
                  </span>
                  <span className="text-xs text-slate-500 hidden sm:inline">
                    {wordCount} words
                  </span>
                  <button
                    id="regenerate-fresh-description-btn"
                    onClick={() => handleGenerate()}
                    className="px-3.5 py-2 rounded-xl font-semibold text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center gap-1.5 transition-colors"
                    title="Draft an entirely new angle and fresh hook"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Fresh Draft</span>
                  </button>
                  <button
                    id="copy-description-btn"
                    onClick={handleCopyFull}
                    className={`px-4 py-2 rounded-xl font-semibold text-xs flex items-center gap-2 shadow-sm transition-all ${
                      copiedFull
                        ? "bg-emerald-600 text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    {copiedFull ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Description</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Tab 1: Live Editable Full Textarea */}
              {activeTab === "preview" && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold text-slate-700 flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-blue-500" />
                      Ready-to-Paste YouTube Studio Description
                    </span>
                    <span>You can edit text directly below before copying</span>
                  </div>

                  <textarea
                    id="full-description-textarea"
                    rows={16}
                    value={editableFullText}
                    onChange={(e) => setEditableFullText(e.target.value)}
                    className="w-full p-4 text-xs sm:text-sm font-sans text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 leading-relaxed resize-y"
                  />
                </div>
              )}

              {/* Tab 2: Structured Breakdown */}
              {activeTab === "breakdown" && (
                <div className="space-y-4">
                  {/* Hook */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Opening Hook (Above the fold)
                      </span>
                      <button
                        onClick={() => handleCopyPart(result.hook, "hook", "Hook")}
                        className="text-xs text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1"
                      >
                        {copiedSection === "hook" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        Copy Hook
                      </button>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                      {result.hook}
                    </p>
                  </div>

                  {/* Main Body & Timestamps */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                        <ListOrdered className="w-3.5 h-3.5 text-blue-600" /> Main Overview & Timestamps
                      </span>
                      <button
                        onClick={() => handleCopyPart(result.mainDescription, "main", "Main Overview")}
                        className="text-xs text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1"
                      >
                        {copiedSection === "main" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        Copy Overview
                      </button>
                    </div>
                    <pre className="text-xs sm:text-sm font-sans text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-100 whitespace-pre-wrap leading-relaxed">
                      {result.mainDescription}
                    </pre>
                  </div>

                  {/* CTA */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                        <Share2 className="w-3.5 h-3.5 text-emerald-600" /> Call to Action
                      </span>
                      <button
                        onClick={() => handleCopyPart(result.callToAction, "cta", "Call to Action")}
                        className="text-xs text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1"
                      >
                        {copiedSection === "cta" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        Copy CTA
                      </button>
                    </div>
                    <pre className="text-xs sm:text-sm font-sans text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-100 whitespace-pre-wrap leading-relaxed">
                      {result.callToAction}
                    </pre>
                  </div>

                  {/* Hashtags */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                        <Hash className="w-3.5 h-3.5 text-amber-600" /> YouTube Hashtags
                      </span>
                      <button
                        onClick={() => handleCopyPart(result.hashtags.join(" "), "hashtags", "Hashtags")}
                        className="text-xs text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1"
                      >
                        {copiedSection === "hashtags" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        Copy Hashtags
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {result.hashtags.map((ht, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-medium"
                        >
                          {ht}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
