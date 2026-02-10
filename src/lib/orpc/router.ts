import { os } from '@orpc/server'

import type { WikiPageFilter } from '@/lib/types'

import { storage } from '@/lib/storage'

export const router = {
  deletePage: os.input<string>().handler(async ({ input }) => {
    return storage.deletePage(input)
  }),

  filterPages: os.input<WikiPageFilter>().handler(async ({ input }) => {
    return storage.filterPages(input)
  }),

  getAllPages: os.handler(async () => {
    return storage.getAllPages()
  }),

  getAllTags: os.handler(async () => {
    return storage.getAllTags()
  }),

  hello: os.handler(async () => {
    return `${i18n.t('hello')} orpc`
  }),

  updatePageTags: os.input<{ id: string, tags: string[] }>().handler(async ({ input }) => {
    return storage.updatePageTags(input.id, input.tags)
  }),
}

export type AppRouter = typeof router
