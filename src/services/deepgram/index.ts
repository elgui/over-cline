import { DeepgramClient, DeepgramClientOptions, SpeakSchema } from "@deepgram/sdk"
import * as vscode from "vscode"

/**
 * Service for interacting with the Deepgram API for TTS and potentially STT.
 */
export class DeepgramService {
	private deepgram: DeepgramClient | null = null
	private apiKey: string | null = null

	constructor(apiKey?: string) {
		if (apiKey) {
			this.initialize(apiKey)
		} else {
			console.warn("[DeepgramService] Initialized without API key.")
		}
	}

	/**
	 * Initializes the Deepgram client with the provided API key.
	 * @param apiKey The Deepgram API key.
	 */
	public initialize(apiKey: string): void {
		if (!apiKey) {
			console.error("[DeepgramService] Initialization failed: API key is missing.")
			this.deepgram = null
			this.apiKey = null
			return
		}
		this.apiKey = apiKey
		try {
			// Instantiate DeepgramClient using the options object
			const options: DeepgramClientOptions = { apiKey: this.apiKey }
			this.deepgram = new DeepgramClient(options)
			console.log("[DeepgramService] DeepgramClient instantiated successfully.")
		} catch (error) {
			console.error("[DeepgramService] Error during attempted DeepgramClient initialization:", error)
			vscode.window.showErrorMessage(
				`Failed to initialize Deepgram client: ${error instanceof Error ? error.message : String(error)}`,
			)
			this.deepgram = null
			this.apiKey = null // Ensure service is not marked as ready if init fails
		}
	}

	/**
	 * Checks if the service is ready to make API calls.
	 */
	public isReady(): boolean {
		// isReady now depends on successful client instantiation AND having an API key stored.
		return !!this.deepgram && !!this.apiKey
	}

	/**
	 * Performs Text-to-Speech using Deepgram's Aura API.
	 * @param text The text to synthesize into speech.
	 * @returns A Promise resolving to the audio data as a Buffer, or null on failure.
	 */
	public async speak(text: string): Promise<Buffer | null> {
		if (!this.isReady()) {
			console.error("[DeepgramService] Cannot perform TTS: Service not initialized or API key missing.")
			// Avoid showing error message here if it's just not configured yet.
			// vscode.window.showErrorMessage("Deepgram Service not ready. Please configure the API key.");
			return null
		}

		const speakOptions: SpeakSchema = { model: "aura-asteria-en" } // Example model

		try {
			console.log(`[DeepgramService] Requesting TTS for text: "${text.substring(0, 50)}..."`)
			// Correctly call the request method
			const speakResponse = await this.deepgram!.speak.request(
				{ text }, // Source
				speakOptions,
			)

			// Get the stream from the response
			const stream = await speakResponse.getStream()

			if (!stream) {
				console.error("[DeepgramService] Failed to get audio stream from Deepgram.")
				return null
			}

			// Read the stream into a buffer using standard reader
			const reader = stream.getReader()
			const chunks: Uint8Array[] = []
			let done = false
			while (!done) {
				const { value, done: readerDone } = await reader.read()
				if (value) {
					chunks.push(value)
				}
				done = readerDone
			}
			const buffer = Buffer.concat(chunks)

			if (!buffer || buffer.length === 0) {
				// Check if buffer is empty
				console.error("[DeepgramService] Failed to get audio buffer from Deepgram stream.")
				return null
			}

			console.log(`[DeepgramService] TTS buffer received (${buffer.length} bytes).`)
			return buffer
		} catch (error) {
			console.error("[DeepgramService] Deepgram TTS API error:", error)
			vscode.window.showErrorMessage(`Deepgram TTS Error: ${error instanceof Error ? error.message : String(error)}`)
			return null
		}
	}

	// Add methods for STT if needed later, although the current plan
	// assumes STT happens externally.
}
