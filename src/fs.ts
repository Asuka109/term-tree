import fs from 'fs';
import path from 'path';

export interface WalkDirectoryOptions {
  cwd?: string;
  fs?: typeof fs.promises;
  depth?: number;
  filter?: (filename: string) => boolean;
  followSymlink?: boolean;
}

export async function* walkDirectory(
  dir: string,
  options: WalkDirectoryOptions = {}
): AsyncGenerator<[string, fs.Stats]> {
  const opts: Required<WalkDirectoryOptions> = {
    cwd: options.cwd ?? process.cwd(),
    fs: options.fs ?? fs.promises,
    depth: options.depth ?? Number.POSITIVE_INFINITY,
    filter: options.filter ?? (() => true),
    followSymlink: options.followSymlink ?? false,
  };
  const filename = path.resolve(opts.cwd, dir);
  if (opts.depth < 0 || !opts.filter(filename)) {
    return;
  }
  const [stats, paths] = await Promise.all([
    opts.fs.lstat(filename),
    opts.fs.readdir(filename).catch(() => []),
  ]);
  if (stats.isSymbolicLink() && !opts.followSymlink) {
    return;
  }
  yield [filename, stats];
  for (const p of paths) {
    const generator = walkDirectory(p, {
      cwd: filename,
      fs: opts.fs,
      depth: opts.depth - 1,
      filter: opts.filter,
      followSymlink: opts.followSymlink,
    });
    for await (const val of generator) {
      yield val;
    }
  }
}
