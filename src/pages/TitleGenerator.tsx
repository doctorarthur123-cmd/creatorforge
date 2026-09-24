import React, { useState } from "react";
import {
  Sparkles,
  Copy,
  Check,
  Search,
  Flame,
  Briefcase,
  Smartphone,
  HelpCircle,
  RefreshCw,
  Zap,
  ArrowRight,
} from "lucide-react";
import { TitleResults } from "../types";
import { copyToClipboard } from "../utils/youtube";

interface TitleGeneratorProps {
  onShowToast: (msg: string, type?: "success" | "error" | "info") => void;
}

export const TitleGenerator: React.FC<TitleGeneratorProps> = ({ onShowToast }) => {
  const [topic, setTopic] = useState("");
  const [keyword, setKeyword] = useState("");
  const [audience, setAudience] = useState("");
  const [creativeAngle, setCreativeAngle] = useState("auto");
  const [generationRun, setGenerationRun] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<TitleResults | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const sampleTopics = [
    { topic: "How to edit videos in DaVinci Resolve", kw: "DaVinci Resolve tutorial", aud: "Beginner editors" },
    { topic: "Minimalist productivity habits that actually work", kw: "productivity habits", aud: "Busy professionals" },
    { topic: "Why most creators fail in their first 90 days", kw: "YouTube growth tips", aud: "New creators" },
    { topic: "Budget street photography guide", kw: "street photography camera", aud: "Hobbyist photographers" },
  ];

  const handleGenerate = async (e?: React.FormEvent, forcedAngle?: string) => {
    if (e) e.preventDefault();
    if (!topic.trim()) {
      setError("Please enter a video topic to generate titles.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const activeAngle = forcedAngle || creativeAngle;
      const response = await fetch("/api/generate-titles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic.trim(),
          keyword: keyword.trim() || undefined,
          audience: audience.trim() || undefined,
          creativeAngle: activeAngle,
          variationSeed: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate titles. Please try again.");
      }

      const data: TitleResults = await response.json();
      setResults(data);
      setGenerationRun((prev) => prev + 1);
      onShowToast("Fresh titles generated successfully!", "success");
    } catch (err: any) {
      setError(err.message || "An error occurred while generating titles.");
      onShowToast("Error generating titles", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (title: string, id: string) => {
    const success = await copyToClipboard(title);
    if (success) {
      setCopiedIndex(id);
      onShowToast("Copied title to clipboard!", "success");
      setTimeout(() => setCopiedIndex(null), 2000);
    } else {
      onShowToast("Could not copy title", "error");
    }
  };

  const handleCopyCategory = async (titles: string[], categoryName: string) => {
    const text = titles.join("\n");
    const success = await copyToClipboard(text);
    if (success) {
      onShowToast(`Copied all ${categoryName} titles!`, "success");
    }
  };

  const styleCategories = [
    {
      key: "curiosity" as const,
      label: "Curiosity & High-CTR",
      badge: "Click Magnet",
      badgeColor: "bg-purple-100 text-purple-700 border-purple-200",
      icon: <HelpCircle className="w-4 h-4 text-purple-600" />,
      desc: "Creates curiosity gaps that compel viewers to click without false clickbait.",
    },
    {
      key: "search" as const,
      label: "Search & SEO-Focused",
      badge: "Evergreen Views",
      badgeColor: "bg-blue-100 text-blue-700 border-blue-200",
      icon: <Search className="w-4 h-4 text-blue-600" />,
      desc: "Targeted queries optimized for YouTube search suggestions and Google SEO.",
    },
    {
      key: "emotional" as const,
      label: "Emotional & Relatable",
      badge: "High Engagement",
      badgeColor: "bg-rose-100 text-rose-700 border-rose-200",
      icon: <Flame className="w-4 h-4 text-rose-600" />,
      desc: "Connects with viewer desires, fears, challenges, and personal transformation.",
    },
    {
      key: "professional" as const,
      label: "Professional & Authority",
      badge: "Expert Credibility",
      badgeColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
      icon: <Briefcase className="w-4 h-4 text-emerald-600" />,
      desc: "Clean, authoritative, framework and tutorial titles for established brands.",
    },
    {
      key: "shorts" as const,
      label: "Shorts & Punchy",
      badge: "Mobile-First",
      badgeColor: "bg-amber-100 text-amber-700 border-amber-200",
      icon: <Smartphone className="w-4 h-4 text-amber-600" />,
      desc: "Short, high-energy hooks engineered for YouTube Shorts and mobile feeds.",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>YouTube Title Generator</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Generate High-CTR YouTube Titles in 5 Distinct Styles
        </h1>
        <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed">
          Transform your video idea into catchy, SEO-friendly titles designed for maximum click-through rates. Free forever, no signup required.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-red-500" /> Video Details
            </h2>

            <form onSubmit={handleGenerate} className="space-y-4">
              {/* Topic Input */}
              <div>
                <label htmlFor="topic-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Video Topic or Core Idea <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="topic-input"
                  rows={3}
                  value={topic}
                  onChange={(e) => {
                    setTopic(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="e.g. How to learn coding with Python from scratch in 2025"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm text-slate-900 placeholder:text-slate-400 resize-none transition-shadow"
                />
              </div>

              {/* Keyword Input */}
              <div>
                <label htmlFor="keyword-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Target Keyword <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  id="keyword-input"
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="e.g. Python for beginners"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm text-slate-900 placeholder:text-slate-400 transition-shadow"
                />
              </div>

              {/* Audience Input */}
              <div>
                <label htmlFor="audience-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Target Audience / Niche <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  id="audience-input"
                  type="text"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  placeholder="e.g. College students, self-taught developers"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm text-slate-900 placeholder:text-slate-400 transition-shadow"
                />
              </div>

              {/* Creative Lens / Angle Selector */}
              <div>
                <label htmlFor="angle-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Creative Angle & Lens <span className="text-slate-400 font-normal">(Freshness Driver)</span>
                </label>
                <select
                  id="angle-input"
                  value={creativeAngle}
                  onChange={(e) => setCreativeAngle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm text-slate-900 bg-white transition-shadow"
                >
                  <option value="auto">🎲 Auto (Fresh & Varied Every Run)</option>
                  <option value="Curiosity gap, psychological hook & counter-intuitive reveal">🔍 Curiosity Gaps & Surprising Truths</option>
                  <option value="High-efficiency workflow, secret frameworks & systems">⚡ High-Efficiency Systems & Frameworks</option>
                  <option value="Contrarian & myth-busting analysis vs. conventional advice">🛡️ Contrarian & Myth-Busting Analysis</option>
                  <option value="Deep-dive case study, experiment, or practical breakthrough">🔬 Deep-Dive Case Study & Experiments</option>
                  <option value="Beginner reality-check and transformative roadmap">🚀 Beginner Reality-Check & Roadmap</option>
                  <option value="Tactical masterclass with actionable milestones">🎓 Tactical Masterclass with Milestones</option>
                </select>
                <p className="text-[11px] text-slate-400 mt-1">
                  Every request synthesizes completely unique wording, hooks, and perspectives tailored to your topic.
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                id="generate-titles-btn"
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm shadow-md shadow-red-600/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Generating Unique Title Ideas...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Fresh Titles
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
                  id={`sample-title-prompt-${idx}`}
                  onClick={() => {
                    setTopic(s.topic);
                    setKeyword(s.kw);
                    setAudience(s.aud);
                  }}
                  className="w-full text-left p-2.5 rounded-lg bg-white border border-slate-200 hover:border-red-300 hover:bg-red-50/50 transition-colors text-xs text-slate-700 flex items-center justify-between group"
                >
                  <span className="truncate pr-2 font-medium">{s.topic}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-500 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Output Column */}
        <div className="lg:col-span-7">
          {!results && !loading && (
            <div className="h-full min-h-[420px] rounded-2xl border-2 border-dashed border-slate-200 bg-white p-8 flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mb-4">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-base font-semibold text-slate-800">No Titles Generated Yet</h3>
              <p className="text-sm text-slate-500 max-w-sm mt-1 mb-5">
                Enter your video topic on the left and click "Generate Titles" to receive curiosity, search, emotional, professional, and Shorts titles.
              </p>
              <button
                onClick={() => {
                  setTopic(sampleTopics[0].topic);
                  setKeyword(sampleTopics[0].kw);
                  setAudience(sampleTopics[0].aud);
                }}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
              >
                Load Sample Prompt
              </button>
            </div>
          )}

          {loading && (
            <div className="h-full min-h-[420px] rounded-2xl border border-slate-200 bg-white p-8 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-12 h-12 rounded-full border-4 border-red-200 border-t-red-600 animate-spin" />
              <div>
                <p className="text-sm font-semibold text-slate-900">Crafting high-CTR YouTube titles...</p>
                <p className="text-xs text-slate-500 mt-1">Analyzing curiosity hooks, search patterns, and mobile length.</p>
              </div>
            </div>
          )}

          {results && !loading && (
            <div className="space-y-6">
              {/* Fresh Variations Bar */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">Unique Title Variations</h3>
                      <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                        Run #{generationRun} · Anti-Duplicate Active
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Each generation explores novel hooks, sentence syntax, and creative angles.
                    </p>
                  </div>
                </div>

                <button
                  id="regenerate-fresh-titles-btn"
                  onClick={() => handleGenerate()}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Generate Fresh Ideas
                </button>
              </div>

              {styleCategories.map((cat) => {
                const list = results[cat.key] || [];
                return (
                  <div
                    key={cat.key}
                    className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
                  >
                    <div className="px-5 py-3.5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {cat.icon}
                        <h3 className="text-sm font-bold text-slate-900">{cat.label}</h3>
                        <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border ${cat.badgeColor}`}>
                          {cat.badge}
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopyCategory(list, cat.label)}
                        className="text-xs text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1 transition-colors"
                        title="Copy all titles in this category"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy All</span>
                      </button>
                    </div>

                    <div className="p-4 divide-y divide-slate-100">
                      {list.map((title, i) => {
                        const copyId = `${cat.key}-${i}`;
                        const isCopied = copiedIndex === copyId;
                        const charCount = title.length;
                        const isOptimalLength = charCount >= 40 && charCount <= 70;

                        return (
                          <div
                            key={i}
                            className="py-3 first:pt-0 last:pb-0 flex items-start justify-between gap-4 group"
                          >
                            <div className="space-y-1 pr-2">
                              <p className="text-sm font-medium text-slate-900 leading-snug group-hover:text-red-700 transition-colors">
                                {title}
                              </p>
                              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                                <span className={isOptimalLength ? "text-emerald-600 font-medium" : "text-slate-500"}>
                                  {charCount} chars {isOptimalLength ? "• Ideal length" : ""}
                                </span>
                              </div>
                            </div>
                            <button
                              id={`copy-title-${cat.key}-${i}`}
                              onClick={() => handleCopy(title, copyId)}
                              className={`shrink-0 p-2 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all ${
                                isCopied
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                              }`}
                              title="Copy this title"
                            >
                              {isCopied ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  <span className="hidden sm:inline">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span className="hidden sm:inline">Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
