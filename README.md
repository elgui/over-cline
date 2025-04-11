<div align="center"><sub>
English | <a href="https://github.com/elgui/over-cline/blob/main/locales/es/README.md" target="_blank">Español</a> | <a href="https://github.com/elgui/over-cline/blob/main/locales/de/README.md" target="_blank">Deutsch</a> | <a href="https://github.com/elgui/over-cline/blob/main/locales/ja/README.md" target="_blank">日本語</a> | <a href="https://github.com/elgui/over-cline/blob/main/locales/zh-cn/README.md" target="_blank">简体中文</a> | <a href="https://github.com/elgui/over-cline/blob/main/locales/zh-tw/README.md" target="_blank">繁體中文</a> | <a href="https://github.com/elgui/over-cline/blob/main/locales/ko/README.md" target="_blank">한국어</a>
</sub></div>

# Over-Cline – Fork of Cline
Meet Over-Cline, an AI assistant that can use your **CLI** a**N**d **E**ditor. This is a fork of the original [Cline](https://github.com/cline/cline) extension.



### Voice Interaction (Experimental)

Over-Cline now includes experimental support for voice interaction:

-   **Text-to-Speech (TTS):** Hear Over-Cline's responses spoken aloud.
    -   Requires a [Deepgram](https://deepgram.com/) API key. Set it in the extension settings (`cline.deepgram.apiKey`).
    -   Enable/disable TTS using the `cline.tts.enabled` setting (default: `true`).
-   **Voice Input Initiation:** A microphone button is available next to the chat input to start/stop audio capture.
    -   **Important:** This feature only *captures* audio using the `naudiodon` library. Actual Speech-to-Text (STT) processing must be handled by an external application or service. The transcribed text should then be sent back to Over-Cline using its programmatic input API.
    -   Enable/disable the microphone button using the `cline.voiceInput.enabled` setting (default: `false`).
    -   **Build Tools Requirement:** The `naudiodon` library requires native compilation. You might need build tools installed on your system (like Python, C++ compiler, make) for the extension to install and use this feature correctly. Consult the `naudiodon` documentation for platform-specific requirements if you encounter installation issues.

<img width="2000" height="0" src="https://github.com/user-attachments/assets/ee14e6f7-20b8-4391-9091-8e8e25561929"><br>



<details>
<summary>Local Development Instructions</summary>

1. Clone the repository _(Requires [git-lfs](https://git-lfs.com/))_:
    ```bash
    git clone https://github.com/elgui/over-cline.git
    ```
2. Open the project in VSCode:
    ```bash
    code over-cline # Or the directory name you cloned into
    ```
3. Install the necessary dependencies for the extension and webview-gui:
    ```bash
    npm run install:all
    ```
4. Launch by pressing `F5` (or `Run`->`Start Debugging`) to open a new VSCode window with the extension loaded. (You may need to install the [esbuild problem matchers extension](https://marketplace.visualstudio.com/items?itemName=connor4312.esbuild-problem-matchers) if you run into issues building the project.)

</details>

<details>
<summary>Creating a Pull Request</summary>

1. Before creating a PR, generate a changeset entry:
    ```bash
    npm run changeset
    ```
   This will prompt you for:
   - Type of change (major, minor, patch)
     - `major` → breaking changes (1.0.0 → 2.0.0)
     - `minor` → new features (1.0.0 → 1.1.0)
     - `patch` → bug fixes (1.0.0 → 1.0.1)
   - Description of your changes

2. Commit your changes and the generated `.changeset` file

3. Push your branch and create a PR on GitHub. Our CI will:
   - Run tests and checks
   - Changesetbot will create a comment showing the version impact
   - When merged to main, changesetbot will create a Version Packages PR
   - When the Version Packages PR is merged, a new release will be published

</details>


## License

[Apache 2.0 © 2025 elgui](./LICENSE)
