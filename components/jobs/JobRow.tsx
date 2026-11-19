"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ChevronRight,
  ChevronUp,
  ExternalLink,
  Star,
  AlertCircle,
  Clock,
  Calendar,
  Award,
  Briefcase,
  History,
  Sparkles,
} from "lucide-react";
import { Job, JobStatus } from "@/types/job";
import { Checkbox } from "@/components/ui/checkbox";
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
  onToggleSelect,
  onStatusChange,
}: JobRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(true);
  const [selectedModel, setSelectedModel] = useState<"chatgpt" | "claude">(
    "chatgpt",
  );
  const [isProposalOpen, setIsProposalOpen] = useState(false);
  const [markStatus, setMarkStatus] = useState<string>(
    job.status === "Applied" ? "Applied" : "Not Applied",
  );

  const details = getDetailedJobInfo(job);

  const handleRowClick = (e: React.MouseEvent<HTMLTableRowElement>) => {
    // Prevent expanding if the user clicked an interactive control
    const target = e.target as HTMLElement;
    if (
      target.closest('button, a, input, [role="combobox"], [role="menuitem"]')
    ) {
      return;
    }
    setIsExpanded((prev) => !prev);
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
        <TableCell className="w-8 pl-3.5 pr-0 py-2 border-b border-slate-100">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded((prev) => !prev);
            }}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
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
                isExpanded ? "rotate-90 text-blue-600" : "rotate-0 text-slate-400",
              )}
            />
          </button>
        </TableCell>

        {/* 1. Checkbox */}
        <TableCell
          className="w-9 px-1 py-2 border-b border-slate-100"
          onClick={(e) => e.stopPropagation()}
        >
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onToggleSelect(job.id)}
            aria-label={`Select job ${job.title}`}
          />
        </TableCell>

        {/* 2. JOB TITLE (Clicking triggers accordion directly) */}
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
                      setIsExpanded((prev) => !prev);
                    }}
                    className="text-xs text-slate-900 font-medium hover:text-blue-600 transition-colors truncate block text-left min-w-0 flex-1 cursor-pointer"
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
            <span className="text-[10px] text-slate-400 uppercase font-medium">{job.budgetType}</span>
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
            onStatusChange={(newStatus) => {
              onStatusChange(job.id, newStatus);
              setMarkStatus(
                newStatus === "Applied" ? "Applied" : "Not Applied",
              );
            }}
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
        <TableCell colSpan={9} className="p-0">
          <div
            className={cn(
              "grid transition-all duration-300 ease-in-out",
              isExpanded
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0",
            )}
          >
            <div className="overflow-hidden">
              <div className="p-4 sm:p-5 bg-slate-50/40 border-t border-slate-100 space-y-5">
                {/* 1. TOP FIT CHECK BANNER CONTAINER */}
                <div className="rounded-xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
                  {/* Top Bar Header */}
                  <div className="px-4 py-3 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100">
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs">
                      <span className="font-semibold text-[11px] uppercase tracking-wider text-slate-500">
                        FIT CHECK
                      </span>

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

                      {/* Warning Notice with icon */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <AlertCircle className="h-3.5 w-3.5 text-red-500 shrink-0" />
                        <span>{details.fitCheck.warningMessage}</span>
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
                          "h-3.5 w-3.5 text-slate-400 transition-transform duration-200",
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
                            <div className="space-y-1 min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-slate-900">
                                  Client score
                                </span>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold border border-blue-200 text-blue-700 bg-blue-50/70">
                                  Confidence{" "}
                                  {details.clientScoreCard.confidence}
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 leading-relaxed">
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
                                    <span className="text-slate-400 text-[10px] cursor-help">
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
                              <div className="space-y-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-sm text-slate-900">
                                    Job score
                                  </span>
                                  <span
                                    className={cn(
                                      "px-2 py-0.5 rounded text-[10px] font-semibold border",
                                      details.jobScoreCard.verdictBadgeClass,
                                    )}
                                  >
                                    {details.jobScoreCard.verdict}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-600 leading-relaxed">
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
                                    <span className="text-slate-400 text-[10px] cursor-help">
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

                          <p className="text-[11px] text-slate-400 italic">
                            {details.jobScoreCard.footnote}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. JOB DESCRIPTION TEXT */}
                <div className="space-y-4 text-xs text-[#0F172A] leading-relaxed">
                  <p className=" text-[#0F172A] leading-relaxed">
                    {details.description.intro}
                  </p>

                  <div className="space-y-1.5 pt-1">
                    <p className="font-bold text-[#000000]">
                      {details.description.bulletsTitle}
                    </p>
                    <ul className="space-y-1.5 pl-1">
                      {details.description.bullets.map((bullet, bIdx) => (
                        <li
                          key={bIdx}
                          className="flex items-start gap-2 text-[#0F172A]"
                        >
                          <span className="text-black font-bold">•</span>
                          <span className="">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2 pt-2 text-xs text-[#0F172A]">
                    {details.description.outro.map((paragraph, oIdx) => (
                      <p key={oIdx} className=" leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                {/* 3. SKILLS & EXPERTISE PILLS */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {details.skills.map((skill) => {
                    const isHighlighted = skill === details.highlightSkill;
                    return (
                      <span
                        key={skill}
                        className={cn(
                          "px-2.5 py-1 rounded-full text-xs border transition-colors shadow-2xs",
                          isHighlighted
                            ? "bg-amber-50 text-amber-800 border-amber-200 font-semibold"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50",
                        )}
                      >
                        {skill}
                      </span>
                    );
                  })}
                </div>

                {/* 4. METADATA SPECIFICATIONS ROW WITH ICONS */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                    <div className="inline-flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      <span>{details.specs.workload}</span>
                    </div>

                    <div className="inline-flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      <span>{details.specs.duration}</span>
                    </div>

                    <div className="inline-flex items-center gap-1.5">
                      <Award className="h-3.5 w-3.5 text-slate-400" />
                      <span>{details.specs.experienceLevel}</span>
                    </div>

                    <div className="inline-flex items-center gap-1.5">
                      <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                      <span>{details.specs.projectType}</span>
                    </div>

                    <div className="inline-flex items-center gap-1.5">
                      <History className="h-3.5 w-3.5 text-slate-400" />
                      <button
                        type="button"
                        onClick={() =>
                          alert(`Viewing client history for ${job.title}`)
                        }
                        className="underline decoration-dotted hover:text-slate-900 cursor-pointer"
                      >
                        Client&apos;s Work History (
                        {details.specs.historyProjectsCount} projects)
                      </button>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    {details.specs.categoryBreadcrumb}
                  </p>
                </div>

                {/* 5. BOTTOM ACTION TOOLBAR */}
                <div className="pt-4 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left: Mark as statuses (Applied, Not Applied, Not Relevant) */}
                  <div className="flex flex-wrap items-center gap-4 text-xs">
                    <span className="font-semibold text-slate-800">Mark as:</span>
                    {(["Applied", "Not Applied", "Not Relevant"] as const).map(
                      (status) => {
                        const isChecked = markStatus === status;
                        return (
                          <label
                            key={status}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1.5 cursor-pointer text-slate-600 hover:text-slate-900 select-none"
                          >
                            <Checkbox
                              checked={isChecked}
                              onCheckedChange={() => {
                                setMarkStatus(status);
                                if (
                                  status === "Applied" ||
                                  status === "Not Applied"
                                ) {
                                  onStatusChange(job.id, status);
                                }
                              }}
                            />
                            <span
                              className={cn(
                                isChecked
                                  ? "font-semibold text-slate-900"
                                  : "text-slate-600",
                              )}
                            >
                              {status}
                            </span>
                          </label>
                        );
                      },
                    )}
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* Generate Proposal */}
                    <Button
                      onClick={() => setIsProposalOpen(true)}
                      className="h-9 px-3.5 gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shadow-xs transition-colors cursor-pointer"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Generate Proposal</span>
                    </Button>

                    {/* Open project */}
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-2xs transition-colors"
                    >
                      <span>Open project</span>
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
