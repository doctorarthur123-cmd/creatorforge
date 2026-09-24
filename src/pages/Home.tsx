import React from "react";
import {
  Sparkles,
  Tag,
  FileText,
  ImageDown,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  HelpCircle,
  Play,
  Layers,
  Search,
  Sliders,
} from "lucide-react";
import { PageId } from "../types";

interface HomeProps {
  onNavigate: (page: PageId) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const tools = [
    {
      id: "title-generator" as PageId,
      name: "YouTube Title Generator",
      tagline: "High-CTR Titles in 5 Distinct Creative Styles",
      desc: "Generate curiosity hooks, SEO search queries, emotional stories, professional masterclass titles, and punchy Shorts titles tailored to your niche.",
      icon: <Sparkles className="w-6 h-6 text-red-600" />,
      badge: "CTR Optimization",
      badgeColor: "bg-red-50 text-red-700 border-red-200",
      color: "hover:border-red-300",
      accent: "text-red-600",
      features: [
        "Curiosity, Search, Emotional, Pro & Shorts styles",
        "Character length & mobile cutoff meter",
        "One-click copy for every variation",
      ],
      btnText: "Generate Titles",
      btnClass: "bg-red-600 hover:bg-red-700 text-white",
    },
    {
      id: "tags-generator" as PageId,
      name: "YouTube Tags Generator",
      tagline: "Targeted SEO Keywords & Search Tags",
      desc: "Uncover high-intent search tags, broad category keywords, and long-tail query phrases with YouTube's 500-character limit counter.",
      icon: <Tag className="w-6 h-6 text-emerald-600" />,
      badge: "Search Discoverability",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      color: "hover:border-emerald-300",
      accent: "text-emerald-600",
      features: [
        "15–20 targeted tags in seconds",
        "Individual tag chips + comma-separated box",
        "Interactive 500-char YouTube limit counter",
      ],
      btnText: "Generate Tags",
      btnClass: "bg-emerald-600 hover:bg-emerald-700 text-white",
    },
    {
      id: "description-generator" as PageId,
      name: "YouTube Description Writer",
      tagline: "Structured Descriptions with Timestamps & CTAs",
      desc: "Create natural, audience-friendly descriptions containing compelling hooks, chapter timestamp placeholders, call-to-action blocks, and hashtags.",
      icon: <FileText className="w-6 h-6 text-blue-600" />,
      badge: "Viewer Retention",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
      color: "hover:border-blue-300",
      accent: "text-blue-600",
      features: [
        "Above-the-fold opening hook",
        "Key takeaways & timestamp outline",
        "Relevant hashtags & live in-app text editor",
      ],
      btnText: "Write Description",
      btnClass: "bg-blue-600 hover:bg-blue-700 text-white",
    },
    {
      id: "thumbnail-downloader" as PageId,
      name: "Thumbnail Downloader",
      tagline: "Instant HD & 4K Preview and Direct Download",
      desc: "Extract maximum resolution (1280×720 HD), standard, and high-quality cover thumbnails directly from any YouTube video, Shorts, or youtu.be URL.",
      icon: <ImageDown className="w-6 h-6 text-amber-600" />,
      badge: "Asset Extractor",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
      color: "hover:border-amber-300",
      accent: "text-amber-600",
      features: [
        "Supports standard URLs, Shorts, and youtu.be",
        "MaxRes HD, Standard & HQ quality tiers",
        "One-click direct browser download",
      ],
      btnText: "Download Thumbnails",
      btnClass: "bg-amber-500 hover:bg-amber-600 text-white",
    },
  ];

  const workflowSteps = [
    {
      step: "01",
      title: "Hook With Titles",
      desc: "Test 5 different angles (curiosity, search, emotion, authority, shorts) to pick the highest-converting title.",
    },
    {
      step: "02",
      title: "Optimize Search Tags",
      desc: "Generate 20 relevant tags to give YouTube's recommendation engine accurate contextual signals.",
    },
    {
      step: "03",
      title: "Structure Description",
      desc: "Format your description with strong hooks, clear chapters, social links, and relevant hashtags.",
    },
    {
      step: "04",
      title: "Inspect Thumbnails",
      desc: "Extract HD cover images from competitor videos to study design patterns and benchmark contrast.",
    },
  ];

  const faqs = [
    {
      q: "Are all tools on CreatorTools Hub completely free?",
      a: "Yes. Every tool—Title Generator, Tags Generator, Description Writer, and Thumbnail Downloader—is 100% free to use with no account, paywall, or credit card required.",
    },
    {
      q: "Do generated titles or tags guarantee more views or subscribers?",
      a: "No algorithmic tool can guarantee YouTube views. Views depend on viewer retention, topic market demand, thumbnail design, and audio/video quality. Our tools provide proven frameworks, keyword optimization, and inspiration to help you save time.",
    },
    {
      q: "What types of YouTube URLs work with the Thumbnail Downloader?",
      a: "The downloader supports all standard YouTube formats: regular desktop links (youtube.com/watch?v=...), mobile links (m.youtube.com), shortened youtu.be links, and vertical YouTube Shorts URLs.",
    },
    {
      q: "How does the YouTube Title Generator determine styles?",
      a: "Our engine categorizes title ideas into 5 psychological formats: Curiosity (creates an intriguing knowledge gap), Search (matches high-intent YouTube search terms), Emotional (connects to viewer feelings), Professional (authority tutorials), and Shorts (punchy, energetic hooks under 50 characters).",
    },
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden border-b border-slate-200/80 bg-gradient-to-b from-white via-slate-50/50 to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200 mb-6 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <span>Modern Production Toolkit for Video Creators</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.15]">
            Supercharge Your <span className="text-red-600">YouTube Workflow</span> With Free Creator Tools
          </h1>

          <p className="mt-5 max-w-2xl mx-auto text-base sm:text-xl text-slate-600 font-normal leading-relaxed">
            Generate high-CTR titles, optimize search tags, draft complete descriptions with timestamps, and download HD thumbnails. No signups, no watermarks.
          </p>

          {/* Quick CTA Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              id="hero-start-titles-btn"
              onClick={() => onNavigate("title-generator")}
              className="px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm shadow-md shadow-red-600/20 flex items-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Explore Title Generator</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              id="hero-start-thumbs-btn"
              onClick={() => onNavigate("thumbnail-downloader")}
              className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm border border-slate-300 shadow-xs flex items-center gap-2 transition-all"
            >
              <ImageDown className="w-4 h-4 text-amber-500" />
              <span>Download Thumbnails</span>
            </button>
          </div>

          {/* Value Badges */}
          <div className="mt-12 pt-8 border-t border-slate-200/70 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <div>
                <span className="text-xs font-bold text-slate-900 block">100% Free</span>
                <span className="text-[11px] text-slate-500">No paid tiers</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
              <div>
                <span className="text-xs font-bold text-slate-900 block">No Account</span>
                <span className="text-[11px] text-slate-500">Zero login friction</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Zap className="w-5 h-5 text-emerald-500 shrink-0" />
              <div>
                <span className="text-xs font-bold text-slate-900 block">Instant Export</span>
                <span className="text-[11px] text-slate-500">One-click clipboard</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Play className="w-5 h-5 text-emerald-500 shrink-0" />
              <div>
                <span className="text-xs font-bold text-slate-900 block">Shorts & Long-Form</span>
                <span className="text-[11px] text-slate-500">All YouTube formats</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Tool Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
            Explore the 4 Creator Utilities
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Dedicated standalone tools designed specifically for YouTube creators, editors, and growth managers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tools.map((tool) => (
            <div
              key={tool.id}
              className={`bg-white rounded-2xl border border-slate-200 p-7 shadow-sm transition-all hover:shadow-md flex flex-col justify-between ${tool.color}`}
            >
              <div>
                {/* Card Header */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-slate-100/90">{tool.icon}</div>
                  <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${tool.badgeColor}`}>
                    {tool.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-950 mb-1">{tool.name}</h3>
                <p className={`text-xs font-semibold ${tool.accent} mb-3`}>{tool.tagline}</p>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">{tool.desc}</p>

                {/* Feature bullets */}
                <ul className="space-y-2 mb-6 text-xs text-slate-600 border-t border-slate-100 pt-4">
                  {tool.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action button */}
              <button
                id={`home-open-${tool.id}`}
                onClick={() => onNavigate(tool.id)}
                className={`w-full py-3 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors ${tool.btnClass}`}
              >
                <span>{tool.btnText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Creator Workflow Section */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-red-400 block mb-2">
              The Creator Pipeline
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Publish Smarter In 4 Seamless Steps
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              How YouTube creators use CreatorTools Hub to polish every upload in under 3 minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflowSteps.map((step, idx) => (
              <div key={idx} className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/60 relative">
                <span className="text-3xl font-black text-red-500/30 block mb-2 font-mono">
                  {step.step}
                </span>
                <h3 className="text-base font-bold text-white mb-2">{step.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Everything you need to know about using CreatorTools Hub.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-2 flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{faq.q}</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-6">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-3xl p-8 sm:p-12 text-center shadow-xl shadow-red-600/10">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-3">
            Ready to Upgrade Your YouTube Video Preparation?
          </h2>
          <p className="max-w-xl mx-auto text-sm sm:text-base text-red-100 mb-8">
            Pick any tool above and try it instantly. Free, lightweight, and engineered for high-performance creators.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onNavigate("title-generator")}
              className="px-6 py-3 bg-white text-red-600 hover:bg-red-50 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-colors"
            >
              Start With Title Generator
            </button>
            <button
              onClick={() => onNavigate("tags-generator")}
              className="px-6 py-3 bg-red-800/60 hover:bg-red-800 text-white font-bold text-xs sm:text-sm rounded-xl border border-red-500/40 transition-colors"
            >
              Try Tags Generator
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
