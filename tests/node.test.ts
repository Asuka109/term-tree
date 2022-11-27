import path from 'path';
import { describe, expect, it } from 'vitest';
import { createTreeFromFiles, renderTree, TreeSymbols } from '../src';

const files = [
  'package/src/foo/bar.ts',
  'package/src/foo/baz.ts',
  'package/src/shared/context.ts',
  'package/src/shared/vendors/ansi.ts',
  'package/tests/foo/bar.ts',
  'package/tests/foo/baz.ts',
  'package/package.json'
];

describe('createTreeFromFiles', () => {
  it('should create tree source', () => {
    const source = createTreeFromFiles(files);
    const tree = renderTree(source);
    expect(tree).toMatchInlineSnapshot(`
      "package
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
      └── package.json"
    `);
  });
  it('should create tree source with absolute path', () => {
    const source = createTreeFromFiles(files, {
      absolute: true,
      cwd: path.sep
    });
    const tree = renderTree(source);
    expect(tree).toMatchInlineSnapshot(`
      "/package
      ├── /package/src
      │   ├── /package/src/foo
      │   │   ├── /package/src/foo/bar.ts
      │   │   └── /package/src/foo/baz.ts
      │   └── /package/src/shared
      │       ├── /package/src/shared/context.ts
      │       └── /package/src/shared/vendors/ansi.ts
      ├── /package/tests/foo
      │   ├── /package/tests/foo/bar.ts
      │   └── /package/tests/foo/baz.ts
      └── /package/package.json"
    `);
  });
  it('should create tree source with processor', () => {
    const source = createTreeFromFiles(files, {
      processor: node => {
        node.name += ` (10 lines)`;
      }
    });
    const tree = renderTree(source);
    expect(tree).toMatchInlineSnapshot(`
      "package (10 lines)
      ├── src (10 lines)
      │   ├── foo (10 lines)
      │   │   ├── bar.ts (10 lines)
      │   │   └── baz.ts (10 lines)
      │   └── shared (10 lines)
      │       ├── context.ts (10 lines)
      │       └── vendors/ansi.ts (10 lines)
      ├── tests/foo (10 lines)
      │   ├── bar.ts (10 lines)
      │   └── baz.ts (10 lines)
      └── package.json (10 lines)"
    `);
  });
  it('should create tree source without combine', () => {
    const source = createTreeFromFiles(files, { combine: false });
    const tree = renderTree(source);
    expect(tree).toMatchInlineSnapshot(`
      "package
      ├── src
      │   ├── foo
      │   │   ├── bar.ts
      │   │   └── baz.ts
      │   └── shared
      │       ├── context.ts
      │       └── vendors
      │           └── ansi.ts
      ├── tests
      │   └── foo
      │       ├── bar.ts
      │       └── baz.ts
      └── package.json"
    `);
  });
  it('should create tree source with custom symbols', () => {
    const source = createTreeFromFiles(files);
    const symbols: TreeSymbols = {
      BRANCH: '#- ',
      EMPTY: '',
      INDENT: '   ',
      LAST_BRANCH: '@- ',
      VERTICAL: '!  '
    };
    const tree = renderTree(source, { symbols });
    expect(tree).toMatchInlineSnapshot(`
      "package
      #- src
      !  #- foo
      !  !  #- bar.ts
      !  !  @- baz.ts
      !  @- shared
      !     #- context.ts
      !     @- vendors/ansi.ts
      #- tests/foo
      !  #- bar.ts
      !  @- baz.ts
      @- package.json"
    `);
  });
});
