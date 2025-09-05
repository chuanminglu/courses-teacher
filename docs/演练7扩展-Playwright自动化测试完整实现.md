# 演练7扩展 - Playwright自动化测试脚本完整实现

## 第二阶段步骤4：基础自动化脚本生成完整流程

### 实现目标

基于AI生成的测试用例，使用Playwright框架实现票务系统的端到端自动化测试，包括完整的Page Object模式、数据驱动测试、以及智能化的错误处理机制。

---

## 1. 项目初始化和环境配置

### 1.1 创建项目结构

```bash
# 创建项目目录
mkdir ticket-system-test
cd ticket-system-test

# 初始化npm项目
npm init -y

# 安装Playwright和相关依赖
npm install -D @playwright/test playwright
npm install -D allure-playwright allure-commandline
npm install -D dotenv faker
npm install -D winston

# 初始化Playwright配置
npx playwright install
```

### 1.2 项目目录结构

```
ticket-system-test/
├── tests/
│   ├── pages/                 # Page Object模式页面类
│   ├── fixtures/              # 测试数据和fixture
│   ├── helpers/               # 工具函数
│   ├── specs/                 # 测试用例
│   └── config/                # 配置文件
├── test-results/              # 测试结果
├── reports/                   # 测试报告
├── screenshots/               # 截图
├── videos/                    # 视频录制
├── playwright.config.js       # Playwright配置
├── package.json
└── .env                       # 环境变量
```

### 1.3 Playwright配置文件

**playwright.config.js**

```javascript
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  // 测试目录
  testDir: './tests/specs',
  
  // 全局超时设置
  timeout: 60000,
  expect: {
    timeout: 10000
  },
  
  // 失败重试次数
  retries: process.env.CI ? 2 : 1,
  
  // 并行执行worker数量
  workers: process.env.CI ? 2 : 4,
  
  // 测试输出配置
  reporter: [
    ['html', { outputFolder: 'reports/html' }],
    ['junit', { outputFile: 'reports/junit.xml' }],
    ['allure-playwright', { outputFolder: 'reports/allure-results' }],
    ['line'],
    ['json', { outputFile: 'reports/test-results.json' }]
  ],
  
  // 全局设置
  use: {
    // 基础URL
    baseURL: process.env.BASE_URL || 'https://ticket.example.com',
    
    // 浏览器设置
    headless: process.env.HEADLESS !== 'false',
    viewport: { width: 1280, height: 720 },
    
    // 截图和视频
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    
    // 网络和性能
    actionTimeout: 10000,
    navigationTimeout: 30000,
    
    // 其他设置
    locale: 'zh-CN',
    timezoneId: 'Asia/Shanghai',
    
    // 追踪
    trace: 'retain-on-failure'
  },

  // 多浏览器配置
  projects: [
    {
      name: 'Desktop Chrome',
      use: { 
        ...devices['Desktop Chrome'],
        channel: 'chrome'
      },
    },
    {
      name: 'Desktop Firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'Desktop Safari',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  // 全局setup和teardown
  globalSetup: require.resolve('./tests/config/global-setup.js'),
  globalTeardown: require.resolve('./tests/config/global-teardown.js'),

  // Web Server配置（如果需要启动本地服务）
  webServer: process.env.START_SERVER ? {
    command: 'npm run start:test',
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 120000
  } : undefined,
});
```

---

## 2. Page Object模式实现

### 2.1 基础页面类

**tests/pages/BasePage.js**

```javascript
import { expect } from '@playwright/test';
import { Logger } from '../helpers/logger.js';

export class BasePage {
  constructor(page) {
    this.page = page;
    this.logger = new Logger('BasePage');
  }

  // 通用等待方法
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
    this.logger.info('Page loaded successfully');
  }

  // 智能等待元素
  async waitForElement(selector, options = {}) {
    const defaultOptions = { 
      timeout: 10000, 
      state: 'visible',
      ...options 
    };
    
    try {
      await this.page.waitForSelector(selector, defaultOptions);
      this.logger.info(`Element found: ${selector}`);
      return true;
    } catch (error) {
      this.logger.error(`Element not found: ${selector}`, error);
      return false;
    }
  }

  // 智能点击（重试机制）
  async smartClick(selector, options = {}) {
    const maxRetries = 3;
    let attempts = 0;

    while (attempts < maxRetries) {
      try {
        await this.page.locator(selector).click(options);
        this.logger.info(`Successfully clicked: ${selector}`);
        return true;
      } catch (error) {
        attempts++;
        this.logger.warn(`Click attempt ${attempts} failed for ${selector}: ${error.message}`);
        
        if (attempts < maxRetries) {
          await this.page.waitForTimeout(1000);
        }
      }
    }
    
    throw new Error(`Failed to click ${selector} after ${maxRetries} attempts`);
  }

  // 智能输入
  async smartFill(selector, text, options = {}) {
    try {
      // 清空输入框
      await this.page.locator(selector).clear();
      // 输入文本
      await this.page.locator(selector).fill(text, options);
      // 验证输入
      const inputValue = await this.page.locator(selector).inputValue();
      expect(inputValue).toBe(text);
      
      this.logger.info(`Successfully filled ${selector} with: ${text}`);
    } catch (error) {
      this.logger.error(`Failed to fill ${selector}`, error);
      throw error;
    }
  }

  // 截图方法
  async takeScreenshot(name) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const screenshotPath = `screenshots/${name}_${timestamp}.png`;
    await this.page.screenshot({ path: screenshotPath, fullPage: true });
    this.logger.info(`Screenshot saved: ${screenshotPath}`);
    return screenshotPath;
  }

  // 页面断言
  async assertPageTitle(expectedTitle) {
    const actualTitle = await this.page.title();
    expect(actualTitle).toContain(expectedTitle);
    this.logger.info(`Page title verified: ${actualTitle}`);
  }

  // URL断言
  async assertCurrentUrl(expectedUrl) {
    const currentUrl = this.page.url();
    expect(currentUrl).toContain(expectedUrl);
    this.logger.info(`URL verified: ${currentUrl}`);
  }
}
```

### 2.2 登录页面类

**tests/pages/LoginPage.js**

```javascript
import { BasePage } from './BasePage.js';
import { expect } from '@playwright/test';

export class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    
    // 页面元素定位器
    this.selectors = {
      usernameInput: '[data-testid="username-input"]',
      passwordInput: '[data-testid="password-input"]',
      loginButton: '[data-testid="login-button"]',
      errorMessage: '[data-testid="error-message"]',
      forgotPasswordLink: '[data-testid="forgot-password"]',
      registerLink: '[data-testid="register-link"]',
      rememberMeCheckbox: '[data-testid="remember-me"]',
      captchaImage: '[data-testid="captcha-image"]',
      captchaInput: '[data-testid="captcha-input"]'
    };
  }

  // 导航到登录页面
  async goto() {
    await this.page.goto('/login');
    await this.waitForPageLoad();
    await this.assertPageTitle('用户登录');
  }

  // 执行登录
  async login(username, password, options = {}) {
    this.logger.info(`Attempting login with username: ${username}`);
    
    try {
      // 填写用户名
      await this.smartFill(this.selectors.usernameInput, username);
      
      // 填写密码
      await this.smartFill(this.selectors.passwordInput, password);
      
      // 处理验证码（如果存在）
      if (options.captcha) {
        await this.handleCaptcha(options.captcha);
      }
      
      // 处理记住我选项
      if (options.rememberMe) {
        await this.smartClick(this.selectors.rememberMeCheckbox);
      }
      
      // 点击登录按钮
      await this.smartClick(this.selectors.loginButton);
      
      // 等待登录结果
      await this.waitForLoginResult();
      
      this.logger.info('Login completed successfully');
    } catch (error) {
      await this.takeScreenshot('login_failed');
      throw error;
    }
  }

  // 处理验证码
  async handleCaptcha(captchaText) {
    const captchaExists = await this.waitForElement(this.selectors.captchaInput, { timeout: 5000 });
    if (captchaExists) {
      await this.smartFill(this.selectors.captchaInput, captchaText);
      this.logger.info('Captcha filled');
    }
  }

  // 等待登录结果
  async waitForLoginResult() {
    // 等待页面跳转或错误消息出现
    await Promise.race([
      this.page.waitForURL('**/dashboard', { timeout: 10000 }),
      this.page.waitForSelector(this.selectors.errorMessage, { timeout: 10000 })
    ]);
  }

  // 验证登录成功
  async assertLoginSuccess() {
    await this.assertCurrentUrl('/dashboard');
    // 可以添加更多成功登录的验证
    const userMenu = await this.page.locator('[data-testid="user-menu"]').isVisible();
    expect(userMenu).toBe(true);
    this.logger.info('Login success verified');
  }

  // 验证登录失败
  async assertLoginError(expectedErrorMessage) {
    const errorElement = this.page.locator(this.selectors.errorMessage);
    await expect(errorElement).toBeVisible();
    
    if (expectedErrorMessage) {
      await expect(errorElement).toContainText(expectedErrorMessage);
    }
    
    this.logger.info('Login error verified');
  }

  // 点击忘记密码
  async clickForgotPassword() {
    await this.smartClick(this.selectors.forgotPasswordLink);
    await this.assertCurrentUrl('/forgot-password');
  }

  // 点击注册链接
  async clickRegister() {
    await this.smartClick(this.selectors.registerLink);
    await this.assertCurrentUrl('/register');
  }
}
```

### 2.3 搜索页面类

**tests/pages/SearchPage.js**

```javascript
import { BasePage } from './BasePage.js';
import { expect } from '@playwright/test';

export class SearchPage extends BasePage {
  constructor(page) {
    super(page);
    
    this.selectors = {
      fromCitySelect: '[data-testid="from-city-select"]',
      toCitySelect: '[data-testid="to-city-select"]',
      departureDatePicker: '[data-testid="departure-date"]',
      returnDatePicker: '[data-testid="return-date"]',
      passengerCountSelect: '[data-testid="passenger-count"]',
      adultCountInput: '[data-testid="adult-count"]',
      childCountInput: '[data-testid="child-count"]',
      infantCountInput: '[data-testid="infant-count"]',
      cabinClassSelect: '[data-testid="cabin-class"]',
      searchButton: '[data-testid="search-button"]',
      swapCitiesButton: '[data-testid="swap-cities"]',
      oneWayRadio: '[data-testid="one-way"]',
      roundTripRadio: '[data-testid="round-trip"]',
      loadingIndicator: '[data-testid="loading"]',
      searchForm: '[data-testid="search-form"]'
    };
  }

  // 导航到搜索页面
  async goto() {
    await this.page.goto('/search');
    await this.waitForPageLoad();
    await this.assertPageTitle('机票搜索');
  }

  // 搜索航班
  async searchFlights(searchData) {
    this.logger.info('Starting flight search', searchData);
    
    try {
      // 选择行程类型
      await this.selectTripType(searchData.tripType);
      
      // 选择出发城市
      await this.selectCity(this.selectors.fromCitySelect, searchData.fromCity);
      
      // 选择目的地城市
      await this.selectCity(this.selectors.toCitySelect, searchData.toCity);
      
      // 选择出发日期
      await this.selectDate(this.selectors.departureDatePicker, searchData.departureDate);
      
      // 选择返程日期（如果是往返）
      if (searchData.tripType === 'roundTrip' && searchData.returnDate) {
        await this.selectDate(this.selectors.returnDatePicker, searchData.returnDate);
      }
      
      // 选择乘客数量
      await this.selectPassengers(searchData.passengers);
      
      // 选择舱位等级
      await this.selectCabinClass(searchData.cabinClass);
      
      // 点击搜索按钮
      await this.smartClick(this.selectors.searchButton);
      
      // 等待搜索结果
      await this.waitForSearchResults();
      
      this.logger.info('Flight search completed successfully');
    } catch (error) {
      await this.takeScreenshot('search_failed');
      throw error;
    }
  }

  // 选择行程类型
  async selectTripType(tripType) {
    const selector = tripType === 'roundTrip' ? 
      this.selectors.roundTripRadio : 
      this.selectors.oneWayRadio;
    
    await this.smartClick(selector);
    this.logger.info(`Trip type selected: ${tripType}`);
  }

  // 选择城市
  async selectCity(selector, cityCode) {
    // 点击下拉框
    await this.smartClick(selector);
    
    // 等待下拉选项加载
    await this.page.waitForSelector(`[data-value="${cityCode}"]`);
    
    // 选择城市
    await this.smartClick(`[data-value="${cityCode}"]`);
    
    this.logger.info(`City selected: ${cityCode}`);
  }

  // 选择日期
  async selectDate(selector, date) {
    await this.smartClick(selector);
    
    // 假设日期选择器使用标准格式
    const dateString = this.formatDate(date);
    await this.smartFill(selector, dateString);
    
    // 点击日期选择器外部关闭
    await this.page.click('body');
    
    this.logger.info(`Date selected: ${dateString}`);
  }

  // 选择乘客数量
  async selectPassengers(passengers) {
    // 点击乘客选择器
    await this.smartClick(this.selectors.passengerCountSelect);
    
    // 设置成人数量
    if (passengers.adults) {
      await this.setPassengerCount(this.selectors.adultCountInput, passengers.adults);
    }
    
    // 设置儿童数量
    if (passengers.children) {
      await this.setPassengerCount(this.selectors.childCountInput, passengers.children);
    }
    
    // 设置婴儿数量
    if (passengers.infants) {
      await this.setPassengerCount(this.selectors.infantCountInput, passengers.infants);
    }
    
    // 确认选择
    await this.page.click('body');
    
    this.logger.info('Passenger count set', passengers);
  }

  // 设置乘客数量
  async setPassengerCount(selector, count) {
    const currentCount = await this.page.locator(selector).inputValue();
    const increment = count - parseInt(currentCount);
    
    if (increment > 0) {
      const plusButton = `${selector}-plus`;
      for (let i = 0; i < increment; i++) {
        await this.smartClick(plusButton);
      }
    } else if (increment < 0) {
      const minusButton = `${selector}-minus`;
      for (let i = 0; i < Math.abs(increment); i++) {
        await this.smartClick(minusButton);
      }
    }
  }

  // 选择舱位等级
  async selectCabinClass(cabinClass) {
    await this.smartClick(this.selectors.cabinClassSelect);
    await this.smartClick(`[data-value="${cabinClass}"]`);
    this.logger.info(`Cabin class selected: ${cabinClass}`);
  }

  // 交换城市
  async swapCities() {
    await this.smartClick(this.selectors.swapCitiesButton);
    this.logger.info('Cities swapped');
  }

  // 等待搜索结果
  async waitForSearchResults() {
    // 等待加载指示器出现
    await this.waitForElement(this.selectors.loadingIndicator, { timeout: 5000 });
    
    // 等待加载指示器消失
    await this.page.waitForSelector(this.selectors.loadingIndicator, { 
      state: 'hidden', 
      timeout: 30000 
    });
    
    // 验证跳转到结果页面
    await this.assertCurrentUrl('/search/results');
    
    this.logger.info('Search results loaded');
  }

  // 验证搜索表单
  async validateSearchForm(searchData) {
    // 验证出发城市
    const fromCity = await this.page.locator(this.selectors.fromCitySelect).textContent();
    expect(fromCity).toContain(searchData.fromCity);
    
    // 验证目的地城市
    const toCity = await this.page.locator(this.selectors.toCitySelect).textContent();
    expect(toCity).toContain(searchData.toCity);
    
    this.logger.info('Search form validated');
  }

  // 格式化日期
  formatDate(date) {
    if (typeof date === 'string') {
      return date;
    }
    return date.toISOString().split('T')[0];
  }
}
```

---

## 3. 测试数据和Fixture

### 3.1 测试数据生成器

**tests/fixtures/testData.js**

```javascript
import { faker } from '@faker-js/faker/locale/zh_CN';

export class TestDataGenerator {
  static generateUser() {
    return {
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: 'Test123!@#',
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      phone: faker.phone.number(),
      idCard: this.generateIdCard(),
      passport: this.generatePassport()
    };
  }

  static generateSearchData() {
    return {
      tripType: faker.helpers.arrayElement(['oneWay', 'roundTrip']),
      fromCity: faker.helpers.arrayElement(['BJS', 'SHA', 'CAN', 'SZX', 'CTU']),
      toCity: faker.helpers.arrayElement(['NYC', 'LON', 'PAR', 'TYO', 'SIN']),
      departureDate: this.generateFutureDate(1, 30),
      returnDate: this.generateFutureDate(7, 60),
      passengers: {
        adults: faker.number.int({ min: 1, max: 4 }),
        children: faker.number.int({ min: 0, max: 2 }),
        infants: faker.number.int({ min: 0, max: 1 })
      },
      cabinClass: faker.helpers.arrayElement(['economy', 'business', 'first'])
    };
  }

  static generateFlightData() {
    return {
      flightNumber: this.generateFlightNumber(),
      airline: faker.helpers.arrayElement(['CA', 'MU', 'CZ', 'HU', 'FM']),
      aircraft: faker.helpers.arrayElement(['A320', 'A330', 'B737', 'B777', 'B787']),
      departure: {
        airport: faker.helpers.arrayElement(['PEK', 'PVG', 'CAN', 'SZX']),
        time: this.generateFutureDateTime(),
        terminal: faker.helpers.arrayElement(['T1', 'T2', 'T3'])
      },
      arrival: {
        airport: faker.helpers.arrayElement(['JFK', 'LHR', 'CDG', 'NRT']),
        time: this.generateFutureDateTime(),
        terminal: faker.helpers.arrayElement(['T1', 'T2', 'T3'])
      },
      price: {
        base: faker.number.int({ min: 2000, max: 15000 }),
        tax: faker.number.int({ min: 200, max: 800 }),
        total: 0
      },
      seats: {
        economy: faker.number.int({ min: 10, max: 200 }),
        business: faker.number.int({ min: 0, max: 30 }),
        first: faker.number.int({ min: 0, max: 12 })
      }
    };
  }

  static generatePaymentData() {
    return {
      cardNumber: '4111111111111111', // 测试卡号
      expiryMonth: faker.number.int({ min: 1, max: 12 }).toString().padStart(2, '0'),
      expiryYear: faker.number.int({ min: 2024, max: 2030 }).toString(),
      cvv: faker.number.int({ min: 100, max: 999 }).toString(),
      cardHolder: faker.person.fullName(),
      billingAddress: {
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        zipCode: faker.location.zipCode(),
        country: 'CN'
      }
    };
  }

  // 生成身份证号
  static generateIdCard() {
    const provinces = ['11', '12', '13', '14', '15', '21', '22', '23'];
    const province = faker.helpers.arrayElement(provinces);
    const city = faker.number.int({ min: 10, max: 99 }).toString();
    const district = faker.number.int({ min: 10, max: 99 }).toString();
    const birth = faker.date.birthdate({ min: 18, max: 65, mode: 'age' });
    const birthStr = birth.toISOString().slice(0, 10).replace(/-/g, '');
    const sequence = faker.number.int({ min: 100, max: 999 }).toString();
    const check = faker.number.int({ min: 0, max: 9 }).toString();
    
    return `${province}${city}${district}${birthStr}${sequence}${check}`;
  }

  // 生成护照号
  static generatePassport() {
    const prefix = faker.helpers.arrayElement(['E', 'G', 'P']);
    const number = faker.number.int({ min: 10000000, max: 99999999 }).toString();
    return `${prefix}${number}`;
  }

  // 生成航班号
  static generateFlightNumber() {
    const airline = faker.helpers.arrayElement(['CA', 'MU', 'CZ', 'HU', 'FM']);
    const number = faker.number.int({ min: 1000, max: 9999 }).toString();
    return `${airline}${number}`;
  }

  // 生成未来日期
  static generateFutureDate(minDays, maxDays) {
    const start = new Date();
    start.setDate(start.getDate() + minDays);
    const end = new Date();
    end.setDate(end.getDate() + maxDays);
    return faker.date.between({ from: start, to: end });
  }

  // 生成未来日期时间
  static generateFutureDateTime() {
    const date = this.generateFutureDate(1, 60);
    const hour = faker.number.int({ min: 6, max: 23 });
    const minute = faker.number.int({ min: 0, max: 59 });
    date.setHours(hour, minute, 0, 0);
    return date;
  }

  // 生成测试场景数据集
  static generateTestScenarios() {
    return {
      validLogin: {
        username: 'testuser@example.com',
        password: 'Test123!@#'
      },
      invalidLogin: [
        { username: '', password: 'Test123!@#', error: '请输入用户名' },
        { username: 'testuser@example.com', password: '', error: '请输入密码' },
        { username: 'invalid@example.com', password: 'wrongpass', error: '用户名或密码错误' }
      ],
      searchScenarios: [
        {
          name: '国内单程',
          data: {
            tripType: 'oneWay',
            fromCity: 'BJS',
            toCity: 'SHA',
            departureDate: this.generateFutureDate(1, 7),
            passengers: { adults: 1, children: 0, infants: 0 },
            cabinClass: 'economy'
          }
        },
        {
          name: '国际往返',
          data: {
            tripType: 'roundTrip',
            fromCity: 'BJS',
            toCity: 'NYC',
            departureDate: this.generateFutureDate(7, 30),
            returnDate: this.generateFutureDate(14, 60),
            passengers: { adults: 2, children: 1, infants: 0 },
            cabinClass: 'business'
          }
        }
      ]
    };
  }
}
```

### 3.2 测试Fixture

**tests/fixtures/baseFixture.js**

```javascript
import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { SearchPage } from '../pages/SearchPage.js';
import { TestDataGenerator } from './testData.js';
import { Logger } from '../helpers/logger.js';

// 扩展基础test以包含页面对象和数据
export const test = base.extend({
  // 页面对象
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  searchPage: async ({ page }, use) => {
    const searchPage = new SearchPage(page);
    await use(searchPage);
  },

  // 测试数据
  testData: async ({}, use) => {
    const testData = {
      user: TestDataGenerator.generateUser(),
      search: TestDataGenerator.generateSearchData(),
      flight: TestDataGenerator.generateFlightData(),
      payment: TestDataGenerator.generatePaymentData()
    };
    await use(testData);
  },

  // 已登录用户
  authenticatedUser: async ({ page, loginPage, testData }, use) => {
    await loginPage.goto();
    await loginPage.login(testData.user.username, testData.user.password);
    await loginPage.assertLoginSuccess();
    await use(testData.user);
  },

  // 日志记录器
  logger: async ({}, use) => {
    const logger = new Logger('Test');
    await use(logger);
  }
});

export { expect };
```

---

## 4. 具体测试用例实现

### 4.1 登录功能测试

**tests/specs/login.spec.js**

```javascript
import { test, expect } from '../fixtures/baseFixture.js';

test.describe('用户登录功能', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('成功登录', async ({ loginPage, testData, logger }) => {
    logger.info('开始测试：成功登录');
    
    await loginPage.login(testData.user.username, testData.user.password);
    await loginPage.assertLoginSuccess();
    
    logger.info('测试完成：成功登录');
  });

  test('用户名为空', async ({ loginPage, logger }) => {
    logger.info('开始测试：用户名为空');
    
    await loginPage.login('', 'Test123!@#');
    await loginPage.assertLoginError('请输入用户名');
    
    logger.info('测试完成：用户名为空');
  });

  test('密码为空', async ({ loginPage, testData, logger }) => {
    logger.info('开始测试：密码为空');
    
    await loginPage.login(testData.user.username, '');
    await loginPage.assertLoginError('请输入密码');
    
    logger.info('测试完成：密码为空');
  });

  test('错误的用户名密码', async ({ loginPage, logger }) => {
    logger.info('开始测试：错误的用户名密码');
    
    await loginPage.login('wrong@example.com', 'wrongpassword');
    await loginPage.assertLoginError('用户名或密码错误');
    
    logger.info('测试完成：错误的用户名密码');
  });

  test('记住我功能', async ({ loginPage, testData, page, logger }) => {
    logger.info('开始测试：记住我功能');
    
    await loginPage.login(testData.user.username, testData.user.password, { 
      rememberMe: true 
    });
    await loginPage.assertLoginSuccess();
    
    // 验证cookie是否设置
    const cookies = await page.context().cookies();
    const rememberCookie = cookies.find(c => c.name === 'remember_token');
    expect(rememberCookie).toBeTruthy();
    
    logger.info('测试完成：记住我功能');
  });
});
```

### 4.2 搜索功能测试

**tests/specs/search.spec.js**

```javascript
import { test, expect } from '../fixtures/baseFixture.js';

test.describe('航班搜索功能', () => {
  test.beforeEach(async ({ searchPage, authenticatedUser }) => {
    await searchPage.goto();
  });

  test('国内单程搜索', async ({ searchPage, logger }) => {
    logger.info('开始测试：国内单程搜索');
    
    const searchData = {
      tripType: 'oneWay',
      fromCity: 'BJS',
      toCity: 'SHA',
      departureDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7天后
      passengers: { adults: 1, children: 0, infants: 0 },
      cabinClass: 'economy'
    };

    await searchPage.searchFlights(searchData);
    await searchPage.waitForSearchResults();
    
    // 验证结果页面
    await expect(searchPage.page).toHaveURL(/.*search\/results.*/);
    
    logger.info('测试完成：国内单程搜索');
  });

  test('国际往返搜索', async ({ searchPage, logger }) => {
    logger.info('开始测试：国际往返搜索');
    
    const searchData = {
      tripType: 'roundTrip',
      fromCity: 'BJS',
      toCity: 'NYC',
      departureDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14天后
      returnDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21天后
      passengers: { adults: 2, children: 1, infants: 0 },
      cabinClass: 'business'
    };

    await searchPage.searchFlights(searchData);
    await searchPage.waitForSearchResults();
    
    logger.info('测试完成：国际往返搜索');
  });

  test('多乘客搜索', async ({ searchPage, logger }) => {
    logger.info('开始测试：多乘客搜索');
    
    const searchData = {
      tripType: 'oneWay',
      fromCity: 'SHA',
      toCity: 'CAN',
      departureDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      passengers: { adults: 4, children: 2, infants: 1 },
      cabinClass: 'economy'
    };

    await searchPage.searchFlights(searchData);
    await searchPage.waitForSearchResults();
    
    logger.info('测试完成：多乘客搜索');
  });

  test('城市交换功能', async ({ searchPage, logger }) => {
    logger.info('开始测试：城市交换功能');
    
    // 先选择初始城市
    await searchPage.selectCity(searchPage.selectors.fromCitySelect, 'BJS');
    await searchPage.selectCity(searchPage.selectors.toCitySelect, 'SHA');
    
    // 交换城市
    await searchPage.swapCities();
    
    // 验证城市已交换
    await searchPage.validateSearchForm({
      fromCity: 'SHA',
      toCity: 'BJS'
    });
    
    logger.info('测试完成：城市交换功能');
  });

  test('搜索参数验证', async ({ searchPage, logger }) => {
    logger.info('开始测试：搜索参数验证');
    
    // 不选择出发城市直接搜索
    await searchPage.smartClick(searchPage.selectors.searchButton);
    
    // 验证错误提示
    const errorMessage = searchPage.page.locator('[data-testid="from-city-error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('请选择出发城市');
    
    logger.info('测试完成：搜索参数验证');
  });
});
```

---

## 5. 工具类和辅助函数

### 5.1 日志工具

**tests/helpers/logger.js**

```javascript
import winston from 'winston';
import path from 'path';

export class Logger {
  constructor(category = 'Default') {
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json(),
        winston.format.printf(({ timestamp, level, message, category, ...meta }) => {
          return `${timestamp} [${level.toUpperCase()}] [${category}] ${message} ${
            Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
          }`;
        })
      ),
      defaultMeta: { category },
      transports: [
        new winston.transports.File({ 
          filename: path.join('logs', 'error.log'), 
          level: 'error' 
        }),
        new winston.transports.File({ 
          filename: path.join('logs', 'combined.log') 
        }),
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          )
        })
      ]
    });
  }

  info(message, meta = {}) {
    this.logger.info(message, meta);
  }

  warn(message, meta = {}) {
    this.logger.warn(message, meta);
  }

  error(message, meta = {}) {
    this.logger.error(message, meta);
  }

  debug(message, meta = {}) {
    this.logger.debug(message, meta);
  }
}
```

### 5.2 API工具

**tests/helpers/apiHelper.js**

```javascript
import { request } from '@playwright/test';

export class ApiHelper {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.context = null;
  }

  async init() {
    this.context = await request.newContext({
      baseURL: this.baseURL,
      extraHTTPHeaders: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
  }

  async post(endpoint, data, headers = {}) {
    const response = await this.context.post(endpoint, {
      data,
      headers
    });
    return {
      status: response.status(),
      data: await response.json(),
      headers: response.headers()
    };
  }

  async get(endpoint, params = {}, headers = {}) {
    const url = new URL(endpoint, this.baseURL);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    const response = await this.context.get(url.pathname + url.search, { headers });
    return {
      status: response.status(),
      data: await response.json(),
      headers: response.headers()
    };
  }

  async cleanup() {
    if (this.context) {
      await this.context.dispose();
    }
  }
}
```

---

## 6. 执行和报告

### 6.1 运行脚本

**package.json**

```json
{
  "name": "ticket-system-test",
  "version": "1.0.0",
  "scripts": {
    "test": "playwright test",
    "test:headed": "playwright test --headed",
    "test:debug": "playwright test --debug",
    "test:chrome": "playwright test --project='Desktop Chrome'",
    "test:firefox": "playwright test --project='Desktop Firefox'",
    "test:mobile": "playwright test --project='Mobile Chrome'",
    "test:parallel": "playwright test --workers=4",
    "test:login": "playwright test login.spec.js",
    "test:search": "playwright test search.spec.js",
    "report:html": "playwright show-report",
    "report:allure": "allure serve reports/allure-results",
    "setup": "playwright install && npm run create-dirs",
    "create-dirs": "mkdir -p logs screenshots videos reports/allure-results",
    "clean": "rm -rf test-results screenshots videos logs reports"
  }
}
```

### 6.2 执行示例

```bash
# 安装依赖和浏览器
npm install
npm run setup

# 运行所有测试
npm test

# 运行特定测试套件
npm run test:login
npm run test:search

# 调试模式运行
npm run test:debug

# 生成和查看报告
npm run report:html
npm run report:allure
```

---

## 7. 总结

这个完整的实现流程展示了：

1. **项目架构**：清晰的目录结构和配置
2. **Page Object模式**：可维护的页面对象设计
3. **数据驱动测试**：智能的测试数据生成
4. **错误处理**：完善的异常处理机制
5. **日志记录**：详细的执行日志
6. **多浏览器支持**：跨浏览器兼容性测试
7. **报告生成**：多格式的测试报告

通过这套框架，可以高效地实现票务系统的自动化测试，并为后续的AI增强功能奠定坚实基础。
