document.addEventListener("DOMContentLoaded", () => {
  const startVideoButton = document.getElementById("start_video");
  const stopVideoButton = document.getElementById("stop_video");
  const audioElement = document.querySelector("input#audio");
  const fullScreenSelect = document.querySelector(".full-screen");
  const currentTabSelect = document.querySelector(".current-tab");
  const closePopup = document.getElementById("close");
  
  let screen = "browser";
  let hasAudio = true;

  startVideoButton.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "request_recording", audio: hasAudio, screenType: screen }, (response) => {
        if (!chrome.runtime.lastError) {
          console.log(response);
        } else {
          console.error(chrome.runtime.lastError, "Error line 15");
        }
      });
    });
  });

  stopVideoButton.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "stopvideo" }, (response) => {
        if (!chrome.runtime.lastError) {
          console.log(response);
        } else {
          console.error(chrome.runtime.lastError, 'error line 27');
        }
      });
    });
  });

  closePopup.addEventListener("click", () => {
    window.close();
  });

  audioElement.addEventListener("change", () => {
    hasAudio = audioElement.checked;
    console.log(hasAudio);
  });

  fullScreenSelect.addEventListener("click", () => {
    fullScreenSelect.style.opacity = 1;
    currentTabSelect.style.opacity = 0.5;
    screen = "window";
  });

  currentTabSelect.addEventListener("click", () => {
    currentTabSelect.style.opacity = 1;
    fullScreenSelect.style.opacity = 0.5;
    screen = "browser";
  });
});
