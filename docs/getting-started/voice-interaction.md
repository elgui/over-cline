# Getting Started with Cline (Guillaume Berthet Fork): Installation and Voice Interaction

**Note:** This documentation refers to the fork of the original Cline extension maintained by Guillaume Berthet.

This guide covers installing this specific fork of the Cline VSCode extension and setting up its experimental voice interaction features.

## Installation (Fork Version)

This fork is typically installed by running it directly from the source code in a development environment.

**Prerequisites:**

*   [Git](https://git-scm.com/) installed.
*   [Node.js](https://nodejs.org/) (including npm) installed. Check the `.nvmrc` file or `package.json` engines field for the recommended version.
*   [git-lfs](https://git-lfs.com/) installed (required for cloning).

**Steps:**

1.  **Clone the Repository:** Open your terminal or command prompt and run:
    ```bash
    # Replace <repository-url> with the actual URL of Guillaume Berthet's fork
    git clone <repository-url> 
    cd <repository-directory> # Navigate into the cloned project folder
    ```
2.  **Install Dependencies:** Install the necessary packages for both the core extension and the webview UI:
    ```bash
    npm run install:all
    ```
    *   This command runs `npm install` in both the root directory and the `webview-ui` directory.
3.  **Open in VSCode:** Open the cloned project folder in VSCode:
    ```bash
    code .
    ```
4.  **Launch the Extension:** Press `F5` or go to `Run > Start Debugging` in the VSCode menu. This will compile the extension and launch a new VSCode window ("Extension Development Host") with this fork of Cline loaded and activated.

You can now use this fork of Cline within the "Extension Development Host" window. The Cline icon should appear in the Activity Bar.

## Voice Interaction (Experimental)

Cline offers experimental features for voice interaction, allowing you to hear responses and initiate input via microphone. Please note these features are experimental and may require additional setup.

### 1. Text-to-Speech (TTS) - Hearing Cline's Responses

This feature allows Cline's text responses to be spoken aloud.

**Requirements:**

*   A [Deepgram](https://deepgram.com/) API key.

**Setup:**

1.  **Get a Deepgram API Key:** Sign up or log in to Deepgram to obtain an API key.
2.  **Open VSCode Settings:** Go to `File > Preferences > Settings` (or `Code > Settings > Settings` on macOS), or use the shortcut `Ctrl+,` (`Cmd+,` on macOS).
3.  **Search for Cline Settings:** Type `cline.deepgram.apiKey` in the search bar.
4.  **Enter API Key:** Paste your Deepgram API key into the input field for "Cline > Deepgram: Api Key". This key is stored securely in VSCode's secrets storage.
5.  **Enable/Disable TTS (Optional):** Search for `cline.tts.enabled`. By default, TTS is enabled (`true`). You can uncheck the box to disable it if preferred.

With TTS enabled and the API key configured, Cline's responses should now be audible.

### 2. Voice Input Initiation - Speaking to Cline

This feature adds a microphone button to the chat input area, allowing you to capture audio.

**Important Considerations:**

*   **Audio Capture Only:** This feature *only captures* audio using the `naudiodon` library. It **does not** perform Speech-to-Text (STT) conversion itself.
*   **External STT Required:** You need an external application or service to process the captured audio, convert it to text, and then send that text back to Cline. This typically involves using Cline's programmatic API (details not covered in this basic guide).
*   **Build Tools:** The `naudiodon` library requires native compilation during installation. You might need build tools installed on your system (like Python, a C++ compiler, make, etc.). If the microphone button doesn't appear or you encounter errors, ensure you have the necessary build tools for your operating system installed and try reinstalling the extension. Refer to the `naudiodon` documentation for specific requirements.

**Setup:**

1.  **Open VSCode Settings:** Go to `File > Preferences > Settings` (or `Code > Settings > Settings` on macOS), or use the shortcut `Ctrl+,` (`Cmd+,` on macOS).
2.  **Search for Voice Input Setting:** Type `cline.voiceInput.enabled` in the search bar.
3.  **Enable Microphone Button:** Check the box for "Cline > Voice Input: Enabled". The default is `false` (disabled).

Once enabled, a microphone icon will appear next to the chat text area. Clicking it will start/stop audio capture. Remember, you still need an external system to process this audio into text and feed it back to Cline.

---

You have now installed Cline and configured its experimental voice features. Remember to consult the main [README.md](https://github.com/cline/cline/blob/main/README.md) and other documentation files for more advanced features and usage details.
