/**
 * On save helper with bypass
 *
 * @author Dominique Rau [domi.github@gmail.com](mailto:domi.github@gmail.com)
 * @version 0.0.1
 */

import {
	Disposable,
	TextDocumentWillSaveEvent,
	TextEdit,
	workspace,
	window,
	Position,
	Selection,
} from 'vscode';
import { calculateTargetTextForAllRules, getCustomEdits, CustomEditType } from './regreplace';
import { getConfiguration, getMaxRange } from './utils';

let subscription: Disposable;
export default {
	get isEnabled() {
		return getConfiguration<boolean>('on-save');
	},

	register() {
		if (subscription) {
			return;
		}

		subscription = workspace.onWillSaveTextDocument(listener);
	},

	unregister() {
		if (!subscription) {
			return;
		}

		subscription.dispose();
		subscription = null;
	},

	update() {
		if (this.isEnabled) {
			this.register();
		} else {
			this.unregister();
		}
	},

	bypass(action) {
		this.unregister();
		const result = action();
		return result.then(() => this.update());
	},
};

/**
 * callback listener, we apply small delta changes
 */
function listener({ document, waitUntil }: TextDocumentWillSaveEvent) {
	const regreplacedText = calculateTargetTextForAllRules(document);
	if (!regreplacedText || regreplacedText === document.getText()) {
		return;
	}

	// v1 use diff edits
	const edits = getCustomEdits(document.getText(), regreplacedText);
	const textEdits = edits.map(e => {
		switch (e.action) {
			case CustomEditType.Replace:
				return new TextEdit(e.range, e.value);
			case CustomEditType.Insert:
				return new TextEdit(e.range, e.value);
			case CustomEditType.Delete:
				return new TextEdit(e.range, '');
		}
	});
	waitUntil(Promise.all(textEdits));

	// v0 use replace all
	// let selections: Selection[];
	// if (window.activeTextEditor.document === document) {
	//     selections = window.activeTextEditor.selections;
	// }
	// const edits = Promise.resolve([ new TextEdit(getMaxRange(), regreplacedText) ]);
	// waitUntil(edits);
	// if (selections && selections.length >= 1) {
	//     edits.then(() => {
	//         const selection = selections[0];
	//         if (window.activeTextEditor.document.lineCount > selection.start.line) {
	//             const currentLine = window.activeTextEditor.document.lineAt(selection.start.line);
	//             const currentCharacter = Math.min(currentLine.text.length, selection.start.character);
	//             const pos = new Position(currentLine.lineNumber, currentCharacter);
	//             const newSelection = new Selection(pos, pos);
	//             window.activeTextEditor.selection = newSelection;
	//         }
	//     });
	// }
}
