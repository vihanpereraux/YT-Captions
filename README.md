# YT Captions - YouTube Captions & Layout Customizer

A tiny Firefox extension designed for people ( including myself : ) ) with dry eyes and Anisometropia. It enhances your YouTube viewing experience by providing comprehensive customization options for captions, UI elements, and video player features—helping reduce eye strain and improve accessibility.

**Website**: [https://yt-cc.vercel.app/](https://yt-cc.vercel.app/)

## Features

### Home Screen Customizations
- **Left Panel Control**: Adjust the visibility of the navigation sidebar.
- **Top Bar Control**: Customize the opacity of the YouTube header.
- **Filters Panel**: Modify the visibility of the filters section.
- **Thumbnail Control**: Adjust the opacity of video thumbnails.
- **Layout Management**: Fine-tune the overall content grid visibility.

### Video Player Customizations

#### Element Controls
- **Button Visibility**: Toggle visibility of:
  - Share button.
  - Download button.
  - Clip button.
  - Save button.
  - Channel details.

#### Section Management
- **Toggle Visibility** of:
  - Channel metadata section.
  - Video description.
  - Comments section.
  - Similar videos section.

#### Caption Customization
- **Size Control**: Adjust caption size from 20px to 50px.
- **Color Selection**: Choose custom caption colors.
- **Background**: Transparent caption background for better visibility.

#### Video Enhancement
- **Overlay Control**: Add a black overlay with adjustable opacity.
- **Video Effects**: Toggle black & white filter for different viewing experiences.

## Installation (Option 01) - As a temporary plugin 

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/YT-Captions.git
   ```
2. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`.
3. Click on **Load Temporary Add-on**.
4. Select the `manifest.json` file from the project folder.

## Installation (Option 02) - As a permanent plugin 

1. Visit the releases section and get the latest .zip file of the latest version.
2. Before installing unsigned extensions, you may need to disable Firefox's signature requirement:
  - In the address bar, enter `about:config` and press Enter.
  - Accept any warning prompts.
  - Search for `xpinstall.signatures.required`.
  - Double-click the setting to set it to `false`.
3. Open extensions menu and click 'Manage extensions'.
4. Click ⚙️ icon and the click the **Install Add-on From File...** button and select the downloaded `.zip` file.


## Usage

1. Click the extension icon in the Firefox toolbar to open the settings panel.
2. Customize your YouTube experience:
   - Adjust home screen element visibility.
   - Configure video player controls.
   - Customize caption appearance.
   - Set overlay preferences.
   - Toggle video effects (experimental).
3. All changes are applied instantly to the active YouTube tab.
4. Settings are automatically saved and persist between sessions.

## Noob Technical Details : )

### File Structure
- `popup.html`: Extension UI and settings panel.
- `popup.js`: Settings management and communication handler.
- `content.js`: YouTube page modifications and feature implementation.
- `background.js`: Browser event handling and extension lifecycle management.
- `manifest.json`: Extension configuration and permissions.
- `icons/`: Extension icons in various sizes.

### Permissions
The extension requires the following permissions:
- `storage`: For saving user preferences.
- `activeTab`: For modifying YouTube page content.
- `tabs`: For handling tab updates and navigation.
- `scripting`: For injecting required scripts.
- `webNavigation`: For handling YouTube page navigation.

## Development

### Setup
1. Fork and clone the repository.
2. Make your changes to the relevant files.
3. Test the extension:
   - Navigate to `about:debugging#/runtime/this-firefox`.
   - Click "Load Temporary Add-on".
   - Select `manifest.json`.
   - Verify your changes on YouTube.

## License
This project is not licensed at all. Just use at your own discretion and do whatever you like : )

## Disclaimer

This extension is not affiliated with or endorsed by YouTube or Google. Use at your own discretion.
