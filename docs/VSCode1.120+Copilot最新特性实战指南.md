# VSCode 1.120 + GitHub Copilot 最新特性实战指南

> **案例驱动**：以 GeekBooks 极客书店智能推荐系统为主线，带你掌握 VSCode 1.120 与 GitHub Copilot 的核心特性。
> **版本基准**：VSCode 1.120（2026年5月13日发布）· GitHub Copilot Chat 0.48.x

---

## 目录

1. [全景图：你手中的 AI 工具链](#1-全景图你手中的-ai-工具链)
2. [Agent 模式：让 Copilot 自主干活](#2-agent-模式让-copilot-自主干活)
3. [Agents Window：跨项目多任务并行](#3-agents-window跨项目多任务并行)
4. [MCP 工具扩展：连接外部世界](#4-mcp-工具扩展连接外部世界)
5. [BYOK 模型管理：自带 API Key](#5-byok-模型管理自带-api-key)
6. [Chat 智能提效：上下文、工具与指令](#6-chat-智能提效上下文工具与指令)
7. [终端风险评估：安全执行命令](#7-终端风险评估安全执行命令)
8. [计划模式：先规划再执行](#8-计划模式先规划再执行)
9. [自定义指令与提示词文件](#9-自定义指令与提示词文件)
10. [Markdown Diff 预览](#10-markdown-diff-预览)
11. [代码审查与测试生成](#11-代码审查与测试生成)
12. [GeekBooks 完整工作流实战](#12-geekbooks-完整工作流实战)
13. [快捷键速查表](#13-快捷键速查表)

---

## 1. 全景图：你手中的 AI 工具链

```
┌─────────────────────────────────────────────────────────────┐
│                  VSCode 1.120 AI 能力全景                    │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  内联建议     │  │  Chat 对话    │  │   Agent 自主执行  │  │
│  │ (Tab 补全)   │  │ (Ctrl+Alt+I) │  │  (Ctrl+Shift+I)  │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                  工具扩展层（Tools）                   │   │
│  │  MCP 服务器  │  VS Code 内置工具  │  扩展提供的工具   │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │               Agents Window (v1.120 新增 Stable)     │    │
│  │  跨项目并行  │  隔离环境  │  会话持久化  │  远程机器  │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### 三种核心使用姿势

| 使用方式 | 适用场景 | GeekBooks 举例 |
|---------|---------|--------------|
| **内联建议**（被动） | 编写代码时实时补全 | 写 `RecommendationService` 方法体时按 Tab |
| **Chat 对话**（主动问答） | 解释代码、查 API、快速问答 | "解释这段推荐算法的时间复杂度是多少？" |
| **Agent 自主模式**（委托执行） | 多文件修改、完整功能实现 | "给图书推荐模块添加单元测试，覆盖边界情况" |

---

## 2. Agent 模式：让 Copilot 自主干活

### 2.1 什么是 Agent 模式

Agent 模式下，Copilot **自主规划 → 执行 → 检验 → 修正**，无需你手动操作每一步。它会：

- 分析你的完整代码库找到相关文件
- 跨多个文件做修改
- 执行终端命令（如运行测试）
- 遇到报错自动修复，直到任务完成

### 2.2 如何开启

```
Ctrl+Shift+I  →  在 Chat 面板顶部下拉选择 "Agent" 模式
```

或直接在 Chat 视图输入框点击 **模式切换按钮**。

### 2.3 案例：为 GeekBooks 推荐服务添加完整功能

**背景**：GeekBooks Sprint 3 需要实现智能图书推荐系统，后端使用 Spring Boot 3.x + Java 17。

**❌ 普通 Chat 模式的局限**
```
你：帮我写一个推荐服务
Copilot：（给你一段代码片段）
→ 需要你手动创建文件、复制代码、处理依赖、写测试...
```

**✅ Agent 模式的正确姿势**

在 Agent 模式下输入：
```
基于 GeekBooks 项目的 Spring Boot 架构，实现图书智能推荐服务：

需求：
1. 基于用户浏览历史（UserBrowseHistory）和购买记录（OrderItem）
2. 使用协同过滤算法推荐相似用户喜欢的图书
3. 结合 Redis 缓存热门推荐结果（TTL 30分钟）
4. 提供 REST API：GET /api/v1/books/recommendations?userId={id}&limit=10

请分析现有代码结构后实现，并添加单元测试。
```

**Copilot 自主执行过程**：
```
✓ 分析项目结构（扫描 src/main/java 目录）
✓ 读取 UserBrowseHistory.java、OrderItem.java 实体类
✓ 创建 RecommendationService.java
✓ 创建 RecommendationController.java  
✓ 创建 RecommendationServiceTest.java
✓ 更新 pom.xml 添加依赖
✓ 运行 mvn test 验证 → 修复报错
✓ 任务完成，等待你审查
```

### 2.4 权限控制（重要！）

Agent 执行操作前会请求你的确认。1.120 版本提供三个权限级别：

| 权限级别 | 说明 | 推荐场景 |
|---------|-----|---------|
| **Default Approvals** | 每个工具调用都需确认 | 正式项目、谨慎操作 |
| **Bypass Approvals** | 跳过大多数确认 | 快速原型、个人项目 |
| **Autopilot (Preview)** | 全自动，无需确认 | 熟悉的重复性任务 |

> ⚠️ **建议**：在 GeekBooks 这类真实项目上，始终使用 Default Approvals，尤其是涉及数据库操作时。

---

## 3. Agents Window：跨项目多任务并行

### 3.1 什么是 Agents Window（v1.120 正式进入 Stable）

这是 VSCode 1.120 **最重磅的新功能**之一——专为 Agent 驱动的工作流设计的独立窗口。

**主要能力**：
- 在不同项目（courses-starter、deerpowers、GeekBooks 等）间**并行运行多个 Agent 任务**
- 每个任务在**隔离环境**中运行，互不干扰
- **会话持久化**：关闭后重新打开，任务状态保留
- 支持在**远程机器**上运行 Agent

### 3.2 如何打开

```
标题栏右上角 → "Open in Agents" 按钮
```

或通过命令面板：`Ctrl+Shift+P` → `Agents: Open Agents Window`

### 3.3 v1.120 新改进

| 改进点 | 说明 |
|-------|-----|
| 偏好持久化 | 上次选择的 Agent 和隔离模式在新会话中保留 |
| 快速丢弃改动 | 直接在 Changes 面板中丢弃编辑 |
| 同步上游变更 | Files 面板新增 Sync 按钮，Agent 开始前同步 main 分支 |
| 快速切换会话 | 左上角箭头按钮在最近会话间跳转 |
| 全量变更查看 | 完成的会话自动展示所有改动 |

### 3.4 案例：GeekBooks 多任务并行

```
任务 A（Agents Window）：
"分析 GeekBooks 的技术债务，生成技术债务报告"
→ 在后台运行，可能需要 10 分钟

任务 B（主窗口，当前编辑器）：
同时编写新的前端推荐组件
→ 两个任务互不影响
```

---

## 4. MCP 工具扩展：连接外部世界

### 4.1 什么是 MCP

MCP（Model Context Protocol）允许你为 Copilot **挂载外部工具**，让 Agent 能够：
- 查询数据库
- 调用第三方 API
- 操作文件系统（超出工作区）
- 获取实时网络数据

### 4.2 在 VSCode 中配置 MCP

打开命令面板：`Ctrl+Shift+P` → `MCP: Add Server`

或在 `.vscode/mcp.json` 中手动配置：

```json
{
  "servers": {
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    },
    "context7": {
      "command": "npx", 
      "args": ["-y", "@upstash/context7-mcp"]
    },
    "fetch": {
      "command": "uvx",
      "args": ["mcp-server-fetch"]
    }
  }
}
```

> **v1.120 新特性**：通过 `copilot plugin install` 安装的 Copilot CLI 插件会**自动被 VSCode 识别**，无需重复配置！

### 4.3 案例：GeekBooks 技术选型调研

在 Agent 模式下，挂载 Context7 和 Fetch MCP 后：

```
你（Agent 模式）：
"帮我调研 GeekBooks 推荐系统的技术选型。
 候选方案：Apache Mahout、LightFM、自研协同过滤。
 从 GitHub stars、性能、Java 集成难度三个维度对比，
 获取最新文档和社区活跃度数据。"

Copilot 执行：
✓ [fetch] 获取 Apache Mahout GitHub 页面数据
✓ [context7] 检索 LightFM 最新 API 文档  
✓ [context7] 检索 Spring Boot 集成示例
✓ 生成结构化对比表格 + ADR 架构决策记录
```

### 4.4 在 Chat 中使用 MCP 工具

```bash
# 在 Chat 输入框中直接引用工具
#web/fetch https://github.com/apache/mahout
"总结这个项目的主要功能和最近的活跃情况"
```

---

## 5. BYOK 模型管理：自带 API Key

### 5.1 BYOK 是什么

BYOK（Bring Your Own Key）允许你**用自己的 API Key** 接入第三方模型：
- Anthropic Claude（claude-3.7-sonnet、claude-opus-4 等）
- OpenAI GPT-4o、o3
- DeepSeek、Qwen 等 OpenAI 兼容模型
- Azure OpenAI 部署

### 5.2 v1.120 的两大 BYOK 改进

#### ① Token 用量可视化（新功能）

之前 BYOK 模型 token 统计显示 `0%`，1.120 修复了这个问题。

```
Chat 视图底部上下文窗口控件：
[████████░░░░] 68% · 127,420 / 200,000 tokens
```

通过悬停可看到分类占比（代码、对话历史、工具输出等）。

**对 GeekBooks 开发的实际意义**：
- 当你把整个 `src/` 目录加为上下文时，知道占用了多少 token
- 在 token 快满时用 `/compact` 命令压缩对话历史

#### ② 推理模型思考力度配置（新功能）

对于 Claude 3.7、o3-mini 等推理型模型，可以调整"思考力度"：

```
模型选择器（Ctrl+Alt+.）→ 选择推理模型 → 右侧出现 Thinking Effort 滑块
   Low ──────────●───── High
   （速度快/省钱）    （质量高/贵）
```

**GeekBooks 场景建议**：
| 任务 | 推荐力度 | 原因 |
|-----|---------|-----|
| 快速问代码问题 | Low | 简单问答，节省成本 |
| 设计推荐算法架构 | High | 需要深度推理 |
| 生成单元测试 | Medium | 平衡质量与速度 |

### 5.3 模型选择器按 Provider 分组（新功能）

```
Ctrl+Alt+.  →  模型选择器（现在按 Provider 分组）

  ▼ Anthropic
    claude-opus-4
    claude-sonnet-4.5  ✓（最近使用）
    claude-3-haiku

  ▼ OpenAI  
    gpt-4o
    o3-mini

  ▼ GitHub (内置)
    Copilot (Claude Sonnet 4.6)  ← 当前默认
    Copilot (GPT-4o)
```

> **技巧**：在 Chat 输入框中输入 `/models` 快速跳转到模型选择。

---

## 6. Chat 智能提效：上下文、工具与指令

### 6.1 上下文管理（`#` 引用）

精准提供上下文是获得高质量回答的关键：

```bash
# 引用特定文件
#RecommendationService.java 这段代码有性能问题吗？

# 引用当前选中代码  
（选中代码后）Ctrl+I → 提问

# 引用工作区变更
#changes 基于这些改动，生成 git commit 信息

# 引用问题面板
#problems 帮我修复这些编译错误

# 引用终端最后命令
#terminalLastCommand 上面的测试为什么失败？
```

### 6.2 GeekBooks 上下文最佳实践

| 任务 | 最佳上下文配置 |
|-----|-------------|
| 实现新功能 | `#RecommendationService.java` + `#UserBrowseHistory.java` + 说明需求 |
| 修 Bug | `#problems` + `#terminalLastCommand`（包含错误日志） |
| 代码审查 | `#changes`（审查当前所有未提交改动） |
| 写测试 | 选中目标方法 → `/tests` |

### 6.3 内置工具（v1.120 完整版）

在 Agent 模式下可直接调用的内置工具集：

```
#edit/*      → 创建/编辑文件、目录
#execute/*   → 运行终端命令、任务、测试
#read/*      → 读取文件、Notebook、终端输出  
#search/*    → 搜索代码库、文件、符号引用
#browser/*   → 浏览器操作（实验性）
#web/fetch   → 获取网页内容
#todos       → 任务进度跟踪
```

### 6.4 斜杠命令速查

| 命令 | 功能 | GeekBooks 用法 |
|-----|-----|--------------|
| `/explain` | 解释代码 | 选中协同过滤算法 → `/explain` |
| `/fix` | 修复问题 | `/fix 这个 NPE 怎么避免？` |
| `/tests` | 生成测试 | 选中 Service 方法 → `/tests` |
| `/doc` | 生成文档注释 | 选中方法 → `/doc` |
| `/plan` | 生成实现计划 | `/plan 实现智能推荐模块` |
| `/new` | 脚手架新项目 | `/new Spring Boot recommendation service` |
| `/init` | 生成项目指令文件 | `/init` → 自动生成 `.github/copilot-instructions.md` |
| `/compact` | 压缩对话历史 | Token 快满时使用 |
| `/fork` | 分叉当前会话 | 保存主线，探索新思路 |
| `/yolo` | 全局自动批准 | 重复性批量任务时开启 |

---

## 7. 终端风险评估：安全执行命令

### 7.1 功能说明（v1.120 实验性功能）

当 Agent 要求执行终端命令时，现在每条命令都会附带**AI 生成的风险徽章**：

```
┌─────────────────────────────────────────────────────┐
│  Agent 想要执行以下命令：                              │
│                                                     │
│  $ rm -rf ./target && mvn clean package -DskipTests │
│                                                     │
│  🟡 CAUTION  修改工作区：删除 target 目录并重新编译    │
│                                                     │
│  [ 允许 ]  [ 拒绝 ]  [ 查看详情 ]                    │
└─────────────────────────────────────────────────────┘
```

**三个风险等级**：

| 级别 | 颜色 | 含义 | GeekBooks 举例 |
|-----|-----|-----|--------------|
| **Safe** | 🟢 绿 | 只读操作 | `git status`、`ls`、`grep` |
| **Caution** | 🟡 橙 | 修改工作区/网络操作 | `mvn install`、`npm run build` |
| **Review carefully** | 🔴 红 | 不可撤销操作 | `git push --force`、`DROP TABLE` |

### 7.2 开启方式

```json
// .vscode/settings.json
{
  "chat.tools.riskAssessment.enabled": true
}
```

### 7.3 案例：GeekBooks 数据库迁移场景

```
Agent 执行 Flyway 迁移时弹出警告：

🔴 REVIEW CAREFULLY
执行 Flyway 数据库迁移脚本，将修改生产数据库结构（users 表新增列），
此操作难以撤销。

建议：在非生产环境先验证后再执行。
```

---

## 8. 计划模式：先规划再执行

### 8.1 功能说明

在开始复杂编码任务前，先让 Copilot **生成执行计划**，你审核后再开始执行：

```
/plan 实现 GeekBooks 智能推荐系统，要求：
  - 协同过滤 + 内容过滤混合策略
  - A/B Test 框架支持
  - Redis 缓存
  - 完整单元测试
```

### 8.2 v1.120 内联编辑改进

之前：计划修改会打开新标签页
现在：计划**直接在控件内联编辑**，不离开当前上下文

```
┌──────────────────────────────────────────────────┐
│  📋 实现计划（可直接编辑）                          │
│                                                  │
│  Phase 1: 数据层                                  │
│  ✏️ 1.1 创建 UserBehaviorRecord 实体              │
│  ✏️ 1.2 创建 BookSimilarity 实体                  │
│                                                  │
│  Phase 2: 算法层                                  │
│  ✏️ 2.1 实现协同过滤算法 (ItemCF)                 │
│  ✏️ 2.2 实现内容过滤算法                           │
│                                                  │
│  [ 开始执行计划 ]  [ 提供反馈 ]  [ 放弃 ]          │
└──────────────────────────────────────────────────┘
```

**最佳实践**：在复杂任务前总是先用 `/plan`，检查 Copilot 的理解是否准确，避免大量无效工作。

---

## 9. 自定义指令与提示词文件

### 9.1 三层自定义体系

```
.github/copilot-instructions.md    ← 全局指令（对所有会话生效）
.github/prompts/*.prompt.md        ← 可复用提示词文件
.github/instructions/*.md          ← 任务特定指令
```

### 9.2 GeekBooks 项目指令配置示例

**创建方式**：在 Chat 中运行 `/init`，Copilot 会自动分析项目生成初稿。

```markdown
<!-- .github/copilot-instructions.md -->
# GeekBooks 项目编码规范

## 技术栈
- 后端：Spring Boot 3.x + Java 17，使用 Record 类代替 DTO
- 前端：Vue 3 Composition API + TypeScript
- 数据库：MySQL 8.0，所有查询必须通过 MyBatis-Plus

## 命名规范
- Service 层方法：动词 + 名词（如 `findRecommendedBooks`）
- API 路径：RESTful，版本前缀 `/api/v1/`
- 测试类：`{被测类名}Test`，测试方法：`test{方法名}_{场景}`

## 代码质量
- 所有 Service 方法必须有对应的单元测试
- 敏感数据（用户 ID、手机号）不得直接打印到日志
- Redis Key 命名：`geekbooks:{模块}:{业务Key}`
```

### 9.3 可复用提示词文件

```markdown
<!-- .github/prompts/review-api.prompt.md -->
---
description: "审查 REST API 设计"
---
请审查以下 API 设计，关注：
1. RESTful 规范符合度
2. 入参校验是否完整
3. 错误码是否统一
4. 是否存在安全隐患（未授权访问、SQL 注入等）

API 代码：
{{selection}}
```

使用时：在 Chat 中输入 `/review-api`，选中代码后执行。

### 9.4 /init 命令自动生成

```
# 在 Chat 中运行：
/init

→ Copilot 扫描项目结构
→ 生成 .github/copilot-instructions.md 草稿
→ 你审核并调整
```

---

## 10. Markdown Diff 预览

### 10.1 功能说明（v1.120 Preview）

在 Source Control 视图中查看 `.md` 文件差异时，可以**渲染预览而非查看原始 Markdown**：

```
Source Control → 点击 .md 文件 → "Reopen Editor With..." → "Markdown Preview Diff"
```

### 10.2 GeekBooks 应用场景

当 Copilot Agent 修改了 API 文档（`.md`）后，你可以用渲染视图看清楚什么内容变了：

```
❌ 原始 diff 视图（难阅读）：
- ## API 接口
- | GET /books/recommend | 获取推荐 |
+ ## API 接口（v2.0）
+ | GET /books/recommendations | 获取个性化推荐 |

✅ Markdown Preview Diff（清晰）：
  左侧：渲染后的旧文档
  右侧：渲染后的新文档
  差异：标题和路径变更一目了然
```

### 10.3 设置为默认视图

```json
// .vscode/settings.json
{
  "workbench.diffEditorAssociations": {
    "*.md": "vscode.markdown.preview.editor"
  }
}
```

---

## 11. 代码审查与测试生成

### 11.1 Code Review（实验性功能）

两种使用方式：

**① 快速审查（选中代码）**
```
选中 RecommendationService 的核心方法
→ 右键 → "Generate Code" → "Review"
→ Copilot 在编辑器中直接添加 Review 注释
```

**② 完整 PR 级别审查**
```
Source Control 视图 → "Code Review" 按钮
→ 审查所有未提交改动
→ 问题以内联注释形式展示，可直接应用修复建议
```

### 11.2 测试生成

**快速生成测试**：
```
# 方法1：选中方法 → 右键 → /tests
# 方法2：在 Chat 中
/tests 为 RecommendationService.getRecommendations() 
       生成单元测试，使用 Mockito mock 依赖
```

**测试框架配置**：
```
/setupTests 我用 Spring Boot + JUnit 5 + Mockito，
            帮我配置测试环境
```

**测试覆盖率驱动（实验性）**：
```
Source Control 视图 → "Test Coverage" 
→ 高亮显示未覆盖的行
→ 右键未覆盖代码 → "Generate Tests for Uncovered Code"
```

### 11.3 GeekBooks TDD 实战流程

```
Step 1: 写测试（让 Copilot 生成）
/tests 为协同过滤推荐算法生成测试用例，
       要求覆盖：冷启动用户、相似度计算准确性、缓存命中场景

Step 2: 运行测试（红色阶段）
Agent 模式：运行 mvn test，确认失败

Step 3: 实现代码
Agent 模式：基于这些测试实现 RecommendationService

Step 4: 验证（绿色阶段）  
Agent 模式：再次运行 mvn test，确认全部通过
```

---

## 12. GeekBooks 完整工作流实战

> 以下是一个完整的"Sprint 3 推荐功能"开发流程，展示如何串联使用各项特性。

### 阶段一：需求理解与规划（15分钟）

```
1. 打开 VSCode + Copilot Chat（Ctrl+Alt+I）

2. 设置上下文：
   拖入 GeekBooks极客书店需求描述.md 到 Chat 视图

3. 生成实现计划：
   /plan 基于这份需求文档，为 Sprint 3 的智能推荐功能
         制定详细的技术实现计划，包含：
         - 数据模型设计
         - 算法选型理由
         - API 设计
         - 测试策略
         
4. 审核计划，确认无误后保存为 docs/sprint3-plan.md
```

### 阶段二：架构设计（使用 MCP）

```
1. 确保 Context7 和 Fetch MCP 已在 VSCode 中配置

2. 在 Agent 模式下：
   "基于 GeekBooks 的 Spring Boot 技术栈，调研并设计
    推荐系统架构。使用 Context7 查询 Spring Data Redis
    最新 API，生成 ADR 架构决策记录。"

3. Copilot 自动：
   ✓ 查询最新 Redis 集成文档
   ✓ 分析现有代码结构  
   ✓ 生成 docs/adr/ADR-001-recommendation-tech-stack.md
```

### 阶段三：代码实现（Agent 模式）

```
1. 切换到 Agent 模式（Ctrl+Shift+I）

2. 提交任务：
   "根据 docs/sprint3-plan.md 中的设计，实现推荐服务。
    参考 #UserBrowseHistory.java 和 #OrderItem.java 的数据结构。
    遵循项目的 .github/copilot-instructions.md 规范。"

3. Agent 执行时，对每个文件操作在 Changes 面板审查

4. 对危险命令（数据库操作）仔细检查风险徽章
```

### 阶段四：测试与质量

```
1. 快速生成测试：
   选中 RecommendationService → /tests

2. 代码审查：
   Source Control → "Code Review" 按钮
   关注安全性（用户数据访问控制）

3. 提交前检查：
   Source Control → ✨（Copilot 图标）→ 生成 commit 信息
```

### 阶段五：文档更新

```
1. 更新 API 文档后，用 Markdown Preview Diff 查看变更
   确认文档描述准确

2. 生成 PR 描述：
   GitHub Pull Requests 扩展 → "Create Pull Request"
   → Copilot 自动生成 PR 标题和描述
```

---

## 13. 快捷键速查表

| 快捷键 | 功能 |
|-------|-----|
| `Ctrl+Alt+I` | 打开/关闭 Chat 视图 |
| `Ctrl+Shift+I` | 切换到 Agent 模式 |
| `Ctrl+I`（编辑器中） | 内联 Chat |
| `Ctrl+I`（终端中） | 终端内联 Chat |
| `Ctrl+Shift+Alt+L` | 快速 Chat（不打断当前工作） |
| `Ctrl+N`（Chat 中） | 新建 Chat 会话 |
| `Ctrl+Alt+.` | 打开模型选择器 |
| `Tab` | 接受内联建议 |
| `Alt+]` / `Alt+[` | 下一个/上一个内联建议 |
| `F2` | AI 辅助重命名符号 |
| `Shift+Alt+Right` | 扩展选区（Markdown 表格智能感知） |

### Chat 中的 `#` 上下文变量

| 变量 | 含义 |
|-----|-----|
| `#changes` | 当前未提交的 git 改动 |
| `#problems` | Problems 面板中的错误/警告 |
| `#terminalLastCommand` | 终端最后一条命令及输出 |
| `#terminalSelection` | 终端当前选中内容 |
| `#selection` | 编辑器当前选中代码 |
| `#<文件名>` | 引用特定文件内容 |
| `#githubRepo` | 搜索 GitHub 仓库代码 |
| `#web/fetch <url>` | 抓取网页内容 |

---

## 附录：GeekBooks 推荐的 VSCode 扩展配置

```json
// .vscode/extensions.json
{
  "recommendations": [
    "github.copilot",
    "github.copilot-chat",
    "github.vscode-pull-request-github",
    "vscjava.vscode-spring-boot-dashboard",
    "pivotal.vscode-spring-boot",
    "redhat.vscode-xml",
    "cweijan.vscode-mysql-client2"
  ]
}
```

```json
// .vscode/settings.json（推荐配置）
{
  "chat.tools.riskAssessment.enabled": true,
  "chat.tools.compressOutput.enabled": true,
  "github.copilot.chat.tools.memory.enabled": true,
  "chat.tools.todos.showWidget": true,
  "workbench.diffEditorAssociations": {
    "*.md": "vscode.markdown.preview.editor"
  },
  "search.searchView.semanticSearchBehavior": "auto"
}
```

---

> **版本说明**：本文档基于 VSCode 1.120（2026年5月13日）和 GitHub Copilot Chat 0.48.x 编写。
> 标注 `(Preview)` 或 `(实验性)` 的功能需手动在设置中开启，行为可能随版本变化。
