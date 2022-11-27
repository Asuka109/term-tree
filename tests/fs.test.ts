import path from 'path';
import { expect, test } from 'vitest';
import { walkDirectory } from '../src/fs';
import { createTreeFromFiles } from '../src/node';
import { renderTree } from '../src/render';
import { arrayFromAsyncGenerator } from '../src/utils';

test('walkDirectory', async () => {
  const walking = walkDirectory(path.dirname(__dirname), {
    filter: filename => !filename.includes('node_modules')
  });
  const files = await arrayFromAsyncGenerator(walking);
  const tree = createTreeFromFiles(files.map(([filename]) => filename));
  expect(renderTree(tree)).toMatchInlineSnapshot(`
    "
    ├── .eslintrc.js
    ├── .vscode/settings.json
    ├── foo.mjs
    ├── package.json
    ├── pnpm-lock.yaml
    ├── src
    │   ├── fs.ts
    │   ├── index.ts
    │   ├── node.ts
    │   ├── render.ts
    │   ├── types.ts
    │   └── utils.ts
    ├── tests
    │   ├── fs.test.ts
    │   └── node.test.ts
    └── tsconfig.json"
  `);
});
