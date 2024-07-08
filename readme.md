# Chats Cleaner

## Background

Claude AI is a powerful artificial intelligence assistant, but it has always lacked a feature to manage and clean up conversation history. For users who prefer a tidy interface and don't want to see a long list of chats in their "Recent" section, this can be frustrating. Especially since the upgrade to *Claude 3.5 Sonnet*, I've been using it more frequently than OpenAI's GPT-4 or GPT-4o.

As someone who favors a clean interface and an empty chat list, I developed this Chrome extension to address this issue. Claude Chats Cleaner is designed to help users who share this preference, allowing them to easily clear all their conversation history.

## Implementation Logic

The core functionality of this extension is implemented through the following steps:

1. **Obtain Organization ID**:
   - Listen for network requests to `claude.ai/api/bootstrap`.
   - Extract the user's organization ID from the response.

2. **Clean Conversations**:
   - When the user clicks the "Clean Conversations" button in the extension:
     a. Send a request to Claude AI's API to get a list of all conversations.
     b. Iterate through the conversation list, sending a delete request for each conversation.
     c. Keep a count of successfully deleted conversations.

3. **Notify User**:
   - After cleaning is complete, inform the user of the number of deleted conversations via a browser notification.

## Installation and Usage

1. Install from Chrome or Edge extension store:
   - For Chrome: [Chrome Web Store Link](https://chromewebstore.google.com/detail/chats-cleaner/oinbkbjbbobaollnbbfigafeoldcemci)
   - For Edge: [Microsoft Edge Add-ons Link]
   
2. Once installed, you'll see the extension icon in your browser toolbar.
3. On the Claude AI webpage, click the extension icon, then click the "Clean Conversations" button to clear all chats.

Optional (not recommended for most users):
If you want to use the extension in developer mode:
1. Download the ZIP file of this repository and extract it.
2. Open your browser and navigate to the extensions management page (chrome://extensions/ for Chrome, edge://extensions/ for Edge).
3. Enable "Developer mode" in the top right corner.
4. Click "Load unpacked" and select the extracted folder.

## Caution

- Using this extension will delete all your Claude AI conversation history. Use with care.
- It's recommended to backup any important conversation content before use.

## Contributing

Feel free to open issues or submit pull requests to improve this project.

## License

[MIT License](LICENSE)
