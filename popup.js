document.getElementById('cleanButton').addEventListener('click', () => {
    chrome.runtime.sendMessage({action: "cleanConversations"});
    window.close();
  });