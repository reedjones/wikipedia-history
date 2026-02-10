import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import type { WikiPageFilter } from '@/lib/types'

import { PageListItem } from '@/components/PageListItem'
import { orpc } from '@/lib/orpc/client'

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const filter: WikiPageFilter = {
    searchQuery: searchQuery || undefined,
    tags: selectedTags.length > 0 ? selectedTags : undefined,
  }

  const { data: pages = [], isPending, refetch } = useQuery(
    orpc.filterPages.queryOptions(filter),
  )
  const { data: allTags = [] } = useQuery(orpc.getAllTags.queryOptions())

  const deleteMutation = useMutation({
    mutationFn: (id: string) => orpc.deletePage.mutate(id),
    onSuccess: () => refetch(),
  })

  const updateTagsMutation = useMutation({
    mutationFn: ({ id, tags }: { id: string, tags: string[] }) =>
      orpc.updatePageTags.mutate({ id, tags }),
    onSuccess: () => {
      refetch()
      // Refetch tags to update tag list
      orpc.getAllTags.mutate().catch(console.error)
    },
  })

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag],
    )
  }

  return (
    <div className="w-[600px] h-[500px] flex flex-col">
      <div className="bg-blue-600 text-white p-4">
        <h1 className="text-xl font-bold">Wikipedia History</h1>
        <p className="text-sm opacity-90">
          {pages.length}
          {' '}
          pages collected
        </p>
      </div>

      <div className="p-4 border-b bg-gray-50">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search pages..."
            type="text"
            value={searchQuery}
          />
        </div>

        {allTags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {allTags.map(tag => (
              <button
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                key={tag}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {isPending
          ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                Loading...
              </div>
            )
          : pages.length === 0
            ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <p className="text-lg">No pages found</p>
                  <p className="text-sm mt-2">Visit Wikipedia pages to start collecting!</p>
                </div>
              )
            : (
                <div>
                  {pages.map(page => (
                    <PageListItem
                      key={page.id}
                      onDelete={id => deleteMutation.mutate(id)}
                      onUpdateTags={(id, tags) => updateTagsMutation.mutate({ id, tags })}
                      page={page}
                    />
                  ))}
                </div>
              )}
      </div>
    </div>
  )
}

export default App
