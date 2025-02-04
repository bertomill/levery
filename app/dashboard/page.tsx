import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { RSSSourceManager } from '@/components/rss/RSSSourceManager'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

export default async function Dashboard() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <>
      <nav className="border-b bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="flex flex-shrink-0 items-center">
                <span className="text-xl font-bold">Levery</span>
              </div>
            </div>
            <div className="flex items-center">
              <form action="/auth/signout" method="post">
                <Button variant="ghost" size="sm">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-8 md:grid-cols-[300px,1fr]">
          <aside className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">RSS Feeds</h2>
              <RSSSourceManager />
            </div>
          </aside>

          <main className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h1 className="text-2xl font-bold mb-4">Research Dashboard</h1>
              <p className="text-gray-600">
                Start by adding some RSS feeds to stay updated with the latest content.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Recent Articles</h2>
              <div className="bg-white shadow rounded-lg p-6">
                {/* We'll add the ArticleList component here later */}
                <p className="text-gray-600">Articles from your feeds will appear here.</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
