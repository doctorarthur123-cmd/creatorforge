import React from "react";
import { Play, Sparkles, Shield, Heart, Users, Target, CheckCircle2 } from "lucide-react";
import { PageId } from "../types";

interface AboutProps {
  onNavigate: (page: PageId) => void;
}

export const About: React.FC<AboutProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
          <Play className="w-3.5 h-3.5 fill-red-600 text-red-600" />
          <span>About CreatorTools Hub</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Empowering Video Creators With Free, Unrestricted Utilities
        </h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          We believe high-converting titles, discoverable tags, and structured descriptions shouldn't be locked behind expensive monthly subscriptions.
        </p>
      </div>

      {/* Mission Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-red-50 text-red-600">
            <Target className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Our Core Mission</h2>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">
          YouTube content creation is challenging enough without spending hours second-guessing titles or struggling with awkward description formatting. CreatorTools Hub was created to provide a streamlined, zero-friction workspace where creators of all channel sizes can brainstorm title angles, optimize keyword tags, and preview HD thumbnails without paywalls, complex extensions, or mandatory account logins.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1">
              100% Free Forever
            </h3>
            <p className="text-xs text-slate-500">
              No premium upsells, no credit cards, and no artificial generation limits.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1">
              Zero Login Friction
            </h3>
            <p className="text-xs text-slate-500">
              Hop in, generate what you need, copy to clipboard, and paste into YouTube Studio.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1">
              Privacy By Default
            </h3>
            <p className="text-xs text-slate-500">
              We never save your unpublished video topics, scripts, or channel ideas.
            </p>
          </div>
        </div>
      </div>

      {/* Philosophy on AI & Creator Ethics */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
            <Shield className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Our Honest Philosophy on YouTube Growth</h2>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">
          Many tools make exaggerated promises about "guaranteed viral growth" or "hacking the algorithm." We believe in transparency:
        </p>
        <ul className="space-y-3 text-xs sm:text-sm text-slate-600 pt-1">
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
            <span>
              <strong>Titles and thumbnails earn the click; the video earns the watch time:</strong> A compelling title gets viewers in the door, but genuine storytelling and valuable content keep them watching.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
            <span>
              <strong>Curiosity without deceit:</strong> We design title suggestions that create strong curiosity gaps while avoiding deceptive clickbait that damages viewer trust.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
            <span>
              <strong>Search intent matters:</strong> Providing accurate keyword tags and structured descriptions helps YouTube categorize your upload accurately in search and suggested feeds.
            </span>
          </li>
        </ul>
      </div>

      {/* CTA Box */}
      <div className="p-6 rounded-2xl bg-slate-100 text-center space-y-4">
        <h3 className="text-base font-bold text-slate-900">Ready to test out the tools?</h3>
        <p className="text-xs text-slate-600 max-w-md mx-auto">
          Explore our suite of utilities and see how much time you save on your next upload.
        </p>
        <div className="flex flex-wrap justify-center gap-2.5 pt-1">
          <button
            onClick={() => onNavigate("title-generator")}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Title Generator
          </button>
          <button
            onClick={() => onNavigate("thumbnail-downloader")}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Thumbnail Downloader
          </button>
        </div>
      </div>
    </div>
  );
};
