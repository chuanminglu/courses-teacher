# 演练7简化版 - VS Code中的Playwright快速上手

## 演练目标

在10分钟内使用VS Code的Playwright Test扩展完成票务系统的基础自动化测试

## 前置条件

1. VS Code已安装
2. 已安装Playwright Test扩展
3. Node.js环境（14+）

---

## 第1步：快速项目初始化（2分钟）

### 1.1 创建项目文件夹

```bash
mkdir ticket-test-demo
cd ticket-test-demo
```

### 1.2 初始化项目

```bash
# 初始化npm项目
npm init -y

# 使用VS Code打开项目
code .
```

### 1.3 安装Playwright（VS Code中操作）

**方法1：使用VS Code扩展（推荐）**
1. 按 `Ctrl+Shift+X` 打开扩展面板
2. 搜索 `Playwright Test for VSCode`
3. 点击安装（Microsoft官方扩展）
4. 安装完成后，按 `Ctrl+Shift+P` 打开命令面板
5. 输入 `Test: Install Playwright`
6. 选择配置选项：
   - ✅ JavaScript 
   - ✅ Add a GitHub Actions workflow
   - ✅ Install Playwright browsers

**方法2：命令行安装**
```bash
npm init playwright@latest
```

等待安装完成（约1-2分钟）

---

## 第2步：创建简单的测试页面对象（3分钟）

### 2.1 创建页面对象文件

创建 `tests/pages/ticketPage.js`：

```javascript
// tests/pages/ticketPage.js
export class TicketPage {
  constructor(page) {
    this.page = page;
    
    // 简化的页面元素
    this.searchForm = page.locator('[data-testid="search-form"]');
    this.fromCity = page.locator('#from-city');
    this.toCity = page.locator('#to-city');
    this.searchButton = page.locator('button:has-text("搜索")');
    this.results = page.locator('.search-results');
  }

  // 导航到首页
  async goto() {
    await this.page.goto('https://www.example-airline.com');
  }

  // 搜索航班
  async searchFlight(from, to) {
    await this.fromCity.fill(from);
    await this.toCity.fill(to);
    await this.searchButton.click();
  }

  // 验证搜索结果
  async verifyResults() {
    await this.results.waitFor();
    return await this.results.isVisible();
  }

  // 使用fetch获取航班数据
  async getFlightDataViaAPI(from, to, date) {
    const response = await this.page.evaluate(async ([fromCity, toCity, flightDate]) => {
      const apiUrl = `https://api.example-airline.com/flights/search`;
      const requestBody = {
        from: fromCity,
        to: toCity,
        date: flightDate
      };

      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('API调用失败:', error);
        return null;
      }
    }, [from, to, date]);

    return response;
  }

  // 验证API响应数据
  async validateAPIResponse(apiData) {
    if (!apiData || !apiData.flights) {
      return false;
    }
    
    return apiData.flights.length > 0;
  }
}
```

### 2.2 创建测试数据文件

创建 `tests/data/testData.js`：

```javascript
// tests/data/testData.js
export const testData = {
  cities: {
    beijing: '北京',
    shanghai: '上海',
    guangzhou: '广州'
  },
  
  searchScenarios: [
    { from: '北京', to: '上海', name: '京沪线' },
    { from: '北京', to: '广州', name: '京广线' },
    { from: '上海', to: '广州', name: '沪广线' }
  ],

  // API测试数据
  apiEndpoints: {
    search: 'https://api.example-airline.com/flights/search',
    login: 'https://api.example-airline.com/auth/login',
    booking: 'https://api.example-airline.com/bookings'
  },

  // 测试用户凭据
  testUser: {
    email: 'test@example.com',
    password: 'Test123!@#'
  }
};
```

---

## 第3步：编写基础测试用例（3分钟）

### 3.1 创建主要测试文件

创建 `tests/ticket-search.spec.js`：

```javascript
// tests/ticket-search.spec.js
import { test, expect } from '@playwright/test';
import { TicketPage } from './pages/ticketPage.js';
import { testData } from './data/testData.js';

test.describe('机票搜索功能', () => {
  let ticketPage;

  test.beforeEach(async ({ page }) => {
    ticketPage = new TicketPage(page);
    await ticketPage.goto();
  });

  test('基础搜索功能', async ({ page }) => {
    // 执行搜索
    await ticketPage.searchFlight('北京', '上海');
    
    // 验证结果
    const hasResults = await ticketPage.verifyResults();
    expect(hasResults).toBe(true);
    
    // 截图保存
    await page.screenshot({ path: 'screenshots/search-results.png' });
  });

  test('API数据验证测试', async ({ page }) => {
    // 使用fetch获取API数据
    const today = new Date().toISOString().split('T')[0];
    const apiData = await ticketPage.getFlightDataViaAPI('北京', '上海', today);
    
    // 验证API响应
    const isValidResponse = await ticketPage.validateAPIResponse(apiData);
    expect(isValidResponse).toBe(true);
    
    console.log('API返回的航班数量:', apiData?.flights?.length || 0);
  });

  test('前端与API数据一致性验证', async ({ page }) => {
    const today = new Date().toISOString().split('T')[0];
    
    // 1. 获取API数据
    const apiData = await ticketPage.getFlightDataViaAPI('北京', '上海', today);
    
    // 2. 执行前端搜索
    await ticketPage.searchFlight('北京', '上海');
    await ticketPage.verifyResults();
    
    // 3. 比较前端显示的结果数量与API返回的数量
    const frontendResults = await page.locator('.flight-item').count();
    const apiResults = apiData?.flights?.length || 0;
    
    console.log(`前端显示: ${frontendResults} 个航班, API返回: ${apiResults} 个航班`);
    
    // 验证数据一致性（允许一定误差）
    expect(Math.abs(frontendResults - apiResults)).toBeLessThanOrEqual(2);
  });

  test('多个搜索场景', async ({ page }) => {
    for (const scenario of testData.searchScenarios) {
      console.log(`测试场景: ${scenario.name}`);
  
      await ticketPage.searchFlight(scenario.from, scenario.to);
  
      // 验证每个搜索都有结果
      const hasResults = await ticketPage.verifyResults();
      expect(hasResults).toBe(true);
  
      // 返回首页准备下一次搜索
      await ticketPage.goto();
    }
  });

  test('搜索表单验证', async ({ page }) => {
    // 不填写城市直接搜索
    await ticketPage.searchButton.click();
  
    // 验证错误提示（这里需要根据实际页面调整）
    const errorMessage = page.locator('.error-message');
    await expect(errorMessage).toBeVisible();
  });
});
```

### 3.2 创建API测试文件

创建 `tests/api.spec.js`：

```javascript
// tests/api.spec.js
import { test, expect } from '@playwright/test';
import { testData } from './data/testData.js';

test.describe('API接口测试', () => {
  test('使用fetch测试登录API', async ({ page }) => {
    const loginResult = await page.evaluate(async (userData) => {
      try {
        const response = await fetch('https://api.example-airline.com/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: userData.email,
            password: userData.password
          })
        });

        const data = await response.json();
        return {
          status: response.status,
          ok: response.ok,
          data: data
        };
      } catch (error) {
        return {
          error: error.message
        };
      }
    }, testData.testUser);

    // 验证API响应
    expect(loginResult.status).toBe(200);
    expect(loginResult.ok).toBe(true);
    expect(loginResult.data).toHaveProperty('token');
  });

  test('测试航班搜索API', async ({ page }) => {
    const searchResult = await page.evaluate(async () => {
      try {
        const response = await fetch('https://api.example-airline.com/flights/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: '北京',
            to: '上海',
            date: new Date().toISOString().split('T')[0]
          })
        });

        const data = await response.json();
        return {
          status: response.status,
          ok: response.ok,
          flightCount: data.flights ? data.flights.length : 0
        };
      } catch (error) {
        return {
          error: error.message
        };
      }
    });

    // 验证搜索结果
    expect(searchResult.status).toBe(200);
    expect(searchResult.flightCount).toBeGreaterThan(0);
  });
});
```

### 3.3 创建简单的登录测试

创建 `tests/login.spec.js`：

```javascript
// tests/login.spec.js
import { test, expect } from '@playwright/test';

test.describe('用户登录', () => {
  test('登录页面基本元素检查', async ({ page }) => {
    await page.goto('https://www.example-airline.com/login');
  
    // 检查登录表单元素
    await expect(page.locator('#username')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('button:has-text("登录")')).toBeVisible();
  });

  test('登录功能测试', async ({ page }) => {
    await page.goto('https://www.example-airline.com/login');
  
    // 填写登录信息
    await page.fill('#username', 'test@example.com');
    await page.fill('#password', 'password123');
  
    // 点击登录
    await page.click('button:has-text("登录")');
  
    // 验证跳转（需要根据实际情况调整）
    await expect(page).toHaveURL(/.*dashboard.*/);
  });
});
```

---

## 第4步：在VS Code中运行测试（2分钟）

### 4.1 使用VS Code Playwright扩展运行

1. 在VS Code左侧面板找到 **测试资源管理器** 图标（Testing图标）
2. 如果没看到测试，点击 **刷新测试** 按钮
3. 展开测试树，看到刚创建的测试文件
4. 点击测试旁边的 ▶️ 按钮运行单个测试
5. 点击文件夹旁边的 ▶️ 运行所有测试
6. 右键点击测试可以选择：
   - `Run Test` - 运行测试
   - `Debug Test` - 调试模式运行
   - `Run Test in Browser` - 在浏览器中运行

**VS Code快捷键:**
- `Ctrl+Shift+P` → `Test: Run All Tests` - 运行所有测试
- `Ctrl+Shift+P` → `Test: Debug All Tests` - 调试所有测试

### 4.2 使用命令行运行

```bash
# 运行所有测试
npx playwright test

# 运行特定测试文件
npx playwright test tests/login.spec.js

# 以headed模式运行（显示浏览器）
npx playwright test --headed

# 运行并生成报告
npx playwright test --reporter=html
```

### 4.3 查看测试结果

1. 在VS Code的Testing面板查看结果
2. 点击失败的测试查看详细信息
3. 查看生成的截图：`test-results/` 文件夹

---

## 第5步：快速优化和调试技巧（可选）

### 5.1 使用调试模式

```bash
# 调试模式运行，会暂停在每一步
npx playwright test --debug
```

### 5.2 录制测试脚本

```bash
# 使用录制器生成测试代码
npx playwright codegen https://www.example-airline.com
```

### 5.3 VS Code中的快捷操作

**调试和运行:**
- `F5` - 调试当前测试
- `Ctrl+F5` - 运行当前测试（不调试）
- `Ctrl+Shift+P` → `Playwright` 查看所有可用命令

**常用Playwright命令:**
- `Test: Install Playwright` - 安装Playwright
- `Test: Record New Test` - 录制新测试
- `Test: Show Trace Viewer` - 查看测试轨迹
- `Test: Clear All Results` - 清除测试结果

**右键菜单操作:**
- 右键点击测试 → `Debug Test` 进入调试模式
- 右键点击测试 → `Reveal in Test Explorer` 在资源管理器中显示
- 右键点击测试文件 → `Record at Cursor` 从光标位置开始录制

---

## 项目结构总览

```
ticket-test-demo/
├── tests/
│   ├── pages/
│   │   └── ticketPage.js        # 页面对象（含fetch API）
│   ├── data/
│   │   └── testData.js          # 测试数据（含API配置）
│   ├── api.spec.js              # API接口测试
│   ├── login.spec.js            # 登录测试
│   └── ticket-search.spec.js    # 搜索测试
├── test-results/                # 测试结果和截图
├── playwright.config.js         # Playwright配置
└── package.json
```

---

## 快速验证清单

完成后检查以下项目：

- [ ] ✅ 项目结构创建完成
- [ ] ✅ Playwright扩展安装成功
- [ ] ✅ 页面对象类创建完成（包含fetch API）
- [ ] ✅ 测试用例编写完成（UI + API测试）
- [ ] ✅ 在VS Code中成功运行测试
- [ ] ✅ 可以查看测试结果和截图
- [ ] ✅ 理解基本的测试结构
- [ ] ✅ 验证fetch API调用成功
- [ ] ✅ 前端与后端数据一致性验证通过

---

## 扩展学习方向

### 即时可以尝试的：

1. **修改测试目标网站**：将示例网站改为真实的航空公司网站
2. **添加更多断言**：验证页面标题、元素文本等
3. **使用不同浏览器**：在配置中启用Firefox、Safari测试
4. **添加等待机制**：使用 `page.waitForSelector()` 等待元素
5. **扩展fetch使用**：添加PUT、DELETE等HTTP方法测试
6. **API错误处理**：测试网络异常、超时等场景

### 进阶学习：

1. **完整API测试套件**：使用Playwright的request API进行接口测试
2. **移动端测试**：配置移动设备模拟
3. **CI/CD集成**：使用生成的GitHub Actions配置
4. **视觉测试**：使用screenshot比较功能
5. **性能测试**：结合fetch API监控接口响应时间
6. **Mock API**：使用page.route()拦截和模拟API请求

---

## 常见问题和解决方案

### Q: 测试运行失败怎么办？
A: 
1. 检查网站URL是否可访问
2. 修改选择器以匹配实际页面元素
3. 增加等待时间：`await page.waitForTimeout(1000)`

### Q: 找不到页面元素？
A: 
1. 使用浏览器开发者工具检查元素
2. 尝试不同的选择器策略：`text=`, `css=`, `xpath=`
3. 使用 `page.locator().first()` 选择第一个匹配元素

### Q: fetch API调用失败？
A:
1. 检查API端点URL是否正确
2. 验证请求头设置（Content-Type等）
3. 使用try-catch处理网络异常
4. 检查CORS设置和认证要求

### Q: VS Code中看不到测试？
A:
1. 确保已安装 `Playwright Test for VSCode` 扩展
2. 检查测试文件命名是否正确（*.spec.js）
3. 点击测试资源管理器中的"刷新"按钮
4. 重启VS Code

### Q: 如何提高测试稳定性？
A:
1. 使用 `waitFor()` 等待元素出现
2. 添加重试机制
3. 使用更稳定的选择器（data-testid优于class）
4. 对API调用添加超时和错误处理

### Q: 如何调试fetch API问题？
A:
1. 在浏览器开发者工具Network面板查看实际请求
2. 使用console.log输出API响应数据
3. 检查网络状态码和响应格式
4. 验证请求参数是否正确

通过这个简化版演练，学员可以在10分钟内快速上手Playwright自动化测试，建立基础概念，掌握fetch API使用，为后续深入学习打下基础。
