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

// Listen for the "stopvideo" message and redirect to a link
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "stopvideo") {
    console.log("Stopping video and redirecting...");
    sendResponse(`processed: ${message.action}`);
    
    // Redirect to the desired URL
    window.location.href = "https://hng-stage-5-5sz7.vercel.app/videos"; // Replace with your desired URL
  }
});
