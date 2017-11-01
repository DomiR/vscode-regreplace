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
This sample configuration will remove newlines from end of file.
```typescript
"regreplace.commands": [
   {
      "match": ".(ts|js|tsx)$",  // typescript
      "regexp": "\n+$",          // escaped regexp
      "global": true,            // glob
      "replace": ""              // replace with empty string
   }
]
```


## Known Issues

None yet :)

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

Initial release of regreplace.

-----------------------------------------------------------------------------------------------------------

## Licence

MIT License

Copyright (c) 2017 DomiR

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.