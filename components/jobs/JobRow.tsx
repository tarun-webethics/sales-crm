"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ChevronRight,
  ChevronUp,
  ExternalLink,
  Star,
  Clock,
  Calendar,
  Award,
  Briefcase,
  History,
  Sparkles,
} from "lucide-react";
import { Job, JobStatus } from "@/types/job";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RatingBadges } from "@/components/jobs/RatingBadges";
import { StatusSelect } from "@/components/jobs/StatusSelect";
import { ProposalModal } from "@/components/jobs/ProposalModal";
import { getDetailedJobInfo } from "@/lib/jobDetails";
import { cn } from "@/lib/utils";

interface JobRowProps {
  job: Job;
  isSelected: boolean;
  isFiltersOpen?: boolean;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  onToggleSelect: (id: string) => void;
  onStatusChange: (id: string, status: JobStatus) => void;
}

/**
 * Circular progress score SVG ring with dynamic color filling on the basis of percentage value:
 * >= 75%: Green (#16A34A)
 * 40% - 74%: Amber (#F59E0B)
 * < 40%: Red (#DC2626)
 */
function CircularScore({
  value,
  size = 44,
  strokeWidth = 3.5,
  className,
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedValue = Math.min(100, Math.max(0, value));
  const strokeDashoffset = circumference - (clampedValue / 100) * circumference;

  let color = "#DC2626"; // Red for < 40
  if (clampedValue >= 75) {
    color = "#16A34A"; // Green for >= 75
  } else if (clampedValue >= 40) {
    color = "#F59E0B"; // Amber for 40-74
  }

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center shrink-0 select-none",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90 transform"
      >
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Dynamic Colored Filling Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <span
        className="absolute font-bold text-xs"
        style={{ color, fontSize: size <= 32 ? "10px" : "13px" }}
      >
        {clampedValue}
      </span>
    </div>
  );
}

export function JobRow({
  job,
  isSelected,
  isFiltersOpen = false,
  isExpanded: controlledExpanded,
  onToggleExpand,
  onToggleSelect,
  onStatusChange,
}: JobRowProps) {
  const [internalExpanded, setInternalExpanded] = useState(false);
  const isExpanded =
    controlledExpanded !== undefined ? controlledExpanded : internalExpanded;

  const [showBreakdown, setShowBreakdown] = useState(false);
  const [selectedModel, setSelectedModel] = useState<"chatgpt" | "claude">(
    "chatgpt",
  );
  const [isProposalOpen, setIsProposalOpen] = useState(false);

  const details = getDetailedJobInfo(job);

  const handleToggle = () => {
    if (onToggleExpand) {
      onToggleExpand();
    } else {
      setInternalExpanded((prev) => !prev);
    }
  };

  const handleRowClick = (e: React.MouseEvent<HTMLTableRowElement>) => {
    // Prevent expanding if the user clicked an interactive control
    const target = e.target as HTMLElement;
    if (
      target.closest('button, a, input, [role="combobox"], [role="menuitem"]')
    ) {
      return;
    }
    handleToggle();
  };

  return (
    <>
      <TableRow
        data-state={isSelected ? "selected" : undefined}
        onClick={handleRowClick}
        className={cn(
          "group transition-colors cursor-pointer select-none",
          isSelected
            ? "bg-blue-50/50 hover:bg-blue-50/70"
            : "hover:bg-slate-50/60",
          isExpanded && (isSelected ? "bg-blue-50/60" : "bg-slate-50/40"),
        )}
      >
        {/* 0. Expand Chevron Toggle */}
        <TableCell className="w-9 pl-3.5 pr-0 py-2 border-b border-slate-100">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleToggle();
            }}
            className="p-1 rounded-md text-black hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label={
              isExpanded
                ? `Collapse details for ${job.title}`
                : `Expand details for ${job.title}`
            }
            aria-expanded={isExpanded}
          >
            <ChevronRight
              className={cn(
                "h-4 w-4 transition-transform duration-300 ease-in-out",
                isExpanded ? "rotate-90 text-blue-600" : "rotate-0 text-black",
              )}
            />
          </button>
        </TableCell>

        {/* 1. JOB TITLE (Clicking triggers accordion directly) */}
        <TableCell
          className={cn(
            "px-3.5 py-2 transition-all duration-300 border-b border-slate-100",
            isFiltersOpen
              ? "w-[280px] max-w-[340px] xl:max-w-[420px]"
              : "w-[420px] max-w-[560px] xl:max-w-[740px]",
          )}
        >
          <div className="flex items-center gap-1.5 min-w-0 max-w-full">
            {job.isCream ? (
              <span
                className="inline-flex items-center gap-0.5 h-4 px-1 rounded bg-[#FEFCE8] border border-[#FDE047] text-[#854D0E] text-[10px] font-bold shrink-0 leading-none select-none"
                title={`Cream Job${job.creamCount ? ` (${job.creamCount})` : ''}`}
              >
                <Star className="h-2.5 w-2.5 fill-[#EAB308] text-[#EAB308] shrink-0" />
                {job.creamCount ? <span className="leading-none">{job.creamCount}</span> : null}
              </span>
            ) : (
              <Image
                src="/up-log.png"
                alt="Upwork Job"
                width={16}
                height={16}
                className="h-4 w-4 shrink-0 rounded-full object-contain"
              />
            )}

            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggle();
                    }}
                    className="text-[13px] text-slate-900 transition-colors truncate block text-left min-w-0 flex-1 cursor-pointer"
                  >
                    {job.title}
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="max-w-md p-2.5 text-xs text-left"
                >
                  <p className=" text-white">{job.title}</p>
                  {job.company && (
                    <p className="text-[11px] text-gray-300 mt-1">
                      Company: {job.company}
                    </p>
                  )}
                  <p className="text-[10px] text-slate-300 mt-1  italic">
                    Click to view details & AI analysis
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </TableCell>

        {/* 3. AI RATING (Pills placed in their own column) */}
        <TableCell className="whitespace-nowrap px-3.5 py-2 border-b border-slate-100">
          <RatingBadges
            verdict={job.magicVerdict}
            verdictScore={job.verdictScore}
            modelScores={job.modelScores}
          />
        </TableCell>

        {/* 4. BUDGET */}
        <TableCell className="whitespace-nowrap px-3.5 py-2 border-b border-slate-100">
          <div className="flex items-baseline gap-1">
            <span className="text-xs text-slate-800">{job.budgetAmount}</span>
            <span className="text-[10px] text-black uppercase font-medium">{job.budgetType}</span>
          </div>
        </TableCell>

        {/* 5. POSTED */}
        <TableCell className="whitespace-nowrap px-3.5 py-2 text-xs text-slate-500 border-b border-slate-100">
          {job.posted}
        </TableCell>

        {/* 6. TOTAL SPENT */}
        <TableCell className="whitespace-nowrap px-3.5 py-2 border-b border-slate-100">
          <span className="text-xs text-slate-700">
            {job.totalSpent}
          </span>
        </TableCell>

        {/* 7. LOCATION */}
        <TableCell className="whitespace-nowrap px-3.5 py-2 text-xs text-slate-600 border-b border-slate-100">
          {job.location}
        </TableCell>

        {/* 8. STATUS */}
        <TableCell
          className="whitespace-nowrap px-3.5 pr-4 py-2 border-b border-slate-100"
          onClick={(e) => e.stopPropagation()}
        >
          <StatusSelect
            status={job.status}
            onStatusChange={(newStatus) => onStatusChange(job.id, newStatus)}
          />
        </TableCell>
      </TableRow>

      {/* Accordion Expandable Row matching the exact reference layout */}
      <TableRow
        className={cn(
          "hover:bg-transparent transition-all",
          isExpanded ? "border-b border-slate-100" : "border-b-0",
        )}
      >
        <TableCell colSpan={8} className="p-0">
          <div
            className={cn(
              "grid transition-all duration-300 ease-in-out",
              isExpanded
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0",
            )}
          >
            <div className="overflow-hidden">
              <div className="p-5 sm:p-7 lg:p-8 bg-slate-50/40 border-t border-slate-100 space-y-6 sm:space-y-7">
                {/* 1. AI FITCHECK BREAKDOWN CARD */}
                <div className="rounded-xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
                  {/* Top Bar Header */}
                  <div
                    className={cn(
                      "px-4 py-3 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3 transition-colors",
                      showBreakdown && "border-b border-slate-100",
                    )}
                  >
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs">
                      {/* Client Score Dynamic SVG Circle & Label */}
                      <div className="flex items-center gap-2">
                        <CircularScore
                          value={details.fitCheck.clientScore}
                          size={30}
                          strokeWidth={3}
                        />
                        <div className="flex flex-col">
                          <span
                            className={cn(
                              "font-medium text-xs",
                              details.fitCheck.clientVerdictColor,
                            )}
                          >
                            Client
                          </span>
                          <span
                            className={cn(
                              "font-bold text-xs -mt-1",
                              details.fitCheck.clientVerdictColor,
                            )}
                          >
                            {details.fitCheck.clientVerdict.replace(
                              "Client ",
                              "",
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Job Score Dynamic SVG Circle & Label */}
                      <div className="flex items-center gap-2">
                        <CircularScore
                          value={details.fitCheck.jobScore}
                          size={30}
                          strokeWidth={3}
                        />
                        <div className="flex flex-col">
                          <span
                            className={cn(
                              "font-medium text-xs",
                              details.fitCheck.jobVerdictColor,
                            )}
                          >
                            Job
                          </span>
                          <span
                            className={cn(
                              "font-bold text-xs -mt-1",
                              details.fitCheck.jobVerdictColor,
                            )}
                          >
                            {details.fitCheck.jobVerdict.replace("Job ", "")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Hide / Show breakdown button */}
                    <button
                      type="button"
                      onClick={() => setShowBreakdown((prev) => !prev)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors ml-auto cursor-pointer shadow-2xs"
                    >
                      <span>
                        {showBreakdown ? "Hide breakdown" : "Show breakdown"}
                      </span>
                      <ChevronUp
                        className={cn(
                          "h-3.5 w-3.5 text-black transition-transform duration-200",
                          !showBreakdown && "rotate-180",
                        )}
                      />
                    </button>
                  </div>

                  {/* Collapsible Breakdown Cards (Smooth Grid Transition) */}
                  <div
                    className={cn(
                      "grid transition-all duration-300 ease-in-out",
                      showBreakdown
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <div className="overflow-hidden">
                      <div className="p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-2 gap-4 bg-white">
                        {/* Left Card: Client score with Dynamic SVG Circle */}
                        <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/30 space-y-3.5">
                          <div className="flex items-start gap-3.5">
                            {/* Dynamic SVG Score Circle */}
                            <CircularScore
                              value={details.clientScoreCard.score}
                              size={44}
                              strokeWidth={3.5}
                            />
                            <div className="space-y-1.5 min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-slate-900">
                                  Client score
                                </span>
                              </div>
                              <p className="text-xs text-amber-900 bg-amber-50 border border-amber-200/80 rounded-md px-2 py-1 leading-relaxed">
                                {details.clientScoreCard.summary}
                              </p>
                            </div>
                          </div>

                          {/* Progress Metrics List */}
                          <div className="space-y-2 pt-1">
                            {details.clientScoreCard.metrics.map(
                              (metric, mIdx) => (
                                <div
                                  key={mIdx}
                                  className="flex items-center gap-3 text-xs"
                                >
                                  <span className="w-36 text-slate-600 truncate flex items-center gap-1">
                                    <span>{metric.label}</span>
                                    <span className="text-black text-[10px] cursor-help">
                                      ⓘ
                                    </span>
                                  </span>
                                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                      className={cn(
                                        "h-full rounded-full",
                                        metric.colorClass,
                                      )}
                                      style={{
                                        width: `${(metric.current / metric.max) * 100}%`,
                                      }}
                                    />
                                  </div>
                                  <span className="w-10 text-right font-mono text-[11px] font-semibold text-slate-800">
                                    {metric.current}/{metric.max}
                                  </span>
                                </div>
                              ),
                            )}
                          </div>
                        </div>

                        {/* Right Card: Job score with Dynamic SVG Circle & Model Toggle */}
                        <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/30 space-y-3.5">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3.5 min-w-0 flex-1">
                              {/* Dynamic SVG Score Circle */}
                              <CircularScore
                                value={
                                  selectedModel === "chatgpt"
                                    ? details.jobScoreCard.chatgptScore
                                    : details.jobScoreCard.claudeScore
                                }
                                size={44}
                                strokeWidth={3.5}
                              />
                              <div className="space-y-1.5 min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-sm text-slate-900">
                                    Job score
                                  </span>
                                </div>
                                <p className="text-xs text-amber-900 bg-amber-50 border border-amber-200/80 rounded-md px-2 py-1 leading-relaxed">
                                  {details.jobScoreCard.summary}
                                </p>
                              </div>
                            </div>

                            {/* ChatGPT / Claude Pills */}
                            <div className="inline-flex p-0.5 rounded-lg border border-slate-200 bg-slate-100/70 shrink-0 text-xs">
                              <button
                                type="button"
                                onClick={() => setSelectedModel("chatgpt")}
                                className={cn(
                                  "px-2.5 py-1 rounded-md transition-colors text-xs font-medium cursor-pointer",
                                  selectedModel === "chatgpt"
                                    ? "bg-white text-slate-900 shadow-2xs"
                                    : "text-slate-500 hover:text-slate-900",
                                )}
                              >
                                ChatGPT
                              </button>
                              <button
                                type="button"
                                onClick={() => setSelectedModel("claude")}
                                className={cn(
                                  "px-2.5 py-1 rounded-md transition-colors text-xs font-medium cursor-pointer",
                                  selectedModel === "claude"
                                    ? "bg-white text-slate-900 shadow-2xs"
                                    : "text-slate-500 hover:text-slate-900",
                                )}
                              >
                                Claude
                              </button>
                            </div>
                          </div>

                          {/* Progress Metrics List */}
                          <div className="space-y-2 pt-1">
                            {details.jobScoreCard.metrics.map(
                              (metric, mIdx) => (
                                <div
                                  key={mIdx}
                                  className="flex items-center gap-3 text-xs"
                                >
                                  <span className="w-36 text-slate-600 truncate flex items-center gap-1">
                                    <span>{metric.label}</span>
                                    <span className="text-black text-[10px] cursor-help">
                                      ⓘ
                                    </span>
                                  </span>
                                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                      className={cn(
                                        "h-full rounded-full",
                                        metric.colorClass,
                                      )}
                                      style={{
                                        width: `${(metric.current / metric.max) * 100}%`,
                                      }}
                                    />
                                  </div>
                                  <span className="w-10 text-right font-mono text-[11px] font-semibold text-slate-800">
                                    {metric.current}/{metric.max}
                                  </span>
                                </div>
                              ),
                            )}
                          </div>

                          <p className="text-[11px] text-black italic">
                            {details.jobScoreCard.footnote}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. JOB DETAILS CARD (Spacious & Breathable Layout) */}
                <div className="bg-white space-y-7">
                  {/* Job Description Text */}
                  <div className="space-y-5 max-w-4xl text-[13px] text-xs text-slate-700 leading-relaxed sm:leading-6">
                    {/* Intro paragraph */}
                    <p className="text-slate-800 leading-relaxed sm:leading-6">
                      {details.description.intro}
                    </p>

                    {/* Bullets List */}
                    <div className="space-y-3 pt-1">
                      <p className="font-semibold text-slate-900 text-xs tracking-tight">
                        {details.description.bulletsTitle}
                      </p>
                      <ul className="space-y-2.5 pl-0.5">
                        {details.description.bullets.map((bullet, bIdx) => (
                          <li
                            key={bIdx}
                            className="flex items-start gap-3 text-slate-700 leading-relaxed"
                          >
                            <span className="inline-block h-1.5 w-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Outro paragraphs */}
                    <div className="space-y-3 pt-2 text-slate-700 leading-relaxed sm:leading-6">
                      {details.description.outro.map((paragraph, oIdx) => {
                        const isNote = paragraph.toLowerCase().startsWith('note:');
                        return isNote ? (
                          <div
                            key={oIdx}
                            className="mt-3.5 p-3 rounded-lg bg-slate-50 border border-slate-200/80 text-xs sm:text-[13px] text-slate-600 font-medium leading-normal"
                          >
                            {paragraph}
                          </div>
                        ) : (
                          <p key={oIdx}>{paragraph}</p>
                        );
                      })}
                    </div>
                  </div>

                  {/* 3. SKILLS & EXPERTISE PILLS */}
                  <div className="pt-6 border-t border-slate-100 space-y-3">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                      Skills & Expertise
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {details.skills.map((skill) => {
                        const isHighlighted = skill === details.highlightSkill;
                        return (
                          <span
                            key={skill}
                            className={cn(
                              "px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors shadow-2xs",
                              isHighlighted
                                ? "bg-amber-50 text-amber-800 border-amber-200 font-semibold shadow-xs"
                                : "bg-slate-50/70 hover:bg-white text-slate-700 border-slate-200/90",
                            )}
                          >
                            {skill}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* 4. METADATA SPECIFICATIONS ROW WITH ICONS */}
                  <div className="pt-5 border-t border-slate-100 space-y-3">
                    <div className="flex flex-wrap items-center gap-x-7 gap-y-3 text-xs text-slate-600">
                      <div className="inline-flex items-center gap-2">
                        <Clock className="h-4 w-4 text-slate-400 shrink-0" />
                        <span className="font-medium text-slate-700">{details.specs.workload}</span>
                      </div>

                      <div className="inline-flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                        <span className="font-medium text-slate-700">{details.specs.duration}</span>
                      </div>

                      <div className="inline-flex items-center gap-2">
                        <Award className="h-4 w-4 text-slate-400 shrink-0" />
                        <span className="font-medium text-slate-700">{details.specs.experienceLevel}</span>
                      </div>

                      <div className="inline-flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-slate-400 shrink-0" />
                        <span className="font-medium text-slate-700">{details.specs.projectType}</span>
                      </div>

                      <div className="inline-flex items-center gap-2">
                        <History className="h-4 w-4 text-slate-400 shrink-0" />
                        <button
                          type="button"
                          onClick={() =>
                            alert(`Viewing client history for ${job.title}`)
                          }
                          className="font-medium text-slate-700 hover:text-slate-900 underline decoration-slate-300 hover:decoration-slate-600 underline-offset-4 transition-colors cursor-pointer"
                        >
                          Client&apos;s Work History ({details.specs.historyProjectsCount} projects)
                        </button>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400 font-medium">
                      {details.specs.categoryBreadcrumb}
                    </p>
                  </div>

                  {/* 5. BOTTOM ACTION TOOLBAR */}
                  <div className="pt-5 border-t border-slate-100 flex items-center justify-end gap-3">
                    {/* Generate Proposal */}
                    <Button
                      onClick={() => setIsProposalOpen(true)}
                      className="inline-flex items-center gap-2 h-9 px-4 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 shadow-2xs transition-colors cursor-pointer"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                      <span>Generate Proposal</span>
                    </Button>

                    {/* Open project on Upwork */}
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 h-9 px-4 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 shadow-2xs transition-colors cursor-pointer"
                    >
                      <span>Upwork</span>
                      <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TableCell>
      </TableRow>

      {/* Slide-over Proposal Generator Modal */}
      <ProposalModal
        isOpen={isProposalOpen}
        onOpenChange={setIsProposalOpen}
        job={job}
      />
    </>
  );
}
