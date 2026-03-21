import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import ArticleCard from '../components/ArticleCard';

// STRICT CACHE BUSTING FOR NEXT.JS 15
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function Home({ searchParams }) {
  let rawNews = [];
  let errorMsg = null;
  
  const params = await searchParams;
  const activeFilter = params?.filter || 'all';
  const searchQuery = params?.q || ''; 
  
  try {
    let query = supabase.from('market_signals').select('*').order('raw_date', { ascending: false });
    if (searchQuery) query = query.ilike('title', `%${searchQuery}%`);

    const { data, error } = await query;
    if (error) throw error;

    rawNews = data.map(item => ({
      title: item.title, link: item.link, displayDate: item.display_date,
      sector: item.sector, isFunding: item.is_funding, color: item.color,
      aiSummary: item.ai_summary,        // <-- NEW: Pulling AI Summary
      fundingAmount: item.funding_amount // <-- NEW: Pulling Funding Amount
    }));
  } catch (error) {
    errorMsg = "⚠️ Radar offline. Could not connect to database.";
  }

  const totalSignals = rawNews.length;
  const fundingEvents = rawNews.filter(n => n.isFunding);
  const ecosystemNews = rawNews.filter(n => !n.isFunding);
  
  // Sector Math
  const sectorCounts = { 'AI': 0, 'Fintech': 0, 'E-commerce': 0, 'Web3': 0, 'Ecosystem': 0 };
  rawNews.forEach(n => sectorCounts[n.sector]++);
  
  let hottestSector = 'Emerging';
  let highestCount = 0;
  Object.keys(sectorCounts).forEach(key => {
    if (key !== 'Ecosystem' && sectorCounts[key] > highestCount) {
      highestCount = sectorCounts[key]; hottestSector = key;
    }
  });

  const dominancePercentage = totalSignals > 0 ? Math.round((highestCount / totalSignals) * 100) : 0;
  
  // DYNAMIC TRENDING KEYWORDS ALGORITHM
  const stopWords = ['and','the','to','a','of','for','in','philippines','startup','tech','on','with','is','at','from','by','ph','startups','business','new','how','its','will'];
  const wordCounts = {};
  
  rawNews.forEach(article => {
    const words = article.title.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/);
    words.forEach(w => {
      if (w.length > 3 && !stopWords.includes(w)) {
        wordCounts[w] = (wordCounts[w] || 0) + 1;
      }
    });
  });

  const trendingKeywords = Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(entry => entry[0]);

  let dynamicInsight = "";
  if (searchQuery && totalSignals > 0) {
    dynamicInsight = `Deep-dive analysis for "${searchQuery}": We detected ${totalSignals} signals in the DB. Out of these, ${fundingEvents.length} are related to capital movement.`;
  } else if (searchQuery && totalSignals === 0) {
    dynamicInsight = `No market signals detected for "${searchQuery}" in our database.`;
  } else {
    dynamicInsight = `We monitored ${totalSignals} unique market signals. The market is showing active liquidity with ${fundingEvents.length} distinct capital raising events. Currently, ${hottestSector} is dominating the narrative, capturing ${dominancePercentage}% of all sector-specific media noise.`;
  }

  let displayedNews = activeFilter === 'funding' ? fundingEvents : activeFilter === 'hottest' ? rawNews.filter(n => n.sector === hottestSector) : rawNews;
  
  let viewTitle = "All Market Signals";
  if (searchQuery) viewTitle = `🔍 Search Results for "${searchQuery}"`;
  else if (activeFilter === 'funding') viewTitle = "💰 Showing Only: Funding Events";
  else if (activeFilter === 'hottest') viewTitle = `🔥 Showing Only: ${hottestSector} Sector`;

  return (
    <div className="min-h-screen bg-slate-50 font-sans relative overflow-hidden pb-20">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-30 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-300 via-slate-50 to-transparent pointer-events-none -z-10"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        
        <div className="inline-flex items-center gap-2 mb-8 bg-white/60 backdrop-blur-md border border-slate-200 px-4 py-2 rounded-full shadow-sm">
          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]"></div>
          <span className="text-emerald-700 text-xs font-bold uppercase tracking-widest">Live Radar Active</span>
        </div>

        <div className="mb-12">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-slate-900 drop-shadow-sm">
            <span className="mr-3 inline-block">🇵🇭</span>
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Philippine Startup</span> Intelligence
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl leading-relaxed font-medium">
            The premier real-time radar for tech startups, venture capital funding, and ecosystem news. Trusted by founders and investors.
          </p>
        </div>

        <div className="mb-12">
          <form method="GET" action="/" className="flex flex-col sm:flex-row gap-3 bg-white/50 backdrop-blur-xl p-2 rounded-2xl border border-white shadow-lg shadow-slate-200/50">
            <input 
              type="text" 
              name="q" 
              defaultValue={searchQuery} 
              placeholder="Search database (e.g., GCash, AI, Seed)..." 
              className="flex-1 px-5 py-4 rounded-xl bg-transparent text-slate-800 text-lg focus:outline-none focus:ring-0 placeholder-slate-400 font-medium"
              suppressHydrationWarning
            />
            <button type="submit" className="bg-slate-900 text-white px-8 py-4 rounded-xl font-semibold hover:bg-emerald-600 transition-all duration-300 shadow-md">
              Search
            </button>
            {searchQuery && (
              <Link href="/" className="flex items-center justify-center px-6 py-4 text-slate-500 font-bold hover:text-slate-800 transition-colors">
                Clear
              </Link>
            )}
          </form>

          {!searchQuery && trendingKeywords.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-4 ml-2">
              <span className="text-sm font-bold text-slate-400 uppercase tracking-widest mr-1">🔥 Trending:</span>
              {trendingKeywords.map(keyword => (
                <Link key={keyword} href={`/?q=${keyword}`} className="text-xs font-bold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-full hover:border-emerald-400 hover:text-emerald-700 hover:shadow-sm transition-all capitalize">
                  {keyword}
                </Link>
              ))}
            </div>
          )}
        </div>

        {errorMsg && <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-8 border border-red-100">{errorMsg}</div>}

        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 rounded-3xl mb-12 shadow-2xl shadow-slate-900/20 relative overflow-hidden border border-slate-700">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 opacity-10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="bg-white/10 p-2 rounded-lg">✨</div>
            <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-widest">AI Analyst Take</h3>
          </div>
          <p className="text-lg md:text-xl text-slate-300 leading-relaxed relative z-10 font-light">{dynamicInsight}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Link href={searchQuery ? `?q=${searchQuery}&filter=all` : "?filter=all"} 
            className={`group p-8 rounded-3xl border transition-all duration-300 hover:-translate-y-2 ${activeFilter === 'all' ? 'bg-white border-emerald-500 shadow-xl shadow-emerald-100' : 'bg-white/80 border-slate-200 hover:shadow-xl hover:border-emerald-300'}`}>
            <p className="text-slate-500 text-sm font-bold mb-2 uppercase tracking-widest group-hover:text-emerald-600 transition-colors">Total Signals</p>
            <h2 className="text-5xl font-black text-slate-900">{totalSignals}</h2>
          </Link>

          <Link href={searchQuery ? `?q=${searchQuery}&filter=funding` : "?filter=funding"} 
            className={`group p-8 rounded-3xl border transition-all duration-300 hover:-translate-y-2 ${activeFilter === 'funding' ? 'bg-white border-emerald-500 shadow-xl shadow-emerald-100' : 'bg-white/80 border-slate-200 hover:shadow-xl hover:border-emerald-300'}`}>
            <p className="text-slate-500 text-sm font-bold mb-2 uppercase tracking-widest group-hover:text-emerald-600 transition-colors">Funding Events</p>
            <h2 className="text-5xl font-black text-slate-900">{fundingEvents.length}</h2>
          </Link>

          <Link href={searchQuery ? `?q=${searchQuery}&filter=hottest` : "?filter=hottest"} 
            className={`group p-8 rounded-3xl border transition-all duration-300 hover:-translate-y-2 ${activeFilter === 'hottest' ? 'bg-white border-emerald-500 shadow-xl shadow-emerald-100' : 'bg-white/80 border-slate-200 hover:shadow-xl hover:border-emerald-300'}`}>
            <p className="text-slate-500 text-sm font-bold mb-2 uppercase tracking-widest group-hover:text-emerald-600 transition-colors">Hottest Sector</p>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 truncate">{hottestSector}</h2>
          </Link>
        </div>

        {activeFilter !== 'all' || searchQuery ? (
          <div>
            <div className="flex justify-between items-end border-b-2 border-slate-200 pb-4 mb-8">
              <h2 className="text-2xl font-extrabold text-slate-900">{viewTitle}</h2>
              {activeFilter !== 'all' && (
                <Link href={searchQuery ? `?q=${searchQuery}` : "/"} className="text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors">
                  ✖ Clear Filter
                </Link>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayedNews.map((article, i) => <ArticleCard key={`filt-${i}`} article={article} />)}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 border-b-2 border-slate-200 pb-4 mb-8">💰 Capital Raising</h2>
              <div className="flex flex-col gap-5">
                {fundingEvents.map((article, i) => <ArticleCard key={`fund-${i}`} article={article} />)}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 border-b-2 border-slate-200 pb-4 mb-8">🚀 Market Intelligence</h2>
              <div className="flex flex-col gap-5">
                {ecosystemNews.map((article, i) => <ArticleCard key={`eco-${i}`} article={article} />)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}