import { useEffect, useState } from "react";

function App() {
  const [leads, setLeads] = useState([]);
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    chrome.storage.local.get("zoho_data", (res) => {
      setLeads(res.zoho_data?.leads || []);
      setDeals(res.zoho_data?.deals || []);
    });
  }, []);

  const injectAndSend = (type) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0].id;

      chrome.scripting.executeScript(
        { target: { tabId }, files: ["content/contentScript.js"] },
        () => {
          chrome.tabs.sendMessage(tabId, { type }, () => {
            // Reload popup to reflect new data
            window.location.reload();
          });
        }
      );
    });
  };

  return (
    <div style={{ padding: "12px", fontSize: "13px", width: "300px" }}>
      <h3>Zoho CRM Extractor</h3>

      <button onClick={() => injectAndSend("EXTRACT_LEADS")}>
        Extract Leads
      </button>{" "}
      <button onClick={() => injectAndSend("EXTRACT_DEALS")}>
        Extract Deals
      </button>

      <hr />

      <strong>Leads ({leads.length})</strong>
      <ul>
        {leads.slice(0, 5).map((lead) => (
          <li key={lead.id}>{lead.name}</li>
        ))}
      </ul>

      <strong>Deals ({deals.length})</strong>
      <ul>
        {deals.slice(0, 5).map((deal) => (
          <li key={deal.id}>
            {deal.name}
            <br />
            <small>{deal.pipeline}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
