# VS Code Playwright插件安装指南

## 📋 系统要求检查

### VS Code最新版本要求
- **VS Code版本**: 1.74.0 或更高版本（推荐最新稳定版）
- **操作系统支持**:
  - Windows 10/11 (64位)
  - macOS (最新版本及前两个版本)
  - Linux Ubuntu 20.04+, RHEL 8+, Fedora 36+

### Playwright插件要求
- **Playwright版本**: v1.38+ 或更新版本
- **Node.js**: 16.0+ 或更高版本
- **内存要求**: 至少1GB RAM
- **磁盘空间**: 约500MB（包含浏览器）

## 🚀 安装步骤

### 方法1: 通过VS Code扩展商店安装（推荐）

1. **打开VS Code**
2. **进入扩展页面**:
   - 按 `Ctrl+Shift+X` (Windows/Linux)
   - 按 `Cmd+Shift+X` (macOS)
   - 或点击左侧活动栏的扩展图标

3. **搜索Playwright**:
   - 在搜索框输入: `ms-playwright.playwright`
   - 找到 "Playwright Test for VS Code" (发布者: Microsoft)

4. **安装插件**:
   - 点击 "Install" 按钮
   - 等待安装完成

### 方法2: 通过命令面板安装

1. **打开命令面板**:
   - 按 `Ctrl+P` (Windows/Linux)
   - 按 `Cmd+P` (macOS)

2. **输入安装命令**:
   ```
   ext install ms-playwright.playwright
   ```

3. **按回车执行安装**

### 方法3: 通过VS Code CLI安装

```bash
code --install-extension ms-playwright.playwright
```

## ⚙️ 初始化Playwright项目

### 如果您还没有Playwright项目

1. **打开命令面板** (`Ctrl+Shift+P` / `Cmd+Shift+P`)

2. **运行初始化命令**:
   ```
   > Playwright: Install Playwright
   ```

3. **选择配置选项**:
   - 选择测试语言 (TypeScript/JavaScript)
   - 选择浏览器 (Chromium, Firefox, Safari)
   - 是否添加GitHub Actions
   - 是否安装示例测试

### 如果您已有项目但没有Playwright

1. **在项目根目录运行**:
   ```bash
   npm init playwright@latest
   ```

2. **或使用yarn**:
   ```bash
   yarn create playwright
   ```

## 🛠️ 插件功能验证

### 1. 检查插件是否正确加载

- 在VS Code中打开包含Playwright配置的项目
- 检查左侧活动栏是否出现 "测试" 图标 (🧪)
- 打开测试面板，应该能看到Playwright测试

### 2. 验证核心功能

#### ✅ 运行测试
- 点击测试旁边的 ▷ 绿色三角按钮
- 或右键选择 "Run Test"

#### ✅ 调试测试
- 在测试行设置断点
- 右键选择 "Debug Test"

#### ✅ 录制测试
- 命令面板: `> Playwright: Record New Test`
- 在浏览器中操作，自动生成测试代码

#### ✅ 选择器工具
- 点击 "Pick Locator" 按钮
- 在浏览器中选择元素，获取选择器

## 🔧 常见配置

### 1. Playwright配置文件示例

```javascript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://127.0.0.1:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
```

### 2. VS Code设置优化

在 `.vscode/settings.json` 中添加:

```json
{
  "playwright.testDir": "./tests",
  "playwright.showTrace": true,
  "playwright.reuseBrowser": true,
  "testing.automaticallyOpenPeekView": "never"
}
```

## 🎯 最佳实践

### 1. 项目结构推荐

```
project/
├── tests/
│   ├── example.spec.ts
│   └── utils/
├── playwright.config.ts
├── package.json
└── .vscode/
    └── settings.json
```

### 2. 推荐的VS Code扩展组合

- **Playwright Test for VS Code** (必需)
- **TypeScript Importer** (TS项目推荐)
- **Error Lens** (错误提示增强)
- **GitLens** (Git集成)

### 3. 性能优化建议

- 启用 `reuseBrowser` 选项加快测试速度
- 使用 `fullyParallel: true` 并行运行测试
- 配置合适的 `workers` 数量

## 🚨 故障排除

### 常见问题及解决方案

#### 1. 插件无法识别测试文件
**解决方案**:
- 确保 `playwright.config.ts` 文件存在
- 检查 `testDir` 配置是否正确
- 重启VS Code

#### 2. 浏览器启动失败
**解决方案**:
```bash
# 重新安装浏览器
npx playwright install
```

#### 3. 测试运行缓慢
**解决方案**:
- 检查系统资源使用情况
- 减少并行worker数量
- 启用browser复用

#### 4. 扩展版本兼容性
**解决方案**:
- 更新VS Code到最新版本
- 更新Playwright到v1.38+
- 重新安装扩展

## 📚 相关资源

- [Playwright官方文档](https://playwright.dev/)
- [VS Code测试API文档](https://code.visualstudio.com/docs/editor/testing)
- [Playwright VS Code扩展GitHub仓库](https://github.com/microsoft/playwright-vscode)

## 🔄 版本更新建议

- **定期检查更新**: VS Code会自动提示扩展更新
- **更新命令**:
  ```bash
  npm update @playwright/test
  npx playwright install
  ```
- **版本兼容性**: 始终保持Playwright和VS Code扩展同步更新

---

## ✅ 安装验证清单

- [ ] VS Code版本 ≥ 1.74.0
- [ ] Node.js版本 ≥ 16.0
- [ ] Playwright扩展已安装并启用
- [ ] Playwright项目已初始化
- [ ] 测试面板显示测试文件
- [ ] 能够成功运行测试
- [ ] 录制功能正常工作
- [ ] 调试功能可用

**安装完成后，您就可以享受强大的Playwright测试体验了！** 🎉
