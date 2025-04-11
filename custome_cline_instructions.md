# Over-Cline Extension - AI Coding Assistant Global Instructions

## Mandatory Preparation & Context Awareness

### Project Initialization
ALWAYS begin every new conversation by:
1. Reading PLANNING.md - Contains project architecture, goals & constraints (if available).
2. Reading README.md - Contains practical setup info.
3. Checking TASK.MD - Contains current tasks to be worked on.
4. Reviewing `.clinerules` - Contains detailed architecture and development guidelines for this extension.

**Why?** This ensures you understand context before making suggestions that might not fit with project architecture or standards.

### Project Mental Model
The Over-Cline extension uses:
- **VSCode Extension Architecture:** A core extension backend (`src/`) and a React-based webview frontend (`webview-ui/`).
- **Core Components:**
    - `Extension Entry` (`src/extension.ts`): Main activation point.
    - `WebviewProvider` (`src/core/webview/index.ts`): Manages webview lifecycle and communication.
    - `Controller` (`src/core/controller/index.ts`): Handles state management, webview messages, and task coordination.
    - `Task` (`src/core/task/index.ts`): Executes API requests and tool operations.
- **Webview UI:**
    - `React App` (`webview-ui/src/App.tsx`): Main frontend component.
    - `ExtensionStateContext` (`webview-ui/src/context/ExtensionStateContext.tsx`): Manages webview state.
- **Communication:** Uses VSCode's `postMessage` API for bidirectional communication between the Core Extension (via `WebviewProvider`) and the Webview UI (via `ExtensionStateContext`).
- **State Management:** Core state managed by `Controller`, Webview state by `ExtensionStateContext`. Persistence uses VSCode Global State, Workspace State, and Secrets Storage.
- **API Integration:** Modular system supporting multiple AI providers (`src/api/providers/`).
- **MCP Integration:** Connects to external MCP servers via `McpHub` (`src/services/mcp/McpHub.ts`).
- **Language:** Primarily TypeScript for both core and webview.

## Workflow & Task Management

### Task Handling
Always check TASK.MD before starting. Do not hallucinate tasks.

If asked to work on a new feature:
1. Check if task exists in TASK.MD.
2. If it doesn't exist, suggest adding it first.
3. When complete, mark it as done in TASK.MD.

**Important:**
- Add any discovered sub-tasks to a "Discovered During Work" section in TASK.MD.

### Conversation Management
Start fresh conversations often - don't rely on long history.

**Why?** Long conversation threads:
- Degrade response quality.
- Can lead to context confusion.
- Are harder for the human developer to track.

### Task Focus
Focus on one task per message - avoid multi-part requests.

**Example:**
Instead of: "Update the Controller state and also fix the webview component and then add documentation"

Suggest breaking this into:
1. "First, let's update the Controller state logic"
2. "Now, let's fix the related webview component"
3. "Finally, let's update the documentation"

## Code Structure & Modularity

### File Size Limit
**ENFORCE 500-LINE LIMIT FOR ALL FILES**

If a file approaches this limit, proactively suggest refactoring by:
- Extracting components/functions/classes into separate files within appropriate modules (`src/core/`, `src/services/`, `src/integrations/`, `webview-ui/src/components/`, `webview-ui/src/hooks/`, etc.).
- Creating utility modules (`src/utils/`, `webview-ui/src/utils/`) for repeated logic.
- Splitting classes/modules by responsibility (e.g., separating state logic from UI logic).

### Implementation Patterns
Before implementing a feature:
1. Locate similar implementations in the codebase (check `.clinerules` for key architectural components).
2. Analyze patterns, naming conventions, and structure (e.g., Controller -> Task flow, ExtensionStateContext usage).
3. Apply these patterns to new code for consistency.

### React Best Practices (Webview UI - `webview-ui/`)
- Use functional components with hooks (not classes).
- Create stateful logic with custom hooks in `webview-ui/src/hooks/`.
- Use `ExtensionStateContext` for shared state originating from the core extension. Use standard React Context for purely local UI state if needed.
- Follow single-responsibility principle for components.
- Use TypeScript interfaces/types for all props and state.
- Avoid `any` - use proper types or generics.

### Core Extension Best Practices (`src/`)
- Follow the established architecture: `WebviewProvider` -> `Controller` -> `Task`.
- Place new services in `src/services/`, integrations in `src/integrations/`, core logic in `src/core/`.
- Maintain clear separation of concerns between components.
- Use VSCode APIs correctly (e.g., for state, secrets, notifications).
- Ensure proper disposal of resources (add to `disposables` arrays).

### Extension/Webview Communication
- Use the established `postMessage` mechanism via `Controller` (`postMessageToWebview`) and `ExtensionStateContext` (`vscode.postMessage`).
- Define clear message types in `src/shared/ExtensionMessage.ts` and `src/shared/WebviewMessage.ts`.
- Ensure messages are JSON serializable.

## Testing Requirements

### Core Extension Testing (`src/test/`)
- Use Mocha/Chai/Sinon (as configured in `package.json` and `.mocharc.json`).
- Create tests in `src/test/suite/` or relevant subdirectories.
- Mock external dependencies (VSCode APIs, API providers, file system where appropriate).
- Aim for unit and integration tests covering key logic.
- Create at least 3 tests per feature:
  1. Happy path - Normal expected use.
  2. Edge case - Boundary conditions.
  3. Failure case - Error handling.

### Frontend Testing (Webview UI - `webview-ui/`)
- Use Jest/RTL (check `webview-ui/package.json` for specifics).
- Mock the `vscode` API (`acquireVsCodeApi`) for testing components in isolation.
- Test components and hooks for both success and error states.

### Test Maintenance
When changing code behavior:
1. Identify affected tests in `src/test/` or `webview-ui/`.
2. Update test expectations to match new behavior.
3. Add new tests for any new functionality.

## Style & Coding Conventions

### TypeScript (Core & Webview)
- Follow ESLint and Prettier rules defined in the project (`.eslintrc.json`, `.prettierrc.json`). Run `npm run lint` and `npm run format`.
- Define interfaces/types for props, state, function signatures, and complex objects.
- Avoid `any` type - use proper types or generics (`unknown` if necessary).
- Use JSDoc/TSDoc comments for functions, classes, methods, and complex types.
- Use meaningful variable/parameter names.
- Add `// Reason:` comments for complex or non-obvious logic.

## Documentation Requirements

### Feature Documentation
When adding new features:
- Update `README.md` for setup or usage changes.
- Add JSDoc/TSDoc comments to code.
- Update `PLANNING.MD` if architectural changes are made.
- Document props/params/types in code.

### Architectural Consistency
If the implementation significantly differs from the plan in `PLANNING.MD` or `.clinerules`, ensure relevant documentation is updated.

### Complex Logic Explanation
For non-obvious algorithms or patterns:
- Add explanatory comments using `// Reason:`.
- Document why a particular approach was chosen.
- Reference patterns or design principles being followed (e.g., from `.clinerules`).

## AI Behavior Rules

### Context Awareness
Never assume missing context - ask questions when uncertain about:
- Project-specific patterns (refer to `.clinerules`).
- Implementation details within `src/` or `webview-ui/`.
- Requirements not specified in `TASK.MD`.

### Systematic Approach
Before providing code or solutions:
1. Identify potentially relevant files (e.g., `Controller`, `Task`, specific services, webview components).
2. If necessary, request to read these files using their full paths.
3. Think step-by-step about integration with existing code (e.g., how a change in `Controller` affects `ExtensionStateContext`).
4. Explain thought process briefly before presenting code.

### Strict Implementation Guidelines
- Never hallucinate code features, libraries, or APIs not present in `package.json` or `webview-ui/package.json`.
- Only use documented libraries, APIs (VSCode API, React, etc.), and patterns established in `.clinerules`.
- Verify paths and imports before suggesting (`src/` vs `webview-ui/`).
- Do not delete existing code without explicit instruction.

### Pedagogical Approach
- Explain the approach in plain language.
- Compare with alternatives where appropriate.
- Reference relevant documentation (`.clinerules`, VSCode API docs, React docs).

## Security Considerations

### Input Validation
Apply proper validation for:
- Data received via `postMessage` in both Core Extension and Webview UI.
- User inputs in webview forms/settings.
- Data from external APIs (AI providers, MCP servers).
- Tool inputs/outputs.

### Sensitive Data Handling
- Never log sensitive information (API keys, user data).
- API keys MUST be stored using VSCode's Secrets Storage (`src/core/storage/state.ts`). Do not suggest storing them elsewhere.
- Sanitize data displayed in the webview if it originates from external sources.

### Webview Security
- Maintain strict Content Security Policy (CSP) in `src/core/webview/index.ts`.
- Validate the origin of messages received in the webview.
- Avoid executing arbitrary strings as code.

### Environment Management
- Do not suggest code that embeds secrets.
- Always retrieve secrets via the `Controller` and `SecretsStorage`.
- Let the human developer manage credentials through VSCode settings or secure storage prompts.
