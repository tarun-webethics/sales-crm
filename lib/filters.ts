import { Job, FilterState, SortField, SortDirection } from '@/types/job';

export const initialFilterState: FilterState = {
  search: '',
  magicFilter: 'All',
  technology: 'All Technologies',
  location: 'All Locations',
  status: 'All Statuses',
  date: 'All Time',
  cream: 'All',
};

export function filterJobs(jobs: Job[], filters: FilterState): Job[] {
  return jobs.filter((job) => {
    // 1. Search filter (title, company, technology, location)
    if (filters.search.trim()) {
      const term = filters.search.toLowerCase().trim();
      const matchTitle = job.title.toLowerCase().includes(term);
      const matchCompany = job.company?.toLowerCase().includes(term) ?? false;
      const matchTech = job.technology.toLowerCase().includes(term);
      const matchLoc = job.location.toLowerCase().includes(term);
      if (!matchTitle && !matchCompany && !matchTech && !matchLoc) {
        return false;
      }
    }

    // 2. Webethics Magic Filter
    if (filters.magicFilter !== 'All') {
      if (job.magicVerdict !== filters.magicFilter) {
        return false;
      }
    }

    // 3. Technology
    if (filters.technology !== 'All Technologies') {
      if (job.technology.toLowerCase() !== filters.technology.toLowerCase()) {
        return false;
      }
    }

    // 4. Location
    if (filters.location !== 'All Locations') {
      if (job.location.toLowerCase() !== filters.location.toLowerCase()) {
        return false;
      }
    }

    // 5. Status
    if (filters.status !== 'All Statuses') {
      if (job.status.toLowerCase() !== filters.status.toLowerCase()) {
        return false;
      }
    }

    // 6. Date filter
    if (filters.date !== 'All Time') {
      const minutesAgo = job.postedMinutesAgo;
      if (filters.date === 'Today' || filters.date === 'Last 24 hours') {
        if (minutesAgo > 24 * 60) return false;
      } else if (filters.date === 'Last 7 days') {
        if (minutesAgo > 7 * 24 * 60) return false;
      } else if (filters.date === 'Last 30 days') {
        if (minutesAgo > 30 * 24 * 60) return false;
      }
    }

    // 7. Cream Jobs
    if (filters.cream === 'Cream only') {
      if (!job.isCream) return false;
    } else if (filters.cream === 'Non-cream') {
      if (job.isCream) return false;
    }

    return true;
  });
}

export function sortJobs(jobs: Job[], field: SortField, direction: SortDirection): Job[] {
  const sorted = [...jobs];
  const factor = direction === 'asc' ? 1 : -1;

  sorted.sort((a, b) => {
    switch (field) {
      case 'savedDate':
        return (a.savedTimestamp - b.savedTimestamp) * factor;
      case 'budget':
        return (a.budgetNumeric - b.budgetNumeric) * factor;
      case 'posted':
        // For posted: asc = oldest first (larger minutes ago), desc = newest first (smaller minutes ago)
        return (b.postedMinutesAgo - a.postedMinutesAgo) * factor;
      case 'totalSpent':
        return (a.totalSpentNumeric - b.totalSpentNumeric) * factor;
      default:
        return 0;
    }
  });

  return sorted;
}

export function exportJobsToCSV(jobs: Job[], filename = 'upwork-jobs-export.csv') {
  if (jobs.length === 0) return;

  const headers = [
    'ID',
    'Saved Date',
    'Saved Time',
    'Job Title',
    'Company',
    'Magic Verdict',
    'Verdict Score (%)',
    'AI Model Badges',
    'Technology',
    'Budget Type',
    'Budget Amount',
    'Posted',
    'Total Spent',
    'Location',
    'Status',
    'Cream Job',
    'URL',
  ];

  const escapeCSV = (value: unknown): string => {
    if (value === null || value === undefined) return '';
    const str = String(value);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const rows = jobs.map((job) => [
    job.id,
    job.savedDate,
    job.savedTime,
    job.title,
    job.company || '',
    job.magicVerdict,
    `${job.verdictScore}%`,
    job.modelScores.map((m) => `${m.model} ${m.score}%`).join('; '),
    job.technology,
    job.budgetType,
    job.budgetAmount,
    job.posted,
    job.totalSpent,
    job.location,
    job.status,
    job.isCream ? `Yes (${job.creamCount || 0})` : 'No',
    job.url,
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map(escapeCSV).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
