chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg === 'getIssueName') {
    const sum = document.getElementById('summary-val')
    if (sum) {
      sendResponse(sum.innerText)
    }
  }
})
