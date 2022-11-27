import assert from 'node:assert';
import { TreeNode, TreeSymbols } from './types';

export const SYMBOLS_ANSI: TreeSymbols = {
  BRANCH: '├── ',
  EMPTY: '',
  INDENT: '    ',
  LAST_BRANCH: '└── ',
  VERTICAL: '│   '
};

export const SYMBOLS_ASCII: TreeSymbols = {
  BRANCH: '|-- ',
  EMPTY: '',
  INDENT: '    ',
  LAST_BRANCH: '`-- ',
  VERTICAL: '|   '
};

export interface RenderTreeOptions {
  /** @default 'ansi' */
  symbols?: TreeSymbols | 'ansi' | 'ascii';
}

/** Credit to {@link https://github.com/yangshun/tree-node-cli} */
export function renderTreeImpl(
  source: TreeNode,
  currentDepth = 0,
  prefixSymbol = '',
  options: RenderTreeOptions = {},
  isLast = false,
): string[] {
  const { children = [] } = source;
  const lines: string[] = [];

  assert(typeof options.symbols === 'object');
  const SYMBOLS = options.symbols;

  const line = [prefixSymbol];
  if (currentDepth >= 1) {
    line.push(isLast ? SYMBOLS.LAST_BRANCH : SYMBOLS.BRANCH);
  }
  line.push(source.name);
  lines.push(line.join(''));

  children.forEach((child, index) => {
    const isCurrentLast = index === children.length - 1;
    let lineSymbol = SYMBOLS.EMPTY;
    if (currentDepth >= 1) {
      lineSymbol = isLast ? SYMBOLS.INDENT : SYMBOLS.VERTICAL;
    }
    const linesForFile = renderTreeImpl(
      child,
      currentDepth + 1,
      prefixSymbol + lineSymbol,
      options,
      isCurrentLast,
    );
    lines.push(...linesForFile);
  });
  return lines;
}

export const renderTree = (
  source: TreeNode,
  options: RenderTreeOptions = {},
) => {
  let symbols: TreeSymbols;
  if (options.symbols === 'ansi') {
    symbols = SYMBOLS_ANSI;
  } else if (options.symbols === 'ascii') {
    symbols = SYMBOLS_ASCII;
  } else {
    symbols = options.symbols || SYMBOLS_ANSI;
  }
  assert(typeof symbols === 'object', 'Invalid tree symbols');
  const opts = { ...options, symbols };
  return renderTreeImpl(source, 0, '', opts, true).join('\n');
};
