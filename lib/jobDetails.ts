import { Job } from '@/types/job';

export interface ScoreMetric {
  label: string;
  current: number;
  max: number;
  colorClass: string;
}

export interface DetailedJobInfo {
  fitCheck: {
    clientScore: number;
    clientVerdict: string;
    clientVerdictColor: string;
    clientBorderColor: string;
    jobScore: number;
    jobVerdict: string;
    jobVerdictColor: string;
    jobBorderColor: string;
    warningMessage: string;
  };
  clientScoreCard: {
    score: number;
    confidence: number;
    summary: string;
    metrics: ScoreMetric[];
  };
  jobScoreCard: {
    score: number;
    verdict: string;
    verdictBadgeClass: string;
    chatgptScore: number;
    claudeScore: number;
    summary: string;
    metrics: ScoreMetric[];
    footnote: string;
  };
  description: {
    intro: string;
    bulletsTitle: string;
    bullets: string[];
    outro: string[];
  };
  skills: string[];
  highlightSkill: string;
  specs: {
    workload: string;
    duration: string;
    experienceLevel: string;
    projectType: string;
    historyProjectsCount: number;
    categoryBreadcrumb: string;
  };
}

export function getDetailedJobInfo(job: Job): DetailedJobInfo {
  const isHighBudget = job.budgetNumeric >= 1500;
  const isRejected = job.magicVerdict === 'Rejected';
  const isReview = job.magicVerdict === 'Manual Review';
  const isApproved = job.magicVerdict === 'Approved';

  // Deterministic seed based on job.id
  const hash = job.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  // 1. Client Score & Status
  let clientScore = isApproved ? 82 + (hash % 16) : isReview ? 54 + (hash % 18) : 18 + (hash % 16);
  let clientVerdict = isApproved ? 'Client Strong' : isReview ? 'Client Moderate' : 'Client Weak';
  let clientVerdictColor = isApproved ? 'text-[#16A34A]' : isReview ? 'text-[#D97706]' : 'text-[#DC2626]';
  let clientBorderColor = isApproved ? 'border-[#16A34A] text-[#16A34A]' : isReview ? 'border-[#D97706] text-[#D97706]' : 'border-[#DC2626] text-[#DC2626]';

  // 2. Job Score & Status
  let jobScore = job.verdictScore;
  let jobVerdict = isApproved ? 'Job Approved' : isReview ? 'Manual Review' : 'Job Rejected';
  let jobVerdictColor = isApproved ? 'text-[#16A34A]' : isReview ? 'text-[#D97706]' : 'text-[#DC2626]';
  let jobBorderColor = isApproved ? 'border-[#16A34A] text-[#16A34A]' : isReview ? 'border-[#D97706] text-[#D97706]' : 'border-[#DC2626] text-[#DC2626]';

  // Warning text
  let warningMessage = '';
  if (isRejected) {
    warningMessage = `Budget ${job.budgetAmount} is below your $500 minimum · new client, low hire rate`;
  } else if (isReview) {
    warningMessage = `Budget ${job.budgetAmount} requires review · check client feedback before applying`;
  } else {
    warningMessage = `Budget ${job.budgetAmount} matches your target criteria · payment verified · high historical hire rate`;
  }

  // Client Score Card Metrics
  const clientMetrics: ScoreMetric[] = [
    {
      label: 'Hire Rate',
      current: isApproved ? 22 : isReview ? 15 : 3,
      max: 25,
      colorClass: isApproved ? 'bg-[#16A34A]' : isReview ? 'bg-[#D97706]' : 'bg-[#DC2626]',
    },
    {
      label: 'Client Rating',
      current: isApproved ? 19 : isReview ? 14 : 1,
      max: 20,
      colorClass: isApproved ? 'bg-[#16A34A]' : isReview ? 'bg-[#D97706]' : 'bg-[#DC2626]',
    },
    {
      label: 'Total Spent',
      current: isApproved ? 28 : isReview ? 18 : 10,
      max: 30,
      colorClass: isApproved ? 'bg-[#16A34A]' : isReview ? 'bg-[#D97706]' : 'bg-[#DC2626]',
    },
    {
      label: 'Avg Spent Per Hire',
      current: isApproved ? 14 : isReview ? 9 : 2,
      max: 15,
      colorClass: isApproved ? 'bg-[#16A34A]' : isReview ? 'bg-[#D97706]' : 'bg-[#DC2626]',
    },
    {
      label: 'Payment Verified',
      current: 10,
      max: 10,
      colorClass: 'bg-[#16A34A]',
    },
  ];

  // Job Score Card Metrics
  const jobMetrics: ScoreMetric[] = [
    {
      label: 'Budget Bracket',
      current: isApproved ? 28 : isReview ? 18 : 0,
      max: 30,
      colorClass: isApproved ? 'bg-[#16A34A]' : isReview ? 'bg-[#D97706]' : 'bg-[#DC2626]',
    },
    {
      label: 'AI Score',
      current: isApproved ? 52 : isReview ? 38 : 0,
      max: 55,
      colorClass: isApproved ? 'bg-[#16A34A]' : isReview ? 'bg-[#D97706]' : 'bg-[#DC2626]',
    },
    {
      label: 'Proposals',
      current: 15,
      max: 15,
      colorClass: 'bg-[#16A34A]',
    },
  ];

  // Client Score Summary text
  const clientSummary = isRejected
    ? `Fresh client with less than 3 job posts on Upwork and a verified payment method.`
    : isReview
    ? `Mid-tier client with moderate spending history and verified payment method.`
    : `Verified enterprise client with strong spend history (${job.totalSpent}) and high repeat hire rate.`;

  // Job Score Summary text
  const jobSummary = isRejected
    ? `Rejected because the budget is only ${job.budgetAmount}, below the minimum required budget of $500.`
    : isReview
    ? `Flagged for manual review: scope requires clarification regarding delivery timelines and milestones.`
    : `Approved: High viability score (${job.verdictScore}%), matches Webethics agency expertise and high budget bracket.`;

  const footnote = isRejected
    ? `AI score not calculated — job was rejected by the budget rule first.`
    : `Scores calculated via Claude 3.5 Sonnet & OpenAI GPT-4o evaluation consensus.`;

  // Tailored description & bullets
  let intro = '';
  let bullets: string[] = [];
  let skills: string[] = [];
  let highlightSkill = 'WordPress';

  if (job.technology.toLowerCase().includes('shopify')) {
    intro = `We are a high-volume direct-to-consumer e-commerce brand looking for an experienced freelance Shopify Plus designer/developer to create professional, modern, and high-converting storefront experiences optimized for mobile conversions, SEO, and sub-second page speed.`;
    bullets = [
      `Strong expertise in Shopify Plus, Storefront API, and Liquid theme development.`,
      `Experience building modern custom landing pages and product detail templates for B2C & B2B brands.`,
      `Ability to deliver creative, responsive, and pixel-perfect designs matching Figma mockups.`,
      `Deep understanding of checkout extensibility, dynamic multi-currency routing, and custom bundle logic.`,
      `Strong ownership, clear English communication, and high attention to detail.`,
    ];
    skills = ['Shopify Plus', 'Storefront API', 'Liquid', 'Responsive Design', 'Conversion Optimization', 'User Experience', 'Tailwind CSS', 'Algolia Search', 'Next.js'];
    highlightSkill = 'Shopify Plus';
  } else if (job.technology.toLowerCase().includes('php') || job.technology.toLowerCase().includes('laravel')) {
    intro = `We are a SaaS fintech and billing platform looking for an experienced freelance backend engineer to audit, refactor, and scale our high-throughput transaction webhook listener and payment reconciliation services.`;
    bullets = [
      `Strong expertise in PHP 8.3, Laravel framework, and RESTful API architecture.`,
      `Experience handling asynchronous queue systems with Redis and MySQL index optimization.`,
      `Ability to troubleshoot high-concurrency payment gateway webhooks (Stripe / PayPal).`,
      `Strong ownership, automated test writing (PHPUnit), and zero-downtime migration practices.`,
      `Openness to iterative code reviews and working with our distributed team.`,
    ];
    skills = ['PHP 8.3', 'Laravel', 'MySQL Optimization', 'Redis Queues', 'Stripe API', 'Webhook Architecture', 'Docker', 'REST API', 'PHPUnit'];
    highlightSkill = 'Laravel';
  } else if (job.technology.toLowerCase().includes('python')) {
    intro = `We are a market data analytics firm looking for an experienced freelance Python engineer to build, maintain, and scale our automated web extraction and ETL ingestion pipelines.`;
    bullets = [
      `Strong expertise in Python web scraping using Playwright, Scrapy, and headless Chromium.`,
      `Experience rotating residential proxies and managing rate-limiting backoffs.`,
      `Ability to structure, normalize, and deduplicate millions of records in PostgreSQL.`,
      `Strong ownership, Docker containerization, and automated error logging with Datadog.`,
      `Clear communication, prompt availability, and clean, documented source code.`,
    ];
    skills = ['Python', 'Scrapy', 'Playwright', 'PostgreSQL', 'Docker', 'Proxy Rotation', 'ETL Pipeline', 'Data Engineering', 'Redis'];
    highlightSkill = 'Python';
  } else {
    intro = `We are a business setup and logistics solutions company looking for an experienced freelance Wix designer/developer to create professional, modern and conversion-focused landing pages optimised for SEO, AEO and GEO.`;
    bullets = [
      `Strong expertise in Wix website design and development.`,
      `Experience creating websites & landing pages for B2B businesses.`,
      `Ability to deliver creative, modern and professional designs.`,
      `Strong ownership, attention to detail and accountability.`,
      `Openness to feedback and collaborative working.`,
    ];
    skills = ['Landing Page', 'Website', 'Responsive Design', 'Search Engine Optimization', 'Website Customization', 'User Experience', 'Landing Page Optimization', 'Wix', 'Web Design'];
    highlightSkill = 'WordPress';
  }

  const outro = [
    `If you have relevant experience, we'd love to see your portfolio, especially projects you've created for B2B clients.`,
    `Please share your work samples along with your availability and rates.`,
    `Note: This will be an ongoing project`,
  ];

  return {
    fitCheck: {
      clientScore,
      clientVerdict,
      clientVerdictColor,
      clientBorderColor,
      jobScore,
      jobVerdict,
      jobVerdictColor,
      jobBorderColor,
      warningMessage,
    },
    clientScoreCard: {
      score: clientScore,
      confidence: 100,
      summary: clientSummary,
      metrics: clientMetrics,
    },
    jobScoreCard: {
      score: jobScore,
      verdict: isApproved ? 'Approved' : isReview ? 'Review' : 'Rejected',
      verdictBadgeClass: isApproved
        ? 'bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]'
        : isReview
        ? 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]'
        : 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]',
      chatgptScore: isApproved ? 94 : isReview ? 68 : 15,
      claudeScore: isApproved ? 96 : isReview ? 73 : 18,
      summary: jobSummary,
      metrics: jobMetrics,
      footnote,
    },
    description: {
      intro,
      bulletsTitle: "What we're looking for:",
      bullets,
      outro,
    },
    skills,
    highlightSkill,
    specs: {
      workload: isHighBudget ? '30+ hrs/week' : 'Less than 30 hrs/week',
      duration: isHighBudget ? '3 to 6 months' : '1 to 3 months',
      experienceLevel: isHighBudget ? 'Expert' : 'Intermediate',
      projectType: 'Ongoing project',
      historyProjectsCount: 2 + (hash % 14),
      categoryBreadcrumb: 'Web, Mobile & Software Dev, Web & Mobile Design',
    },
  };
}
