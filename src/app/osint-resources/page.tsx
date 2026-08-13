"use client";

import React, { useState, useMemo } from "react";
import {
  Globe,
  Search,
  ExternalLink,
  Copy,
  Check,
  Shield,
  Sparkles,
  Zap,
  Tag,
  Compass,
  Code,
  BookOpen,
  Filter,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import { OSINT_RESOURCES_DIRECTORY, OsintResourceLink } from "@/data/osintLinks";
import { CopyButton } from "@/components/ui/CopyButton";

type CategoryFilter =
  | "All"
  | "IoT & Search Engines"
  | "Domain & DNS Recon"
  | "Identity & Email OSINT"
  | "Network & Geolocation"
  | "Exploits & Cyber Utilities";

type AccessFilter = "All" | "Free" | "Freemium";

const CATEGORIES: CategoryFilter[] = [
  "All",
  "IoT & Search Engines",
  "Domain & DNS Recon",
  "Identity & Email OSINT",
  "Network & Geolocation",
  "Exploits & Cyber Utilities",
];

export default function OsintResourcesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("All");
  const [selectedAccess, setSelectedAccess] = useState<AccessFilter>("All");

  const filteredLinks = useMemo(() => {
    return OSINT_RESOURCES_DIRECTORY.filter((res) => {
      const matchesCategory = selectedCategory === "All" || res.category === selectedCategory;
      const matchesAccess = selectedAccess === "All" || res.accessType === selectedAccess;
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        !query ||
        res.name.toLowerCase().includes(query) ||
        res.url.toLowerCase().includes(query) ||
        res.description.toLowerCase().includes(query) ||
        res.popularFor.some((tag) => tag.toLowerCase().includes(query)) ||
        (res.sampleQuery && res.sampleQuery.toLowerCase().includes(query));

      return matchesCategory && matchesAccess && matchesSearch;
    });
  }, [selectedCategory, selectedAccess, searchQuery]);

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-10 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
            <Globe className="w-3.5 h-3.5" />
            <span>DIRECT WEB RESOURCES & OSINT DIRECTORY</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            OSINT Web <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">Resources & Live Links</span>
          </h1>

          <p className="text-sm text-slate-400 leading-relaxed">
            Curated directory of premier open-source intelligence websites collected from Google. Access <strong>Shodan</strong>, <strong>Censys</strong>, <strong>Crt.sh</strong>, <strong>DNSDumpster</strong>, <strong>HaveIBeenPwned</strong>, <strong>Hunter.io</strong>, <strong>OSINT Framework</strong>, and <strong>CyberChef</strong> directly with 1-click links.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
              <Globe className="w-4 h-4" /> {OSINT_RESOURCES_DIRECTORY.length} Official OSINT Portals
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <ExternalLink className="w-4 h-4" /> 1-Click External Website Access
            </span>
          </div>
        </div>
      </div>

      {/* Controls: Search, Category Pills, & Access Filters */}
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold shadow-sm"
                    : "bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box & Access Filter */}
          <div className="flex items-center gap-3">
            <div className="relative min-w-[240px] flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search web link, dork, or site..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-mono"
              />
            </div>

            <select
              value={selectedAccess}
              onChange={(e) => setSelectedAccess(e.target.value as AccessFilter)}
              className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-mono text-xs focus:outline-none focus:border-cyan-400"
            >
              <option value="All">All Access</option>
              <option value="Free">100% Free</option>
              <option value="Freemium">Freemium</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
          <span>Showing {filteredLinks.length} OSINT web resource portals</span>
          {(searchQuery || selectedCategory !== "All" || selectedAccess !== "All") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setSelectedAccess("All");
              }}
              className="text-cyan-400 hover:underline cursor-pointer"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* OSINT Links Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLinks.map((res) => (
          <div
            key={res.id}
            className="rounded-2xl border border-slate-800/90 bg-slate-900/70 backdrop-blur-sm p-6 space-y-5 flex flex-col justify-between hover:border-slate-700 transition-all shadow-xl group"
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-extrabold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-2">
                    <Globe className="w-4 h-4 text-cyan-400 shrink-0" />
                    {res.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                      {res.category}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                        res.accessType === "Free"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                      }`}
                    >
                      {res.accessType}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 leading-relaxed font-sans line-clamp-3">
                {res.description}
              </p>

              {/* Sample Query Hint Box (If Available) */}
              {res.sampleQuery && (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase text-slate-500 font-semibold">
                    <span>Sample Dork / Query</span>
                    <CopyButton text={res.sampleQuery} />
                  </div>
                  <code className="text-xs font-mono text-emerald-400 block truncate">
                    {res.sampleQuery}
                  </code>
                </div>
              )}

              {/* Popular Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {res.popularFor.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-950 text-slate-400 border border-slate-800"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
              <a
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-cyan-500/10"
              >
                <span>Visit {res.name}</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              <CopyButton text={res.url} label="" />
            </div>
          </div>
        ))}
      </div>

      {filteredLinks.length === 0 && (
        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 space-y-3">
          <Search className="w-8 h-8 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-300">No matching OSINT web resources found</h3>
          <p className="text-xs text-slate-500">
            Try searching for terms like "shodan", "censys", "virustotal", or "haveibeenpwned".
          </p>
        </div>
      )}
    </div>
  );
}
