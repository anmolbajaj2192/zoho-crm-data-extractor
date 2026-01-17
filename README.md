# Zoho CRM Data Extractor – Chrome Extension

## Overview
Zoho CRM Data Extractor is a Chrome Extension built using **Manifest V3** that extracts
data from **Zoho CRM** using **DOM scraping** and displays it in a **React-based popup dashboard**.

The extension is designed to work reliably with **Zoho CRM’s Single Page Application (SPA)**
architecture by dynamically injecting content scripts when extraction is triggered.

---

## Tech Stack
- Chrome Extension (Manifest V3)
- JavaScript (Content Scripts & Service Worker)
- React.js (Popup UI)
- chrome.storage.local (Persistence)
- chrome.scripting (Dynamic content script injection)
- Shadow DOM (Visual extraction feedback)

---

## Supported CRM
- **Zoho CRM**

---

## Supported Modules
- Leads
- Deals (with best-effort pipeline awareness)

> Other modules such as Contacts, Accounts, and Tasks follow similar extraction patterns
and are documented as future extensions.

---

## How the Extension Works

1. The popup UI (React) triggers extraction from the currently active Zoho CRM tab.
2. A content script is dynamically injected using `chrome.scripting.executeScript`
   to ensure compatibility with Zoho CRM’s SPA behavior.
3. Data is extracted directly from the DOM (no API usage).
4. Extracted records are stored in `chrome.storage.local`.
5. The popup dashboard reads from local storage and displays the extracted data.
6. A small Shadow DOM-based status indicator is injected into the page during extraction
   to show progress.

---

## DOM Selection Strategy

Zoho CRM uses a SPA architecture with **Lyte components** instead of traditional HTML tables.
Standard selectors like `<table>` or `<tr>` are not reliable.

The extraction logic:
- Inspects live DOM elements for each module
- Uses **component-level selectors** (e.g. `lyte-text` inside anchor elements)
- Relies on **attribute-based and structural selectors** instead of static table rows
- Dynamically injects content scripts to handle DOM changes during SPA navigation

This approach ensures stable extraction across page reloads and module transitions.

---

## Storage Schema

```json
{
  "zoho_data": {
    "leads": [
      { "id": "lead-1", "name": "Example Lead" }
    ],
    "deals": [
      {
        "id": "deal-1",
        "name": "Example Deal",
        "stage": "Visible in UI",
        "pipeline": "Default Pipeline"
      }
    ],
    "lastSync": 1234567890
  }
}
```
## Features
- Extract Leads and Deals from Zoho CRM
- Deal pipeline awareness (best-effort from visible UI)
- Local persistence using `chrome.storage.local`
- React-based popup dashboard
- Shadow DOM status indicator during extraction
- SPA-safe extraction using dynamic script injection

---

## Limitations
- Pagination handling is not implemented
- Canvas view is not supported
- Team Selling and Deal Split features are not implemented (bonus scope)
- Stage extraction is UI-aware but not deeply parsed

These trade-offs were made intentionally to prioritize reliability and core functionality
within the given time constraints.

---

## How to Run Locally

1. Install dependencies:
   ```bash
   npm install
2. Build the popup UI:
   ```bash
   npm run build
3. Open Chrome and go to:
   ```bash
   chrome://extensions
4. Enable Developer Mode
5. Click Load unpacked
6. Select the extension/ directory

Future Improvements
Add support for Contacts, Accounts, and Tasks
Implement pagination handling
Export extracted data as CSV/JSON
Add search and filtering in popup dashboard
Real-time sync across tabs using chrome.storage.onChanged

