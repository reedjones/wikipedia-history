export default defineContentScript({
  main() {
    // Extract Wikipedia page information
    const extractPageData = () => {
      const url = window.location.href
      const title = document.querySelector('#firstHeading')?.textContent || document.title
      const summary = document.querySelector('.mw-parser-output > p')?.textContent?.slice(0, 500) || ''
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
