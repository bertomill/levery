export interface User {
  id: string
  email: string
  fullName: string
  jobTitle?: string
  industry?: string
  goals?: string
  profileImageUrl?: string
  settings?: Record<string, any>
}

export interface Article {
  id: string
  userId: string
  title: string
  url: string
  source: string
  summary?: string
  content?: string
  publishedDate: Date
  savedDate: Date
  tags: string[]
  status: 'unread' | 'reading' | 'read'
  importance: number
  metadata?: Record<string, any>
}

export interface Note {
  id: string
  userId: string
  articleId?: string
  title: string
  content: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
  isArchived: boolean
  metadata?: Record<string, any>
}

export interface BlogPost {
  id: string
  userId: string
  title: string
  content: string
  status: 'draft' | 'review' | 'published'
  publishedDate?: Date
  createdAt: Date
  updatedAt: Date
  tags: string[]
  seoMetadata?: Record<string, any>
  referencedArticles: string[]
  referencedNotes: string[]
} 