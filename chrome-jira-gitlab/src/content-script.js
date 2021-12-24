chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg === "getIssueName") {
    let sum = document.getElementById("summary-val");
    if (sum) {
      sendResponse(sum.innerText);
    }
  }
});
