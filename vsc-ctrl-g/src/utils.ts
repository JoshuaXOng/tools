import * as vscode from 'vscode';

export const isIntConvertable = (str: string) => {
	return Number.isInteger(Number(str)) && str.replace(" ", "").length !== 0;
}

export const getLineCount = () => {
	return vscode.window.activeTextEditor?.document.lineCount;
}

export const absMoveCursor = (lineNo: number) => {
	let editor = vscode.window.activeTextEditor;
	if (!editor) return;

	let range = editor.document.lineAt(lineNo-1).range;
	editor.selection =  new vscode.Selection(range.start, range.end);
	editor.revealRange(range);
}