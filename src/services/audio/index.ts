import * as vscode from "vscode"
// eslint-disable-next-line @typescript-eslint/no-var-requires
const naudio = require("naudiodon")

// Basic type definition for naudiodon device info (add more properties as needed)
interface NaudioDevice {
	id: number
	name: string
	maxInputChannels: number
	maxOutputChannels: number
	sampleRates: number[]
	isDefaultInput?: boolean // Optional, might not always be present
	isDefaultOutput?: boolean // Optional
}

// Basic type definition for AudioIO instance (add more methods/properties as needed)
interface NaudioAudioIO extends NodeJS.EventEmitter {
	start(): void
	quit(callback?: () => void): void
	// Add other methods like pause, abort if needed
}

/**
 * Service for handling audio input and output using naudiodon.
 */
export class AudioService {
	private outputChannel: vscode.OutputChannel
	private isRecording = false
	private audioInStream: NaudioAudioIO | null = null

	constructor(outputChannel: vscode.OutputChannel) {
		this.outputChannel = outputChannel
		this.log("AudioService initialized.")
		this.logAvailableDevices()
	}

	private log(message: string) {
		this.outputChannel.appendLine(`[AudioService] ${message}`)
		console.log(`[AudioService] ${message}`)
	}

	/**
	 * Logs the available audio devices to the output channel.
	 */
	logAvailableDevices() {
		try {
			const devices: NaudioDevice[] = naudio.getDevices()
			this.log("Available Audio Devices:")
			devices.forEach((device: NaudioDevice) => {
				this.log(
					`  - ID: ${device.id}, Name: ${device.name}, MaxInputChannels: ${device.maxInputChannels}, MaxOutputChannels: ${device.maxOutputChannels}, SampleRates: [${device.sampleRates.join(", ")}]`,
				)
			})
		} catch (error) {
			this.log(`Error getting audio devices: ${error}`)
			vscode.window.showErrorMessage(`Error getting audio devices: ${error}`)
		}
	}

	/**
	 * Starts recording audio from the default input device.
	 * TODO: Allow selecting a specific device.
	 * TODO: Handle audio data (stream/buffer/emit).
	 */
	startRecording() {
		if (this.isRecording) {
			this.log("Already recording.")
			return
		}

		this.log("Starting recording...")
		try {
			// For now, use default device settings. These might need configuration.
			// Find the default input device or the first one with input channels
			const devices: NaudioDevice[] = naudio.getDevices()
			const defaultInputDevice = devices.find((d: NaudioDevice) => d.maxInputChannels > 0 && d.isDefaultInput) // Heuristic for default input
			const inputDevice = defaultInputDevice || devices.find((d: NaudioDevice) => d.maxInputChannels > 0)

			if (!inputDevice) {
				throw new Error("No suitable input device found.")
			}

			this.log(`Using input device: ID ${inputDevice.id}, Name: ${inputDevice.name}`)

			// Configure Audio Input Stream (adjust parameters as needed)
			this.audioInStream = naudio.AudioIO({
				inOptions: {
					deviceId: inputDevice.id, // Use the selected device ID
					channelCount: 1, // Mono audio
					sampleFormat: naudio.SampleFormat16Bit, // 16-bit PCM
					sampleRate: 16000, // 16kHz sample rate (common for STT)
					closeOnError: true, // Close the stream on error
				},
			})

			// Ensure stream is valid before attaching listeners
			if (!this.audioInStream) {
				throw new Error("Audio stream initialization failed unexpectedly.")
			}

			// Handle incoming audio data
			this.audioInStream.on("data", (chunk: Buffer) => {
				// TODO: Process the audio chunk (e.g., send to STT service)
				// For now, just log that we received data
				// console.log(`Received audio chunk of size: ${chunk.length}`);
			})

			this.audioInStream.on("error", (err: Error) => {
				this.log(`Audio Input Error: ${err.message}`)
				this.stopRecording() // Stop recording on error
				vscode.window.showErrorMessage(`Audio Input Error: ${err.message}`)
			})

			this.audioInStream.on("close", () => {
				this.log("Audio input stream closed.")
				this.isRecording = false // Ensure state is updated if closed unexpectedly
			})

			// Start the stream
			this.audioInStream.start()
			this.isRecording = true
			this.log("Recording started.")
		} catch (error) {
			this.log(`Error starting recording: ${error}`)
			vscode.window.showErrorMessage(`Error starting recording: ${error}`)
			this.isRecording = false
			if (this.audioInStream) {
				try {
					this.audioInStream.quit()
				} catch (quitError) {
					this.log(`Error quitting audio stream after start failure: ${quitError}`)
				}
				this.audioInStream = null
			}
		}
	}

	/**
	 * Stops the current audio recording.
	 */
	stopRecording() {
		if (!this.isRecording || !this.audioInStream) {
			this.log("Not recording or stream not initialized.")
			return
		}

		this.log("Stopping recording...")
		try {
			this.audioInStream.quit(() => {
				this.log("Audio stream quit successfully.")
			})
		} catch (error) {
			this.log(`Error stopping recording: ${error}`)
			// Attempt to force close might be needed depending on library behavior
		} finally {
			this.audioInStream = null
			this.isRecording = false
			this.log("Recording stopped.")
		}
	}

	/**
	 * Checks if recording is currently active.
	 */
	getIsRecording(): boolean {
		return this.isRecording
	}

	/**
	 * Dispose resources if needed.
	 */
	dispose() {
		this.log("Disposing AudioService.")
		if (this.isRecording) {
			this.stopRecording()
		}
	}
}
