/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { AppSettings, Service, Review } from "../types";
import { Copy, Check, Download, FileText, Folder, FolderOpen, Github, Globe } from "lucide-react";

interface TemplateExporterProps {
  settings: AppSettings;
  services: Service[];
  reviews: Review[];
}

export default function TemplateExporter({ settings, services, reviews }: TemplateExporterProps) {
  const [copiedSettings, setCopiedSettings] = useState(false);
  const [copiedReadme, setCopiedReadme] = useState(false);
  const [expandedFolder, setExpandedFolder] = useState<string[]>(["root", "config", "docs", "src", "public"]);

  const toggleFolder = (folder: string) => {
    if (expandedFolder.includes(folder)) {
      setExpandedFolder(expandedFolder.filter((f) => f !== folder));
    } else {
      setExpandedFolder([...expandedFolder, folder]);
    }
  };

  const isExpanded = (folder: string) => expandedFolder.includes(folder);

  // Generate customized settings JSON
  const settingsJson = JSON.stringify(
    {
      appSettings: settings,
      services: services.map(s => ({
        id: s.id,
        name: s.name,
        category: s.category,
        icon: s.icon,
        priceType: s.priceType,
        price: s.price,
        priceUnit: s.priceUnit,
        description: s.description,
        benefits: s.benefits,
        isFeatured: s.isFeatured
      })),
      reviews: reviews.filter(r => r.approved).map(r => ({
        id: r.id,
        reviewerName: r.reviewerName,
        serviceName: r.serviceName,
        rating: r.rating,
        reviewText: r.reviewText,
        createdAt: r.createdAt
      }))
    },
    null,
    2
  );

  // Generate customized docs/README.md
  const readmeMarkdown = `# 🌟 ${settings.brandName} - Nanyuki Landing Page & Booking Template

A high-converting, mobile-first responsive landing page and automated WhatsApp-integrated booking calendar built for service entrepreneurs in Nanyuki, Kenya.

This system is built as a highly reusable, modular template. You can customize all text, services, pricing, and visual story components simply by updating \`config/settings.json\`.

## 📁 Repository Structure
\`\`\`
├── config/
│   └── settings.json       # <-- MAIN CONFIG FILE (Customise everything here!)
├── docs/
│   └── README.md           # This documentation
├── index.html              # Core landing page index file
├── src/
│   ├── App.tsx             # Main application driver with state manager
│   ├── index.css           # Global Tailwind CSS and typography pairing
│   ├── types.ts            # Type definitions (Service, Booking, Review, settings)
│   └── defaultData.ts      # Fresh pre-filled values
├── package.json            # Node.js dependencies
└── vite.config.ts          # Vite configuration
\`\`\`

## ⚙️ How to Customize (Quick Start)
All business logic is modular and configurable. To change pricing, taglines, or WhatsApp contact phone numbers:
1. Open \`config/settings.json\`.
2. Update the values inside the \`appSettings\` block:
   - \`brandName\`: Name of the business (e.g., "${settings.brandName}")
   - \`whatsappNumber\`: Mobile number to receive bookings (e.g., "${settings.whatsappNumber}")
   - \`tagline\`: Hero message (e.g., "${settings.tagline}")
3. Modify, delete, or append objects inside the \`services\` list to display custom services (e.g., Carpet Cleaning, Wardrobe Organizing).
4. Update or filter the \`reviews\` list with real testimonials to instantly build local trust.

## 🚀 Deployment Instructions
This template is configured to build as an ultra-fast client-side Single Page Application (SPA).
1. **GitHub Pages / Netlify / Vercel**:
   - Push this directory structure to your GitHub repository.
   - Connect the repository to your chosen host.
   - Set the build command to \`npm run build\` and publishing directory to \`dist\`.
2. **WhatsApp Integration Engine**:
   - No complex database or messaging server is required! Bookings and enquiries are constructed on-the-fly and passed directly into the official WhatsApp API.
   - On clicking "Send Booking", the system automatically formats a clean summary and opens WhatsApp with Mary's Nanyuki mobile line (\`+${settings.whatsappNumber}\`).

---
Crafted with ❤️ for **Mary Anthony** & single mothers breaking cycles in Nanyuki, Kenya.
`;

  const copyToClipboard = (text: string, setCopied: React.Dispatch<React.SetStateAction<boolean>>) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(settingsJson);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "settings.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6 mb-6">
        <div>
          <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Template Export Hub
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-purple-deep mt-2">
            Reusable Template &amp; Config Generator
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Download your configured assets or copy setup codes to publish your custom landing page immediately.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 bg-gray-900 text-white hover:bg-gray-800 transition text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md"
          >
            <Github size={14} />
            <span>GitHub Structure</span>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Virtual File Explorer */}
        <div className="lg:col-span-5 bg-purple-50/50 rounded-xl p-5 border border-purple-100/60">
          <h3 className="text-xs font-bold text-purple-mid tracking-wider uppercase mb-4 flex items-center gap-1.5">
            <FolderOpen size={14} /> Virtual Directory Tree
          </h3>

          <div className="font-mono text-xs text-gray-700 space-y-2 select-none">
            {/* Root folder */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => toggleFolder("root")}>
              {isExpanded("root") ? <FolderOpen size={16} className="text-purple-mid" /> : <Folder size={16} className="text-purple-mid" />}
              <span className="font-bold text-purple-deep">sparkle-shine-nanyuki/</span>
            </div>

            {isExpanded("root") && (
              <div className="pl-4 border-l border-purple-200 ml-2 space-y-2 pt-1">
                {/* config folder */}
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => toggleFolder("config")}>
                  {isExpanded("config") ? <FolderOpen size={15} className="text-amber-500" /> : <Folder size={15} className="text-amber-500" />}
                  <span className="font-semibold text-gray-800">config/</span>
                </div>
                {isExpanded("config") && (
                  <div className="pl-4 border-l border-purple-200 ml-2">
                    <div className="flex items-center gap-2 text-purple-800 font-semibold bg-purple-100/50 p-1 px-2 rounded">
                      <FileText size={14} className="text-amber-600" />
                      <span>settings.json</span>
                    </div>
                  </div>
                )}

                {/* docs folder */}
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => toggleFolder("docs")}>
                  {isExpanded("docs") ? <FolderOpen size={15} className="text-amber-500" /> : <Folder size={15} className="text-amber-500" />}
                  <span className="font-semibold text-gray-800">docs/</span>
                </div>
                {isExpanded("docs") && (
                  <div className="pl-4 border-l border-purple-200 ml-2">
                    <div className="flex items-center gap-2 text-gray-600 p-1">
                      <FileText size={14} />
                      <span>README.md</span>
                    </div>
                  </div>
                )}

                {/* src folder */}
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => toggleFolder("src")}>
                  {isExpanded("src") ? <FolderOpen size={15} className="text-amber-500" /> : <Folder size={15} className="text-amber-500" />}
                  <span className="font-semibold text-gray-800">src/</span>
                </div>
                {isExpanded("src") && (
                  <div className="pl-4 border-l border-purple-200 ml-2 space-y-1">
                    <div className="flex items-center gap-2 text-gray-600 p-1"><FileText size={14} /><span>App.tsx</span></div>
                    <div className="flex items-center gap-2 text-gray-600 p-1"><FileText size={14} /><span>types.ts</span></div>
                    <div className="flex items-center gap-2 text-gray-600 p-1"><FileText size={14} /><span>index.css</span></div>
                    <div className="flex items-center gap-2 text-gray-600 p-1"><FileText size={14} /><span>defaultData.ts</span></div>
                  </div>
                )}

                {/* Other root files */}
                <div className="flex items-center gap-2 text-gray-600 p-0.5"><FileText size={14} /><span>index.html</span></div>
                <div className="flex items-center gap-2 text-gray-600 p-0.5"><FileText size={14} /><span>package.json</span></div>
                <div className="flex items-center gap-2 text-gray-600 p-0.5"><FileText size={14} /><span>tsconfig.json</span></div>
                <div className="flex items-center gap-2 text-gray-600 p-0.5"><FileText size={14} /><span>vite.config.ts</span></div>
              </div>
            )}
          </div>

          <div className="bg-purple-100/40 rounded-lg p-3.5 border border-purple-200/50 mt-6 text-xs text-purple-950 leading-relaxed space-y-2">
            <p className="font-semibold text-purple-deep flex items-center gap-1">
              <Globe size={13} className="text-pink" /> Modular Advantage:
            </p>
            <p>
              Your landing page is dynamic! To deploy, simply upload these files. Any changes you make in the Admin Dashboard instantly refresh this configurations output.
            </p>
          </div>
        </div>

        {/* Configurations Code Output */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* settings.json tab */}
          <div>
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-t-xl border-t border-x border-gray-100">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-gray-700 bg-gray-200/70 px-2.5 py-1 rounded">
                  config/settings.json
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(settingsJson, setCopiedSettings)}
                  className="flex items-center gap-1.5 text-xs text-purple-mid hover:text-purple-deep font-semibold bg-white p-1.5 px-3 rounded-lg border border-gray-200 shadow-sm transition cursor-pointer"
                >
                  {copiedSettings ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
                  <span>{copiedSettings ? "Copied" : "Copy"}</span>
                </button>
                <button
                  onClick={downloadJson}
                  className="flex items-center gap-1.5 text-xs text-amber-800 hover:text-amber-950 font-semibold bg-amber-100 hover:bg-amber-200 p-1.5 px-3 rounded-lg border border-amber-200 transition cursor-pointer"
                >
                  <Download size={12} />
                  <span>Download</span>
                </button>
              </div>
            </div>
            <div className="bg-gray-950 rounded-b-xl p-4 text-xs font-mono text-gray-200 overflow-x-auto max-h-56 shadow-inner border border-gray-900 leading-relaxed">
              <pre>{settingsJson}</pre>
            </div>
          </div>

          {/* README.md tab */}
          <div>
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-t-xl border-t border-x border-gray-100">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-gray-700 bg-gray-200/70 px-2.5 py-1 rounded">
                  docs/README.md
                </span>
              </div>
              <button
                onClick={() => copyToClipboard(readmeMarkdown, setCopiedReadme)}
                className="flex items-center gap-1.5 text-xs text-purple-mid hover:text-purple-deep font-semibold bg-white p-1.5 px-3 rounded-lg border border-gray-200 shadow-sm transition cursor-pointer"
              >
                {copiedReadme ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
                <span>{copiedReadme ? "Copied!" : "Copy Markdown"}</span>
              </button>
            </div>
            <div className="bg-gray-950 rounded-b-xl p-4 text-xs font-mono text-gray-200 overflow-x-auto max-h-56 shadow-inner border border-gray-900 leading-relaxed">
              <pre className="whitespace-pre-wrap">{readmeMarkdown}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
