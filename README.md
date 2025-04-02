# YouTube Captions and UI Customizer

This Firefox extension allows users to customize YouTube's captions and UI elements, providing a more personalized viewing experience.

**Official Website**: [https://yt-cc.vercel.app/](https://yt-cc.vercel.app/)

## Features

- **Caption Customization**:
  - Change caption color.
  - Adjust caption size.

- **UI Visibility Toggles**:
  - Show or hide the comments section.
  - Show or hide the similar videos section.

- **Overlay Settings**:
  - Add a black overlay to the video player with adjustable opacity.

## Installation

1. Clone or download this repository to your local machine.
2. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`.
3. Click on **Load Temporary Add-on**.
4. Select the `manifest.json` file from the project folder.
5. The extension will now be added to Firefox.

## Usage

1. Click on the extension icon in the Firefox toolbar to open the popup.
2. Use the provided controls to:
   - Toggle the visibility of comments and similar videos.
   - Adjust caption size and color.
   - Modify the black overlay opacity.
3. Changes will be applied immediately to the active YouTube tab.

## File Structure

- **popup.html**: The UI for the extension's popup.
- **popup.js**: Handles communication between the popup and the content script.
- **content.js**: Applies the customizations to YouTube's UI.
- **background.js**: Background script for the extension.
- **manifest.json**: Defines the extension's metadata and permissions.

## Development

To make changes to the extension:

1. Edit the relevant files in the project directory.
2. Reload the extension in Firefox by navigating to `about:debugging#/runtime/this-firefox` and reloading the extension.

## License

This project is licensed under the MIT License. Feel free to use, modify, and distribute it.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.

## Disclaimer

This extension is not affiliated with or endorsed by YouTube. Use it at your own risk.
