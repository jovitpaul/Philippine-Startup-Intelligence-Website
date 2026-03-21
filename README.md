# 🇵🇭 Philippine Startup Intelligence

![Live Radar Active](https://img.shields.io/badge/Status-Live_Radar_Active-10b981?style=flat-square)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat-square&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Database-Supabase-3ecf8e?style=flat-square&logo=supabase)

**Philippine Startup Intelligence** is a real-time Venture Capital deal flow and market signal tracker tailored specifically for the Philippine startup ecosystem. It acts as an automated radar for founders, angel investors, and VCs to monitor capital movement, trending narratives, and market liquidity.

🌐 **[View Live Dashboard](https://your-vercel-link-here.vercel.app)** *(Replace with your actual Vercel link!)*

---

## ✨ Key Features

*   **🤖 Rule-Based AI Analyst:** Automatically categorizes thousands of news articles into core sectors (Fintech, E-commerce, AI, Web3) and flags specific capital-raising events (Seed, Series A, M&A).
*   **📡 Automated Cron Jobs:** A background worker runs every night at midnight to scrape Google News RSS feeds, process the data, and securely update the database without human intervention.
*   **🔥 Dynamic Trending Keywords:** Real-time NLP algorithm that extracts the top 5 most-discussed ecosystem keywords over the last 30 days (e.g., GCash, Seed, AI).
*   **⚡ Edge-Speed Database:** Migrated from a stateless scraper to a fully indexed **Supabase (PostgreSQL)** database, ensuring instant dashboard loads and zero rate-limiting from search engines.
*   **🎨 Premium Tech UI:** Designed with **Tailwind CSS v4**, featuring glassmorphism, responsive mobile layouts, and Next.js Suspense loading states.

## 🛠 Tech Stack

*   **Frontend:** Next.js 15 (App Router), React, Tailwind CSS v4
*   **Backend:** Next.js Serverless API Routes
*   **Database:** Supabase (PostgreSQL)
*   **Automation:** Vercel Cron Jobs (`vercel.json`)
*   **Analytics:** Vercel Web Analytics
*   **Data Ingestion:** `rss-parser`

---

## 🚀 Local Development Setup

Want to run the radar locally? Follow these steps:

**1. Clone the repository**
```bash
git clone https://github.com/your-username/ph-startup-intelligence.git
cd ph-startup-intelligence