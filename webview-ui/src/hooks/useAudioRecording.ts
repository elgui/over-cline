import { useState, useCallback } from "react"
import { vscode } from "@/utils/vscode"

export const useAudioRecording = () => {
	const [isRecording, setIsRecording] = useState(false)
	// TODO: Add state for potential errors or feedback from the extension

	const startRecording = useCallback(() => {
		console.log("Requesting to start recording...")
		vscode.postMessage({ type: "startAudioRecording" })
		setIsRecording(true)
		// TODO: Handle potential failure feedback from extension
	}, [])

	const stopRecording = useCallback(() => {
		console.log("Requesting to stop recording...")
		vscode.postMessage({ type: "stopAudioRecording" })
		setIsRecording(false)
		// TODO: Handle potential failure feedback from extension
	}, [])

	// TODO: Add useEffect listener for messages from extension about recording state
	// e.g., 'recordingStarted', 'recordingStopped', 'recordingError'

	return {
		isRecording,
		startRecording,
		stopRecording,
	}
}
