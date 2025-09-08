# VS Code测试管理器与Playwright集成配置指南

## 目标
在VS Code中使用测试管理器(Test Explorer)运行和调试Playwright测试，实现可视化测试管理。

---

## 前置条件

- VS Code已安装
- Node.js 16+环境
- Playwright Test扩展 (ms-playwright.playwright)

---

## 第1步：项目初始化

### 1.1 创建项目结构
```bash
mkdir playwright-vscode-demo
cd playwright-vscode-demo
npm init -y
```

### 1.2 安装Playwright
```bash
# 安装Playwright测试框架
npm create playwright@latest

# 或手动安装
npm install -D @playwright/test
npx playwright install
```

---

## 第2步：Playwright配置文件

创建 `playwright.config.js`：

```javascript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // 测试目录
  testDir: './tests',
  
  // 全局超时设置
  timeout: 30000,
  expect: {
    timeout: 5000
  },
  
  // 并行执行配置
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  // 报告器配置
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }]
  ],
  
  // 全局设置
  use: {
    baseURL: 'https://www.ctrip.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },

  // 浏览器项目配置
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
    // 移动端测试
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],

  // 开发服务器配置
  webServer: {
    command: 'npm run start',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
});
```

---

## 第3步：VS Code工作区配置

### 3.1 创建 `.vscode/settings.json`
```json
{
  "playwright.reuseBrowser": true,
  "playwright.showTrace": true,
  "files.associations": {
    "*.spec.js": "javascript",
    "*.spec.ts": "typescript"
  },
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### 3.2 创建 `.vscode/launch.json` (调试配置)
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Playwright Tests",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/playwright",
      "args": ["test", "--debug"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    },
    {
      "name": "Debug Current Test",
      "type": "node", 
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/playwright",
      "args": ["test", "${relativeFile}", "--debug"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

### 3.3 创建 `.vscode/tasks.json`
```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "运行所有测试",
      "type": "shell",
      "command": "npx playwright test",
      "group": "test",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      }
    },
    {
      "label": "显示测试报告",
      "type": "shell", 
      "command": "npx playwright show-report",
      "group": "test"
    },
    {
      "label": "录制新测试",
      "type": "shell",
      "command": "npx playwright codegen",
      "group": "test"
    }
  ]
}
```

---

## 第4步：创建测试示例

### 4.1 基础测试 `tests/example.spec.js`
```javascript
import { test, expect } from '@playwright/test';

test.describe('携程网测试套件', () => {
  test.beforeEach(async ({ page }) => {
    // 每个测试前的设置
    await page.goto('/');
  });

  test('首页加载测试', async ({ page }) => {
    await expect(page).toHaveTitle(/携程/);
    await expect(page.locator('[data-testid="logo"]')).toBeVisible();
  });

  test('机票搜索功能', async ({ page }) => {
    // 点击机票tab
    await page.click('text=机票');
    
    // 等待页面加载
    await page.waitForLoadState('networkidle');
    
    // 验证页面跳转
    await expect(page).toHaveURL(/flights/);
  });
});
```

### 4.2 页面对象模式 `tests/pages/flight-page.js`
```javascript
export class FlightPage {
  constructor(page) {
    this.page = page;
    this.departureInput = page.locator('[data-testid="departure"]');
    this.arrivalInput = page.locator('[data-testid="arrival"]');
    this.searchButton = page.locator('[data-testid="search-btn"]');
  }

  async searchFlight(departure, arrival) {
    await this.departureInput.fill(departure);
    await this.arrivalInput.fill(arrival);
    await this.searchButton.click();
  }
}
```

---

## 第5步：测试管理器使用指南

### 5.1 启用测试探索器
1. 打开VS Code命令面板 (`Ctrl+Shift+P`)
2. 输入 `Test: Focus on Test Explorer View`
3. 在侧边栏看到测试图标 🧪

### 5.2 测试操作说明

#### 运行测试
- **运行所有测试**: 点击播放按钮 ▶️
- **运行单个测试**: 点击测试名称旁的播放按钮
- **运行测试套件**: 点击文件夹的播放按钮
- **调试测试**: 点击调试按钮 🐛

#### 查看结果
- **通过**: ✅ 绿色对勾
- **失败**: ❌ 红色叉号
- **跳过**: ⚪ 灰色圆点
- **运行中**: 🔄 旋转图标

### 5.3 快捷键
```
Ctrl+Shift+P → Test: Run All Tests
Ctrl+Shift+P → Test: Debug Last Run
Ctrl+Shift+P → Test: Show Output
```

---

## 第6步：高级功能配置

### 6.1 测试录制
```bash
# 录制新测试
npx playwright codegen https://www.ctrip.com

# 录制特定浏览器
npx playwright codegen --browser=firefox https://www.ctrip.com
```

### 6.2 自动化配置 `package.json`
```json
{
  "scripts": {
    "test": "playwright test",
    "test:debug": "playwright test --debug", 
    "test:ui": "playwright test --ui",
    "test:report": "playwright show-report",
    "test:headed": "playwright test --headed"
  }
}
```

### 6.3 CI/CD集成 `.github/workflows/playwright.yml`
```yaml
name: Playwright Tests
on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]
jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: 18
    - name: Install dependencies
      run: npm ci
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps
    - name: Run Playwright tests
      run: npm run test
    - uses: actions/upload-artifact@v3
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
```

---

## 第7步：故障排除

### 7.1 常见问题

**Q: 测试探索器不显示测试？**
A: 检查以下项目：
- `playwright.config.js` 是否存在
- 测试文件是否在正确目录
- 重新加载窗口: `Ctrl+Shift+P` → `Developer: Reload Window`

**Q: 调试断点不生效？**
A: 确保：
- 使用 `--debug` 参数
- 在测试代码中设置断点
- 选择正确的调试配置

**Q: 测试运行慢？**
A: 优化配置：
- 减少并行worker数量
- 使用 `--headed` 模式调试
- 检查网络延迟

### 7.2 性能优化
```javascript
// playwright.config.js 性能配置
export default defineConfig({
  workers: process.env.CI ? 1 : 3, // 限制并行数
  use: {
    trace: 'retain-on-failure', // 仅失败时记录
    video: 'retain-on-failure', // 仅失败时录制
  }
});
```

---

## 完成验证

✅ 测试探索器显示所有测试  
✅ 可以运行/调试单个测试  
✅ 测试结果实时显示  
✅ 支持断点调试  
✅ 生成测试报告  

---

## 最佳实践

1. **组织测试**: 按功能模块创建测试文件
2. **命名规范**: 使用描述性的测试名称
3. **页面对象**: 复用页面元素定位器
4. **数据驱动**: 使用测试数据分离
5. **并行执行**: 合理配置worker数量
6. **报告分析**: 定期查看测试报告和趋势

通过这个配置，您就可以在VS Code中高效地管理和运行Playwright测试了！
