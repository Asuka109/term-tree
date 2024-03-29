# term-tree

> Tree structure utils for terminal printing and file traversing.

## Install

    $ npm install term-tree

## Usage

### Node.js

Create and print filenames from array.

```js
import { createTreeFromFiles, renderTree } from 'term-tree'

const files = ['package/src/foo/bar.ts', /* ... */];
const tree = createTreeFromFiles(files);
const graph = renderTree(source);
console.log(graph);
```

    package
    ├── src
    │   ├── foo
    │   │   ├── bar.ts
    │   │   └── baz.ts
    │   └── shared
    │       ├── context.ts
    │       └── vendors/ansi.ts
    ├── tests/foo
    │   ├── bar.ts
    │   └── baz.ts
    └── package.json

Walk directory to read files:

```js
import fs from 'fs/promises';
import { walkDirectory } from 'term-tree';

const files = {};

for await (const [name, stats] of walkDirectory('./')) {
  if (stats.isFile) {
    files[name] = await fs.readFile(name, 'utf8');
  }
}
```

### Command Line

    $ npm install -g term-tree
    $ term-tree --size

    /Users/Asuka109/repositories/term-tree (82.21 kB)
    ├── README.md (5.52 kB)
    ├── bin.js (132 B)
    ├── package.json (762 B)
    ├── pnpm-lock.yaml (48.53 kB)
    ├── src (9.85 kB)
    │   ├── cli.ts (3.32 kB)
    │   ├── fs.ts (1.25 kB)
    │   ├── index.ts (122 B)
    │   ├── node.ts (2.5 kB)
    │   ├── render.ts (1.96 kB)
    │   ├── types.ts (202 B)
    │   └── utils.ts (213 B)
    ├── tests (5.4 kB)
    │   ├── fs.test.ts (1.44 kB)
    │   ├── node.test.ts (3.73 kB)
    │   └── tsconfig.json (82 B)
    ├── tsconfig.json (11.33 kB)
    └── vitest.config.ts (174 B)

<!---->

    $ term-tree --help
    Usage: term-tree [options] [dir]

    Tree structure utils for terminal printing and file traversing.

    Arguments:
      dir                         directory to list (default: "./")

    Options:
      -V, --version               output the version number
      -d, --depth [depth]         depth of the tree to search (default: 5)
      -s, --size                  show file size
      -S, --symbols <symbols>     symbols of tree (default: "ansi")
      -a, --absolute              print absolute path
      --combine                   combine files and directories (default: true)
      --no-combine
      -l, --follow-symlink        follow symlink
      -D, --include-dots          include dot files
      -M, --include-node-modules  include node_modules
      -r, --review                print and review the options
      -j, --json                  output as json
      -h, --help                  display help for command

## API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

#### Table of Contents

*   [arrayFromAsyncGenerator](#arrayfromasyncgenerator)
    *   [Parameters](#parameters)
*   [visitTree](#visittree)
    *   [Parameters](#parameters-1)
*   [createTreeFromFiles](#createtreefromfiles)
    *   [Parameters](#parameters-2)
*   [symbols](#symbols)
*   [renderTree](#rendertree)
    *   [Parameters](#parameters-3)
*   [walkDirectory](#walkdirectory)
    *   [Parameters](#parameters-4)

### arrayFromAsyncGenerator

[src/utils.ts:2-10](https://github.com/Asuka109/term-tree/blob/4462365a734b217cfb5e0cb0ad9d2e32869e547a/src/utils.ts#L2-L10 "Source code on GitHub")

Create an array from async generator.

#### Parameters

*   `generator` **AsyncGenerator\<T>**&#x20;

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)\<T>>**&#x20;

### visitTree

[src/node.ts:6-13](https://github.com/Asuka109/term-tree/blob/4462365a734b217cfb5e0cb0ad9d2e32869e547a/src/node.ts#L6-L13 "Source code on GitHub")

Visit the tree node and its children in DFS.

#### Parameters

*   `source` **TreeNode**&#x20;
*   `handler` **function (src: TreeNode, parent: TreeNode): void**&#x20;
*   `parent` **TreeNode?**&#x20;

### createTreeFromFiles

[src/node.ts:23-84](https://github.com/Asuka109/term-tree/blob/4462365a734b217cfb5e0cb0ad9d2e32869e547a/src/node.ts#L23-L84 "Source code on GitHub")

Create a tree from a list of files.

#### Parameters

*   `files` **any**&#x20;
*   `options` **CreateTreeFromFilesOptions**  (optional, default `{}`)

### symbols

[src/render.ts:25-25](https://github.com/Asuka109/term-tree/blob/4462365a734b217cfb5e0cb0ad9d2e32869e547a/src/render.ts#L25-L25 "Source code on GitHub")

The symbols to use for rendering the tree.

Type: (TreeSymbols | `"ansi"` | `"ascii"`)

### renderTree

[src/render.ts:68-83](https://github.com/Asuka109/term-tree/blob/4462365a734b217cfb5e0cb0ad9d2e32869e547a/src/render.ts#L68-L83 "Source code on GitHub")

Render the tree node into terminal graph.

#### Parameters

*   `source` **TreeNode**&#x20;
*   `options` **RenderTreeOptions**  (optional, default `{}`)

### walkDirectory

[src/fs.ts:13-48](https://github.com/Asuka109/term-tree/blob/4462365a734b217cfb5e0cb0ad9d2e32869e547a/src/fs.ts#L13-L48 "Source code on GitHub")

Generate and walk the directory tree.

#### Parameters

*   `dir` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**&#x20;
*   `options` **WalkDirectoryOptions?**&#x20;

Returns **AsyncGenerator<\[[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String), fs.Stats]>**&#x20;
