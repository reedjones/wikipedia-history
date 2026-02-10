import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

import type { WikiPageFilter } from '@/lib/types'

import { PageListItem } from '@/components/PageListItem'
import { orpc } from '@/lib/orpc/client'

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const queryClient = useQueryClient()

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
      // Invalidate tags query to refresh tag list
      queryClient.invalidateQueries({ queryKey: orpc.getAllTags.queryOptions().queryKey })
    },
  })

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag],
    )
  }

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="bg-blue-600 text-white p-6">
        <h1 className="text-2xl font-bold">Wikipedia History</h1>
        <p className="text-sm opacity-90 mt-1">
          {pages.length}
          {' '}
          pages collected
        </p>
      </div>

      <div className="p-6 border-b bg-gray-50">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            className="w-full pl-12 pr-4 py-3 border rounded-lg text-base"
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search pages..."
            type="text"
            value={searchQuery}
          />
        </div>

        {allTags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-sm text-gray-600 font-semibold mr-2">Filter by tags:</span>
            {allTags.map(tag => (
              <button
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
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
                <div className="text-center">
                  <p className="text-xl mb-2">Loading...</p>
                  <p className="text-sm">Fetching your Wikipedia collection</p>
                </div>
              </div>
            )
          : pages.length === 0
            ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
                  <svg className="w-24 h-24 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                  <p className="text-xl font-semibold mb-2">No pages found</p>
                  <p className="text-sm text-center max-w-md">
                    Visit Wikipedia pages to start building your collection!
                    <br />
                    Pages will be automatically saved as you browse.
                  </p>
                </div>
              )
            : (
                <div className="max-w-4xl mx-auto">
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
