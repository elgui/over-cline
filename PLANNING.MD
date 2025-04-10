# Cline Extension Modification Plan: Deepgram Integration for TTS/STT

## 1. Project Goal

Modify the Cline VSCode extension to integrate with Deepgram for:
1.  **Text-to-Speech (TTS):** Intercept specific chat messages (based on defined criteria) and use Deepgram to read them aloud.
2.  **Speech-to-Text (STT):** Allow an external source (responsible for audio capture) to send transcribed text (via Deepgram STT) to Cline, injecting it as user input.

## 2. Relevant Architecture

The core components involved in the chat interface and communication are:

*   **`src/core/webview/index.ts` (WebviewProvider):** Manages the webview lifecycle (creation, disposal, visibility) and acts as the primary message broker between the extension host and the webview. It uses `webview.postMessage()` to send data *to* the webview and `webview.onDidReceiveMessage()` to receive data *from* the webview.
*   **`src/core/controller/index.ts` (Controller):** The central orchestrator. It manages the overall extension state, handles messages received *from* the webview (`handleWebviewMessage`), initiates and manages `Task` instances for each chat session, and sends state updates and commands *to* the webview (`postMessageToWebview`, `postStateToWebview`).
*   **`src/core/task/index.ts` (Task):** Represents a single chat session/task. It holds the actual conversation history (`clineMessages`), interacts with the AI API, executes tools, and manages checkpoints. The `Controller` accesses the `clineMessages` from the active `Task` instance.
*   **`webview-ui/src/context/ExtensionStateContext.tsx`:** A React Context provider within the webview UI. It listens for messages *from* the extension host (`window.addEventListener('message')`), updates its local React state based on received messages (especially the `state` message containing `clineMessages`), and provides this state to UI components (like the chat display and input field) via the `useExtensionState` hook. Components use `vscode.postMessage()` to send data back to the `Controller`.

## 3. Proposed Approach

### 3.1 Chat Message Interception & Text-to-Speech (TTS)

1.  **Hook Point:** Use the existing `onBeforeSay` mechanism implemented in `Task.say` (`src/core/task/index.ts`).
2.  **Callback Registration:** The `Controller` registers its `processInterceptedMessage` method with the `InterceptionService`, which in turn provides the callback to the `Task`.
3.  **Processing Logic:** The `Controller.processInterceptedMessage` method will:
    *   Analyze the intercepted message (`type`, `text`, `partial`, etc.) based on defined criteria (e.g., message type, content keywords).
    *   If criteria are met for TTS, call a new `DeepgramService` to perform the text-to-speech conversion using the Deepgram SDK.
    *   Decide whether to allow the original message to proceed to the webview (return `true`), suppress it (return `false`), or modify it (return `{...}`). For TTS, likely return `true` to still display the message visually.

### 3.2 Speech-to-Text (STT) & Programmatic Input Injection

1.  **Trigger:** An external source (responsible for audio capture and sending audio data to Deepgram) will receive transcribed text from Deepgram STT.
2.  **API Exposure:** Expose a method in the extension's public API (e.g., `injectUserInput(text: string, images?: string[])` in `src/exports/index.ts`).
3.  **API Implementation:** This exported API method will call the existing `Controller.handleProgrammaticUserInput(text, images)`.
4.  **Injection Logic:** The `Controller.handleProgrammaticUserInput` method (already implemented) handles injecting the text into the active `Task` by either responding to an `ask` or simulating a new message submission.
5.  **(Optional) Visual Feedback:** Consider adding the optional `invoke: 'setInputText'` mechanism (Subtask 2.4) if desired, so the transcribed text appears visually in the input field before being sent.

### 3.3 Deepgram Service

1.  **Create Service:** Implement a new `DeepgramService` class (e.g., in `src/services/deepgram/index.ts`).
2.  **Responsibilities:** This service will:
    *   Manage the Deepgram API key (likely retrieved from VSCode secrets storage via the `Controller`).
    *   Encapsulate interactions with the Deepgram Node.js SDK.
    *   Provide methods for TTS (e.g., `speak(text: string)`) and potentially STT setup/handling if needed directly by the extension (though STT seems primarily external based on the trigger).
3.  **Integration:** The `Controller` will instantiate and use the `DeepgramService`.

## 4. Key Files to Modify

*   `src/core/task/index.ts`: (Already modified for `onBeforeSay`).
*   `src/core/controller/index.ts`: To implement `processInterceptedMessage` logic, instantiate `DeepgramService`, and potentially manage Deepgram API keys. `handleProgrammaticUserInput` is already implemented.
*   `src/services/interception/index.ts`: (Already modified to use a processor callback).
*   `src/services/deepgram/index.ts`: **(New File)** To house the `DeepgramService` class and SDK interactions.
*   `src/exports/index.ts`: To add `injectUserInput` to the exported API.
*   `src/exports/cline.d.ts`: To add `injectUserInput` to the `ClineAPI` interface.
*   `src/extension.ts`: To potentially manage the lifecycle of `DeepgramService` if needed, and provide the `Controller` instance to `createClineAPI`.
*   `package.json`: To add the `@deepgram/sdk` dependency.
*   **(Optional) `src/shared/ExtensionMessage.ts`:** To define `invoke: 'setInputText'` if visual feedback is implemented.
*   **(Optional) `webview-ui/src/context/ExtensionStateContext.tsx` or input component:** To handle `invoke: 'setInputText'` if visual feedback is implemented.

## 5. Considerations

*   **Deepgram API Key:** Securely store and manage the Deepgram API key (using VSCode secrets). Configuration setting added.
*   **TTS Audio Output:** Audio playback implemented via Web Audio API in the webview, triggered by a `playAudio` message containing a data URI.
*   **STT Audio Input:** The external source triggering the injection is responsible for capturing audio and performing the Deepgram STT request. The extension receives the final text via the `injectUserInput` API endpoint.
*   **Error Handling:** Implement robust error handling for Deepgram API calls (invalid key, network issues, transcription/speech errors).
*   **TTS Criteria:** Define clear criteria within `processInterceptedMessage` for which messages should trigger TTS.
*   **Concurrency:**
    *   TTS: What happens if multiple messages trigger TTS simultaneously? Queueing might be needed.
    *   Injection: The current `handleProgrammaticUserInput` handles basic task states.
*   **Dependencies:** Added `@deepgram/sdk` to `package.json`.
*   **BLOCKER:** The correct way to instantiate `DeepgramClient` in `src/services/deepgram/index.ts` needs to be determined from SDK documentation to resolve TypeScript errors. The current instantiation is commented out.
