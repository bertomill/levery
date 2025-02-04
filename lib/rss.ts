import Parser from 'rss-parser'
import { createClient } from '@supabase/supabase-js'

const parser = new Parser({
  customFields: {
    item: [
      ['content:encoded', 'content'],
      ['dc:creator', 'author'],
    ],
  },
})

export async function fetchAndStoreRSSFeed(feedId: string, url: string) {
  try {
    // Parse the RSS feed
    const feed = await parser.parseURL(url)
    
    // Prepare articles for insertion
    const articles = feed.items.map(item => ({
      feed_id: feedId,
      title: item.title || 'Untitled',
      url: item.link || '',
      description: item.description || '',
      content: item.content || item['content:encoded'] || '',
      author: item.author || item.creator || '',
      published_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
    }))

    // Get Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Update last_fetched_at timestamp
    await supabase
      .from('rss_feeds')
      .update({ last_fetched_at: new Date().toISOString() })
      .eq('id', feedId)

    // Insert articles, ignoring duplicates
    const { error } = await supabase
      .from('articles')
      .upsert(articles, { 
        onConflict: 'feed_id,url',
        ignoreDuplicates: true 
      })

    if (error) {
      console.error('Error storing articles:', error)
      throw error
    }

    return articles
  } catch (error) {
    console.error('Error fetching RSS feed:', error)
    throw error
  }
}
