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
