import * as fs from 'fs';
import { join, basename, relative, sep } from 'path';

/**
 * TreeNode 代表目錄或檔案的樹狀節點
 */
export interface TreeNode {
  name: string;
  children: TreeNode[];
  isDirectory: boolean;
}

/**
 * 根據檔案路徑建立樹狀結構
 * @param filePaths - 從 findFiles 取得的絕對路徑陣列
 * @param baseDir - 基礎目錄
 */
function buildTree(filePaths: string[], baseDir: string): TreeNode {
  const root: TreeNode = {
    name: basename(baseDir),
    children: [],
    isDirectory: true,
  };

  for (const file of filePaths) {
    const relativePath = relative(baseDir, file);
    if (!relativePath) continue;
    const parts = relativePath.split(sep);
    let currentNode = root;
    let currentPath = baseDir;
    parts.forEach((part, index) => {
      currentPath = join(currentPath, part);
      let childNode = currentNode.children.find((child) => child.name === part);
      if (!childNode) {
        const isDir = (index < parts.length - 1) ? true : fs.statSync(currentPath).isDirectory();
        childNode = { name: part, children: [], isDirectory: isDir };
        currentNode.children.push(childNode);
      }
      currentNode = childNode;
    });
  }

  return root;
}

/**
 * 產生文件化樹狀結構字串
 * 此函式只專注於字串生成，不處理檔案系統操作
 * @param node - 樹狀結構節點
 * @param prefix - 前置字串
 */
function generateDocumentedTreeStructureString(node: TreeNode, prefix: string = ''): string {
  let treeStr = '';
  // 依字母排序子項目（忽略大小寫）
  const children = node.children.sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
  );
  
  children.forEach((child, index) => {
    const isLast = index === children.length - 1;
    const connector = isLast ? '└── ' : '├── ';
    treeStr += prefix + connector + child.name + (child.isDirectory ? '/' : '') + '\n';
    if (child.isDirectory && child.children.length > 0) {
      // 更新前置字串：若為最後一項則補空白，否則補上「│   」
      const newPrefix = prefix + (isLast ? '    ' : '│   ');
      treeStr += generateDocumentedTreeStructureString(child, newPrefix);
    }
  });
  return treeStr;
}

export function generateDocumentedTreeStructure(filePaths: string[], baseDir: string): string {
  const rootNode = buildTree(filePaths, baseDir);
  return generateDocumentedTreeStructureString(rootNode, '');
}