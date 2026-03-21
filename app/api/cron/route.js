import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

// FIX: PREVENT NEXT.JS FROM CACHING THIS ROUTE
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Connect to Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Connect to OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

// NEW: OpenAI Extraction Function
async function getOpenAIInsights(title) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a Venture Capital analyst. Read the headline. 1) Extract any exact funding amounts (e.g. '\$5M', '₱50 Million'). If none, return null. 2) Write a strict 1-sentence summary of what happened. Return ONLY valid JSON with exactly two keys: 'funding_amount' and 'ai_summary'."
        },
        { role: "user", content: `Headline: "${title}"` }
      ],
      response_format: { type: "json_object" }, // Guarantees a perfect JSON response!
      temperature: 0.2,
    });
    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error("OpenAI Error:", error);
    return { funding_amount: null, ai_summary: "AI summary currently unavailable." };
  }
}

export async function GET() {
  try {
    const parser = new Parser();
    const rawQuery = 'philippines (startup OR "venture capital" OR funding OR tech) when:14d -smartphone -review';
    const feedUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(rawQuery)}&hl=en-US&gl=US&ceid=US:en`;
    
    const feed = await parser.parseURL(feedUrl);
    const excludeWords = ['smartphone', 'iphone', 'samsung', 'oppo', 'vivo', 'camera review', 'gaming console', 'tablet'];
    
    // Process only the top 15 newest articles so Vercel free tier doesn't timeout (10s limit)
    const recentItems = feed.items.slice(0, 15);

    // Run AI on all 15 articles simultaneously using Promise.all!
    const articlesToSave = (await Promise.all(
      recentItems.map(async (item) => {
        const cleanTitle = item.title.split(' - ')[0]; 
        const titleLower = cleanTitle.toLowerCase();
        
        if (!excludeWords.some(word => titleLower.includes(word))) {
          let displayDate = 'Recent';
          if (item.pubDate) {
            const d = new Date(item.pubDate);
            displayDate = `${d.toLocaleString('default', { month: 'short' })} ${d.getDate()}, ${d.getFullYear()}`;
          }

          // 1. Run standard JS rules
          const analysis = analyzeArticle(cleanTitle);
          // 2. Ask OpenAI for deep insights
          const aiData = await getOpenAIInsights(cleanTitle);

          return {
            title: cleanTitle,
            link: item.link,
            raw_date: new Date(item.pubDate).toISOString(),
            display_date: displayDate,
            sector: analysis.sector,
            is_funding: analysis.isFunding,
            color: analysis.color,
            ai_summary: aiData.ai_summary,         // Saved to new Supabase column!
            funding_amount: aiData.funding_amount  // Saved to new Supabase column!
          };
        }
        return null;
      })
    )).filter(article => article !== null);

    // Save to Supabase
    const { error } = await supabase
      .from('market_signals')
      .upsert(articlesToSave, { onConflict: 'link', ignoreDuplicates: true });

    if (error) throw error;

    return NextResponse.json({ success: true, message: `Successfully fetched, AI-analyzed, and saved news to database!` });
    
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}