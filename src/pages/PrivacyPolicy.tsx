import React from "react";
import { Shield, Lock, EyeOff } from "lucide-react";

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
          <Shield className="w-3.5 h-3.5 text-slate-600" />
          <span>Legal & Data Protection</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-500">Last Updated: September 2025</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6 text-sm text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">1. Overview and Privacy Pledge</h2>
          <p>
            CreatorTools Hub ("we", "our", or "the Service") provides free online utilities for digital video creators. We place paramount importance on creator privacy. You do not need to register, create an account, or link your Google / YouTube account to use our core utilities.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">2. Information We Process</h2>
          <p>
            • <strong>User Inputs:</strong> When you generate titles, tags, or descriptions, your query text (e.g. video topic or keywords) is transmitted to our processing server strictly to generate the requested output. We do not store, catalog, or associate your drafted video ideas with your personal identity.
          </p>
          <p>
            • <strong>YouTube URLs:</strong> When using the Thumbnail Downloader, the submitted video URL is parsed client-side or server-side only to extract the 11-character video ID and resolve publicly accessible CDN thumbnail paths.
          </p>
          <p>
            • <strong>No User Account Credentials:</strong> We never ask for or store passwords, YouTube channel tokens, or OAuth keys.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">3. Cookies & Analytics</h2>
          <p>
            We use minimal technical session storage for client-side state preferences. We do not engage in invasive third-party cross-site advertising tracking or commercial data brokering.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">4. Third-Party Services</h2>
          <p>
            Thumbnails previewed and downloaded through our utility are hosted on public YouTube image content delivery networks (img.youtube.com / i.ytimg.com). Accessing these assets is subject to standard Internet network protocols.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">5. Contact Regarding Privacy</h2>
          <p>
            If you have questions regarding this Privacy Policy, please contact our team at:{" "}
            <a href="mailto:privacy@creatortoolshub.com" className="text-red-600 hover:underline">
              privacy@creatortoolshub.com
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
};
