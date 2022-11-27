import fs from 'fs';
import path from 'path';

export interface WalkDirectoryOptions {
  cwd?: string;
  fs?: typeof fs.promises;
  depth?: number;
  filter?: (filename: string) => boolean;
}

export async function* walkDirectory(
  dir: string,
  options: WalkDirectoryOptions = {}
): AsyncGenerator<[string, fs.Stats]> {
  const opts: Required<WalkDirectoryOptions> = {
    cwd: options.cwd || process.cwd(),
    fs: options.fs || fs.promises,
    depth: options.depth || Number.POSITIVE_INFINITY,
    filter: options.filter || (() => true),
  };
  if (!opts.depth || !opts.filter(dir)) {
    return;
  }
  const filename = path.resolve(opts.cwd, dir);
  const [stats, paths] = await Promise.all([
    opts.fs.stat(filename),
    opts.fs.readdir(filename).catch(() => []),
  ]);
  yield [filename, stats];
  for (const p of paths) {
    const generator = walkDirectory(p, {
      cwd: filename,
      fs: opts.fs,
      depth: opts.depth - 1,
      filter: opts.filter,
    });
    for await (const val of generator) {
      yield val;
    }
  }
}
