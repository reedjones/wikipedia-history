export default defineContentScript({
  main() {
    // Extract Wikipedia page information
    const extractPageData = () => {
      const url = window.location.href
      const title = document.querySelector('#firstHeading')?.textContent || document.title

      // Find the first non-empty paragraph that's part of the main article
      const paragraphs = document.querySelectorAll('.mw-parser-output > p')
      let summary = ''
      for (const p of paragraphs) {
        const text = p.textContent?.trim() || ''
        // Skip empty paragraphs and disambiguation notices
        if (text.length > 50 && !p.classList.contains('mw-empty-elt')) {
          summary = text.slice(0, 500)
          break
        }
      }

      const lang = url.match(/\/\/([a-z]{2})\.wikipedia\.org/)?.[1] || 'en'

      return {
        lang,
        summary,
        title,
        url,
      }
    }

    // Send page data to background script
    const savePage = async () => {
      const pageData = extractPageData()

      try {
        await browser.runtime.sendMessage({
          data: pageData,
          type: 'SAVE_WIKI_PAGE',
        })
      }
      catch (error) {
        console.error('Failed to save Wikipedia page:', error)
      }
    }

    // Save page when loaded
    if (document.readyState === 'complete') {
      savePage()
    }
    else {
      window.addEventListener('load', savePage)
    }
  },
  matches: ['*://*.wikipedia.org/*'],
})
