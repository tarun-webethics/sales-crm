# Upwork Jobs Dashboard

A modern, high-polish, light-themed dashboard for viewing and managing AI-rated Upwork jobs, inspired by Upwork's design language. Built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **shadcn/ui** components.

This application is **fully static** (no backend, API keys, or databases required) using typed mock data, while structured cleanly so a real scraping pipeline (n8n, Supabase, or official Upwork API) can be plugged in seamlessly.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (tested on Node v22)
- pnpm (or npm / yarn)

### Installation
```bash
# Clone the repository and navigate into the folder
cd sales-crm-black

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. It automatically redirects to `/jobs`.

### Production Build
```bash
pnpm build
pnpm start
```

---

## 🎨 Design System

- **Palette (Upwork-inspired)**:
  - **Primary Green**: `#14A800` (Hover: `#108A00`, Active: `#0D7300`)
  - **Primary Tints**: `#F1FAF0` (backgrounds), `#DFF3DC` (soft badge), `#BEE8B8` (borders)
  - **Neutrals**: Page background `#F7F8FA`, Card `#FFFFFF`, Border `#E5E7EB`, Heading `#001E00`, Body `#3C4043`, Muted `#6B7280`
  - **Semantics**: Warning Amber `#F59E0B`, Danger Red `#DC2626`, Info Indigo `#4F46E5`, Success Green `#14A800`
- **Typography**:
  - Font: **Inter** via `next/font/google`
  - Feature settings: `"cv11", "ss01"` with relaxed line-height for crisp legibility
- **Component Styling**:
  - Rounded-xl cards (`rounded-xl`), subtle shadows (`shadow-xs` / `shadow-sm`), 1px borders, uppercase tracked headers, smooth hover highlights without heavy animations.

---

## ✨ Features

1. **Fixed Left Sidebar (256px)**:
   - Green "J" logo block with Webethics branding
   - User profile card for Harsh Vardhan (Internal Corporate Access)
   - Categorized navigation sections:
     - `UPWORK`: Dashboard, **Jobs (Active)**
     - `DOCUMENTS`: Documents
     - `EMAIL MARKETING`: Email Marketing
     - `LINKEDIN OUTREACH`: LinkedIn Outreach
     - `ADMIN`: User Management
     - `UPWORK SETTING`: System Prompt, Prompt Examples, Keywords, Case Studies
     - `AI KEY SETTINGS`: Claude Settings, ChatGPT Settings
   - Pinned footer with user details, "Change PW", red-outline "Log Out", and license caption
   - Fully responsive: collapses into a mobile slide-out Sheet with hamburger trigger

2. **Client-Side Filtering & Search**:
   - Instant text search across job title, company, technology, and location
   - 6 custom dropdown filters:
     1. **Webethics Magic Filter** (All / Manual Review / Rejected / Approved)
     2. **Technology** (All Technologies / Shopify Plus / PHP / Front End Developer / Python / API Developer / Shopify / React / Node.js)
     3. **Location** (All Locations / Netherlands / India / Australia / Philippines / GBR / United States)
     4. **Status** (All Statuses / Not Applied / Applied / Interviewing / Hired)
     5. **Date** (All Time / Today / Last 24 hours / Last 7 days / Last 30 days)
     6. **Cream Jobs** (All / Cream only / Non-cream)
   - "Fetch Cream Jobs" quick filter button & "Fetch Jobs" simulation button
   - "Reset" button to clear all filters
   - Active filter badges / chips with one-click removal
   - Live result counter ("Showing X of Y jobs")

3. **Jobs Table**:
   - Checkbox row selection + "Select All" on current page
   - Floating bulk action bar (shows count, "Mark Applied", "Mark Interviewing", "Mark Hired", "Export Selected", and clear)
   - Truncated titles with accessible tooltips showing full job descriptions and client companies
   - AI verdict pill badges (Manual Review amber, Rejected red, Approved green) + confidence score
   - Model badges: `J` (indigo), `C` (green), and `Rejected` (red)
   - Gold star badge with count indicator for Cream Jobs
   - Colored technology badges matching the specified color palette
   - Interactive status dropdown pill (changes color live based on status)
   - Direct "Apply" link with external link icon
   - Sortable columns: **Saved On**, **Budget**, **Posted**, **Total Spent**
   - Configurable pagination (10, 20, 50 rows per page)
   - Loading skeleton state toggled by the "Refresh" action button (800ms simulated network delay)

4. **Client-Side CSV Export**:
   - Downloads the currently filtered dataset directly into a properly formatted `.csv` file
   - Can also export only the specifically selected rows via the bulk action bar

---

## 📁 Project Structure

```
├── app/
│   ├── globals.css          # Theme variables, font-feature-settings, Upwork tokens
│   ├── layout.tsx           # Root layout with Inter font and metadata
│   ├── page.tsx             # Redirects root / to /jobs
│   └── jobs/
│       └── page.tsx         # Jobs dashboard container & state orchestration
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx      # Fixed 256px desktop sidebar
│   │   ├── MobileSidebar.tsx# Mobile slide-out Sheet drawer
│   │   └── UserCard.tsx     # User identification card
│   ├── jobs/
│   │   ├── JobsHeader.tsx   # Title, count subtitle, Export and Refresh actions
│   │   ├── JobsFilters.tsx  # Search input, 6 Select dropdowns, chips, action buttons
│   │   ├── JobsTable.tsx    # Table container, sorting headers, pagination, skeleton
│   │   ├── JobRow.tsx       # Individual row with tooltips, pills, and links
│   │   ├── RatingBadges.tsx # AI verdict and model confidence badges
│   │   ├── TechBadge.tsx    # Technology pills with assigned color themes
│   │   ├── StatusSelect.tsx # Status pill dropdown with live state mutation
│   │   └── BulkBar.tsx      # Floating action bar for multi-row operations
│   └── ui/                  # shadcn/ui accessible components
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── checkbox.tsx
│       ├── dropdown-menu.tsx
│       ├── input.tsx
│       ├── pagination.tsx
│       ├── select.tsx
│       ├── separator.tsx
│       ├── sheet.tsx
│       ├── skeleton.tsx
│       ├── table.tsx
│       └── tooltip.tsx
├── data/
│   └── jobs.ts              # 40+ typed mock jobs with TODO for API integration
├── lib/
│   ├── filters.ts           # Filtering, sorting, and CSV export utilities
│   └── utils.ts             # Tailwind classnames merge helper
└── types/
    └── job.ts               # TypeScript interfaces and types for Jobs & Filters
```
# sales-crm
