import path from 'path';
import { expect, test } from 'vitest';
import { walkDirectory } from '../src/fs';
import { createTreeFromFiles } from '../src/node';
import { renderTree } from '../src/render';
import { arrayFromAsyncGenerator } from '../src/utils';

test('walkDirectory', async () => {
  const walking = walkDirectory(path.dirname(__dirname), {
    filter(filename) {
      return !filename.startsWith('.');
    },
  });
  const files = await arrayFromAsyncGenerator(walking);
  const tree = createTreeFromFiles(files.map(([filename]) => filename));
  expect(renderTree(tree)).toMatchInlineSnapshot(`
    ".
    ├── bin.js
    ├── dist
    │   ├── cli.js
    │   ├── fs.js
    │   ├── index.js
    │   ├── node.js
    │   ├── render.js
    │   ├── types.js
    │   └── utils.js
    ├── node_modules
    │   ├── @eslint
    │   ├── @types
    │   └── @typescript-eslint
    ├── package.json
    ├── pnpm-lock.yaml
    ├── src
    │   ├── cli.ts
    │   ├── fs.ts
    │   ├── index.ts
    │   ├── node.ts
    │   ├── render.ts
    │   ├── types.ts
    │   └── utils.ts
    ├── tests
    │   ├── fs.test.ts
    │   ├── node.test.ts
    │   └── tsconfig.json
    ├── tsconfig.json
    └── vitest.config.ts"
  `);
});
