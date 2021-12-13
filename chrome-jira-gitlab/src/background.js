browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  sendResponse("test");
});
