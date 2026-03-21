export default function ArticleCard({ article }) {
  return (
    <a 
      href={article.link} 
      target="_blank" 
      rel="noreferrer" 
      className="group block bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 hover:-translate-y-1 transition-all duration-200 cursor-pointer"
    >
      <div className="flex justify-between items-center mb-4">
        <span 
          className="text-xs font-bold px-3 py-1 rounded-full tracking-wide"
          style={{ color: article.color, backgroundColor: `${article.color}15` }}
        >
          {article.sector}
        </span>
        <span className="text-xs text-slate-400 font-medium">{article.displayDate}</span>
      </div>
      <h3 className="text-lg text-slate-800 leading-snug font-semibold group-hover:text-emerald-600 transition-colors duration-200">
        {article.title}
      </h3>
    </a>
  );
}