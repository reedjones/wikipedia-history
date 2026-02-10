import type { WikiPage, WikiPageFilter } from './types'

const DB_NAME = 'wikipedia-history'
const STORE_NAME = 'pages'
const DB_VERSION = 1

class StorageService {
  private db: IDBDatabase | null = null

  async addPage(page: WikiPage): Promise<void> {
    const db = await this.ensureDb()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.put(page)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async deletePage(id: string): Promise<void> {
    const db = await this.ensureDb()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.delete(id)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async filterPages(filter: WikiPageFilter): Promise<WikiPage[]> {
    const pages = await this.getAllPages()
    return pages.filter((page) => {
      // Search query filter
      if (filter.searchQuery) {
        const query = filter.searchQuery.toLowerCase()
        const matchesTitle = page.title.toLowerCase().includes(query)
        const matchesSummary = page.summary?.toLowerCase().includes(query) || false
        if (!matchesTitle && !matchesSummary)
          return false
      }

      // Tags filter
      if (filter.tags && filter.tags.length > 0) {
        const hasTag = filter.tags.some(tag => page.tags.includes(tag))
        if (!hasTag)
          return false
      }

      // Date range filter
      if (filter.startDate && page.timestamp < filter.startDate)
        return false
      if (filter.endDate && page.timestamp > filter.endDate)
        return false

      return true
    }).sort((a, b) => b.timestamp - a.timestamp)
  }

  async getAllPages(): Promise<WikiPage[]> {
    const db = await this.ensureDb()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.getAll()

      request.onsuccess = () => resolve(request.result || [])
      request.onerror = () => reject(request.error)
    })
  }

  async getAllTags(): Promise<string[]> {
    const pages = await this.getAllPages()
    const tagsSet = new Set<string>()
    pages.forEach(page => page.tags.forEach(tag => tagsSet.add(tag)))
    return Array.from(tagsSet).sort()
  }

  async getPage(id: string): Promise<undefined | WikiPage> {
    const db = await this.ensureDb()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.get(id)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' })
          store.createIndex('timestamp', 'timestamp', { unique: false })
          store.createIndex('url', 'url', { unique: false })
          store.createIndex('tags', 'tags', { multiEntry: true, unique: false })
        }
      }
    })
  }

  async updatePageTags(id: string, tags: string[]): Promise<void> {
    const page = await this.getPage(id)
    if (!page)
      throw new Error('Page not found')
    page.tags = tags
    await this.addPage(page)
  }

  private async ensureDb(): Promise<IDBDatabase> {
    if (!this.db) {
      await this.init()
    }
    if (!this.db) {
      throw new Error('Failed to initialize IndexedDB. Please check browser settings and try again.')
    }
    return this.db
  }
}

export const storage = new StorageService()
