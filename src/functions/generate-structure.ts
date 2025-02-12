import { statSync } from 'fs';
import { basename, resolve, sep } from 'path';
import { Style } from '../types/style';
import { findFiles } from './find-files';
import { getPrefix } from './get-prefix';
import { generateDocumentedTreeStructure } from './generate-documented-tree';

export async function generateStructure(
  folderPath: string,
  excludePatterns: string[],
  style: Style,
  allowRecursion: boolean = true, // Toggle recursive search
  respectGitignore: boolean = false // Toggle .gitignore usage
): Promise<string> {

  const items = await findFiles(
    folderPath,       // 基底目錄
    ['**/*'],         // 包含所有檔案
    excludePatterns,  // 排除模式
    allowRecursion,   // 是否遞迴
    respectGitignore  // 是否遵循 .gitignore
  );

  if (style === Style.DocumentedTree) {    
    const rootName = basename(folderPath) + '/\n';
    return rootName + generateDocumentedTreeStructure(items, folderPath);
  }

  let structure = '';

  // 以平坦清單方式產生結構（非 DocumentedTree 時）
  for (const [index, item] of items.entries()) {
    const fullPath = resolve(item); // 確保取得完整路徑
    const isFolder = statSync(fullPath).isDirectory();
    const isLastItem = index === items.length - 1;

    // 計算目前項目的深度
    const currentDepth =
      fullPath.split(sep).length - folderPath.split(sep).length;

    // 取得前置字串
    const prefix = getPrefix(
      currentDepth, // 根據深度計算
      style,        // 畫圖風格
      !isFolder,    // 是否為檔案
      isLastItem    // 是否為最後一項
    );

    structure += `${prefix}${basename(item)}\n`;
  }

  return structure;
}
