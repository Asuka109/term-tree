import { Command } from 'commander';
import { walkDirectory } from './fs';
import { arrayFromAsyncGenerator } from './utils';
import { createTreeFromFiles } from './node';
import { renderTree } from './render';
import path from 'path';

export interface CommandLineOptions {
  cwd: string;
  depth: number;
  symbols: 'ansi' | 'ascii';
  absolute: boolean;
  combine: boolean;
  followSymlink: boolean;
  includeDots: boolean;
  includeNodeModules: boolean;
  review: boolean;
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

export const createProgram = () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const pkgMeta = require('../package.json');
  const program = new Command();
  program
    .version(pkgMeta.version)
    .option('-d, --depth [depth]', 'Depth of the tree to search', Number, 5)
    .option('-s, --symbols <symbols>', 'Symbols of tree', 'ansi')
    .option('-a, --absolute', 'Print absolute path')
    .option('--combine', 'Combine files and directories', true)
    .option('--no-combine')
    .option('-l, --follow-symlink', 'Follow symlink')
    .option('-D, --include-dots', 'Include dot files')
    .option('-M, --include-node-modules', 'Include node_modules')
    .option('-r, --review', 'Print and review the options')
    .action(async (opts: CommandLineOptions) => {
      opts.cwd = process.cwd();
      opts.review && console.log('options: ', opts);
      const filter = createFilter(opts);
      const walking = walkDirectory(process.cwd(), { ...opts, filter });
      const pairs = await arrayFromAsyncGenerator(walking);
      const files = pairs.map(([filename]) => filename);
      const tree = createTreeFromFiles(files, opts);
      tree.name = path.resolve(opts.cwd, '.');
      console.log(renderTree(tree, opts));
    });
  return program;
};
