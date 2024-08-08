document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('cleanButton').addEventListener('click', cleanConversations);
  document.getElementById('coffeeButton').addEventListener('click', openPayPalLink);
});

function cleanConversations() {
  chrome.runtime.sendMessage({action: "cleanConversations"});
  window.close();
}

function openPayPalLink() {
  chrome.tabs.create({ url: 'https://paypal.me/AlexChiang37' });
}