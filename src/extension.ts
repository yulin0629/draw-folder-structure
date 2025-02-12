import { statSync } from 'fs';
import { basename } from 'path';
import * as vscode from 'vscode';
import { generateStructure } from './functions/generate-structure';
import { getPrefix } from './functions/get-prefix';
import { Style } from './types/style';

const CURRENT_VERSION = '1.4.2';

export function activate(context: vscode.ExtensionContext) {
  const previousVersion = context.globalState.get<string>('extensionVersion');

  if (previousVersion !== CURRENT_VERSION) {
    vscode.window.showInformationMessage(
      `🎉 New version ${CURRENT_VERSION} available! Check out the new features!`
    );
    context.globalState.update('extensionVersion', CURRENT_VERSION);
  }

  let disposable = vscode.commands.registerCommand(
    'extension.generateMarkdownStructure',
    async (folder: vscode.Uri) => {
      const folderPath = folder.fsPath;
      const itemName = basename(folderPath);
      const stats = statSync(folderPath);
      let markdownStructure = '';

      const excludePatterns: string[] =
        vscode.workspace
          .getConfiguration('draw.folder.structure')
          .get('exclude') || [];

      const style: Style =
        vscode.workspace
          .getConfiguration('draw.folder.structure')
          .get('style') || Style.EmojiDashes;

      // TODO: Implement this feature in the future (allowRecursion)
      const allowRecursion: boolean = true; // getConfiguration('draw.folder.structure').get('allowRecursion')

      // 此命令預設不遵循 .gitignore
      const respectGitignore: boolean = false;

      if (stats.isDirectory()) {
        if (style === Style.DocumentedTree) {
          // 若為 DocumentedTree 風格，直接呼叫新函式產生樹狀結構
          markdownStructure = await generateStructure(
            folderPath,
            excludePatterns,
            style,
            allowRecursion,
            respectGitignore
          );
        } else {
          // 其他 style 先印出根目錄名稱，再遞迴產生結構
          markdownStructure += getPrefix(0, style) + itemName + '\n';
          markdownStructure += await generateStructure(
            folderPath,
            excludePatterns,
            style,
            allowRecursion,
            respectGitignore
          );
        }
      } else {
        markdownStructure = getPrefix(0, style, true) + itemName + '\n';
      }

      markdownStructure = '```\n' + markdownStructure + '```';

      vscode.env.clipboard.writeText(markdownStructure).then(() => {
        // Muestra una notificación
        vscode.window.showInformationMessage(
          'Markdown structure copied to clipboard!'
        );
      });

      vscode.workspace
        .openTextDocument({ content: markdownStructure, language: 'markdown' })
        .then((doc) => {
          vscode.window.showTextDocument(doc);
        });
    }
  );

  let disposableGitignore = vscode.commands.registerCommand(
    'extension.generateMarkdownStructureRespectGitignore',
    async (folder: vscode.Uri) => {
      const folderPath = folder.fsPath;
      const itemName = basename(folderPath);
      const stats = statSync(folderPath);
      let markdownStructure = '';

      const excludePatterns: string[] =
        vscode.workspace
          .getConfiguration('draw.folder.structure')
          .get('exclude') || [];

      const style: Style =
        vscode.workspace
          .getConfiguration('draw.folder.structure')
          .get('style') || Style.EmojiDashes;

      // TODO: Implement this feature in the future (allowRecursion)
      const allowRecursion: boolean = true; // getConfiguration('draw.folder.structure').get('allowRecursion')

      // 此命令啟用 respectGitignore
      const respectGitignore: boolean = true;

      if (stats.isDirectory()) {
        if (style === Style.DocumentedTree) {
          // 若為 DocumentedTree 風格，直接呼叫新函式產生樹狀結構
          markdownStructure = await generateStructure(
            folderPath,
            excludePatterns,
            style,
            allowRecursion,
            respectGitignore
          );
        } else {
          // 其他 style 先印出根目錄名稱，再遞迴產生結構
          markdownStructure += getPrefix(0, style) + itemName + '\n';
          markdownStructure += await generateStructure(
            folderPath,
            excludePatterns,
            style,
            allowRecursion,
            respectGitignore
          );
        }
      } else {
        markdownStructure = getPrefix(0, style, true) + itemName + '\n';
      }

      markdownStructure = '```\n' + markdownStructure + '```';

      vscode.env.clipboard.writeText(markdownStructure).then(() => {
        vscode.window.showInformationMessage(
          'Markdown structure (with respectGitignore) copied to clipboard!'
        );
      });

      vscode.workspace
        .openTextDocument({ content: markdownStructure, language: 'markdown' })
        .then((doc) => {
          vscode.window.showTextDocument(doc);
        });
    }
  );

  context.subscriptions.push(disposable, disposableGitignore);
}

export function deactivate() {}
