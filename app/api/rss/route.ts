import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { fetchAndStoreRSSFeed } from '@/lib/rss'

export async function POST(request: Request) {
  try {
    const { url } = await request.json()
    const supabase = createRouteHandlerClient({ cookies })

    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Create the RSS feed
    const { data: feed, error: feedError } = await supabase
      .from('rss_feeds')
      .insert({
        user_id: user.id,
        url,
        title: url, // We'll update this after fetching
      })
      .select()
      .single()

    if (feedError) {
      return NextResponse.json(
        { error: feedError.message },
        { status: 400 }
      )
    }

    // Fetch and store the articles
    await fetchAndStoreRSSFeed(feed.id, url)

    return NextResponse.json({ feed })
  } catch (error) {
    console.error('Error in RSS route:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user's RSS feeds
    const { data: feeds, error: feedsError } = await supabase
      .from('rss_feeds')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (feedsError) {
      return NextResponse.json(
        { error: feedsError.message },
        { status: 400 }
      )
    }

    return NextResponse.json({ feeds })
  } catch (error) {
    console.error('Error in RSS route:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
