function showStatus(text) {
  const host = document.createElement("div");
  const shadow = host.attachShadow({ mode: "open" });

  shadow.innerHTML = `
    <div style="
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #111;
      color: #fff;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 12px;
      z-index: 999999;">
      ${text}
    </div>
  `;

  document.body.appendChild(host);
  setTimeout(() => host.remove(), 2000);
}

showStatus("Extracting Leads...");

function extractLeads() {
  const leadElements = document.querySelectorAll(
    'a[href*="/crm/org"][data-zcqa]'
  );

  const leads = [];
  leadElements.forEach((el, index) => {
    const name = el.innerText?.trim();
    if (name) {
      leads.push({
        id: `lead-${index}`,
        name
      });
    }
  });

  return leads;
}

showStatus("Extracting Deals...");

function extractDeals() {
  const dealTextElements = document.querySelectorAll("a lyte-text");
  const deals = [];

  // Best-effort pipeline detection from visible UI
  const pipelineText =
    document.querySelector('[data-zcqa*="Pipeline"]')?.innerText ||
    document.querySelector("lyte-dropdown")?.innerText ||
    "Default Pipeline";

  dealTextElements.forEach((el, index) => {
    const name = el.innerText?.trim();

    if (name && name.length > 1) {
      deals.push({
        id: `deal-${index}`,
        name,
        stage: "Visible in UI",
        pipeline: pipelineText
      });
    }
  });

  return deals;
}


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "EXTRACT_LEADS") {
    const leads = extractLeads();
    chrome.storage.local.set(
      {
        zoho_data: {
          leads,
          lastSync: Date.now()
        }
      },
      () => sendResponse({ success: true, count: leads.length })
    );
    return true;
  }

  if (message.type === "EXTRACT_DEALS") {
    const deals = extractDeals();
    chrome.storage.local.set(
      {
        zoho_data: {
          deals,
          lastSync: Date.now()
        }
      },
      () => sendResponse({ success: true, count: deals.length })
    );
    return true;
  }
});
