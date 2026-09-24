import React from "react";
import { FileText, AlertTriangle } from "lucide-react";

export const TermsOfService: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
          <FileText className="w-3.5 h-3.5 text-slate-600" />
          <span>Terms of Use</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Terms of Service
        </h1>
        <p className="text-xs text-slate-500">Last Updated: September 2025</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6 text-sm text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">1. Acceptance of Terms</h2>
          <p>
            By accessing or using CreatorTools Hub, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use the website.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">2. Description of Service</h2>
          <p>
            CreatorTools Hub provides informational, brainstorming, and productivity tools designed for online video creators, including Title Generation, Tag Suggestions, Description Formatting, and Thumbnail Extraction.
          </p>
        </section>

        <section className="space-y-2 bg-amber-50/70 p-4 rounded-xl border border-amber-200 text-amber-900">
          <div className="flex items-center gap-2 font-bold mb-1">
            <AlertTriangle className="w-4 h-4 text-amber-700" />
            <span>3. Critical Disclaimers & Third-Party Platform Notice</span>
          </div>
          <p className="text-xs text-amber-800 leading-relaxed">
            • <strong>No Affiliation:</strong> CreatorTools Hub is an independent utility and is not affiliated with, endorsed by, sponsored by, or associated with YouTube, Google LLC, Alphabet Inc., or any of their subsidiaries. "YouTube" is a registered trademark of Google LLC.
          </p>
          <p className="text-xs text-amber-800 leading-relaxed mt-2">
            • <strong>No Metric Guarantees:</strong> All generated titles, keyword suggestions, and descriptions are algorithmic aids. We do not guarantee views, subscriber counts, watch time, algorithm promotions, monetization approval, or search ranking placement.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">4. User Intellectual Property & Thumbnail Fair Use</h2>
          <p>
            You retain all rights to any video content, scripts, or creative materials you produce. When downloading thumbnail images, you are responsible for respecting the copyright and intellectual property rights of the respective content owners and adhering to YouTube's Terms of Service and applicable copyright fair use guidelines.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">5. Limitation of Liability</h2>
          <p>
            CreatorTools Hub is provided "as is" without warranty of any kind. Under no circumstances shall CreatorTools Hub be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use the service.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">6. Modifications to the Service</h2>
          <p>
            We reserve the right to modify, update, or discontinue any feature of the website at any time without prior notice.
          </p>
        </section>
      </div>
    </div>
  );
};
