/**
 * Regreplace
 *
 * @author Dominique Rau [domi.github@gmail.com](mailto:domi.github@gmail.com)
 * @version 0.0.1
 */

import { commands, ExtensionContext, workspace } from 'vscode';
import onSave from './on-save';
import { saveWithoutReplacing, regreplaceCurrentDocument, runSingleRule } from './regreplace';
import { EXTENSION_NAME } from './utils';

export function activate({ subscriptions }: ExtensionContext) {
    subscriptions.push(commands.registerCommand(EXTENSION_NAME + '.regreplace', regreplaceCurrentDocument));
    subscriptions.push(commands.registerCommand(EXTENSION_NAME + '.save-without-regreplace', saveWithoutReplacing));
    subscriptions.push(commands.registerCommand(EXTENSION_NAME + '.run-single-rule', runSingleRule));

    onSave.update();
    workspace.onDidChangeConfiguration(() => onSave.update());
}

export function deactivate() { }