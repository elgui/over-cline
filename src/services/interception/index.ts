import type { BeforeSayCallback } from "../../core/task"
import type { ClineSay } from "../../shared/ExtensionMessage"

// Define the signature for the function that will process intercepted messages
type MessageProcessor = (
	type: ClineSay,
	text?: string,
	images?: string[],
	partial?: boolean,
) => Promise<boolean | { text?: string; images?: string[] }>

/**
 * Service responsible for handling chat message interception logic.
 */
export class InterceptionService {
	private messageProcessor?: MessageProcessor

	/**
	 * The callback function to be registered with the Task instance.
	 * This method delegates the processing logic to the messageProcessor.
	 *
	 * @param type - The type of the message ('text', 'tool', 'error', etc.).
	 * @param text - The text content of the message.
	 * @param images - Optional array of image data URIs.
	 * @param partial - Boolean indicating if the message is partial.
	 * @returns boolean | { text: string; images?: string[] } | undefined
	 *          - false: Suppress the message.
	 *          - { text, images }: Modify the message content.
	 *          - true: Allow the message to proceed unmodified.
	 */
	public onBeforeSayCallback: BeforeSayCallback = async (type, text, images, partial) => {
		if (this.messageProcessor) {
			try {
				// Delegate processing to the provided callback
				return await this.messageProcessor(type, text, images, partial)
			} catch (error) {
				console.error("[InterceptionService] Error executing messageProcessor:", error)
				// Fallback to default behavior on processor error
				return true
			}
		}

		// Default behavior: Allow all messages to proceed unmodified if no processor is set
		console.log("[InterceptionService] No messageProcessor set, allowing message:", {
			type,
			text,
			partial,
			imageCount: images?.length,
		})
		return true
	}

	constructor(messageProcessor?: MessageProcessor) {
		this.messageProcessor = messageProcessor
		console.log(`InterceptionService initialized ${this.messageProcessor ? "with" : "without"} a message processor.`)
	}

	// Add other methods related to interception if necessary
}
