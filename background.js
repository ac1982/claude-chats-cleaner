console.log('Service Worker: Script loaded');

let organizationID = null;

function extractOrganizationID(url) {
  const match = url.match(/\/api\/bootstrap\/([^/]+)/);
  return match ? match[1] : null;
}

chrome.webRequest.onCompleted.addListener(
  function(details) {
    console.log('Intercepted request:', details.url);
    if (details.url.includes('api.claude.ai/api/bootstrap')) {
      const extractedID = extractOrganizationID(details.url);
      if (extractedID) {
        organizationID = extractedID;
        console.log('Organization ID extracted from URL:', organizationID);
      } else {
        console.log('Failed to extract organizationID from URL');
      }

      fetch(details.url)
        .then(response => response.json())
        .then(data => {
          console.log('Full API response:', JSON.stringify(data, null, 2));
          
          if (data.user && data.user.customIDs && data.user.customIDs.organizationID) {
            organizationID = data.user.customIDs.organizationID;
            console.log('Organization ID from response:', organizationID);
          } else {
            console.log('OrganizationID not found in response data');
          }
        })
        .catch(error => {
          console.error('Error fetching bootstrap data:', error);
        });
    }
  },
  {urls: ["https://api.claude.ai/api/bootstrap/*"]}
);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Service Worker: Received message:', request);
  if (request.action === "cleanConversations") {
    fetchAndDeleteConversations();
    sendResponse({status: "Cleaning started"});
  } else {
    console.error('Unknown action:', request.action);
    sendResponse({error: 'Unknown action'});
  }
});

function fetchAndDeleteConversations() {
  if (!organizationID) {
    console.log('Organization ID not available. Please visit claude.ai first.');
    return;
  }

  fetch(`https://api.claude.ai/api/organizations/${organizationID}/chat_conversations`)
    .then(response => response.json())
    .then(data => {
      console.log(`Fetched ${data.length} conversations`);
      return Promise.all(data.map(conversation => deleteConversation(conversation.uuid)));
    })
    .then(results => {
      const deletedCount = results.filter(result => result === true).length;
      console.log(`Successfully deleted ${deletedCount} conversations`);
      showNotification("Done", `Deleted ${deletedCount} conversations. Please refresh your web page.`);
    })
    .catch(error => console.error('Error in fetchAndDeleteConversations:', error));
}

function deleteConversation(uuid) {
  return fetch(`https://api.claude.ai/api/organizations/${organizationID}/chat_conversations/${uuid}`, {
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
      console.error(`Error deleting conversation ${uuid}:`, error);
      return false;
    });
}

function showNotification(title, message) {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon128.png',
    title: title,
    message: message
  });
}

console.log('Service Worker: Initialization complete');