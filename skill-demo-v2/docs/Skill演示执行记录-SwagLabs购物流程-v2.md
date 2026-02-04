# Chrome DevTools + Playwright Skill 演示执行记录

> **演示日期**: 2026-01-28  
> **目标网站**: Swag Labs (https://www.saucedemo.com)  
> **测试用例**: 测试用例2 - 完整购物流程验证  
> **Skill版本**: v2.0 (5阶段工作流)

---

## 📋 演示概述

本文档记录了使用 **Chrome DevTools + Playwright** Skill 完整演示 5 阶段工作流的过程。

### 工作流概览

```
EXPLORE → DOCUMENT → CODE → EXECUTE → DIAGNOSE
  (MCP)     (AI)     (AI)    (CI)      (MCP)
```

---

## Phase 1: Explore (MCP探索)

### 1.1 探索登录页面

**执行命令:**
```javascript
mcp_io_github_chr_new_page({ url: "https://www.saucedemo.com" })
mcp_io_github_chr_take_screenshot({ fullPage: true })
mcp_io_github_chr_take_snapshot({ verbose: true })
```

**发现的选择器:**
| 元素 | data-test 属性 | 类型 |
|------|----------------|------|
| 用户名输入框 | `username` | INPUT |
| 密码输入框 | `password` | INPUT |
| 登录按钮 | `login-button` | INPUT (submit) |

### 1.2 探索商品列表页

**执行流程:**
1. 填写登录表单 (standard_user / secret_sauce)
2. 点击登录按钮
3. 截图并提取选择器

**发现的选择器:**
| 元素 | data-test 属性 |
|------|----------------|
| 页面标题 | `title` |
| 购物车链接 | `shopping-cart-link` |
| 购物车徽章 | `shopping-cart-badge` |
| 商品列表 | `inventory-list` |
| 添加Backpack | `add-to-cart-sauce-labs-backpack` |
| 添加Bike Light | `add-to-cart-sauce-labs-bike-light` |

### 1.3 探索购物车页面

**执行流程:**
1. 添加两件商品到购物车
2. 验证购物车徽章显示"2"
3. 点击购物车图标进入购物车

**发现的选择器:**
| 元素 | data-test 属性 |
|------|----------------|
| 页面标题 | `title` (Your Cart) |
| 购物车列表 | `cart-list` |
| 商品名称 | `inventory-item-name` |
| 商品价格 | `inventory-item-price` |
| 结账按钮 | `checkout` |

### 1.4 探索结账流程

**结账信息页 (Step 1):**
| 元素 | data-test 属性 |
|------|----------------|
| First Name | `firstName` |
| Last Name | `lastName` |
| Postal Code | `postalCode` |
| 继续按钮 | `continue` |

**订单确认页 (Step 2):**
| 元素 | data-test 属性 |
|------|----------------|
| 小计 | `subtotal-label` |
| 税费 | `tax-label` |
| 总计 | `total-label` |
| 完成按钮 | `finish` |

**订单完成页:**
| 元素 | data-test 属性 |
|------|----------------|
| 完成标题 | `complete-header` |
| 成功图标 | `pony-express` |

### 1.5 关键发现

1. **选择器策略**: Swag Labs 使用 `data-test` 属性，非常适合自动化测试
2. **React表单**: 需要触发 input 事件才能正确填充表单
3. **Session管理**: 购物车数据在session中保持
4. **价格计算**: 
   - Backpack: $29.99
   - Bike Light: $9.99
   - Subtotal: $39.98
   - Tax: $3.20
   - Total: $43.18

---

## Phase 2: Document (生成测试用例文档)

### 2.1 测试覆盖矩阵

| 功能模块 | 正常路径 | 异常场景 | 边界值 |
|---------|---------|---------|--------|
| 登录 | ✅ 有效凭证登录 | - | - |
| 商品列表 | ✅ 添加购物车 | - | - |
| 购物车 | ✅ 查看商品 | - | - |
| 结账信息 | ✅ 填写完整信息 | ✅ 空字段提交 | - |
| 订单确认 | ✅ 价格验证 | - | - |
| 订单完成 | ✅ 成功展示 | - | - |

### 2.2 生成的测试用例

**输出文件:** `docs/test-cases/购物流程-测试用例.md`

**统计:**
| 指标 | 数值 |
|------|------|
| 总用例数 | 14 |
| P0 用例数 | 11 |
| P1 用例数 | 3 |
| 可自动化用例 | 14 |
| 覆盖模块数 | 6 |

---

## Phase 3: Code (生成测试代码)

### 3.1 生成的 Page Objects

| 文件 | 页面 | 主要方法 |
|------|------|---------|
| `LoginPage.ts` | 登录页 | `goto()`, `login()`, `loginAsStandardUser()` |
| `InventoryPage.ts` | 商品列表 | `addToCart()`, `goToCart()`, `expectCartBadge()` |
| `CartPage.ts` | 购物车 | `checkout()`, `expectItemInCart()` |
| `CheckoutPage.ts` | 结账流程 | `fillInfo()`, `finish()`, `expectOrderComplete()` |

### 3.2 生成的测试脚本

**输出文件:** `tests/shopping-flow.spec.ts`

**测试用例:**
1. `SWAG-LOGIN-001: 使用有效凭证登录系统`
2. `测试用例2：完整购物流程验证` (组合11个子用例)
3. `SWAG-CHK-003: 空字段提交验证`

### 3.3 项目结构

```
skill-demo-v2/
├── docs/
│   └── test-cases/
│       └── 购物流程-测试用例.md     # 测试用例文档
├── pages/                           # Page Objects
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   ├── CheckoutPage.ts
│   └── index.ts
├── tests/                           # 测试脚本
│   └── shopping-flow.spec.ts
├── .github/workflows/e2e.yml        # CI配置
├── playwright.config.ts
└── package.json
```

---

## Phase 4: Execute (执行测试)

### 4.1 本地执行

```bash
# 安装依赖
npm install

# 安装浏览器
npx playwright install chromium

# 运行测试
npx playwright test

# 调试模式
npx playwright test --debug

# UI模式
npx playwright test --ui
```

### 4.2 CI执行

GitHub Actions 配置已生成，触发条件:
- Push 到 main/master 分支
- Pull Request 到 main/master 分支

---

## Phase 5: Diagnose (故障诊断)

### 5.1 诊断模式

当测试失败时，使用以下 MCP 命令诊断:

```javascript
// 1. 检查控制台错误
mcp_io_github_chr_list_console_messages({ types: ["error"] })

// 2. 检查网络请求
mcp_io_github_chr_list_network_requests({ resourceTypes: ["xhr", "fetch"] })

// 3. 截取当前状态
mcp_io_github_chr_take_screenshot()

// 4. 获取DOM快照
mcp_io_github_chr_take_snapshot()
```

### 5.2 常见问题排查

| 问题 | 诊断方法 | 可能原因 |
|------|----------|---------|
| 元素未找到 | `take_snapshot` | 选择器变更、页面未加载 |
| 表单提交失败 | `list_console_messages` | React表单需要触发事件 |
| 超时 | `list_network_requests` | 网络慢、API失败 |

---

## 📊 演示总结

### 效率提升

| 任务 | 传统方式 | 使用Skill |
|------|----------|-----------|
| 页面分析 | 2-4小时 | 15分钟 |
| 测试文档 | 2-3小时 | 10分钟 |
| 测试代码 | 4-8小时 | 20分钟 |
| 选择器提取 | 1-2小时 | 5分钟 |
| **总计** | **9-17小时** | **50分钟** |

### 关键收获

1. **MCP探索** - 快速获取页面结构和选择器
2. **先文档后代码** - 确保测试覆盖完整性
3. **POM模式** - 代码可维护性高
4. **CI集成** - 自动化执行保障

### 生成的文件清单

| 文件 | 类型 | 用途 |
|------|------|------|
| `docs/test-cases/购物流程-测试用例.md` | 文档 | 测试用例 |
| `pages/*.ts` | 代码 | Page Objects |
| `tests/shopping-flow.spec.ts` | 代码 | 测试脚本 |
| `playwright.config.ts` | 配置 | Playwright配置 |
| `.github/workflows/e2e.yml` | 配置 | CI配置 |
| `本文件` | 文档 | 执行记录 |

---

## 🔗 相关链接

- **Skill文档**: `.github/skills/chrome-devtools-playwright/SKILL.md`
- **使用指南**: `Chrome-DevTools-Playwright测试技能使用指南.md`
- **参考提示词**: `.github/skills/chrome-devtools-playwright/references/prompts.md`
