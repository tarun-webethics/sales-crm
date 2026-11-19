export type MagicFilterType = 'All' | 'Manual Review' | 'Rejected' | 'Approved';

export type JobStatus = 'Not Applied' | 'Applied' | 'Interviewing' | 'Hired';

export type TechnologyType =
  | 'All Technologies'
  | 'Shopify Plus'
  | 'PHP'
  | 'Front End Developer'
  | 'Python'
  | 'API Developer'
  | 'Shopify'
  | 'React'
  | 'Node.js';

export type LocationType =
  | 'All Locations'
  | 'Netherlands'
  | 'India'
  | 'Australia'
  | 'Philippines'
  | 'GBR'
  | 'United States';

export type DateFilterType =
  | 'All Time'
  | 'Today'
  | 'Last 24 hours'
  | 'Last 7 days'
  | 'Last 30 days';

export type CreamFilterType = 'All' | 'Cream only' | 'Non-cream';

export interface ModelScore {
  model: 'J' | 'C' | 'Rejected';
  score: number;
}

export interface Job {
  id: string;
  title: string;
  company?: string;
  savedDate: string; // e.g. "18 Nov"
  savedTime: string; // e.g. "10:56 AM"
  savedTimestamp: number;
  magicVerdict: 'Manual Review' | 'Rejected' | 'Approved';
  verdictScore: number; // percentage, e.g. 73
  modelScores: ModelScore[]; // e.g. [{ model: 'J', score: 47 }, { model: 'C', score: 64 }]
  isCream: boolean;
  creamCount?: number;
  technology: string;
  budgetType: 'Fixed' | 'Hourly';
  budgetAmount: string; // "$9500", "$25-$47"
  budgetNumeric: number; // For sorting
  posted: string; // "9 minutes ago"
  postedMinutesAgo: number; // For sorting and relative date filtering
  totalSpent: string; // "$1,500"
  totalSpentNumeric: number; // For sorting
  location: string;
  status: JobStatus;
  url: string;
}

export interface FilterState {
  search: string;
  magicFilter: MagicFilterType;
  technology: string;
  location: string;
  status: string;
  date: DateFilterType;
  cream: CreamFilterType;
}

export type SortField = 'savedDate' | 'budget' | 'posted' | 'totalSpent';
export type SortDirection = 'asc' | 'desc';
