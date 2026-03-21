import Link from 'next/link';

export default function ArticleCard({ article }) {
  return (
    <a 
      href={article.link} 
      target="_blank" 
      rel="noopener noreferrer"
      className="block group relative bg-white/60 backdrop-blur-md border border-slate-200 rounded-2xl p-6 hover:shadow-2xl hover:shadow-slate-200/50 hover:border-slate-300 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
    >
      {/* Decorative gradient blob on hover */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-emerald-100 to-teal-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-2 items-center">
            <span 
              className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full text-white shadow-sm"
              style={{ backgroundColor: article.color }}
            >
              {article.sector}
            </span>
            {article.isFunding && (
              <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                💰 Funding
              </span>
            )}
          </div>
          <span className="text-xs font-medium text-slate-400">{article.displayDate}</span>
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
          {article.title}
        </h3>

        {/* NEW: AI Insight Section */}
        {article.aiSummary && (
          <div className="mb-4 p-4 rounded-xl bg-slate-50 border border-slate-100 group-hover:bg-white transition-colors">
             <div className="flex items-start gap-2">
               <span className="text-sm mt-0.5">✨</span>
               <p className="text-sm text-slate-600 font-medium leading-relaxed">
                 {article.aiSummary}
               </p>
             </div>
          </div>
        )}

        {/* NEW: Extracted Funding Amount Badge */}
        {article.fundingAmount && (
           <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-100 font-bold text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Amount: {article.fundingAmount}
           </div>
        )}
      </div>
    </a>
  );
}