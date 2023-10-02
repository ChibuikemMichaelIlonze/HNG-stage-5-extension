console.log("Hi, I have been injected whoopie!!!");

let recorder = null;
const recordedChunks = [];

function onAccessApproved(screenStream, includeAudio) {
  const combinedStream = new MediaStream();
  combinedStream.addTrack(screenStream.getVideoTracks()[0]);

  if (includeAudio) {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((micStream) => {
        combinedStream.addTrack(micStream.getAudioTracks()[0]);
        recorder = new MediaRecorder(combinedStream);

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            recordedChunks.push(event.data);
          }
        };

        recorder.onstop = () => {
          stopTracks(screenStream);
          stopTracks(micStream);

          const url = URL.createObjectURL(recordedChunks[0]);
          const lastCharacters = url.substr(-12);
          const customFileName = `untitled_video_${lastCharacters}.mp4`;
          console.log(customFileName);

          const blob = new Blob(recordedChunks, { type: "video/mp4" });
          const file = new File([blob], customFileName, { type: "video/mp4" });

          const formData = new FormData();
          formData.append("video", file);

          sendVideoToServer(formData);
          recordedChunks.length = 0;
        };

        recorder.start();
      })
      .catch((error) => {
        console.error("Error accessing microphone:", error);
      });
  } else {
    recorder = new MediaRecorder(screenStream);

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };

    recorder.onstop = () => {
      stopTracks(screenStream);

      const url = URL.createObjectURL(recordedChunks[0]);
      const lastCharacters = url.substr(-12);
      const customFileName = `untitled_video_${lastCharacters}.mp4`;
      console.log(customFileName);

      const blob = new Blob(recordedChunks, { type: "video/mp4" });
      const file = new File([blob], customFileName, { type: "video/mp4" });

      const formData = new FormData();
      formData.append("video", file);

      sendVideoToServer(formData);
      recordedChunks.length = 0;
    };

    recorder.start();
  }
}

function sendVideoToServer(formData) {
  fetch("https://transcription-5mz1.onrender.com/upload-video", {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (response.ok) {
        console.log("Video sent to the server successfully.");
        console.log(response.ok);
      } else {
        console.error("Error sending video to the server.");
        console.log(response.ok);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function stopTracks(stream) {
  stream.getTracks().forEach((track) => {
    if (track.readyState === "live") {
      track.stop();
    }
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "request_recording") {
    console.log("requesting recording");
    sendResponse(`processed: ${message.action}`);

    navigator.mediaDevices
      .getDisplayMedia({
        video: {
          displaySurface: message.screenType,
          mediaSource: "screen",
        },
        audio: message.audio,
      })
      .then((stream) => {
        onAccessApproved(stream, message.audio);
      });
  }

  if (message.action === "stopvideo") {
    console.log("stopping video");
    sendResponse(`processed: ${message.action}`);
    if (!recorder) return console.log("no recorder");

    recorder.stop();
  }
});
