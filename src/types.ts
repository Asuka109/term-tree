
export interface TreeSymbols {
  BRANCH: string;
  EMPTY: string;
  INDENT: string;
  LAST_BRANCH: string;
  VERTICAL: string;
}

export interface TreeNode {
  name: string;
  children?: TreeNode[];
}
