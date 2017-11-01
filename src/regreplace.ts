/**
 * Regreplace
 *
 * @author Dominique Rau [domi.github@gmail.com](mailto:domi.github@gmail.com)
 * @version 0.0.1
 */

import { dirname, extname } from 'path';
import { TextDocument, window } from 'vscode';
import { getConfiguration, getMaxRange } from './utils';
import onSave from './on-save';





// regreplace
// ------------------------------
export function regreplace(document: TextDocument): string {
    try {
        const commands = getConfiguration<ICommand[]>('commands');

        const currentText = document.getText()
        const fileName = document.fileName;
        const extension = extname(fileName);
        const directory = dirname(fileName);
        const fileMatches = (pattern: string) => pattern && pattern.length > 0 && new RegExp(pattern).test(fileName);

        // filter all commands with filematch patterns
        const activeCommands = commands
            .filter(cfg => {
                const matchPattern = cfg.match || '';
                const negatePattern = cfg.exclude || '';

                // if no match pattern was provided, or if match pattern succeeds
                const isMatch =
                    (typeof matchPattern === "string")
                    ? matchPattern.length === 0 || fileMatches(matchPattern)
                    : matchPattern.some(mp => fileMatches(mp));

                // negation has to be explicitly provided
                const isNegate =
                    (typeof negatePattern === "string")
                    ? negatePattern.length > 0 && fileMatches(negatePattern)
                    : negatePattern.some(mp => fileMatches(mp));

                // negation wins over match
                return !isNegate && isMatch;
            });

        // return if no commands
        if (activeCommands.length === 0) {
            return;
        }

        // sort commands with priority
        const sortedCommands = activeCommands.sort((a, b) => (a.priority || 0) - (b.priority || 0))

        // run through all active commands
        let resultText = currentText;
        activeCommands.forEach(command => {
            if (command == null) { return; }
            try {
                let regexQuery, regexReplace;

                // find via regex or regular find
                if (command.regexp && command.regexp.length > 0) {
                    regexQuery = command.regexp
                } else if (command.find && command.find.length > 0) {
                    regexQuery = command.find.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
                } else {
                    return;
                }

                // result
                if (command.replace != null) {
                    regexReplace = command.replace;
                } else {
                    return;
                }

                const reg = command.global === false ? new RegExp(regexQuery) : new RegExp(regexQuery, "g");
                resultText = resultText.replace(reg, regexReplace)

            } catch (error) {
                if (!getConfiguration<boolean>('suppress-warnings')) {
                    window.showWarningMessage(`Error regreplacing in command ${command.name}: ${error}`);
                }
                return null;
            }
        });

        return resultText;
    } catch (error) {
        if (!getConfiguration<boolean>('suppress-warnings')) {
            window.showWarningMessage(`Error regreplacing: ${error}`);
        }
        return document.getText();
    }
}


export function regreplaceCurrentDocument() {
    const {
        activeTextEditor: editor,
        activeTextEditor: { document }
    } = window;

    const regreplacedText = regreplace(document);
    if (!regreplacedText) {
        return;
    }

    return editor.edit(edit => edit.replace(getMaxRange(), regreplacedText));
}


export async function saveWithoutReplacing() {
    const { document } = window.activeTextEditor;
    onSave.bypass(async () => await document.save());
}





// types
// ------------------------------
interface ICommand {
	name?: string;              // just for keepsake
	match?: string|string[];    // regex expression e.g. "\\.(ts|js|tsx)$"
	exclude?: string|string[];  // will overrule match e.g. "^\\.$" exclude dot files
	priority?: number;          // execution prio
	find?: string;              // use regular search e.g. "** what"
	regexp?: string             // use regexp, need to escape e.g. "(\\n)*"
	replace: string;            // replace with groups e.g. "$2\n$1"
	global?: boolean;           // default true, used in regexp
}