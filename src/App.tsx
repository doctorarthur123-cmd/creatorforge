import React, { useState, useEffect } from "react";
import { PageId } from "./types";
import { SEOHead } from "./components/SEOHead";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Toast, ToastMessage } from "./components/Toast";
import { Home } from "./pages/Home";
import { TitleGenerator } from "./pages/TitleGenerator";
import { TagsGenerator } from "./pages/TagsGenerator";
import { DescriptionGenerator } from "./pages/DescriptionGenerator";
import { ThumbnailDownloader } from "./pages/ThumbnailDownloader";
import { About } from "./pages/About";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import { TermsOfService } from "./pages/TermsOfService";

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>(() => {
    // Check initial URL hash or path
    const hash = window.location.hash.replace("#/", "").replace("#", "");
    const validPages: PageId[] = [
      "home",
      "title-generator",
      "tags-generator",
      "description-generator",
      "thumbnail-downloader",
      "about",
      "privacy-policy",
      "terms-of-service",
    ];
    if (validPages.includes(hash as PageId)) {
      return hash as PageId;
    }
    const path = window.location.pathname.replace(/^\//, "");
    if (validPages.includes(path as PageId)) {
      return path as PageId;
    }
    return "home";
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync hash changes (back/forward navigation)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#/", "").replace("#", "");
      const validPages: PageId[] = [
        "home",
        "title-generator",
        "tags-generator",
        "description-generator",
        "thumbnail-downloader",
        "about",
        "privacy-policy",
        "terms-of-service",
      ];
      if (validPages.includes(hash as PageId)) {
        setCurrentPage(hash as PageId);
      } else if (!hash) {
        setCurrentPage("home");
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const navigateTo = (page: PageId) => {
    setCurrentPage(page);
    window.location.hash = `/${page === "home" ? "" : page}`;
  };

  const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-red-100 selection:text-red-900">
      <SEOHead page={currentPage} />
      <Navbar currentPage={currentPage} onNavigate={navigateTo} />

      <main className="flex-1">
        {currentPage === "home" && <Home onNavigate={navigateTo} />}
        {currentPage === "title-generator" && <TitleGenerator onShowToast={showToast} />}
        {currentPage === "tags-generator" && <TagsGenerator onShowToast={showToast} />}
        {currentPage === "description-generator" && <DescriptionGenerator onShowToast={showToast} />}
        {currentPage === "thumbnail-downloader" && <ThumbnailDownloader onShowToast={showToast} />}
        {currentPage === "about" && <About onNavigate={navigateTo} />}
        {currentPage === "privacy-policy" && <PrivacyPolicy />}
        {currentPage === "terms-of-service" && <TermsOfService />}
      </main>

      <Footer onNavigate={navigateTo} />
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
