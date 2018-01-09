/**
 * On save
 *
 * @author Dominique Rau [domi.github@gmail.com](mailto:domi.github@gmail.com)
 * @version 0.0.1
 */

import { Disposable, TextDocumentWillSaveEvent, TextEdit, workspace } from 'vscode';
import { regreplace } from './regreplace';
import { getConfiguration, getMaxRange }  from './utils';

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
    }
};


function listener({ document, waitUntil }: TextDocumentWillSaveEvent) {
    const regreplacedText = regreplace(document);
    if (!regreplacedText) {
        return;
    }

    const edits = Promise.resolve([ new TextEdit(getMaxRange(), regreplacedText) ]);
    waitUntil(edits);
}