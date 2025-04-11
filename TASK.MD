# Cline Extension Modification Tasks: Deepgram TTS/STT Integration

## Task 1: Implement Chat Message Interception Mechanism (Complete)

*   [X] **Subtask 1.1:** Define `BeforeSayCallback` type in `src/core/task/index.ts`.
*   [X] **Subtask 1.2:** Add `onBeforeSay?: BeforeSayCallback` property to `Task` class in `src/core/task/index.ts`.
*   [X] **Subtask 1.3:** Modify `Task.say` method in `src/core/task/index.ts` to invoke `onBeforeSay` hook before sending messages and handle its return value (suppress or modify message).
*   [X] **Subtask 1.4:** Implement Callback Registration: Created `InterceptionService`, instantiated in `Controller`, and registered `onBeforeSayCallback` with `Task` instance.
*   [X] **Subtask 1.5:** Implement Interception Logic Hook: Added `processInterceptedMessage` to `Controller` to handle intercepted messages (currently logs and stores text). Added `getInterceptedMessages` and `clearInterceptedMessages`.

## Task 2: Implement Programmatic Input Injection API (Complete)

*   [X] **Subtask 2.1:** Create `Controller.handleProgrammaticUserInput(text: string, images?: string[])` method in `src/core/controller/index.ts`. (Method already added during Task 1 fixes).
*   [X] **Subtask 2.2:** Implement Task Interaction Logic within `handleProgrammaticUserInput`:
    *   Checks if `this.task` exists (starts new task if not).
    *   Checks `this.task.isAwaitingAskResponse`.
    *   If waiting for input, calls `this.task.handleWebviewAskResponse('messageResponse', text, images)`.
    *   If idle, simulates message submission via `invoke: 'sendMessage'`.
*   [X] **Subtask 2.3:** Expose Injection via Extension API:
    *   Added `injectUserInput` method to `ClineAPI` interface (`src/exports/cline.d.ts`).
    *   Implemented `injectUserInput` in `src/exports/index.ts` to call `Controller.handleProgrammaticUserInput`.
*   [X] **Subtask 2.4 (Optional):** Implement Visual Feedback for Injection: Skipped as per user request.

## Task 3: Implement Deepgram Integration (Partially Complete)

*   [X] **Subtask 3.1:** Add `@deepgram/sdk` dependency to `package.json` and run `npm install` in root and `webview-ui`.
*   [X] **Subtask 3.2:** Create `DeepgramService` (`src/services/deepgram/index.ts`) with methods for initialization and `speak`.
*   [X] **Subtask 3.2.1:** Resolve `DeepgramClient` instantiation error in `DeepgramService.initialize`. Corrected instantiation to use `new DeepgramClient({ apiKey: ... })`.
*   [X] **Subtask 3.3:** Integrate `DeepgramService` into `Controller`.
*   [X] **Subtask 3.4:** Implement Deepgram API key configuration (`package.json`) and retrieval/update handling in `Controller` using VSCode secrets.
*   [X] **Subtask 3.5:** Implement TTS Logic:
    *   Defined basic criteria (non-partial assistant text) in `Controller.processInterceptedMessage`.
    *   Added call to `DeepgramService.speak(text)`.
    *   Implemented audio playback via Web Audio API in `ExtensionStateContext.tsx` triggered by `playAudio` message. (Playback depends on Subtask 3.2.1 being resolved).
*   [X] **Subtask 3.6:** Define STT Workflow: Confirmed STT is external; transcribed text will use the `injectUserInput` API endpoint (Task 2).

## Task 4: Documentation & Testing

*   [X] **Subtask 4.1:** Update `PLANNING.MD` to reflect Deepgram integration.
*   [ ] **Subtask 4.2:** Add basic tests (if testing infrastructure exists) for the new `Controller` methods, API endpoint, and `DeepgramService`.
*   [ ] **Subtask 4.3:** Manually test TTS triggering and audio playback.
*   [ ] **Subtask 4.4:** Manually test input injection via the exposed API endpoint (simulating the external STT source).

## Task 5: Implement Cross-Platform Audio I/O for Voice Interaction

*Goal: Enable capturing microphone input and playing TTS audio reliably within the VS Code extension environment.*

*   [ ] **Subtask 5.1:** Research & Select Audio Handling Strategy:
    *   Evaluate the current Web Audio API approach in `webview-ui/src/context/ExtensionStateContext.tsx` for TTS playback robustness.
    *   Investigate Node.js libraries (e.g., `node-portaudio`, `naudiodon`) or system commands (SoX, ffmpeg, platform-specific tools) for microphone capture directly from the extension host (`src`).
    *   Decide on the best approach for both playback and capture, considering cross-platform compatibility (Windows, macOS, Linux) and ease of integration.
*   [ ] **Subtask 5.2:** Implement Microphone Input Capture:
    *   Based on the chosen strategy (5.1), implement the logic to capture audio from the user's default microphone. This might involve adding a new service in `src/services/`.
    *   Define how the captured audio data will be handled (e.g., streamed, buffered). *Note: The actual sending to Deepgram STT is assumed to be external, but the extension needs to capture the audio first.*
*   [ ] **Subtask 5.3:** Implement UI Controls for Voice Input:
    *   Add UI elements (e.g., a microphone button) to the webview (`webview-ui`) to allow users to start and stop audio recording.
    *   Connect these UI controls to trigger the microphone capture mechanism (Subtask 5.2).
    *   Determine how the *result* of the external STT (the transcribed text) will be fed back into Cline (likely using the existing `injectUserInput` API from Task 2).
*   [ ] **Subtask 5.4:** Implement/Refine Audio Playback:
    *   If the Web Audio API approach is deemed sufficient, ensure it's robust and handles potential errors gracefully.
    *   If a native Node.js approach is chosen (from 5.1), implement the playback logic in the extension host, likely involving sending audio data/events to the webview or playing directly.
*   [ ] **Subtask 5.5:** Refine TTS Triggering Logic:
    *   Review and potentially adjust the criteria in `Controller.processInterceptedMessage` (`src/core/controller/index.ts`) for when TTS should be triggered. Consider adding settings to control this behavior (e.g., only speak assistant messages, optionally speak tool results).
*   [ ] **Subtask 5.6:** Add Configuration Options:
    *   Introduce settings in `package.json` (contributes.configuration) and handle them in the `Controller` for:
        *   Enabling/disabling voice features (TTS & STT initiation).
        *   (Optional) Selecting input/output audio devices if the chosen library supports it.
*   [ ] **Subtask 5.7:** Documentation & Testing:
    *   Update `README.md` and potentially `PLANNING.MD` with details about voice interaction setup and usage.
    *   Add tests for any new services or significant logic changes.
    *   Perform manual testing across different platforms (if possible) for microphone capture and TTS playback.

## Task 6: Rename Extension Identifiers for Cohabitation (Complete)

*   [X] **Subtask 6.1:** Update `package.json` identifiers (`name`, views, commands, configuration) from `claude-dev`/`cline.` to `over-cline`/`over-cline.`.
*   [X] **Subtask 6.2:** Update corresponding identifiers in TypeScript code (`src/**/*.ts`) and React code (`webview-ui/**/*.tsx`).
*   [X] **Subtask 6.3:** Update Output Channel name and Webview Panel title in `src/extension.ts`.
*   [X] **Subtask 6.4:** Update other relevant names like Git commit user and comments.

## Discovered During Work

*   **TODO:** Perform a manual search-and-replace across the codebase for remaining visual references to "Cline" (e.g., UI text, log messages referring to the extension name) and change them to "Over-Cline" as needed. Focus on user-facing elements.
