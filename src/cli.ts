import path from 'path';
import assert from 'assert';
import { Stats } from 'fs';
import { Command } from 'commander';
import { filesize } from 'filesize';
import { walkDirectory } from './fs';
import { arrayFromAsyncGenerator } from './utils';
import { createTreeFromFiles } from './node';
import { renderTree } from './render';
import { TreeNode } from './types';

export interface CommandLineOptions {
  cwd: string;
  depth: number;
  size: boolean;
  symbols: 'ansi' | 'ascii';
  absolute: boolean;
  combine: boolean;
  followSymlink: boolean;
  includeDots: boolean;
  includeNodeModules: boolean;
  review: boolean;
  json: boolean;
}

const createFilter = (opts: CommandLineOptions) => (filename: string) => {
  const parts = filename.split(path.sep);
  if (!opts.includeDots && parts.find(p => p.startsWith('.'))) {
    return false;
  }
  if (!opts.includeNodeModules && parts.find(p => p === 'node_modules')) {
    return false;
  }
  return true;
};

const createTreeProcessor = (
  opts: CommandLineOptions,
  filePairs: [string, Stats][]
) => {
  const sizeMap = Object.fromEntries(
    filePairs.map(([filename, stat]) => [filename, stat.size])
  );
  return (node: TreeNode, filename: string, parent?: TreeNode) => {
    if (!parent) node.name = filename;
    if (!opts.size) return;
    node.children?.forEach(child => {
      const _filename = path.join(filename, child.name);
      const _size = sizeMap[_filename];
      assert(typeof _size === 'number');
      sizeMap[filename] += _size;
    });
    const sizeMark = ` (${filesize(sizeMap[filename])})`;
    node.name += sizeMark;
    sizeMap[filename + sizeMark] = sizeMap[filename];
  };
};

export const createProgram = () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const pkgMeta = require('../package.json');
  const program = new Command();
  program
    .name(pkgMeta.name)
    .version(pkgMeta.version)
    .description(pkgMeta.description)
    .argument('[dir]', 'directory to list', './')
    .option('-d, --depth [depth]', 'depth of the tree to search', Number, 5)
    .option('-s, --size', 'show file size')
    .option('-S, --symbols <symbols>', 'symbols of tree', 'ansi')
    .option('-a, --absolute', 'print absolute path')
    .option('--combine', 'combine files and directories', true)
    .option('--no-combine')
    .option('-l, --follow-symlink', 'follow symlink')
    .option('-D, --include-dots', 'include dot files')
    .option('-M, --include-node-modules', 'include node_modules')
    .option('-r, --review', 'print and review the options')
    .option('-j, --json', 'output as json')
    .action(async (cwd: string, opts: CommandLineOptions) => {
      opts.cwd = path.resolve(cwd);
      opts.review && console.log('options: ', opts);
      const filter = createFilter(opts);
      const walking = walkDirectory(opts.cwd, { ...opts, filter });
      const pairs = await arrayFromAsyncGenerator(walking);
      const files = pairs.map(([filename]) => filename);
      const processor = createTreeProcessor(opts, pairs);
      const tree = createTreeFromFiles(files, { ...opts, processor });
      if (opts.json) {
        console.log(JSON.stringify(tree, null, 2));
      } else {
        const text = renderTree(tree, opts);
        console.log(text);
      }
    });
  return program;
};
