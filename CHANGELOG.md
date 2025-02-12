# Change Log

All notable changes to the "Draw Folder Structure" extension will be documented in this file.

## [1.4.3] - 2025-02-11

### Fixed
- 修復了在使用 respectGitignore 選項時，目錄匹配的問題
  - 改進了 .gitignore 規則的處理邏輯，現在會正確處理目錄的匹配
  - 確保目錄路徑在匹配 .gitignore 規則時會包含結尾的斜線

## [1.4.2] - 2025-02-10

### Added
- 新增右鍵選項 **Generate Markdown structure (respectGitignore)**，使用此選項時將會讀取並遵循專案中的 **.gitignore** 規則，進一步精確排除不需要的檔案與資料夾。
- 新增 **DocumentedTree** 樣式：使用全新的 DocumentedTree 風格生成樹狀結構，支援根目錄名稱後自動加上斜線，並正確處理樹枝「│」與連線位置。
  
### Changed
- 更新 `generateStructure` 函式，當 style 設定為 DocumentedTree 時，改用新的遞迴邏輯產生結構。
- 調整 `package.json` 與 `README.md` 中的 style 選項，新增 DocumentedTree 的相關說明與說明文件。

## [1.4.0] - 2024-12-16

### Added

- Dependency Updates: Replaced glob and minimatch with fast-glob and ignore for improved file pattern matching and exclusion.
- Standardized single quotes and reordered imports in src/extension.ts.
- Removed should-exclude.ts, now handled by fast-glob and ignore.
- Added a findFiles function for recursive file searching with .gitignore support.
- Updated generateStructure to use findFiles and support options like allowRecursion and respectGitignore.

## [1.3.0] - 2024-08-08

### Added

- Flexible Exclusions: Exclude specific files and folders using glob patterns for more precise control over the generated structure.
- Folders and files are sorted in the original order they came from.
- Added functionality to notify of new version.

## [1.2.2] - 2023-12-26

### Added

- Fix error in shouldExclude function.

## [1.2.1] - 2023-11-16

### Added

- Fix error in README.md.

## [1.2.0] - 2023-11-10

### Added

- Added automatic copy and notification functionality.
  - Generated folder structure content is now automatically wrapped in backticks for proper Markdown code formatting.
  - After generating the structure, the content is automatically copied to the clipboard.
  - A notification is displayed to the user to confirm that the folder structure has been copied to the clipboard.
- These changes improve the usability of the extension, allowing users to quickly paste the structure into their Markdown files without additional steps.

## [1.1.0] - 2023-11-09

### Added

- I add new functionality to have more designs.

## [1.0.1] - 2023-09-20

### Added

- update readme.md.

## [1.0.0] - 2023-09-20

### Added

- the customization option is added so that the user can exclude the files and folders he/she wants.
- add tests.
- update semantic version for production.
- the project structure is improved.

## [0.0.4] - 2023-09-06

### Added

- Change the image in readme.md and update.

## [0.0.3] - 2023-09-05

### Added

- Fix the images and logo in readme.md and include MIT license.

## [Unreleased]

- Initial release.
