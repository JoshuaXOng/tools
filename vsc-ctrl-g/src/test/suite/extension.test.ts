import * as assert from 'assert';
import * as vscode from 'vscode';
import { isIntConvertable } from '../../utils';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Test isIntConvertable Method.', () => {
		assert(isIntConvertable("34"), "Check 34 (string) is convertable to an int.");
		assert(!isIntConvertable("3 4"), "Check 3 4 (string) is not convertable to an int.");
		assert(!isIntConvertable("34a"), "Check 34a (string) is not convertable to an int.");
		assert(!isIntConvertable("a"), "Check a (string) is not convertable to an int.");
		assert(!isIntConvertable(""), "Check <nothing> (string) is not convertable to an int.");
	})
});

