/**
 * Utils
 *
 * @author Dominique Rau [domi.github@gmail.com](mailto:domi.github@gmail.com)
 * @version 0.0.1
 */

import { Range, workspace } from 'vscode';

export const EXTENSION_NAME = 'regreplace';

export function getConfiguration<T>(key: string): T {
	return workspace.getConfiguration(EXTENSION_NAME).get<T>(key);
}

export function getMaxRange(): Range {
	return new Range(0, 0, Number.MAX_VALUE, Number.MAX_VALUE);
}
