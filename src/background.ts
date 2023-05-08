chrome.runtime.onMessage.addListener((msg, sender) => {
  // First, validate the message's structure.
  if (msg.from === 'content' && msg.subject === 'showPageAction') {
    // Enable the page-action for the requesting tab.
    if (sender.tab != undefined && sender.tab.id != undefined) {
      chrome.pageAction.show(sender.tab.id);
    }
  }
});
