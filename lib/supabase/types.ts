export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          full_name: string | null
          job_title: string | null
          industry: string | null
          goals: string | null
          created_at: string
          updated_at: string
          last_login: string | null
          profile_image_url: string | null
          settings: Json | null
        }
        Insert: {
          id: string
          full_name?: string | null
          job_title?: string | null
          industry?: string | null
          goals?: string | null
          created_at?: string
          updated_at?: string
          last_login?: string | null
          profile_image_url?: string | null
          settings?: Json | null
        }
        Update: {
          id?: string
          full_name?: string | null
          job_title?: string | null
          industry?: string | null
          goals?: string | null
          created_at?: string
          updated_at?: string
          last_login?: string | null
          profile_image_url?: string | null
          settings?: Json | null
        }
      }
      articles: {
        Row: {
          id: string
          user_id: string
          title: string
          url: string
          source: string
          summary: string | null
          content: string | null
          published_date: string | null
          saved_date: string
          tags: string[]
          status: 'unread' | 'reading' | 'read'
          importance: number
          metadata: Json | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          url: string
          source: string
          summary?: string | null
          content?: string | null
          published_date?: string | null
          saved_date?: string
          tags?: string[]
          status?: 'unread' | 'reading' | 'read'
          importance?: number
          metadata?: Json | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          url?: string
          source?: string
          summary?: string | null
          content?: string | null
          published_date?: string | null
          saved_date?: string
          tags?: string[]
          status?: 'unread' | 'reading' | 'read'
          importance?: number
          metadata?: Json | null
        }
      }
      notes: {
        Row: {
          id: string
          user_id: string
          article_id: string | null
          title: string
          content: string
          tags: string[]
          created_at: string
          updated_at: string
          is_archived: boolean
          metadata: Json | null
        }
        Insert: {
          id?: string
          user_id: string
          article_id?: string | null
          title: string
          content: string
          tags?: string[]
          created_at?: string
          updated_at?: string
          is_archived?: boolean
          metadata?: Json | null
        }
        Update: {
          id?: string
          user_id?: string
          article_id?: string | null
          title?: string
          content?: string
          tags?: string[]
          created_at?: string
          updated_at?: string
          is_archived?: boolean
          metadata?: Json | null
        }
      }
      blog_posts: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          status: 'draft' | 'review' | 'published'
          published_date: string | null
          created_at: string
          updated_at: string
          tags: string[]
          seo_metadata: Json | null
          referenced_articles: string[]
          referenced_notes: string[]
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content: string
          status?: 'draft' | 'review' | 'published'
          published_date?: string | null
          created_at?: string
          updated_at?: string
          tags?: string[]
          seo_metadata?: Json | null
          referenced_articles?: string[]
          referenced_notes?: string[]
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          status?: 'draft' | 'review' | 'published'
          published_date?: string | null
          created_at?: string
          updated_at?: string
          tags?: string[]
          seo_metadata?: Json | null
          referenced_articles?: string[]
          referenced_notes?: string[]
        }
      }
      article_notes_links: {
        Row: {
          id: string
          article_id: string
          note_id: string
          created_at: string
        }
        Insert: {
          id?: string
          article_id: string
          note_id: string
          created_at?: string
        }
        Update: {
          id?: string
          article_id?: string
          note_id?: string
          created_at?: string
        }
      }
      tags: {
        Row: {
          id: string
          name: string
          user_id: string
          created_at: string
          usage_count: number
        }
        Insert: {
          id?: string
          name: string
          user_id: string
          created_at?: string
          usage_count?: number
        }
        Update: {
          id?: string
          name?: string
          user_id?: string
          created_at?: string
          usage_count?: number
        }
      }
      publishing_history: {
        Row: {
          id: string
          blog_post_id: string
          platform: string
          status: 'scheduled' | 'published' | 'failed'
          published_url: string | null
          scheduled_date: string | null
          published_date: string | null
          metadata: Json | null
        }
        Insert: {
          id?: string
          blog_post_id: string
          platform: string
          status?: 'scheduled' | 'published' | 'failed'
          published_url?: string | null
          scheduled_date?: string | null
          published_date?: string | null
          metadata?: Json | null
        }
        Update: {
          id?: string
          blog_post_id?: string
          platform?: string
          status?: 'scheduled' | 'published' | 'failed'
          published_url?: string | null
          scheduled_date?: string | null
          published_date?: string | null
          metadata?: Json | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
