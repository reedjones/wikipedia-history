import { RPCHandler } from '@orpc/server/message-port'

import type { WikiPage } from '@/lib/types'

import { router } from '@/lib/orpc/router'
import { storage } from '@/lib/storage'

const handler = new RPCHandler(router)

export default defineBackground(() => {
  // Initialize storage
  storage.init().catch(console.error)

  // Handle RPC connections
  browser.runtime.onConnect.addListener((port) => {
    handler.upgrade(port, { context: {} })
  })

  // Handle messages from content script
  browser.runtime.onMessage.addListener((message, _sender) => {
    if (message.type === 'SAVE_WIKI_PAGE') {
      const { lang, summary, title, url } = message.data

      const page: WikiPage = {
        id: crypto.randomUUID(),
        lang,
        summary,
        tags: [],
        timestamp: Date.now(),
        title,
        url,
      }

      storage.addPage(page).catch(console.error)
    }
  })

  // eslint-disable-next-line no-console
  console.log(`${i18n.t('hello')} background!`, { id: browser.runtime.id })
})
