# Wikipedia History

A Chrome extension that automatically collects Wikipedia pages you browse into an organized collection that can be searched, filtered, tagged, and grouped. Built with React, WXT, and TypeScript.

## Features

- 🔖 **Automatic Collection**: Automatically saves Wikipedia pages as you visit them
- 🔍 **Search**: Quickly find pages by title or content
- 🏷️ **Tagging**: Organize pages with custom tags
- 🎯 **Filtering**: Filter pages by tags or date ranges
- 📱 **Multiple Views**: Access your collection via popup or side panel
- 💾 **Local Storage**: All data stored locally using IndexedDB

## Installation

### From Source (Development)

1. Install dependencies:
```bash
npm install --legacy-peer-deps
```

2. Build the extension:
```bash
npm run build
```

3. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked"
   - Select the `.output/chrome-mv3` directory

### Development Mode

```bash
npm run dev
```

This starts a development server with hot-reload. Load `.output/chrome-mv3-dev` in Chrome.

## Usage

### Collecting Pages

Simply browse Wikipedia! The extension automatically saves pages as you visit them. Each page includes:
- Title
- URL
- First paragraph summary
- Language
- Visit timestamp

### Viewing Your Collection

**Popup**: Click the extension icon to view a compact list of your collected pages.

**Side Panel**: For a full-screen experience, open the side panel:
1. Right-click the extension icon
2. Select "Open side panel"

### Searching and Filtering

- **Search Bar**: Type to search page titles and summaries
- **Tag Filters**: Click tags to filter by specific topics
- **Multiple Tags**: Select multiple tags to narrow your search

### Managing Tags

1. Click "Edit tags" on any page
2. Enter tags separated by commas (e.g., "science, physics, quantum")
3. Click "Save"

Tags appear as filter buttons once created and can be used to organize your collection.

### Deleting Pages

Click the trash icon on any page to remove it from your collection.

## Technical Details

### Tech Stack

- **Framework**: [WXT](https://wxt.dev) - Next-gen web extension framework
- **UI**: React 19 with TypeScript
- **Styling**: Tailwind CSS 4 + shadcn/ui components
- **Storage**: IndexedDB for persistent local storage
- **RPC**: oRPC for communication between popup/sidepanel and background service
- **State**: TanStack Query for data fetching and caching

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   └── PageListItem.tsx # Wikipedia page list item
├── entrypoints/        # Extension entry points
│   ├── background.ts   # Background service worker
│   ├── content.ts      # Content script for Wikipedia
│   ├── popup/          # Extension popup
│   └── sidepanel/      # Side panel view
├── lib/
│   ├── storage.ts      # IndexedDB storage service
│   ├── types.ts        # TypeScript type definitions
│   ├── orpc/           # RPC setup for IPC
│   └── utils.ts        # Utility functions
└── locales/            # i18n translations
```

### Storage Schema

```typescript
interface WikiPage {
  id: string // UUID
  lang?: string // Language code (e.g., 'en')
  summary?: string // First paragraph
  tags: string[] // User-defined tags
  timestamp: number // Visit timestamp
  title: string // Page title
  url: string // Full Wikipedia URL
}
```

## Development

### Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production extension
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run typecheck` - Run TypeScript type checking

### Adding UI Components

This project uses [shadcn/ui](https://ui.shadcn.com). To add components:

```bash
npx shadcn@latest add [component-name]
```

### Code Style

The project uses [@antfu/eslint-config](https://github.com/antfu/eslint-config) for consistent code style. Auto-fix is enabled in VS Code.

## Requirements

- Node.js 18+ or Bun
- Chrome/Chromium browser

## License

MIT

## Credits

Built upon the [wxt-starter](https://github.com/mefengl/wxt-starter) template by [@mefengl](https://github.com/mefengl).
