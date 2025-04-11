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
