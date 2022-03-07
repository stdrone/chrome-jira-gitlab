console.log(chrome.runtime);
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  console.log(msg);
  if (msg === "getIssueName") {
    let sum = document.getElementById("summary-val");
    if (sum) {
      sendResponse(sum.innerText);
    }
  }
});
