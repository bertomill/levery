import { createServerSupabaseClient } from './server'
import { Database } from './types'

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]

export async function getUserProfile() {
  const supabase = createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session?.user) {
    return null
  }

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', session.user.id)
    .single()

  return profile
}

export async function upsertUser(userData: Partial<Tables<'users'>>) {
  const supabase = createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session?.user) {
    throw new Error('Not authenticated')
  }

  const { data, error } = await supabase
    .from('users')
    .upsert({
      id: session.user.id,
      ...userData,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function getArticles(options?: {
  status?: Tables<'articles'>['status']
  limit?: number
  offset?: number
}) {
  const supabase = createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session?.user) {
    throw new Error('Not authenticated')
  }

  let query = supabase
    .from('articles')
    .select('*')
    .eq('user_id', session.user.id)
    .order('saved_date', { ascending: false })

  if (options?.status) {
    query = query.eq('status', options.status)
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
  }

  const { data, error } = await query

  if (error) {
    throw error
  }

  return data
}

export async function getNotes(options?: {
  articleId?: string
  limit?: number
  offset?: number
}) {
  const supabase = createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session?.user) {
    throw new Error('Not authenticated')
  }

  let query = supabase
    .from('notes')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })

  if (options?.articleId) {
    query = query.eq('article_id', options.articleId)
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
  }

  const { data, error } = await query

  if (error) {
    throw error
  }

  return data
}

export async function getBlogPosts(options?: {
  status?: Tables<'blog_posts'>['status']
  limit?: number
  offset?: number
}) {
  const supabase = createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session?.user) {
    throw new Error('Not authenticated')
  }

  let query = supabase
    .from('blog_posts')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })

  if (options?.status) {
    query = query.eq('status', options.status)
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
  }

  const { data, error } = await query

  if (error) {
    throw error
  }

  return data
}

export async function getTags() {
  const supabase = createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session?.user) {
    throw new Error('Not authenticated')
  }

  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .eq('user_id', session.user.id)
    .order('usage_count', { ascending: false })

  if (error) {
    throw error
  }

  return data
}
