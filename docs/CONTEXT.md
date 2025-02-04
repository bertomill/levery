# Application Context & User Journeys

## Overview
This document outlines the key user journeys and contexts for our Next.js application. Each journey represents a specific "job to be done" from the user's perspective.

## User Personas

### Primary User
- **Who they are**: The user is Berto, a young and eager professional in Toronto. He is looking to stay on top of the latest news in his industry and generate content sharing his insights for others to learn from.
- **Goals**: Stay on top of the latest industry developments, finding opportunities by staying aware of the latest blogs etc.
- **Pain points**: It's hard to put together blog posts from all the articles read, keep track of the latest developments, and figure out which articles to include in blog posts.
- **Technical comfort level**: He is moderately good with technology and has been putting a lot of work in the last year into learning the latest developments in AI through articles, research papers, and YouTube videos.

## Core User Journeys

### Journey 1: Content Creation & Publishing

#### Context
- **User Goal**: Create insightful content for followers about AI developments, provide value, and create opportunities through content visibility.
- **Entry Point**: Log into the app to start the content creation process seamlessly.
- **Success Criteria**: Feeling confident about created content, with AI functionality helping create excellent content and adding novel insights.

#### Journey Steps
1. **Initial Entry**
   - User Action: Open app to clean welcome screen, sign up/log in with Google account
   - System Response: Seamless login process with Google OAuth integration
   - Technologies: Next.js with Supabase for DB, shadcn for UI
   - Success Indicators: Successful login and redirect to app console

2. **About Me Section**
   - User Action: Complete profile with relevant personal and professional information
   - System Response: Clean, step-by-step onboarding flow with engaging UI components
   - Technologies: 
     - shadcn UI components
     - Form validation with react-hook-form
     - Progressive form state management with Zustand
     - Supabase for user profile storage
   - Success Indicators: Profile completion rate, onboarding engagement metrics

3. **Research**
   - User Action: I now want to do some research on the latest developments in the AI landscape. I want the app to immediately reccomend important events in the AI landscape that are important - I can click links to go to external sites, or even better, the app is pulling in relevant data for me to do my research. 
   - System Response: The app presents a personalized dashboard with:
     - Trending AI news cards
     - Curated RSS feeds from top AI sources
     - Twitter/X API integration for latest updates
     - Ability to save articles with one click
     - AI-powered article summarization
   - Technologies:
     - RSS Feed Parser
     - Twitter/X API
     - Browser extension for external article saving
     - DeepSeek for article summarization
     - Supabase real-time updates
   - Success Indicators: Number of articles saved, engagement time, successful article imports

4. **Taking Notes**
   - User Action: I want to be able to take notes on the articles/content reccomended and also articles I have found external from the app can get pulled in. I want to be able to add them to my research notes.
   - System Response: The app provides:
     - Rich text editor for note-taking
     - Auto-tagging of notes based on content
     - Ability to link notes to saved articles
     - AI-powered note suggestions
     - Quick capture functionality
   - Technologies:
     - TipTap or ProseMirror for rich text editing
     - Natural language processing for auto-tagging
     - IndexedDB for offline support
     - DeepSeek for content analysis
   - Success Indicators: Notes created per session, tags used, links between notes and articles

5. **Suggesting Content Topics**
   - User Action: Once I have collected enough content from the web along with my research notes, I want to be able to leverage them to generate a blog post ideas. I look through the content i've collected and the notes i've taken, probably in a table format, then I can ask the app - what are some blog ideas I should write about, given the content i've saved and the notes i've take. 
   - System Response: The app analyzes saved content and notes to:
     - Generate topic clusters
     - Identify trending subjects
     - Suggest unique angles based on user's expertise
     - Provide gap analysis in current content landscape
   - Technologies:
     - DeepSeek for content analysis
     - Topic modeling algorithms
     - Trend analysis API
     - Custom recommendation engine
   - Success Indicators: Topic suggestion acceptance rate, uniqueness score of suggestions

6. **Writing the blog post**
   - User Action: Once I have a topic that I like, I want to begin the writing process. I want the AI to suggest an outline for the blog post, and then I can add my own thoughts to it. I want to be able to add my own notes to the outline, and then I want to be able to generate the blog post. I also want to be able to select from a list of key facts to include in the post. 
   - System Response: The app provides:
     - AI-generated outline with customization options
     - Fact suggestion panel from saved research
     - Real-time writing assistance
     - Citation management
     - SEO optimization suggestions
   - Technologies:
     - DeepSeek for content generation
     - TipTap for rich text editing
     - Citation management system
     - SEO analysis tools
   - Success Indicators: Time to complete first draft, number of facts incorporated, outline customization rate

7. **Editing the blog post**
   - User Action: Once I have a blog post, I want to be able to highlight specific sections of it I want to change. I want to be able to add my own notes to it. I also want to be able to add images to the post if I want.
   - System Response: The app offers:
     - Inline editing with version history
     - AI-powered improvement suggestions
     - Image search and optimization
     - Grammar and style checking
     - Readability analysis
   - Technologies:
     - Draft.js or Slate.js for rich text editing
     - Image optimization API
     - DeepSeek for content improvement
     - Grammar checking API
   - Success Indicators: Edit completion time, number of AI suggestions accepted, image upload success rate

8. **Publishing the blog post**
   - User Action: Once I have a blog post, I want to be able to publish it. I want to be able to share it with my followers, and I want to be able to share it with my network. I also want to be able to share it with my followers.
   - System Response: The app provides:
     - Multi-platform publishing options
     - Preview functionality
     - Scheduling capabilities
     - Social media post generator
     - Analytics dashboard
   - Technologies:
     - Social media APIs (LinkedIn, Twitter, Medium)
     - Schedule management system
     - Analytics integration
     - Image CDN
   - Success Indicators: Successful publish rate, social sharing metrics, scheduling usage

### Journey 2: [Alternative Job to be Done]
[Similar structure as Journey 1...]

## Technical Context

### Tech Stack
- Frontend: Next.js with TypeScript
- Backend/Database: Supabase
- UI Framework: shadcn/ui
- AI Processing: DeepSeek

### Integration Points
- Social media platforms (LinkedIn, Twitter, Medium)
- RSS feed aggregators
- Image optimization services
- AI content analysis (DeepSeek)
- Authentication providers (Google, GitHub)
- Analytics platforms
- SEO tools

## Success Metrics
### Key Performance Indicators (KPIs)
- User retention rate
- Content completion rate
- Time to publish
- Social sharing metrics
- User engagement metrics

### User Satisfaction Metrics
- Net Promoter Score (NPS)
- User satisfaction surveys
- Feature usage statistics
- Time spent in app
- Content quality ratings

### Technical Performance Metrics
- API response times
- System uptime
- Error rates
- Content processing speed
- Database query performance

## Future Considerations
### Planned Improvements
- Progressive Web App (PWA) features
- Collaborative features
- Advanced AI writing assistance
- Enhanced analytics dashboard
- Custom website integration

### Scalability Considerations
- Microservices architecture
- Content delivery optimization
- Database sharding strategy
- Cache implementation
- API rate limiting

### Potential User Needs
- Team collaboration features
- Content calendar management
- Advanced SEO tools
- Custom branding options
- Integration with additional platforms

## Database Schema

### Tables

#### users
- id: uuid (primary key)
- email: string (unique)
- full_name: string
- job_title: string
- industry: string
- goals: text
- created_at: timestamp
- updated_at: timestamp
- last_login: timestamp
- profile_image_url: string
- settings: jsonb

#### articles
- id: uuid (primary key)
- user_id: uuid (foreign key -> users.id)
- title: string
- url: string
- source: string
- summary: text
- content: text
- published_date: timestamp
- saved_date: timestamp
- tags: string[]
- status: enum ('unread', 'reading', 'read')
- importance: integer
- metadata: jsonb

#### notes
- id: uuid (primary key)
- user_id: uuid (foreign key -> users.id)
- article_id: uuid (foreign key -> articles.id, nullable)
- title: string
- content: text
- tags: string[]
- created_at: timestamp
- updated_at: timestamp
- is_archived: boolean
- metadata: jsonb

#### blog_posts
- id: uuid (primary key)
- user_id: uuid (foreign key -> users.id)
- title: string
- content: text
- status: enum ('draft', 'review', 'published')
- published_date: timestamp
- created_at: timestamp
- updated_at: timestamp
- tags: string[]
- seo_metadata: jsonb
- referenced_articles: uuid[] (foreign key -> articles.id[])
- referenced_notes: uuid[] (foreign key -> notes.id[])

#### article_notes_links
- id: uuid (primary key)
- article_id: uuid (foreign key -> articles.id)
- note_id: uuid (foreign key -> notes.id)
- created_at: timestamp

#### tags
- id: uuid (primary key)
- name: string (unique)
- user_id: uuid (foreign key -> users.id)
- created_at: timestamp
- usage_count: integer

#### publishing_history
- id: uuid (primary key)
- blog_post_id: uuid (foreign key -> blog_posts.id)
- platform: string
- status: enum ('scheduled', 'published', 'failed')
- published_url: string
- scheduled_date: timestamp
- published_date: timestamp
- metadata: jsonb

## Application Structure

├── app/
│ ├── (auth-layout)/
│ │ ├── login/
│ │ │ └── page.tsx
│ │ ├── register/
│ │ │ └── page.tsx
│ │ ├── onboarding/
│ │ │ └── page.tsx
│ │ └── layout.tsx
│ ├── dashboard/
...

├── components/
│ ├── ui/           # shadcn/ui components
│ │ ├── button.tsx
│ │ ├── form.tsx
│ │ ├── input.tsx
│ │ ├── select.tsx
│ │ └── textarea.tsx
│ ├── onboarding/   # New onboarding components
│ │ ├── OnboardingContext.tsx
│ │ ├── OnboardingProgress.tsx
│ │ ├── ProfileStep.tsx
│ │ ├── IndustryStep.tsx
│ │ └── GoalsStep.tsx
│ ├── research/
│ │ ├── ArticleCard.tsx
...