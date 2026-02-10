# Testing Guide

## Manual Testing Steps

### 1. Load the Extension

1. Build the extension:
   ```bash
   npm run build
   ```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable "Developer mode" in the top right

4. Click "Load unpacked"

5. Select the `.output/chrome-mv3` directory

### 2. Test Automatic Collection

1. Navigate to any Wikipedia page (e.g., https://en.wikipedia.org/wiki/JavaScript)
2. The page should be automatically saved
3. Click the extension icon to see the collected page in the popup

### 3. Test Search Functionality

1. Visit several Wikipedia pages (e.g., JavaScript, Python, TypeScript)
2. Open the extension popup
3. Type "script" in the search bar
4. Verify that only matching pages appear

### 4. Test Tag Management

1. Open the popup or sidepanel
2. Click "Edit tags" on any page
3. Add tags like "programming, language, web"
4. Click "Save"
5. Verify tags appear as filter buttons
6. Click a tag to filter by it

### 5. Test Sidepanel

1. Right-click the extension icon
2. Select "Open side panel"
3. Verify the full collection view appears
4. Test all features (search, filter, tag edit, delete)

### 6. Test Page Revisit

1. Visit a Wikipedia page you've already collected
2. The timestamp should update (not create a duplicate)
3. Check the popup to verify only one entry exists

### 7. Test Deletion

1. Click the trash icon on any page
2. Confirm the page is removed from the collection

## Expected Results

- ✅ Pages are automatically collected on visit
- ✅ Search filters pages by title and summary
- ✅ Tags can be added, edited, and used for filtering
- ✅ Multiple tag filters work together (AND logic)
- ✅ Revisiting pages updates timestamp instead of duplicating
- ✅ Deletion removes pages from collection
- ✅ Popup shows compact collection view
- ✅ Sidepanel shows full-screen collection view
- ✅ All data persists after browser restart

## Performance Expectations

- Collection should handle 1000+ pages without noticeable lag
- Search should be instant (< 100ms for typical collections)
- UI should be responsive on all operations

## Browser Compatibility

Tested on:
- Chrome 120+
- Edge 120+
- Other Chromium-based browsers

Note: Firefox is not currently supported (manifest v3 differences)
