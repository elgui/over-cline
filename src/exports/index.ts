import * as vscode from "vscode"
import { Controller } from "../core/controller"
import { ClineAPI } from "./cline"
import { getGlobalState } from "../core/storage/state"

export function createClineAPI(outputChannel: vscode.OutputChannel, sidebarController: Controller): ClineAPI {
	const api: ClineAPI = {
		setCustomInstructions: async (value: string) => {
			await sidebarController.updateCustomInstructions(value)
			outputChannel.appendLine("Custom instructions set")
		},

		getCustomInstructions: async () => {
			return (await getGlobalState(sidebarController.context, "customInstructions")) as string | undefined
		},

		startNewTask: async (task?: string, images?: string[]) => {
			outputChannel.appendLine("Starting new task")
			await sidebarController.clearTask()
			await sidebarController.postStateToWebview()
			await sidebarController.postMessageToWebview({
				type: "action",
				action: "chatButtonClicked",
			})
			await sidebarController.postMessageToWebview({
				type: "invoke",
				invoke: "sendMessage",
				text: task,
				images: images,
			})
			outputChannel.appendLine(
				`Task started with message: ${task ? `"${task}"` : "undefined"} and ${images?.length || 0} image(s)`,
			)
		},

		sendMessage: async (message?: string, images?: string[]) => {
			outputChannel.appendLine(
				`Sending message: ${message ? `"${message}"` : "undefined"} with ${images?.length || 0} image(s)`,
			)
			await sidebarController.postMessageToWebview({
				type: "invoke",
				invoke: "sendMessage",
				text: message,
				images: images,
			})
		},

		pressPrimaryButton: async () => {
			outputChannel.appendLine("Pressing primary button")
			await sidebarController.postMessageToWebview({
				type: "invoke",
				invoke: "primaryButtonClick",
			})
		},

		pressSecondaryButton: async () => {
			outputChannel.appendLine("Pressing secondary button")
			await sidebarController.postMessageToWebview({
				type: "invoke",
				invoke: "secondaryButtonClick",
			})
		},

		injectUserInput: async (text: string, images?: string[]) => {
			outputChannel.appendLine(
				`Injecting user input: ${text ? `"${text}"` : "undefined"} with ${images?.length || 0} image(s)`,
			)
			// Call the controller method to handle the injection
			await sidebarController.handleProgrammaticUserInput(text, images)
		},
	}

	return api
}
