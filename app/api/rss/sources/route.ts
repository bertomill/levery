import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import Parser from 'rss-parser'

const parser = new Parser()

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

    // Parse the RSS feed to get metadata
    const feed = await parser.parseURL(url)

    // Create the RSS source
    const { data: source, error: sourceError } = await supabase
      .from('rss_sources')
      .insert({
        user_id: user.id,
        url,
        title: feed.title || url,
        description: feed.description || null,
      })
      .select()
      .single()

    if (sourceError) {
      return NextResponse.json(
        { error: sourceError.message },
        { status: 400 }
      )
    }

    // Process feed items
    const articles = feed.items.map(item => ({
      user_id: user.id,
      title: item.title || 'Untitled',
      url: item.link || '',
      content: item.content || item['content:encoded'] || '',
      source: url,
      published_date: item.pubDate ? new Date(item.pubDate) : new Date(),
      created_at: new Date(),
      updated_at: new Date(),
    }))

    // Insert articles
    const { error: articlesError } = await supabase
      .from('articles')
      .insert(articles)

    if (articlesError) {
      console.error('Error inserting articles:', articlesError)
    }

    return NextResponse.json({ source })
  } catch (error) {
    console.error('Error in RSS sources route:', error)
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

    // Get user's RSS sources
    const { data: sources, error: sourcesError } = await supabase
      .from('rss_sources')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (sourcesError) {
      return NextResponse.json(
        { error: sourcesError.message },
        { status: 400 }
      )
    }

    return NextResponse.json({ sources })
  } catch (error) {
    console.error('Error in RSS sources route:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
