# regreplace README

Reg Replace is a plugin for Visual Studio Code that allows the creating of commands consisting of sequences of find and replace instructions.

It is heavily inspired from [Reg Replace for Sublime Text](https://github.com/facelessuser/RegReplace)

## Features

- Create find and replace rules that can then be used to create VSCode Commands to call at any time.
- Chain multiple regex find and replace rules together.
- Create rules that can filter regex results by filename.
- Create rules that run on save.

<!-- Describe specific features of your extension including screenshots of your extension in action. Image paths are relative to this README file.

For example if there is an image subfolder under your extension project workspace:
\!\[feature X\]\(images/feature-x.png\)
 -->

## Extension Settings

This extension contributes the following settings:

* `on-save` - defaults to true, run commands on save.
* `suppress-warnings` - (optional) Suppress warnings when regreplace fails.
* `commands` - array of commands that will be run whenever a file is saved.
  * `name` - command name for debugging.
  * `match` - regex for matching files to run commands on. e.g. \"\\.(ts|js|tsx)$\"
  * `exclude` - regex for matching files *not* to run commands on. e.g. \"^\\.$\" exclude dot files
  * `priority` - command priority determines order.
  * `find` - use simple find command. e.g. \"** what\"
  * `regexp` - use regexp find command. Needs to be escaped. e.g. \"(\\n)*\"
  * `replace` - replace text. Supports groups. e.g. \"$2\n$1\"
  * `global` - run command asynchronously.



### Sample Config

This sample configuration will replace single quotes with double quotes.
```typescript
"regreplace.commands": [
   {
      "match": ".html?$",      // html
      "regexp": "(')(.*?)(')", // single quotes
      "global": true,          // glob
      "replace": "\"$2\""      // replace with double quotes
   }
]
```


## Known Issues
- Cursor will be placed at end of file after saving

## Release Notes

### 1.1.0
- Breaking Change: Renaming command `Run RegReplace` to `RegReplace: Run`
- Adding `RegReplace: Save without replacing`

### 1.0.0
- Initial release of regreplace.

-----------------------------------------------------------------------------------------------------------

## Licence
MIT License

