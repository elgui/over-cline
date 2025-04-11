# Getting Started with Cline: Installation and Voice Interaction

This guide covers installing the Cline VSCode extension and setting up its experimental voice interaction features.

## Installation

1.  **Open VSCode:** Launch your Visual Studio Code editor.
2.  **Go to Extensions:** Navigate to the Extensions view by clicking the Extensions icon in the Activity Bar on the side of the window or by pressing `Ctrl+Shift+X` (`Cmd+Shift+X` on macOS).
3.  **Search for Cline:** In the search bar, type "Cline".
4.  **Install:** Find the extension published by "Saoud Rizwan" (or "Cline Bot Inc.") and click the "Install" button.
    *   Alternatively, you can install it directly from the [VSCode Marketplace](https://marketplace.visualstudio.com/items?itemName=saoudrizwan.claude-dev).
5.  **Reload (if prompted):** VSCode might ask you to reload the window to activate the extension.

Once installed, you should see the Cline icon in your Activity Bar. Click it to open the Cline chat panel.

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
