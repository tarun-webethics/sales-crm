'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  FileText,
  Link2,
  X,
  RotateCw,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  Eye,
  Plus,
  ChevronDown,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Job } from '@/types/job';
import { cn } from '@/lib/utils';

interface TrackableLink {
  id: string;
  title: string;
  status: 'Opened' | 'Not opened';
  url: string;
  views: number;
  lastViewed: string;
  author: string;
  createdAt: string;
}

interface ProposalModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  job: Job;
}

export function ProposalModal({
  isOpen,
  onOpenChange,
  job,
}: ProposalModalProps) {
  const [activeTab, setActiveTab] = useState<'cover-letter' | 'share-document'>('cover-letter');
  const [activeModel, setActiveModel] = useState<'chatgpt' | 'claude'>('chatgpt');
  const [variant, setVariant] = useState<'original' | 'improved'>('improved');
  const [claudeGenerated, setClaudeGenerated] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [copiedProposal, setCopiedProposal] = useState(false);
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Document sharing form state
  const [selectedDoc, setSelectedDoc] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('files.webethicssolutions.com');

  // Trackable links list
  const techPortfolioName = useMemo(() => {
    if (job.technology?.toLowerCase().includes('wix')) return 'Wix Portfolio – B2B';
    if (job.technology?.toLowerCase().includes('shopify')) return 'Shopify Portfolio – B2B';
    if (job.technology?.toLowerCase().includes('wordpress')) return 'WordPress Portfolio – B2B';
    if (job.technology?.toLowerCase().includes('react') || job.technology?.toLowerCase().includes('next')) {
      return 'Next.js & React Portfolio – B2B';
    }
    return `${job.technology || 'Web'} Portfolio – B2B`;
  }, [job.technology]);

  const [links, setLinks] = useState<TrackableLink[]>([
    {
      id: 'link-1',
      title: 'Pitch Deck - Upwork',
      status: 'Not opened',
      url: 'https://files.webethicssolutions.com/view/FECpyAXxN8qL',
      views: 0,
      lastViewed: 'Never',
      author: 'Harsh Vardhan',
      createdAt: '1 min ago',
    },
    {
      id: 'link-2',
      title: techPortfolioName,
      status: 'Opened',
      url: 'https://files.webethicssolutions.com/view/Wq7mZt3K91pM',
      views: 3,
      lastViewed: '12 min ago',
      author: 'Harsh Vardhan',
      createdAt: '40 min ago',
    },
  ]);

  // Generate dynamic proposals
  const defaultImprovedChatGPT = useMemo(() => {
    const titleLower = job.title.toLowerCase();
    const techLower = (job.technology || '').toLowerCase();
    const isWix = titleLower.includes('wix') || techLower.includes('wix');
    if (isWix) {
      return `Hi there,

You need Wix landing pages that rank in search and AI answers, and turn B2B visitors into enquiries. That is work we do regularly for service businesses.

My plan: build your core business-setup page first, then turn it into a template so every new page is consistent and quick to ship. Each page gets schema, FAQ blocks and fast load times for SEO, AEO and GEO.

Wix B2B samples: [PORTFOLIO LINK]

I can start this week. How many pages are you planning for the first phase?

Best,
[YOUR NAME]`;
    }

    return `Hi there,

You need ${job.technology || 'custom web'} development that turns visitors into high-value clients and delivers fast load times. That is work we do regularly for high-growth businesses.

My plan: deliver the core milestone architecture first, then turn components into reusable modular templates so your project ships fast and consistently with clean code and robust SEO.

Portfolio samples: [PORTFOLIO LINK]

I can start this week. How many deliverables are you planning for the first phase?

Best,
[YOUR NAME]`;
  }, [job.title, job.technology]);

  const defaultOriginalChatGPT = useMemo(() => {
    return `Hello,

I noticed your posting for "${job.title}" and would love to assist you. With over 8+ years of proven expertise in ${job.technology || 'modern web development'}, our team specializes in delivering robust, high-performance digital solutions tailored to your exact business objectives.

Here is how we would approach this:
1. Conduct an initial review of your requirements and define clear milestone deliverables.
2. Build responsive, pixel-perfect pages optimized for speed, search engines, and maximum conversion.
3. Perform thorough cross-device QA testing and provide post-launch documentation.

Relevant work samples: [PORTFOLIO LINK]

I am available immediately and look forward to discussing your timeline and project specifications.

Kind regards,
[YOUR NAME]`;
  }, [job.title, job.technology]);

  const defaultClaude = useMemo(() => {
    return `Hi there,

Regarding "${job.title}":

We specialize in high-converting ${job.technology || 'digital'} implementations for B2B organizations. 

Key execution focus:
• Fast initial prototype to lock down design standards and core conversion funnels
• High-performance, SEO-ready structure with clean responsive layouts
• Modular templates designed for long-term scalability

Portfolio links: [PORTFOLIO LINK]

Ready to start immediately. What is your preferred start date for Phase 1?

Best,
[YOUR NAME]`;
  }, [job.title, job.technology]);

  const [proposalText, setProposalText] = useState(defaultImprovedChatGPT);

  // Keep proposal in sync when switching model / variant
  useEffect(() => {
    if (activeModel === 'chatgpt') {
      setProposalText(variant === 'improved' ? defaultImprovedChatGPT : defaultOriginalChatGPT);
    } else {
      setProposalText(defaultClaude);
    }
  }, [activeModel, variant, defaultImprovedChatGPT, defaultOriginalChatGPT, defaultClaude]);

  // Word count computation
  const wordCount = useMemo(() => {
    const trimmed = proposalText.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).length;
  }, [proposalText]);

  // Handle Copy to clipboard
  const handleCopyProposal = async () => {
    try {
      await navigator.clipboard.writeText(proposalText);
      setCopiedProposal(true);
      setTimeout(() => setCopiedProposal(false), 2000);
    } catch {
      // Fallback
    }
  };

  // Handle Copy trackable link
  const handleCopyLink = async (link: TrackableLink) => {
    try {
      await navigator.clipboard.writeText(link.url);
      setCopiedLinkId(link.id);
      setTimeout(() => setCopiedLinkId(null), 2000);
    } catch {
      // Fallback
    }
  };

  // Handle Regenerate
  const handleRegenerate = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      if (activeModel === 'chatgpt') {
        setProposalText(variant === 'improved' ? defaultImprovedChatGPT : defaultOriginalChatGPT);
      } else {
        setProposalText(defaultClaude);
      }
      setIsRegenerating(false);
      setNotification('Proposal regenerated');
      setTimeout(() => setNotification(null), 2500);
    }, 600);
  };

  // Handle Insert link into letter
  const handleInsertIntoLetter = (linkUrl: string) => {
    let updatedText = proposalText;
    if (updatedText.includes('[PORTFOLIO LINK]')) {
      updatedText = updatedText.replace('[PORTFOLIO LINK]', linkUrl);
    } else if (!updatedText.includes(linkUrl)) {
      // Append before the closing lines if found
      if (updatedText.includes('I can start this week')) {
        updatedText = updatedText.replace(
          'I can start this week',
          `Samples: ${linkUrl}\n\nI can start this week`
        );
      } else {
        updatedText += `\n\nSamples: ${linkUrl}`;
      }
    }

    setProposalText(updatedText);
    setActiveTab('cover-letter');
    setNotification('Trackable link inserted into letter');
    setTimeout(() => setNotification(null), 3000);
  };

  // Handle Create Trackable Link
  const handleCreateLink = () => {
    const docName = selectedDoc || techPortfolioName;
    const randomHash = Math.random().toString(36).substring(2, 10);
    const newLink: TrackableLink = {
      id: `link-${Date.now()}`,
      title: docName,
      status: 'Not opened',
      url: `https://${selectedDomain}/view/${randomHash}`,
      views: 0,
      lastViewed: 'Never',
      author: 'Harsh Vardhan',
      createdAt: 'Just now',
    };

    setLinks((prev) => [newLink, ...prev]);
    setSelectedDoc('');
    setNotification(`Created trackable link for "${docName}"`);
    setTimeout(() => setNotification(null), 3000);
  };

  const openedCount = links.filter((l) => l.status === 'Opened').length;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[560px] md:max-w-[590px] p-0 flex flex-col bg-white overflow-hidden shadow-2xl border-l border-[#E5E7EB] z-50 focus:outline-none"
      >
        {/* Accessible Header Title & Description (Hidden for screen readers if custom header is used) */}
        <div className="sr-only">
          <SheetTitle>Generate proposal</SheetTitle>
          <SheetDescription>{job.title}</SheetDescription>
        </div>

        {/* 1. TOP HEADER */}
        <div className="px-6 pt-5 pb-3 bg-white relative shrink-0">
          <div className="pr-8">
            <h2 className="text-lg font-bold text-[#111827] tracking-tight">
              Generate proposal
            </h2>
            <p className="text-xs text-[#6B7280] truncate mt-0.5" title={job.title}>
              {job.title}
            </p>
          </div>
        </div>

        {/* TABS */}
        <div className="px-6 border-b border-[#E5E7EB] bg-white relative shrink-0">
          <div className="flex items-center gap-6">
            {/* Tab 1: Cover letter */}
            <button
              type="button"
              onClick={() => setActiveTab('cover-letter')}
              className={cn(
                'inline-flex items-center gap-2 pb-3 pt-3 text-xs font-medium cursor-pointer transition-colors relative border-b-2 -mb-[1px]',
                activeTab === 'cover-letter'
                  ? 'border-[#14A800] text-[#14A800] font-semibold'
                  : 'border-transparent text-[#6B7280] hover:text-[#111827]'
              )}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Cover letter</span>
            </button>

            {/* Tab 2: Share document */}
            <button
              type="button"
              onClick={() => setActiveTab('share-document')}
              className={cn(
                'inline-flex items-center gap-1.5 pb-3 pt-3 text-xs font-medium cursor-pointer transition-colors relative border-b-2 -mb-[1px]',
                activeTab === 'share-document'
                  ? 'border-[#14A800] text-[#14A800] font-semibold'
                  : 'border-transparent text-[#6B7280] hover:text-[#111827]'
              )}
            >
              <Link2 className="h-3.5 w-3.5" />
              <span>Share document</span>
              <span
                className={cn(
                  'px-1.5 py-0.2 rounded-full text-[10px] font-bold leading-tight transition-colors',
                  activeTab === 'share-document'
                    ? 'bg-[#14A800] text-white'
                    : 'bg-[#F3F4F6] text-[#4B5563]'
                )}
              >
                {links.length}
              </span>
            </button>
          </div>
        </div>

        {/* NOTIFICATION TOAST BAR */}
        {notification && (
          <div className="bg-[#F1FAF0] border-b border-[#BEE8B8] px-6 py-2 text-xs font-medium text-[#108A00] flex items-center justify-between animate-in fade-in duration-200">
            <span>{notification}</span>
            <button
              type="button"
              onClick={() => setNotification(null)}
              className="text-[#108A00] hover:text-[#0D7300] cursor-pointer"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}

        {/* 2. BODY CONTENT (SCROLLABLE) */}
        <div className="flex-1 overflow-y-auto px-6 py-5 bg-white">
          {activeTab === 'cover-letter' ? (
            <div className="flex flex-col gap-4">
              {/* MODEL SELECTOR CARDS */}
              <div className="grid grid-cols-2 gap-3 pb-3 border-b border-[#E5E7EB]">
                {/* ChatGPT Card */}
                <button
                  type="button"
                  onClick={() => setActiveModel('chatgpt')}
                  className={cn(
                    'p-2.5 rounded-lg flex items-center gap-2.5 text-left transition-all cursor-pointer relative',
                    activeModel === 'chatgpt'
                      ? 'bg-[#F1FAF0]/40 after:absolute after:bottom-[-13px] after:left-0 after:right-0 after:h-[2px] after:bg-[#14A800]'
                      : 'hover:bg-gray-50'
                  )}
                >
                  <div className="w-6 h-6 rounded-full bg-[#F1FAF0] border border-[#BEE8B8] flex items-center justify-center shrink-0">
                    <span className="text-[11px] font-bold text-[#14A800]">G</span>
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-[#111827] leading-none">
                      ChatGPT
                    </div>
                    <div className="text-[10px] text-[#14A800] font-medium mt-1 flex items-center gap-1">
                      <span>GPT-5</span>
                      <span>·</span>
                      <span>Ready</span>
                    </div>
                  </div>
                </button>

                {/* Claude Card */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveModel('claude');
                    if (!claudeGenerated) setClaudeGenerated(true);
                  }}
                  className={cn(
                    'p-2.5 rounded-lg flex items-center gap-2.5 text-left transition-all cursor-pointer relative',
                    activeModel === 'claude'
                      ? 'bg-gray-50/80 after:absolute after:bottom-[-13px] after:left-0 after:right-0 after:h-[2px] after:bg-[#111827]'
                      : 'hover:bg-gray-50 opacity-80 hover:opacity-100'
                  )}
                >
                  <div className="w-6 h-6 rounded-full bg-[#FFF7ED] flex items-center justify-center shrink-0">
                    <span className="text-[11px] font-bold text-[#EA580C]">C</span>
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-[#4B5563] leading-none">
                      Claude
                    </div>
                    <div className="text-[10px] text-[#9CA3AF] mt-1">
                      {claudeGenerated ? 'Claude 3.7 · Ready' : 'Not generated'}
                    </div>
                  </div>
                </button>
              </div>

              {/* VARIANT TOGGLE & WORD COUNT ROW */}
              <div className="flex items-center justify-between pt-1">
                {/* Segmented Pill: Original vs Improved */}
                <div className="bg-[#F3F4F6] p-0.5 rounded-lg inline-flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setVariant('original')}
                    className={cn(
                      'px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer',
                      variant === 'original'
                        ? 'bg-white text-[#111827] shadow-xs'
                        : 'text-[#6B7280] hover:text-[#111827]'
                    )}
                  >
                    Original
                  </button>
                  <button
                    type="button"
                    onClick={() => setVariant('improved')}
                    className={cn(
                      'px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer inline-flex items-center gap-1',
                      variant === 'improved'
                        ? 'bg-white text-[#111827] shadow-xs font-semibold'
                        : 'text-[#6B7280] hover:text-[#111827]'
                    )}
                  >
                    <span>Improved</span>
                    <Sparkles className="h-3 w-3 text-amber-500 fill-amber-500" />
                  </button>
                </div>

                {/* Word Count Indicator */}
                <div className="text-xs text-[#6B7280] font-medium">
                  {activeModel === 'chatgpt' ? 'GPT-5' : 'Claude'} · {wordCount} words
                </div>
              </div>

              {/* PROPOSAL TEXT CARD */}
              <div className="relative rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-xs transition-shadow hover:border-gray-300">
                {/* Top Right Copy Button */}
                <button
                  type="button"
                  onClick={handleCopyProposal}
                  title="Copy to clipboard"
                  className="absolute right-3.5 top-3.5 p-1.5 rounded-md text-[#6B7280] hover:text-[#111827] hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  {copiedProposal ? (
                    <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#16A34A]">
                      <Check className="h-3.5 w-3.5" />
                      <span>Copied</span>
                    </div>
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>

                {/* Editable Proposal Content */}
                <textarea
                  value={proposalText}
                  onChange={(e) => setProposalText(e.target.value)}
                  rows={14}
                  className="w-full bg-transparent border-0 p-0 text-sm text-[#1F2937] leading-relaxed resize-none focus:outline-none focus:ring-0 font-normal selection:bg-green-100"
                  placeholder="Your proposal will appear here..."
                />
              </div>
            </div>
          ) : (
            /* TAB 2: SHARE DOCUMENT VIEW */
            <div className="flex flex-col gap-6">
              {/* Explainer */}
              <div>
                <p className="text-xs text-[#4B5563] leading-relaxed">
                  Create a trackable link to any document for this job, then see when the client opens it.
                </p>
              </div>

              {/* Form Controls */}
              <div className="flex flex-col gap-3.5">
                {/* Document Select */}
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                    Document
                  </label>
                  <div className="relative">
                    <select
                      value={selectedDoc}
                      onChange={(e) => setSelectedDoc(e.target.value)}
                      className="w-full h-10 px-3 pr-8 rounded-lg border border-[#E5E7EB] bg-white text-xs text-[#111827] shadow-xs appearance-none focus:outline-none focus:border-[#14A800] focus:ring-1 focus:ring-[#14A800] cursor-pointer"
                    >
                      <option value="">Select a document</option>
                      <option value="Pitch Deck - Upwork">Pitch Deck - Upwork</option>
                      <option value={techPortfolioName}>{techPortfolioName}</option>
                      <option value="Webethics Solutions Company Profile 2026">
                        Webethics Solutions Company Profile 2026
                      </option>
                      <option value="Case Study – B2B High Conversion Landing Pages">
                        Case Study – B2B High Conversion Landing Pages
                      </option>
                      <option value="Rate Card & SLA Agreement">Rate Card & SLA Agreement</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-[#9CA3AF] pointer-events-none" />
                  </div>
                </div>

                {/* Domain Select */}
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                    Domain
                  </label>
                  <div className="relative">
                    <select
                      value={selectedDomain}
                      onChange={(e) => setSelectedDomain(e.target.value)}
                      className="w-full h-10 px-3 pr-8 rounded-lg border border-[#E5E7EB] bg-white text-xs text-[#111827] shadow-xs appearance-none focus:outline-none focus:border-[#14A800] focus:ring-1 focus:ring-[#14A800] cursor-pointer"
                    >
                      <option value="files.webethicssolutions.com">
                        files.webethicssolutions.com
                      </option>
                      <option value="docs.webethicssolutions.com">
                        docs.webethicssolutions.com
                      </option>
                      <option value="proposals.webethicssolutions.com">
                        proposals.webethicssolutions.com
                      </option>
                    </select>
                    <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-[#9CA3AF] pointer-events-none" />
                  </div>
                  <p className="text-[11px] text-[#6B7280] mt-1.5">
                    Opens at https://{selectedDomain}/view/...
                  </p>
                </div>

                {/* Create Trackable Link Button */}
                <button
                  type="button"
                  onClick={handleCreateLink}
                  className="w-full h-9 rounded-lg bg-[#14A800] hover:bg-[#108A00] text-white text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Create trackable link</span>
                </button>
              </div>

              {/* Links List Section */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-[#111827]">Links for this job</h3>
                  <span className="text-xs text-[#6B7280]">
                    {links.length} links · {openedCount} opened
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  {links.map((link) => {
                    const isOpened = link.status === 'Opened';
                    const isCopied = copiedLinkId === link.id;

                    return (
                      <div
                        key={link.id}
                        className="p-4 rounded-xl border border-[#E5E7EB] bg-white shadow-xs flex flex-col gap-2.5 transition-all hover:border-[#BEE8B8] hover:shadow-sm"
                      >
                        {/* Title Row */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-[#F1FAF0] border border-[#BEE8B8] flex items-center justify-center shrink-0">
                              <FileText className="h-4 w-4 text-[#14A800]" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-bold text-[#111827] truncate">
                                  {link.title}
                                </span>
                                <span
                                  className={cn(
                                    'px-2 py-0.5 rounded-full text-[10px] font-semibold border',
                                    isOpened
                                      ? 'bg-[#DFF3DC] text-[#14A800] border-[#BEE8B8]'
                                      : 'bg-[#F3F4F6] text-[#4B5563] border-[#E5E7EB]'
                                  )}
                                >
                                  {link.status}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Quick Actions */}
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleCopyLink(link)}
                              title="Copy trackable link"
                              className="p-1.5 rounded-md text-[#6B7280] hover:text-[#111827] hover:bg-gray-100 transition-colors cursor-pointer"
                            >
                              {isCopied ? (
                                <Check className="h-3.5 w-3.5 text-[#14A800]" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </button>
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Open link"
                              className="p-1.5 rounded-md text-[#6B7280] hover:text-[#111827] hover:bg-gray-100 transition-colors cursor-pointer"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          </div>
                        </div>

                        {/* URL Display */}
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-[#14A800] hover:text-[#108A00] hover:underline font-mono truncate"
                        >
                          {link.url}
                        </a>

                        {/* Stats Row */}
                        <div className="flex items-center gap-2 text-[11px] text-[#6B7280] flex-wrap">
                          <span className="inline-flex items-center gap-1 font-medium">
                            <Eye className="h-3 w-3" />
                            <span>{link.views} views</span>
                          </span>
                          <span>·</span>
                          <span>Last viewed {link.lastViewed}</span>
                          <span>·</span>
                          <span>Created {link.createdAt} by {link.author}</span>
                        </div>

                        {/* Insert Button */}
                        <div className="pt-1 border-t border-gray-100">
                          <button
                            type="button"
                            onClick={() => handleInsertIntoLetter(link.url)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-[#14A800] hover:text-[#108A00] transition-colors cursor-pointer"
                          >
                            <Plus className="h-3.5 w-3.5 text-[#14A800]" />
                            <span>Insert into letter</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3. FOOTER TOOLBAR (Keeps ONLY ⟳ Regenerate, excludes crossed-out buttons) */}
        {activeTab === 'cover-letter' && (
          <div className="px-6 py-3.5 border-t border-[#E5E7EB] bg-white flex items-center justify-center shrink-0">
            <button
              type="button"
              onClick={handleRegenerate}
              disabled={isRegenerating}
              className="inline-flex items-center justify-center gap-2 px-5 py-2 text-xs font-medium text-[#374151] hover:text-[#111827] hover:bg-gray-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              <RotateCw
                className={cn('h-3.5 w-3.5 text-[#4B5563]', isRegenerating && 'animate-spin')}
              />
              <span>Regenerate</span>
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
