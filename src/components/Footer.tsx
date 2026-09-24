import React from "react";
import { Play, Sparkles, Tag, FileText, ImageDown, ShieldCheck, Heart } from "lucide-react";
import { PageId } from "../types";

interface FooterProps {
  onNavigate: (page: PageId) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-14 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Brand info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white shadow-sm">
                <Play className="w-4 h-4 fill-white ml-0.5" />
              </div>
              <span className="font-bold text-lg tracking-tight text-white">
                CreatorTools<span className="text-red-500">Hub</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Modern, free utilities designed to streamline video production for creators, marketers, and video editors worldwide.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Free · No Registration Required</span>
            </div>
          </div>

          {/* YouTube Tools */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Creator Tools
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  id="footer-tool-title-btn"
                  onClick={() => onNavigate("title-generator")}
                  className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-red-400" />
                  YouTube Title Generator
                </button>
              </li>
              <li>
                <button
                  id="footer-tool-tags-btn"
                  onClick={() => onNavigate("tags-generator")}
                  className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                >
                  <Tag className="w-3.5 h-3.5 text-emerald-400" />
                  YouTube Tags Generator
                </button>
              </li>
              <li>
                <button
                  id="footer-tool-desc-btn"
                  onClick={() => onNavigate("description-generator")}
                  className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-400" />
                  YouTube Description Writer
                </button>
              </li>
              <li>
                <button
                  id="footer-tool-thumb-btn"
                  onClick={() => onNavigate("thumbnail-downloader")}
                  className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                >
                  <ImageDown className="w-3.5 h-3.5 text-amber-400" />
                  YouTube Thumbnail Downloader
                </button>
              </li>
            </ul>
          </div>

          {/* Company & Policies */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Company & Legal
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  id="footer-nav-about-btn"
                  onClick={() => onNavigate("about")}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  About CreatorTools Hub
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-privacy-btn"
                  onClick={() => onNavigate("privacy-policy")}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-terms-btn"
                  onClick={() => onNavigate("terms-of-service")}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>

          {/* Creator Advisory & Disclaimer */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Platform Advisory
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              CreatorTools Hub is an independent web utility and is not affiliated with, authorized, or endorsed by YouTube or Google LLC.
            </p>
            <p className="text-xs text-slate-400 leading-relaxed bg-slate-800/60 p-3 rounded-lg border border-slate-800">
              <span className="font-semibold text-slate-300">Notice:</span> Generated titles, tags, and descriptions are algorithmic suggestions. Search rankings, views, and impressions depend on video quality, audience retention, and organic viewer demand.
            </p>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} CreatorTools Hub. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built for video creators worldwide <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
          </p>
        </div>
      </div>
    </footer>
  );
};
