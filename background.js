let organizationID = null;

chrome.webRequest.onCompleted.addListener(
  function(details) {
    if (details.url.includes('claude.ai/api/bootstrap')) {
      fetch(details.url)
        .then(response => response.json())
        .then(data => {
          organizationID = data.user.customIDs.organizationID;
          console.log('Organization ID:', organizationID);
        })
        .catch(error => console.error('Error:', error));
    }
  },
  {urls: ["https://claude.ai/api/bootstrap/*"]}
);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "cleanConversations") {
    fetchAndDeleteConversations();
  }
});

function fetchAndDeleteConversations() {
  let deletedCount = 0;

  fetch(`https://claude.ai/api/organizations/${organizationID}/chat_conversations`)
    .then(response => response.json())
    .then(data => {
      const deletePromises = data.map(conversation => deleteConversation(conversation.uuid));
      return Promise.all(deletePromises);
    })
    .then(results => {
      deletedCount = results.filter(result => result === true).length;
      showNotification(deletedCount);
    })
    .catch(error => console.error('Error:', error));
}

function deleteConversation(uuid) {
  return fetch(`https://claude.ai/api/organizations/${organizationID}/chat_conversations/${uuid}`, {
    method: 'DELETE'
  })
    .then(response => {
      if (response.ok) {
        console.log(`Successfully deleted conversation: ${uuid}`);
        return true;
      } else {
        console.log(`Failed to delete conversation: ${uuid}`);
        return false;
      }
    })
    .catch(error => {
      console.error('Error:', error);
      return false;
    });
}

function showNotification(message) {
  if (typeof browser !== 'undefined' && browser.notifications) {
    browser.notifications.create({
      type: 'basic',
      iconUrl: 'icon.png',
      title: 'Claude AI Conversation Cleaner',
      message: message
    });
  } else if (typeof chrome !== 'undefined' && chrome.notifications) {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icon.png',
      title: 'Claude AI Conversation Cleaner',
      message: message
    });
  } else {
    // 如果都不可用，使用 alert
    alert('Claude AI Conversation Cleaner: ' + message);
  }
}