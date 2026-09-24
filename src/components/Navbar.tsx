import React, { useState } from "react";
import {
  Sparkles,
  Tag,
  FileText,
  ImageDown,
  Menu,
  X,
  Play,
  Home,
  Info,
  ChevronDown,
} from "lucide-react";
import { PageId } from "../types";

interface NavbarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);

  const tools: { id: PageId; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      id: "title-generator",
      label: "Title Generator",
      icon: <Sparkles className="w-4 h-4 text-red-500" />,
      desc: "Curiosity, search & viral title styles",
    },
    {
      id: "tags-generator",
      label: "Tags Generator",
      icon: <Tag className="w-4 h-4 text-emerald-500" />,
      desc: "Targeted YouTube keywords & tags",
    },
    {
      id: "description-generator",
      label: "Description Writer",
      icon: <FileText className="w-4 h-4 text-blue-500" />,
      desc: "Structured descriptions with timestamps",
    },
    {
      id: "thumbnail-downloader",
      label: "Thumbnail Downloader",
      icon: <ImageDown className="w-4 h-4 text-amber-500" />,
      desc: "HD 720p & 1080p preview & download",
    },
  ];

  const handleNav = (page: PageId) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    setToolsDropdownOpen(false);
  };

  const isToolActive = [
    "title-generator",
    "tags-generator",
    "description-generator",
    "thumbnail-downloader",
  ].includes(currentPage);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            id="nav-logo-btn"
            onClick={() => handleNav("home")}
            className="flex items-center space-x-2.5 group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-sm shadow-red-500/20 group-hover:bg-red-700 transition-colors">
              <Play className="w-4 h-4 fill-white ml-0.5" />
            </div>
            <div className="text-left">
              <span className="font-bold text-lg tracking-tight text-slate-900 block leading-tight">
                CreatorTools<span className="text-red-600">Hub</span>
              </span>
              <span className="text-[11px] font-medium text-slate-500 block -mt-0.5">
                Free YouTube Toolkit
              </span>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <button
              id="nav-home-btn"
              onClick={() => handleNav("home")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage === "home"
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              Home
            </button>

            {/* Tools Dropdown */}
            <div className="relative">
              <button
                id="nav-tools-dropdown-btn"
                onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
                onMouseEnter={() => setToolsDropdownOpen(true)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                  isToolActive
                    ? "bg-red-50 text-red-700 font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <span>YouTube Tools</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {toolsDropdownOpen && (
                <div
                  onMouseLeave={() => setToolsDropdownOpen(false)}
                  className="absolute left-0 mt-1 w-72 rounded-xl bg-white shadow-xl ring-1 ring-slate-900/10 py-2 z-50 animate-in fade-in slide-in-from-top-1"
                >
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Core Utilities
                  </div>
                  {tools.map((t) => (
                    <button
                      key={t.id}
                      id={`nav-tool-${t.id}`}
                      onClick={() => handleNav(t.id)}
                      className={`w-full text-left px-3 py-2.5 flex items-start gap-3 hover:bg-slate-50 transition-colors ${
                        currentPage === t.id ? "bg-red-50/70" : ""
                      }`}
                    >
                      <div className="mt-0.5 p-1.5 rounded-lg bg-slate-100">{t.icon}</div>
                      <div>
                        <div className="text-sm font-medium text-slate-900">{t.label}</div>
                        <div className="text-xs text-slate-500">{t.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Direct Tool Links for quick access */}
            <button
              id="nav-title-btn"
              onClick={() => handleNav("title-generator")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage === "title-generator"
                  ? "bg-red-50 text-red-700 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              Titles
            </button>
            <button
              id="nav-tags-btn"
              onClick={() => handleNav("tags-generator")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage === "tags-generator"
                  ? "bg-red-50 text-red-700 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              Tags
            </button>
            <button
              id="nav-desc-btn"
              onClick={() => handleNav("description-generator")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage === "description-generator"
                  ? "bg-red-50 text-red-700 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              Descriptions
            </button>
            <button
              id="nav-thumb-btn"
              onClick={() => handleNav("thumbnail-downloader")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage === "thumbnail-downloader"
                  ? "bg-red-50 text-red-700 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              Thumbnails
            </button>
          </nav>

          {/* Right side secondary links */}
          <div className="hidden lg:flex items-center space-x-2">
            <button
              id="nav-about-btn"
              onClick={() => handleNav("about")}
              className={`px-2.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                currentPage === "about"
                  ? "text-slate-900 font-semibold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              About
            </button>
            <button
              id="nav-quick-start-btn"
              onClick={() => handleNav("title-generator")}
              className="ml-2 inline-flex items-center justify-center px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors"
            >
              Create Now
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              id="nav-mobile-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
          <button
            onClick={() => handleNav("home")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
              currentPage === "home" ? "bg-red-50 text-red-700" : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <Home className="w-4 h-4" /> Home
          </button>

          <div className="pt-2 pb-1 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            YouTube Tools
          </div>

          {tools.map((t) => (
            <button
              key={t.id}
              onClick={() => handleNav(t.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                currentPage === t.id ? "bg-red-50 text-red-700" : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}

          <div className="pt-3 border-t border-slate-100 flex items-center px-3 text-sm">
            <button
              onClick={() => handleNav("about")}
              className={`text-slate-600 hover:text-slate-900 flex items-center gap-1.5 ${
                currentPage === "about" ? "font-bold text-red-600" : ""
              }`}
            >
              <Info className="w-4 h-4" /> About CreatorTools Hub
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
