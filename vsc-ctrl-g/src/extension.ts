import * as vscode from 'vscode';
import { decodeCmdValue, JumpType, validateCmdValue } from './cmd';
import { getLineCount, absMoveCursor } from './utils';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('vsc-ctrl-g.helloWorld', async () => {	
		const cmdValue = await vscode.window.showInputBox({ 
			prompt: `Type a line number between 1 and ${getLineCount() ?? "???"}.`, 
			value: ":", 
			valueSelection: [1, 1],
			validateInput: validateCmdValue,
		});
		if (cmdValue === undefined) 
			return;

		const decodedCmd = decodeCmdValue(cmdValue);		
		if (!decodedCmd) {
			vscode.window.showErrorMessage("Command input decodes to an unsupported instruction.");
			return;
		}

		if (decodedCmd.jumpType === JumpType.absolute) 
			absMoveCursor(decodedCmd.lineNo);
		else 
			vscode.window.showErrorMessage("Command input decodes to an unsupported instruction.");
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
