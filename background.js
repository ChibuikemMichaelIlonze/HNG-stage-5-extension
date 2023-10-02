// Chrome

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && /^http/.test(tab.url)) {
      chrome.scripting.executeScript({
        target: { tabId },
        files: ["./content.js"],
      })
        .then(() => {
          console.log("Content script has been injected!");
        })
        .catch((err) => {
          console.error(err, "Error in background script line 10");
        });
    }
  });
  