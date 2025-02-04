'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { PlusIcon, TrashIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'

export function RSSSourceManager() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [sources, setSources] = useState<any[]>([])
  const supabase = createClientComponentClient()
  const { toast } = useToast()

  const addSource = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) return

    setLoading(true)
    try {
      const response = await fetch('/api/rss/sources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) {
        throw new Error('Failed to add RSS source')
      }

      const { source } = await response.json()
      setSources([source, ...sources])
      setUrl('')
      toast({
        title: 'RSS Source Added',
        description: 'Successfully added new RSS source',
      })
    } catch (error) {
      console.error('Error adding RSS source:', error)
      toast({
        title: 'Error',
        description: 'Failed to add RSS source',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const removeSource = async (id: string) => {
    try {
      const { error } = await supabase
        .from('rss_sources')
        .delete()
        .eq('id', id)

      if (error) throw error

      setSources(sources.filter(source => source.id !== id))
      toast({
        title: 'RSS Source Removed',
        description: 'Successfully removed RSS source',
      })
    } catch (error) {
      console.error('Error removing RSS source:', error)
      toast({
        title: 'Error',
        description: 'Failed to remove RSS source',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={addSource} className="flex gap-2">
        <Input
          type="url"
          placeholder="Enter RSS feed URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        <Button type="submit" disabled={loading}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Feed
        </Button>
      </form>

      <div className="space-y-4">
        {sources.map((source) => (
          <div
            key={source.id}
            className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
          >
            <div>
              <h3 className="font-medium">{source.title || source.url}</h3>
              {source.description && (
                <p className="text-sm text-gray-500">{source.description}</p>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeSource(source.id)}
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
