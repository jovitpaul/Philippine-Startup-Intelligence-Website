import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { createClient } from '@supabase/supabase-js';

// ==========================================
// FIX: PREVENT NEXT.JS FROM CACHING THIS ROUTE
// ==========================================
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Connect to Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Your exact AI categorization logic
function analyzeArticle(title) {
  const t = title.toLowerCase();
  const isFunding = t.includes('fund') || t.includes('seed') || t.includes('series') || t.includes('capital') || t.includes('invest') || t.includes('raise') || t.includes('million');
  
  let sector = 'Ecosystem';
  let color = '#64748b'; 
  if (t.includes('ai ') || t.includes('artificial intelligence') || t.includes('machine learning')) { sector = 'AI'; color = '#8b5cf6'; } 
  else if (t.includes('fintech') || t.includes('bank') || t.includes('crypto') || t.includes('pay') || t.includes('finance') || t.includes('gcash') || t.includes('maya') || t.includes('pdax')) { sector = 'Fintech'; color = '#3b82f6'; } 
  else if (t.includes('ecommerce') || t.includes('e-commerce') || t.includes('shop') || t.includes('logistics') || t.includes('delivery')) { sector = 'E-commerce'; color = '#f97316'; } 
  else if (t.includes('web3') || t.includes('blockchain') || t.includes('nft') || t.includes('crypto')) { sector = 'Web3'; color = '#14b8a6'; }

  return { isFunding, sector, color };
}

export async function GET() {
  try {
    const parser = new Parser();
    const rawQuery = 'philippines (startup OR "venture capital" OR funding OR tech) when:14d -smartphone -review';
    const feedUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(rawQuery)}&hl=en-US&gl=US&ceid=US:en`;
    
    const feed = await parser.parseURL(feedUrl);
    const excludeWords = ['smartphone', 'iphone', 'samsung', 'oppo', 'vivo', 'camera review', 'gaming console', 'tablet'];
    const articlesToSave = [];

    feed.items.forEach(item => {
      const cleanTitle = item.title.split(' - ')[0]; 
      const titleLower = cleanTitle.toLowerCase();
      
      if (!excludeWords.some(word => titleLower.includes(word))) {
        let displayDate = 'Recent';
        if (item.pubDate) {
          const d = new Date(item.pubDate);
          displayDate = `${d.toLocaleString('default', { month: 'short' })} ${d.getDate()}, ${d.getFullYear()}`;
        }

        const analysis = analyzeArticle(cleanTitle);

        articlesToSave.push({
          title: cleanTitle,
          link: item.link,
          raw_date: new Date(item.pubDate).toISOString(),
          display_date: displayDate,
          sector: analysis.sector,
          is_funding: analysis.isFunding,
          color: analysis.color
        });
      }
    });

    // Save to Supabase (ignores duplicates automatically!)
    const { error } = await supabase
      .from('market_signals')
      .upsert(articlesToSave, { onConflict: 'link', ignoreDuplicates: true });

    if (error) throw error;

    return NextResponse.json({ success: true, message: `Successfully fetched and saved news to database!` });
    
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}