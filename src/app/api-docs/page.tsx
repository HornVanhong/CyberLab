"use client";

import React, { useEffect, useState } from "react";
import Script from "next/script";
import { BookOpen, Terminal, Sparkles, Globe, Download } from "lucide-react";

export default function SwaggerApiDocsPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Initialize Swagger UI if bundle script is loaded
    if (typeof window !== "undefined" && (window as any).SwaggerUIBundle) {
      (window as any).SwaggerUIBundle({
        url: "/api/docs/openapi.json",
        dom_id: "#swagger-ui",
        deepLinking: true,
        presets: [
          (window as any).SwaggerUIBundle.presets.apis,
          (window as any).SwaggerUIBundle.SwaggerUIStandalonePreset,
        ],
        layout: "BaseLayout",
      });
      setIsLoaded(true);
    }
  }, []);

  const handleScriptLoad = () => {
    if (typeof window !== "undefined" && (window as any).SwaggerUIBundle) {
      (window as any).SwaggerUIBundle({
        url: "/api/docs/openapi.json",
        dom_id: "#swagger-ui",
        deepLinking: true,
        presets: [
          (window as any).SwaggerUIBundle.presets.apis,
          (window as any).SwaggerUIBundle.SwaggerUIStandalonePreset,
        ],
        layout: "BaseLayout",
      });
      setIsLoaded(true);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* External Swagger UI CSS */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css"
      />

      {/* Script for Swagger UI Bundle */}
      <Script
        src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"
        onLoad={handleScriptLoad}
      />
      <Script
        src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-standalone-preset.js"
      />

      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
              <BookOpen className="w-3.5 h-3.5" />
              <span>LOCAL SWAGGER UI INTERACTIVE TESTER</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Swagger <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">API Documentation & Test Console</span>
            </h1>

            <p className="text-sm text-slate-400 leading-relaxed">
              Official <strong>Swagger UI</strong> running locally on your computer. Test API endpoints, execute live requests, inspect request headers, and view JSON schemas.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                <Globe className="w-4 h-4" /> Server: http://localhost:3000/api
              </span>
              <span>•</span>
              <a
                href="/api/docs/openapi.json"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-emerald-400 font-bold hover:underline cursor-pointer"
              >
                <Download className="w-4 h-4" /> Download openapi.json Spec
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Swagger UI Container */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 sm:p-6 shadow-2xl min-h-[600px] overflow-hidden">
        {!isLoaded && (
          <div className="p-12 text-center text-slate-400 font-mono text-xs space-y-3">
            <span className="inline-block w-4 h-4 rounded-full bg-emerald-400 animate-ping" />
            <p>Loading Official Swagger UI Test Console...</p>
          </div>
        )}
        <div id="swagger-ui" className="swagger-theme-cyber" />
      </div>

      {/* Styling Customizations for Dark Cyber Theme in Swagger UI */}
      <style jsx global>{`
        .swagger-ui {
          filter: invert(88%) hue-rotate(180deg);
        }
        .swagger-ui .microlight,
        .swagger-ui img,
        .swagger-ui svg {
          filter: invert(100%) hue-rotate(180deg);
        }
        .swagger-ui .topbar {
          display: none !important;
        }
      `}</style>
    </div>
  );
}
