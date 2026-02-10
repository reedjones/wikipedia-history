import { TrashIcon } from '@radix-ui/react-icons'
import { useState } from 'react'

import type { WikiPage } from '@/lib/types'

import { Button } from '@/components/ui/button'

interface PageListItemProps {
  onDelete: (id: string) => void
  onUpdateTags: (id: string, tags: string[]) => void
  page: WikiPage
}

export function PageListItem({ onDelete, onUpdateTags, page }: PageListItemProps) {
  const [isEditingTags, setIsEditingTags] = useState(false)
  const [tagInput, setTagInput] = useState(page.tags.join(', '))

  const handleSaveTags = () => {
    const tags = tagInput.split(',').map(t => t.trim()).filter(t => t.length > 0)
    onUpdateTags(page.id, tags)
    setIsEditingTags(false)
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  return (
    <div className="border-b p-4 hover:bg-gray-50">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <a
            className="text-lg font-semibold text-blue-600 hover:underline"
            href={page.url}
            rel="noopener noreferrer"
            target="_blank"
          >
            {page.title}
          </a>
          <p className="text-sm text-gray-600 mt-1">{page.summary}</p>
          <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
            <span>{formatDate(page.timestamp)}</span>
            {page.lang && <span className="rounded bg-gray-200 px-2 py-1">{page.lang}</span>}
          </div>
          <div className="mt-2">
            {isEditingTags
              ? (
                  <div className="flex gap-2">
                    <input
                      className="flex-1 rounded border px-2 py-1 text-sm"
                      onChange={e => setTagInput(e.target.value)}
                      placeholder="tag1, tag2, tag3"
                      type="text"
                      value={tagInput}
                    />
                    <Button onClick={handleSaveTags} size="sm">Save</Button>
                    <Button onClick={() => setIsEditingTags(false)} size="sm" variant="outline">Cancel</Button>
                  </div>
                )
              : (
                  <div className="flex items-center gap-2">
                    {page.tags.length > 0
                      ? page.tags.map(tag => (
                          <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-700" key={tag}>
                            {tag}
                          </span>
                        ))
                      : <span className="text-xs text-gray-400">No tags</span>}
                    <button
                      className="text-xs text-blue-600 hover:underline"
                      onClick={() => setIsEditingTags(true)}
                    >
                      Edit tags
                    </button>
                  </div>
                )}
          </div>
        </div>
        <Button
          className="ml-2"
          onClick={() => onDelete(page.id)}
          size="sm"
          variant="ghost"
        >
          <TrashIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
