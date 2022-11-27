import assert from 'assert';
import path from 'path';
import { TreeNode } from './types';

export const visitTree = (
  source: TreeNode,
  handler: (src: TreeNode, parent?: TreeNode) => void,
  parent?: TreeNode,
) => {
  source.children?.forEach(child => visitTree(child, handler, source));
  handler(source, parent);
};

export interface CreateTreeFromFilesOptions {
  cwd?: string;
  processor?: (node: TreeNode, filename: string, parent?: TreeNode) => void;
  absolute?: boolean;
  combine?: boolean;
}

export const createTreeFromFiles = (
  files: readonly string[],
  options: CreateTreeFromFilesOptions = {},
) => {
  assert(files.length, 'files should not be empty');
  const cwd = options.cwd || process.cwd();
  const mapping: Record<string, TreeNode> = {};
  // Create path parts map.
  const partsMap = new Map<string[], true>();
  for (const p of files) {
    const parts = path.resolve(cwd, p).split(path.sep);
    parts.length > 1 && partsMap.set(parts, true);
  }
  // Consume path parts map to create tree.
  let depth = 1;
  while (partsMap.size) {
    for (const [parts] of partsMap) {
      const p = parts.slice(0, depth).join(path.sep) || path.sep;
      if (!mapping[p]) {
        mapping[p] = {
          name: p,
          children: [],
        };
        const dir = path.dirname(p);
        dir !== p && mapping[dir].children?.push(mapping[p]);
      }
      parts.length <= depth && partsMap.delete(parts);
    }
    depth++;
  }

  const root = mapping[path.sep];
  // Organize tree structure.
  visitTree(root, (src, parent) => {
    // Remove empty children.
    src.children?.length || delete src.children;
    // Combine directories with only one child.
    if (options.combine !== false && parent && parent.children?.length === 1) {
      parent.name = src.name;
      parent.children = src.children;
    }
  });
  if (options.combine === false) {
    while (root.children?.length === 1) {
      const child = root.children[0];
      root.name = path.resolve(root.name, child.name);
      root.children = child.children;
    }
  }
  // Resolve name to relative path and run custom node processor.
  const needVisit = !options.absolute || Boolean(options.processor);
  needVisit &&
    visitTree(root, (src, parent) => {
      const filename = src.name;
      if (!options.absolute) {
        src.name = path.relative(parent?.name || cwd, src.name);
      }
      options.processor?.(src, filename, parent);
    });
  return root;
};
