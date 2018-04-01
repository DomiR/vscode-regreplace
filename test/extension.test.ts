//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as myExtension from '../src/extension';
import * as regreplace from '../src/regreplace';

function formatPosition(pos: vscode.Position) {
	return `${pos.line}:${pos.character}`;
}

function formatRange(range: vscode.Range) {
	return `${range.start.line}:${range.start.character} - ${range.end.line}:${
		range.end.character
	}`;
}

function formatEdits(edits) {
	return edits.map(e => `${e.action}: ${formatRange(e.range)} => ${e.value}`);
}

// Defines a Mocha test suite to group tests of similar kind together
suite('Diff generation', () => {
	// Defines a Mocha unit test
	test('plain', () => {
		var diff = regreplace.getDiff('nice weather', 'what weather');
		var result = [[-1, 'nice'], [1, 'what'], [0, ' weather']];
		assert.deepEqual(diff, result);
	});

	test('with newline', () => {
		var diff = regreplace.getDiff('nice\nweather', 'what\nweather');
		var result = [[-1, 'nice'], [1, 'what'], [0, '\nweather']];
		assert.deepEqual(diff, result);
	});

	test('with cr', () => {
		var diff = regreplace.getDiff('nice\r\nweather', 'what\r\nweather');
		var result = [[-1, 'nice'], [1, 'what'], [0, '\r\nweather']];
		assert.deepEqual(diff, result);
	});
});

suite('Replacement generation', () => {
	test('replacement generation pos 0:0', () => {
		var zero = regreplace.getPositionFromIndex('nice weather', 0);
		assert.deepEqual(zero, new vscode.Position(0, 0));

		var zeroWithReturn = regreplace.getPositionFromIndex('nice \nweather', 0);
		assert.deepEqual(zeroWithReturn, new vscode.Position(0, 0));

		var zeroWithCFReturn = regreplace.getPositionFromIndex('nice \r\nweather', 0);
		assert.deepEqual(zeroWithCFReturn, new vscode.Position(0, 0));
	});

	test('replacement generation pos 1:0', () => {
		var oneWithReturn = regreplace.getPositionFromIndex('nice \nweather', 6);
		assert.deepEqual(oneWithReturn, new vscode.Position(1, 0));

		var oneWithCFReturn = regreplace.getPositionFromIndex('nice \r\nweather', 7);
		assert.deepEqual(oneWithCFReturn, new vscode.Position(1, 0));

		var last = regreplace.getPositionFromIndex('nice weather', 1);
	});
});

suite('Replacement generation', () => {
	test('replace single words', () => {
		var edits = regreplace.getCustomEdits('ncie weather', 'what weather');
		assert.deepEqual(edits, [
			{
				action: 0,
				position: null,
				range: {
					_end: {
						_character: 4,
						_line: 0,
					},
					_start: {
						_character: 0,
						_line: 0,
					},
				},
				value: 'what',
			},
		]);
	});

	test('replace with newlines', () => {
		var edits = regreplace.getCustomEdits('ncie \nweather', 'what \nweather');
		assert.deepEqual(edits, [
			{
				action: 0,
				position: null,
				range: {
					_end: {
						_character: 4,
						_line: 0,
					},
					_start: {
						_character: 0,
						_line: 0,
					},
				},
				value: 'what',
			},
		]);
	});

	test('replace over newline', () => {
		var edits = regreplace.getCustomEdits('ncie \nmeat', 'what \nweat');
		assert.deepEqual(edits, [
			{
				action: 0,
				position: null,
				range: {
					_end: {
						_character: 4,
						_line: 0,
					},
					_start: {
						_character: 0,
						_line: 0,
					},
				},
				value: 'what',
			},
			{
				action: 0,
				position: null,
				range: {
					_end: {
						_character: 1,
						_line: 1,
					},
					_start: {
						_character: 0,
						_line: 1,
					},
				},
				value: 'w',
			},
		]);
	});

	test('replace multiple words', () => {
		var editsMultiLine = regreplace.getCustomEdits(
			'ncie \nweather\noldish',
			'what \nweat\nnewish',
		);
		assert.equal(editsMultiLine.length, 3);
	});
});
