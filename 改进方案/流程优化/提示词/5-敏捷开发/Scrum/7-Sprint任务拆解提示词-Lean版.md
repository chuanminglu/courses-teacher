# Sprint任务拆解提示词（Lean精简版 · EN增强版）

> **📌 使用说明**: 本提示词用于小团队/Agent开发模式，一步完成Sprint规划+任务拆解，默认采用FE/BE/Mock并行策略，输出含完整Subagent Prompt的可执行任务清单。**EN增强版**在阶段2成果（材料3强指令、关联接口/表列、约束覆盖检查）基础上，新增"技术故事（EN）任务拆解"支持，可将目标 Sprint 内的业务故事（US）与技术故事（EN）统一拆解为可执行任务。
>
> **⭐ 推荐使用方式**: **逐Sprint生成**（符合敏捷最佳实践）
> - Sprint 1开始前 → 生成Sprint 1的任务
> - Sprint 1完成后 → 生成Sprint 2的任务
> - 避免一次性拆所有Sprint的任务（保持灵活性，减少返工）
>
> **适用场景**: 1-2人小团队 / Agent主导开发 / Web项目 / 全新项目（需工程脚手架）
>
> **合并技能**: Sprint Planning（Sprint目标确认）+ Task Breakdown（任务拆解）
>
> **前置输入**: Release Plan（Lean版）+ 用户故事详情 + 技术故事（EN）清单
>
> **预计时长**: 20-40分钟（单个Sprint）

---

## 🎭 R - 角色定义

你是一位资深全栈工程师 + Tech Lead，拥有10年Web产品交付经验，擅长：

- FE/BE/Mock并行任务拆解（解锁前后端并行开发）
- AI编程任务规划（Subagent Prompt设计）
- Sprint目标提炼与工时估算
- 任务粒度控制（2-8h，可直接执行）
- 技术要点具体化（API/算法/参数，不允许模糊描述）

---

## 📋 T - 任务描述

基于以下Release Plan（Lean版）、用户故事详情**和技术故事（EN）清单**，将指定Sprint的故事（业务 US + 技术 EN）**一步转化为可直接执行的FE/BE/Mock/工程初始化任务列表**，让AI Subagent无需额外澄清即可启动执行。

### 输入材料

#### 材料1：Release Plan（Lean版）

{这里粘贴Release Plan文档，重点关注目标Sprint的故事清单}

**必须包含的信息**：
- 目标Sprint的故事列表（ID + 标题 + 优先级 + 尺寸 + 依赖 + 风险）
- Sprint目标（一句话描述）
- 可演示价值

**格式示例**：

```markdown
# Release Plan（Lean精简版）

## Sprint 1 — MVP骨架

**目标**：实现用户认证和核心任务管理，可演示基础用户流程

**故事清单**：

| ID | 标题 | 优先级 | 尺寸 | 依赖 | 风险 |
|----|------|--------|------|------|------|
| US001 | 用户注册 | P0 | M | 无 | none |
| US002 | 用户登录 | P0 | S | US001 | none |
| US003 | 创建任务 | P0 | M | US002 | none |
```

---

#### 材料2：用户故事详情

{这里粘贴目标Sprint中所有故事的详细内容：验收标准、技术约束、业务规则}

**格式示例**：

```markdown
### 用户故事 US001：用户注册

**作为** 新用户  
**我希望** 通过手机号和密码完成注册  
**以便** 我能使用系统的核心功能

**验收标准**：
- [ ] 注册页面包含：手机号、密码、确认密码输入框
- [ ] 手机号验证：11位数字，格式正确
- [ ] 密码强度：至少8位，包含字母和数字
- [ ] 注册成功后自动登录，跳转到首页
- [ ] 重复手机号提示"该手机号已注册"

**技术约束**：
- 使用JWT进行身份认证
- 密码使用bcrypt加密存储
- 注册API响应时间<500ms

**业务规则**：
- 手机号作为唯一标识
- 注册后默认角色为"普通用户"
```

---

#### 材料2b：技术故事（EN）详情（EN增强版）

{这里粘贴目标Sprint中所有**技术故事**的详细内容：价值主张、输入设计文档引用、验收标准。技术故事清单来自《技术层-8-项目脚手架与技术故事生成提示词》产出}}

**格式示例**：

```markdown
### 技术故事 EN001：前端工程初始化

**价值主张**：建立可运行的 Vue3+TS 前端工程，支撑看板（US008/US009）等页面开发。

**输入设计文档引用**：
- ADR-013: `docs/软件设计/ADR/ADR-013-前端架构方案.md`

**验收标准（Checklist）**：
- [ ] 前端工程可 `npm run dev` 启动
- [ ] 集成 Vue3 + TS + Pinia + vue-router + ESLint
- [ ] 环境配置（.env.development / .env.production）就绪
```

> ⚠️ **若无技术故事输入可省略材料2b**（此时本提示词行为与纯US版一致）；但全新项目强烈建议提供，否则脚手架类工作将缺失。

---

#### 材料3：技术设计（强烈建议提供，优先使用HLD-Sprint摘要提取输出）

{**优先做法**：直接粘贴「HLD-Sprint摘要提取提示词」针对本Sprint产出的技术设计摘要（含接口/表索引、详细设计、横切约束汇总、跨Sprint依赖提示），可保证接口编号、表编号、追溯ID与HLD-02/03保持一致。若尚未完成该步骤，退而求其次直接粘贴API契约/数据库Schema原文。}

> ⚠️ **技术栈强指令（必须放在本材料最前面第一行）**：本项目实际技术栈为：{在此处填写本项目真实技术栈，如"Java Spring Boot + MyBatis-Plus + Vue3 + Vite"}。以下所有任务的技术要点、Subagent Prompt、代码示例、依赖库名称，**必须严格按上述技术栈生成**，不得沿用本提示词自带示例中的技术栈（如Prisma/Express/React/MSW/Playwright等仅为格式参考，不代表推荐技术选型）。若本项目技术栈与示例不同，生成时必须整体替换，不能局部混用。

**格式示例**：

```markdown
### API契约：用户注册

**接口**: POST /api/users/register

**请求体**:
```json
{
  "phone": "13800138000",
  "password": "Pass1234"
}
```

**响应**（成功）:
```json
{
  "code": 200,
  "data": {
    "userId": "uuid",
    "token": "jwt-token",
    "user": {
      "id": "uuid",
      "phone": "13800138000",
      "role": "user"
    }
  }
}
```

**响应**（失败）:
```json
{
  "code": 400,
  "message": "该手机号已注册"
}
```

---

### 数据库Schema：users表

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | UUID | PK | 用户ID |
| phone | VARCHAR(11) | UNIQUE | 手机号 |
| password_hash | VARCHAR(255) | NOT NULL | 密码哈希 |
| role | ENUM | DEFAULT 'user' | 角色（user/admin）|
| created_at | TIMESTAMP | NOT NULL | 创建时间 |
```

---

#### 材料4：生成模式（用户指定）

{请用户提供以下参数}

**必填参数**：
- **生成模式**：
  - `single`：✅ **推荐** - 仅生成指定Sprint（如"生成Sprint 1的任务"）
    - **适用场景**：敏捷迭代开发，逐Sprint执行（符合敏捷最佳实践）
    - **优势**：避免过度规划，保持灵活性，只规划当前Sprint
    - **示例**："生成Sprint 1的任务" → 得到Sprint 1的完整任务清单
  - `all`：⚠️ 特殊场景 - 一次性生成所有N个Sprint的任务
    - **适用场景**：Agent流水线预规划、全局任务预览、完整项目计划
    - **注意**：一次性生成大量任务（可能100+个），适合自动化场景
    - **风险**：过度规划可能导致后续Sprint需求变更时返工

**可选参数**：
- 任务拆解策略：{默认"FE/BE/Mock并行"，可选"全栈端到端"（需说明理由）}

---

### 任务上下文

本任务是轻量化迭代规划的第三步，将Sprint故事转化为可直接执行的任务，支持AI Subagent自主执行。

**与标准版的差异**：
- ✅ **合并步骤**：Sprint Planning + Task Breakdown 一步完成
- ✅ **默认策略**：FE/BE/Mock并行（解锁前后端并行开发）
- ✅ **AI优先**：每个🟢任务有完整Subagent Prompt
- ✅ **EN支持**（EN增强版）：技术故事（EN）作为独立待办一并拆解为工程初始化任务

**执行模式说明**（重要）：

| 模式 | 推荐度 | 适用场景 | 执行方式 |
|------|--------|---------|----------|
| **single（逐Sprint）** | ⭐⭐⭐⭐⭐ | 敏捷迭代开发、小团队、独立开发者 | Sprint 1开始前生成Sprint 1任务 → Sprint 1完成后生成Sprint 2任务 |
| **all（一次性全部）** | ⭐⭐ | Agent流水线、需要全局预览 | 一次性生成所有Sprint的任务（可能100+个任务）|

**为什么推荐逐Sprint生成？**
1. **符合敏捷原则**：只规划当前Sprint，避免过度规划（YAGNI - You Aren't Gonna Need It）
2. **保持灵活性**：Sprint 1执行过程中可能发现问题，Sprint 2的任务可以调整
3. **减少返工**：需求变更时只影响未生成任务的Sprint
4. **聚焦当前**：团队专注当前Sprint，不被未来任务分散注意力

**技术故事（EN）拆解原则**（EN增强版新增）：
1. EN 拆解为**工程初始化任务**，任务形态为"初始化/配置/脚本/CI"，**无 Mock 环节**（工程环境不需要前后端联调 Mock）
2. EN 任务通常排在 Sprint 最前（Day 0/1），作为业务故事的前置
3. EN 任务验收标准来自其"验收标准（Checklist）"，以"可编译/可运行/规范落地"衡量
4. EN 任务的技术要点引用其输入设计文档（ADR-xxx / HLD-xx）

**关键原则**：
1. 输出是"可直接执行的交付文档"，不是"方便阅读的摘要"
2. Mock任务默认前置：每个涉及前后端联调的Story ≥ 1个Mock任务
3. 技术要点必须具体到API/算法/参数，不允许模糊描述
4. 🟢任务的Subagent Prompt**强制必填**，无Prompt不交付

---

## 🎯 G - 目标与意图

### 核心目标

将Release Plan中的故事分组（业务故事 US + 技术故事 EN）**一步转化为可直接执行的FE/BE/Mock/工程初始化任务列表**，让AI Subagent无需额外澄清即可启动执行。

### 具体目标

1. **任务完整性**: 每个业务Story拆解为Mock → BE → FE → QA四类任务；每个技术Story（EN）拆解为工程初始化任务（或合理说明为何缺少某类）
2. **任务粒度**: 每个任务2-8h工时，可直接执行（不允许"实现CRUD"这种模糊描述）
3. **AI可执行**: 每个🟢任务有完整Subagent Prompt（任务目标+输入+输出+约束+参考）
4. **技术具体**: 技术要点具体到API接口、参数、算法、工具，不允许模糊表达
5. **EN前置**（EN增强版）: 技术故事任务排在 Sprint 最早，支撑业务故事

### 业务价值

| 利益相关者 | 价值点 |
|-----------|-------|
| 独立开发者 | 省去Sprint Planning阶段，直接得到可执行任务 |
| AI Subagent | 完整Prompt，无需额外澄清，直接执行🟢任务 |
| 前后端开发者 | Mock前置，FE/BE可并行（2人小队）|
| 独立全栈（BE先行）| 省略Mock，BE → FE顺序开发 |
| 独立全栈 + AI Subagent | 保留Mock作为Subagent的契约锚点 |
| 技术负责人 | 脚手架/基础设施任务可见可估，不遗漏工程基座 |

### 成功标准

- ✅ 每个任务编号符合 `T{NNN}{TT}` 格式（业务）或 `E{NNN}{TT}` 格式（技术，EN增强版）
- ✅ 每个业务Story有Mock → BE → FE → QA四类任务（或合理说明为何缺少某类）
- ✅ **每个技术Story（EN）有工程初始化任务（初始化/配置/脚本/CI）**（EN增强版）
- ✅ 工时按小时估算（不允许半天/一天粒度）
- ✅ 每个🟢任务有完整Subagent Prompt
- ✅ 每个任务有属性表 + 描述 + 完成标准 + 技术要点（缺一不可）
- ✅ 任务依赖图（Mermaid）准确
- ✅ **技术故事（EN）任务排在其支撑的业务故事之前**（EN增强版）

---

## 📤 O - 输出要求

### 1. 输出结构

输出完整的Sprint Tasks文档，包含以下6个部分（缺一不可）：

#### 第1部分：Sprint概览

```markdown
# Sprint {N} 任务清单（Lean精简版 · EN增强版）

> **模式**：Agent精简模式（Lean）
> **Sprint**：Sprint {N} — {主题}
> **目标**：{Sprint目标}
> **生成时间**：{YYYY-MM-DD}
> **故事数**：{N} 个（业务 {X} + 技术 {Y}）
> **任务数**：{N} 个
> **预估工时**：{X} 小时
> **模式说明**：本任务清单采用FE/BE/Mock并行策略，技术故事（EN）拆解为工程初始化任务，所有🟢任务含完整Subagent Prompt

---

## 📊 Sprint概览

### 故事清单

| ID | 类型 | 标题 | 优先级 | 尺寸 | 任务数 | 预估工时 |
|----|------|------|--------|------|--------|---------|
| EN001 | 技术 | 前端工程初始化 | P0 | M | 3个 | 8h |
| EN002 | 技术 | 后端工程骨架 | P0 | M | 4个 | 12h |
| US001 | 业务 | 用户注册 | P0 | M | 6个 | 18h |
| US002 | 业务 | 用户登录 | P0 | S | 4个 | 10h |
| US003 | 业务 | 创建任务 | P0 | M | 6个 | 20h |
| **合计** | — | — | — | — | **23个** | **68h** |

### 任务类型分布

| 类型 | 数量 | 占比 | 预估工时 |
|------|------|------|---------|
| 🧪 Mock | 3个 | 13% | 6h |
| 🖥️ BE | 6个 | 26% | 24h |
| 🎨 FE | 6个 | 26% | 22h |
| ✅ QA | 3个 | 13% | 4h |
| 🛠️ 工程初始化（EN） | 5个 | 22% | 12h |
| **合计** | **23个** | **100%** | **68h** |

### AI模式分布

| 模式 | 图标 | 数量 | 说明 |
|------|------|------|------|
| 自主执行 | 🟢 | 10个 | AI可独立完成，人工验收 |
| 协作执行 | 🟡 | 4个 | 需要人工参与决策或审查 |
| 人工执行 | 🔴 | 2个 | AI辅助但主要靠人 |
| 调研任务 | 🟣 | 0个 | 需要探索评估 |
```

---

#### 第2部分：任务拆解策略说明

```markdown
## 🛠️ 任务拆解策略

### 采用策略：FE/BE/Mock并行 + EN工程初始化

每个涉及前后端联调的业务Story拆解为：

```
┌─────────────────────────────────────────────────────────────┐
│  每个涉及前后端联调的 Story 拆解为：                         │
│                                                             │
│  🧪 Mock   → T{NNN}01  接口Mock + 假数据契约（解锁并行）   │
│  🖥️ BE     → T{NNN}02  Schema + Migration                  │
│  🖥️ BE     → T{NNN}03  CRUD API + 单测                     │
│  🎨 FE     → T{NNN}04  页面UI（基于Mock开发）               │
│  🎨 FE     → T{NNN}05  接入真实API + 状态管理               │
│  ✅ QA     → T{NNN}06  端到端联调测试                       │
└─────────────────────────────────────────────────────────────┘
```

每个技术故事（EN）拆解为工程初始化任务（EN增强版）：

```
┌─────────────────────────────────────────────────────────────┐
│  每个技术故事 EN 拆解为工程初始化任务（无Mock环节）：        │
│                                                             │
│  🛠️ 初始化 → E{NNN}01  工程脚手架/初始化                    │
│  🛠️ 配置   → E{NNN}02  依赖/环境/代理/规范配置              │
│  🛠️ 验证   → E{NNN}03  可编译/可启动/规范校验               │
└─────────────────────────────────────────────────────────────┘
```

### 任务编号规则

- **业务故事（US）任务**：`T{NNN}{TT}` — T前缀 + 3位故事号 + 2位任务序号
  - 示例：Story US001的第1个任务 = `T00101`，第2个 = `T00102`
  - 任务序号在单Story内按执行顺序（Mock先 → BE → FE → QA后）
- **技术故事（EN）任务**（EN增强版）：`E{NNN}{TT}` — E前缀 + 3位故事号 + 2位任务序号
  - 示例：EN001的第1个任务 = `E00101`，第2个 = `E00102`
  - 任务序号按执行顺序（初始化 → 配置 → 验证）

### AI模式说明

| 模式 | 说明 | 典型任务 |
|------|------|---------|
| 🟢 **自主执行** | 需求清晰，AI可独立完成，人工验收 | Mock生成、简单CRUD、表单UI、工程初始化 |
| 🟡 **协作执行** | 需要人工参与决策或审查关键步骤 | 复杂业务逻辑、架构决策、性能优化 |
| 🔴 **人工执行** | AI辅助但主要靠人 | 安全审计、外部系统对接、UX决策 |
| 🟣 **调研任务** | 需要探索评估，产出方案文档 | 技术选型、第三方API调研 |
```

---

#### 第3部分：任务详细清单

```markdown
## 📋 任务详细清单

---

### �️ EN001: 前端工程初始化（P0，M尺寸，8h）

**价值主张**：建立可运行的 Vue3+TS 前端工程，支撑看板（US008/US009）等页面开发。

**验收标准（Checklist）**：
- [ ] 前端工程可 `npm run dev` 启动
- [ ] 集成 Vue3 + TS + Pinia + vue-router + ESLint
- [ ] 复用设计系统 style.css

---

#### E00101: 工程初始化 - 前端脚手架 🟢

| 属性 | 值 |
|------|-----|
| 关联Story | EN001 |
| 关联接口/表 | 无（工程初始化，不涉及具体接口/表；输入引用ADR-013） |
| 类别 | 工程初始化 |
| 类型 | 开发 |
| 工时 | 4h |
| 负责人 | FE/全栈 |
| AI模式 | 🟢 自主执行 |
| 依赖 | 无 |
| 执行时间 | Day 0 |

**任务描述**:
搭建 Vue3 + TypeScript 前端工程骨架（Vite + Pinia + vue-router），集成代码规范（ESLint/Prettier），复用设计系统 style.css。

**完成标准**:
- [ ] 前端工程可 `npm run dev` 启动，访问首页正常
- [ ] 集成 Vue3 + TS + Pinia + vue-router
- [ ] 集成 ESLint/Prettier，`npm run lint` 通过
- [ ] 环境配置（.env.development / .env.production）就绪

**技术要点**:
- Vite + Vue3 + TypeScript（strict mode）
- 脚手架命令（示例）：`npm create vite@latest frontend -- --template vue-ts`

**Subagent Prompt**（🟢任务强制必填）:
```text
任务: 搭建前端工程脚手架（Vite + Vue3 + TS）
输入:
  - ADR-013前端架构（docs/软件设计/ADR/ADR-013-前端架构方案.md）
  - 技术故事验收标准（EN001）
输出:
  - 前端工程骨架（路径：frontend/）
  - 依赖配置（frontend/package.json）
  - 环境变量（frontend/.env.development / .env.production）
约束:
  - Vue 3 + TypeScript strict mode
  - 集成 Pinia + vue-router + ESLint/Prettier
  - npm run dev 可启动
参考:
  - ADR-013前端架构方案
```

---

#### E00102: 配置 - 依赖/代理/规范 🟢

| 属性 | 值 |
|------|-----|
| 关联Story | EN001 |
| 关联接口/表 | 无（工程初始化） |
| 类别 | 工程初始化 |
| 类型 | 配置 |
| 工时 | 2h |
| 负责人 | FE/全栈 |
| AI模式 | 🟢 自主执行 |
| 依赖 | E00101 |
| 执行时间 | Day 0 |

**任务描述**:
配置前端代理（CORS/代理到后端）、代码规范细节（editorconfig/commitlint）、基础目录结构。

**完成标准**:
- [ ] Vite 代理配置（/api → 后端地址）
- [ ] .editorconfig / commitlint 配置
- [ ] npm run lint 与 npm run build 通过

**Subagent Prompt**:
```text
任务: 配置前端工程代理/规范/目录结构
输入:
  - 前端工程骨架（frontend/，E00101产出）
  - ADR-013前端架构
输出:
  - Vite代理配置（frontend/vite.config.ts）
  - 规范配置（.editorconfig / commitlint）
约束:
  - /api代理到后端
  - npm run lint/build通过
参考:
  - ADR-013、Vite文档
```

---

#### E00103: 验证 - 可启动/规范校验 🟢

| 属性 | 值 |
|------|-----|
| 关联Story | EN001 |
| 关联接口/表 | 无（工程初始化） |
| 类别 | 工程初始化 |
| 类型 | 验证 |
| 工时 | 2h |
| 负责人 | QA/FE |
| AI模式 | 🟢 自主执行 |
| 依赖 | E00102 |
| 执行时间 | Day 1 |

**任务描述**:
验证前端工程可启动、构建通过、规范校验通过，输出工程初始化验收结论。

**完成标准**:
- [ ] `npm run dev` 启动正常，首页可见
- [ ] `npm run build` 构建通过
- [ ] `npm run lint` 通过
- [ ] 记录验收结论（通过/问题清单）

**Subagent Prompt**:
```text
任务: 验证前端工程初始化验收标准
输入:
  - 前端工程（frontend/，E00101/E00102产出）
  - 技术故事验收标准（EN001）
输出:
  - 验收结论（frontend/EN001-验收.md）
约束:
  - 验证npm run dev/build/lint
  - 逐条核对EN001验收标准
```

---

### �📦 US001: 用户注册（P0，M尺寸，18h）

**Story概述**：新用户通过手机号和密码完成注册

**验收标准**：
- [ ] 注册页面包含：手机号、密码、确认密码输入框
- [ ] 手机号验证：11位数字，格式正确
- [ ] 密码强度：至少8位，包含字母和数字
- [ ] 注册成功后自动登录，跳转到首页
- [ ] 重复手机号提示"该手机号已注册"

---

#### T00101: 接口Mock - 用户注册API 🟢

| 属性 | 值 |
|------|-----|
| 关联Story | US001 |
| 关联接口/表 | API-001（Mock，摘自HLD-Sprint摘要索引） |
| 类别 | Mock |
| 类型 | 开发 |
| 工时 | 2h |
| 负责人 | 待分配 |
| AI模式 | 🟢 自主执行 |
| 依赖 | 无 |
| 执行时间 | Day 1 |

**任务描述**:
创建用户注册API的Mock接口，返回假数据，支持前端独立开发。包括成功和失败两种场景的Mock响应。

**完成标准**:
- [ ] Mock API接口：POST /api/users/register
- [ ] 成功场景：返回用户ID、token、用户信息
- [ ] 失败场景：手机号已注册返回400错误
- [ ] Mock数据符合真实API契约（如有）
- [ ] 支持前端调用，响应时间<100ms

**技术要点**:
- 使用MSW（Mock Service Worker）或json-server实现Mock
- 成功响应示例：
  ```json
  {
    "code": 200,
    "data": {
      "userId": "mock-uuid-001",
      "token": "mock-jwt-token",
      "user": {
        "id": "mock-uuid-001",
        "phone": "13800138000",
        "role": "user"
      }
    }
  }
  ```
- 失败响应（手机号已注册）：
  ```json
  {
    "code": 400,
    "message": "该手机号已注册"
  }
  ```
- 手机号验证逻辑：检查是否为"13800138000"（Mock为已注册）

**Subagent Prompt**（🟢任务强制必填）:
```text
任务: 创建用户注册API的Mock接口
输入:
  - API契约文档（如有，路径：docs/design/api-contract.md）
  - 用户故事验收标准（US001）
输出:
  - Mock接口实现代码（路径：src/mocks/register.mock.ts）
  - Mock配置文件（路径：src/mocks/handlers.ts）
约束:
  - 使用MSW库（Mock Service Worker）
  - TypeScript strict mode
  - 成功和失败两种场景都要Mock
  - 响应格式必须符合API契约（如有）
参考:
  - MSW官方文档：https://mswjs.io/docs/
  - 项目现有Mock示例（如有）：src/mocks/
```

---

#### T00102: Schema设计 - users表 🟢

| 属性 | 值 |
|------|-----|
| 关联Story | US001 |
| 关联接口/表 | T-001（摘自HLD-Sprint摘要索引） |
| 类别 | BE |
| 类型 | 开发 |
| 工时 | 3h |
| 负责人 | BE/全栈 |
| AI模式 | 🟢 自主执行 |
| 依赖 | 无 |
| 执行时间 | Day 1 |

**任务描述**:
设计users表的数据库Schema，包括字段定义、索引、约束，生成数据库迁移脚本（Migration）。

**完成标准**:
- [ ] 定义users表结构（字段/类型/约束）
- [ ] 创建Prisma Schema（如使用Prisma）或SQL Migration脚本
- [ ] 字段包含：id（UUID PK）、phone（UNIQUE）、password_hash、role、created_at
- [ ] 添加索引：phone字段（UNIQUE INDEX）
- [ ] 生成Migration脚本，可执行成功

**技术要点**:
- 使用Prisma ORM（或指定的ORM）
- users表Schema示例：
  ```prisma
  model User {
    id            String   @id @default(uuid())
    phone         String   @unique @db.VarChar(11)
    password_hash String   @db.VarChar(255)
    role          Role     @default(USER)
    created_at    DateTime @default(now())
  }
  
  enum Role {
    USER
    ADMIN
  }
  ```
- 执行Migration命令：`npx prisma migrate dev --name create_users_table`

**Subagent Prompt**:
```text
任务: 设计users表的数据库Schema并生成Migration
输入:
  - 用户故事验收标准（US001）
  - 数据库设计文档（如有，路径：docs/design/schema.md）
输出:
  - Prisma Schema定义（路径：prisma/schema.prisma）
  - Migration脚本（路径：prisma/migrations/）
约束:
  - 使用Prisma ORM
  - 字段必须包含：id/phone/password_hash/role/created_at
  - phone字段必须唯一（UNIQUE INDEX）
  - TypeScript strict mode
参考:
  - Prisma Schema文档：https://www.prisma.io/docs/concepts/components/prisma-schema
  - 项目现有Schema示例：prisma/schema.prisma
```

---

#### T00103: API实现 - 用户注册CRUD + 单测 🟢

| 属性 | 值 |
|------|-----|
| 关联Story | US001 |
| 关联接口/表 | API-001（摘自HLD-Sprint摘要索引） |
| 类别 | BE |
| 类型 | 开发 |
| 工时 | 6h |
| 负责人 | BE/全栈 |
| AI模式 | 🟢 自主执行 |
| 依赖 | T00102 |
| 执行时间 | Day 2 |

**任务描述**:
实现用户注册API（POST /api/users/register），包括参数验证、密码加密、数据库写入、JWT生成，编写单元测试覆盖主要场景。

**完成标准**:
- [ ] API接口：POST /api/users/register
- [ ] 参数验证：手机号格式（11位）、密码强度（≥8位，含字母和数字）
- [ ] 密码加密：使用bcrypt，salt轮数≥10
- [ ] JWT生成：有效期24小时，包含userId和role
- [ ] 重复手机号检查：返回400错误"该手机号已注册"
- [ ] 单元测试覆盖：成功注册、手机号已存在、参数校验失败（至少3个用例）

**技术要点**:
- 使用Express.js + Prisma ORM
- bcrypt加密：`bcrypt.hash(password, 10)`
- JWT生成：`jwt.sign({ userId, role }, SECRET, { expiresIn: '24h' })`
- 参数验证：使用Joi或Zod库
- 单元测试：使用Jest + Supertest
- 成功响应示例（同Mock中定义）
- 错误处理：
  - 手机号格式错误：400 "手机号格式不正确"
  - 密码强度不足：400 "密码至少8位，包含字母和数字"
  - 手机号已注册：400 "该手机号已注册"

**Subagent Prompt**:
```text
任务: 实现用户注册API及单元测试
输入:
  - users表Schema（prisma/schema.prisma）
  - API契约文档（如有，路径：docs/design/api-contract.md）
  - Mock接口实现（参考响应格式）：src/mocks/register.mock.ts
输出:
  - API实现代码（路径：src/api/users/register.ts）
  - 单元测试（路径：src/api/users/register.test.ts）
约束:
  - 使用Express.js + Prisma ORM
  - 密码使用bcrypt加密，salt轮数≥10
  - JWT有效期24小时
  - 参数验证使用Joi或Zod
  - 单元测试覆盖率≥80%
  - TypeScript strict mode
参考:
  - bcrypt文档：https://www.npmjs.com/package/bcrypt
  - jsonwebtoken文档：https://www.npmjs.com/package/jsonwebtoken
  - 项目现有API示例：src/api/
```

---

#### T00104: 页面UI - 用户注册表单（基于Mock） 🟢

| 属性 | 值 |
|------|-----|
| 关联Story | US001 |
| 关联接口/表 | API-001（Mock契约，摘自HLD-Sprint摘要索引） |
| 类别 | FE |
| 类型 | 开发 |
| 工时 | 5h |
| 负责人 | FE/全栈 |
| AI模式 | 🟢 自主执行 |
| 依赖 | T00101（Mock） |
| 执行时间 | Day 2（可与BE并行） |

**任务描述**:
开发用户注册页面UI，包括手机号、密码、确认密码输入框，前端参数验证，调用Mock API完成注册流程，处理成功和失败场景。

**完成标准**:
- [ ] 注册页面包含：手机号、密码、确认密码输入框、提交按钮
- [ ] 前端验证：手机号格式（11位）、密码强度（≥8位）、两次密码一致
- [ ] 调用Mock API：POST /api/users/register
- [ ] 成功场景：显示"注册成功"，保存token到localStorage，跳转到首页
- [ ] 失败场景：显示错误提示（如"该手机号已注册"）
- [ ] 响应式布局：支持移动端和桌面端

**技术要点**:
- 使用React + TypeScript（或指定框架）
- 表单验证：使用React Hook Form + Yup
- API调用：使用Axios或Fetch API
- 状态管理：使用React useState或Context
- 路由跳转：使用React Router
- UI组件库：使用Ant Design或Material-UI（如项目使用）
- 手机号验证正则：`/^1[3-9]\d{9}$/`
- 密码强度正则：`/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/`

**Subagent Prompt**:
```text
任务: 开发用户注册页面UI（基于Mock API）
输入:
  - Mock API接口（src/mocks/register.mock.ts）
  - UI设计稿（如有）
  - 用户故事验收标准（US001）
输出:
  - 注册页面组件（路径：src/pages/Register.tsx）
  - 表单验证逻辑（路径：src/pages/Register.tsx）
约束:
  - 使用React + TypeScript
  - 表单验证使用React Hook Form + Yup
  - API调用使用Axios
  - 响应式布局（支持移动端和桌面端）
  - TypeScript strict mode
参考:
  - React Hook Form文档：https://react-hook-form.com/
  - Yup文档：https://github.com/jquense/yup
  - 项目现有页面示例：src/pages/
```

---

#### T00105: 接入真实API + 状态管理 🟡

| 属性 | 值 |
|------|-----|
| 关联Story | US001 |
| 关联接口/表 | API-001（摘自HLD-Sprint摘要索引） |
| 类别 | FE |
| 类型 | 集成 |
| 工时 | 2h |
| 负责人 | FE/全栈 |
| AI模式 | 🟡 协作执行 |
| 依赖 | T00103（BE API）、T00104（FE UI）|
| 执行时间 | Day 3 |

**任务描述**:
将前端注册页面从Mock API切换到真实后端API，配置环境变量，实现用户状态管理（登录状态/token存储），处理真实API的错误场景。

**完成标准**:
- [ ] 将API调用从Mock切换到真实后端（环境变量配置）
- [ ] token存储：成功注册后保存token到localStorage
- [ ] 用户状态管理：使用Context或Redux管理登录状态
- [ ] 错误处理：真实API的错误响应（如500错误）有友好提示
- [ ] 联调测试：前后端联调成功，注册流程完整

**技术要点**:
- 环境变量配置：`.env.development`（Mock）和`.env.production`（真实API）
- API Base URL切换：
  ```typescript
  const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:3000'
  ```
- token存储：`localStorage.setItem('token', data.token)`
- 用户状态管理：
  ```typescript
  const [user, setUser] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  ```
- 错误处理：捕获Axios错误，显示友好提示

**Subagent Prompt**:
```text
任务: 将注册页面从Mock API切换到真实API，实现状态管理
输入:
  - 注册页面组件（src/pages/Register.tsx）
  - 后端API地址（如：http://localhost:3000）
  - 真实API契约（docs/design/api-contract.md）
输出:
  - 更新后的注册页面（src/pages/Register.tsx）
  - 环境变量配置（.env.development / .env.production）
  - 用户状态管理（src/context/AuthContext.tsx 或 Redux store）
约束:
  - API Base URL从环境变量读取
  - token存储到localStorage
  - 使用Context或Redux管理用户状态
  - 错误处理完善（网络错误/服务器错误）
  - TypeScript strict mode
参考:
  - React Context文档：https://react.dev/reference/react/createContext
  - 项目现有状态管理示例：src/context/
```

---

#### T00106: 端到端联调测试 ✅ 🟢

| 属性 | 值 |
|------|-----|
| 关联Story | US001 |
| 关联接口/表 | API-001, T-001（摘自HLD-Sprint摘要索引） |
| 类别 | QA |
| 类型 | 测试 |
| 工时 | 0.5h |
| 负责人 | QA/全栈 |
| AI模式 | 🟢 自主执行 |
| 依赖 | T00105（FE接入真实API）|
| 执行时间 | Day 3 |

**任务描述**:
编写端到端测试用例，验证用户注册完整流程（前端 → 后端 → 数据库），覆盖成功和失败场景。

**完成标准**:
- [ ] E2E测试用例：成功注册（新手机号）
- [ ] E2E测试用例：失败注册（手机号已存在）
- [ ] E2E测试用例：参数验证失败（手机号格式错误）
- [ ] 测试通过率100%
- [ ] 测试报告生成（HTML格式）

**技术要点**:
- 使用Playwright或Cypress编写E2E测试
- 测试场景：
  1. 打开注册页面
  2. 填写手机号、密码、确认密码
  3. 点击提交按钮
  4. 验证：成功提示、跳转到首页、token存储到localStorage
  5. 验证数据库：users表有新记录
- 失败场景：
  1. 填写已存在的手机号
  2. 验证错误提示："该手机号已注册"

**Subagent Prompt**:
```text
任务: 编写用户注册的端到端测试
输入:
  - 注册页面URL（如：http://localhost:3000/register）
  - 用户故事验收标准（US001）
  - API契约（docs/design/api-contract.md）
输出:
  - E2E测试脚本（路径：e2e/register.spec.ts）
  - 测试报告（路径：e2e-reports/）
约束:
  - 使用Playwright或Cypress
  - 覆盖成功和失败场景
  - 测试通过率100%
  - TypeScript strict mode
参考:
  - Playwright文档：https://playwright.dev/
  - 项目现有E2E测试示例：e2e/
```

---

{其他Story的任务拆解，同上格式}

---
```

---

#### 第4部分：任务依赖图

```markdown
## 🔗 任务依赖图

\`\`\`mermaid
graph TD
    E00101[E00101: 前端脚手架] --> E00102[E00102: 配置] --> E00103[E00103: 验证]
    E00101 -.->|提供运行环境| T00104[T00104: FE页面UI]
    T00101[T00101: Mock注册API] --> T00104[T00104: FE页面UI]
    T00102[T00102: Schema设计] --> T00103[T00103: BE API实现]
    T00103 --> T00105[T00105: 接入真实API]
    T00104 --> T00105
    T00105 --> T00106[T00106: E2E测试]
    
    T00201[T00201: Mock登录API] --> T00204[T00204: FE登录页面]
    T00202[T00202: 登录API实现] --> T00205[T00205: 接入真实API]
    T00204 --> T00205
    T00205 --> T00206[T00206: E2E测试]
\`\`\`

**依赖说明**：
- **EN任务前置**（EN增强版）：E00101（脚手架）→ E00102（配置）→ E00103（验证），且为 FE 业务任务提供运行环境
- Mock任务前置：T00101（Mock）→ T00104（FE UI），解锁前后端并行
- BE任务串行：T00102（Schema）→ T00103（API）
- FE集成任务：T00103（BE）+ T00104（FE）→ T00105（集成）
- QA测试任务：T00105（集成）→ T00106（E2E测试）
```

---

#### 第5部分：执行时间线

```markdown
## 📅 执行时间线（建议）

### Day 0（EN前置 · 工程初始化）

| 时段 | 任务 | 负责人 | 工时 | 状态 |
|------|------|--------|------|------|
| 上午 | E00101: 前端脚手架 | FE/全栈 | 4h | 🔲 待开始 |
| 上午 | E00102: 后端工程骨架 | BE/全栈 | 4h | 🔲 待开始 |
| 下午 | E00103: 配置与验证 | FE/BE | 4h | 🔲 待开始 |

**EN前置说明**：工程初始化任务在 Sprint 最前，为业务故事提供运行环境

---

### Day 1（{N}h）

| 时段 | 任务 | 负责人 | 工时 | 状态 |
|------|------|--------|------|------|
| 上午 | T00101: Mock注册API | 待分配 | 2h | 🔲 待开始 |
| 上午 | T00102: Schema设计 | BE/全栈 | 3h | 🔲 待开始 |
| 下午 | T00103: BE API实现（部分）| BE/全栈 | 3h | 🔲 待开始 |

**并行开发**：T00101（Mock）完成后，FE可立即开始T00104

---

### Day 2（{N}h）

| 时段 | 任务 | 负责人 | 工时 | 状态 |
|------|------|--------|------|------|
| 上午 | T00103: BE API实现（完成）| BE/全栈 | 3h | 🔲 待开始 |
| 上午 | T00104: FE页面UI | FE/全栈 | 5h | 🔲 待开始 |
| 下午 | T00104: FE页面UI（完成）| FE/全栈 | — | 🔲 待开始 |

**并行开发**：T00103（BE）和T00104（FE）可并行

---

### Day 3（{N}h）

| 时段 | 任务 | 负责人 | 工时 | 状态 |
|------|------|--------|------|------|
| 上午 | T00105: 接入真实API | FE/全栈 | 2h | 🔲 待开始 |
| 上午 | T00106: E2E测试 | QA/全栈 | 0.5h | 🔲 待开始 |
| 下午 | T00201: Mock登录API | 待分配 | 2h | 🔲 待开始 |

**关键路径**：US001完成（T00106）后，开始US002
```

---

#### 第6部分：风险与应对

```markdown
## ⚠️ 风险与应对

| 任务 | 风险类型 | 风险描述 | 缓解措施 |
|------|---------|---------|---------|
| T00103 | tech | bcrypt加密性能，salt轮数过高导致注册慢 | 调整salt轮数为10（默认），实测注册<500ms |
| T00105 | external | 后端API未就绪，前端无法联调 | 保留Mock开关，可随时切换回Mock环境 |
| T00106 | unknown | E2E测试环境不稳定，数据库脏数据影响 | 每次测试前清空users表，使用测试专用数据库 |
| E00101（EN） | tech | 前端脚手架版本兼容问题 | 固定依赖版本并纳入依赖审计 |

**高风险任务处理建议**：
- E00101/E00102（EN工程初始化）：Sprint 最早执行，为业务开发铺路
- T00103（BE API）：优先级最高，尽早完成并单元测试
- T00105（集成）：预留Buffer时间（+1h），应对联调问题
```

---

### 2. 质量要求

#### 任务编号强制规则
- 格式：`T{NNN}{TT}`，T前缀 + 3位故事号 + 2位序号（业务故事）
- 格式（EN增强版）：`E{NNN}{TT}`，E前缀 + 3位故事号 + 2位序号（技术故事）
- 示例：`T00101`、`T00102`、`T00110`、`E00101`、`E00201`
- 序号在单Story内按执行顺序（业务：Mock → BE → FE → QA；技术：初始化 → 配置 → 验证）

#### 关联接口/表字段强制规则

- 每个任务的属性表**必须**包含「关联接口/表」行，填写该任务涉及的接口编号（如API-001）或表编号（如T-001），编号需与材料3（HLD-Sprint摘要提取输出，或HLD-02/03第8章索引）保持一致
- 若材料3未提供，或该任务确实不涉及具体接口/表（如纯前端静态页面、**EN工程初始化任务**），填写`无`并说明原因（EN 任务可标注其输入设计文档引用如 ADR-013），不得留空
- 完成标准中若涉及横切约束（🔒安全/🔁幂等/⏱性能等，来自材料3第4章"横切约束汇总"），必须在"完成标准"中体现为具体检查项（见下方"约束覆盖检查项"）；EN 任务若其输入设计文档标注了约束（如"密码字段仅存密文"），同样须在完成标准覆盖

#### Subagent Prompt强制要求（🟢任务）

所有🟢任务必须包含完整Subagent Prompt，格式如下：

```text
任务: {一句话任务目标}
输入:
  - {输入文件/上下文，具体路径}
  - {输入文件/上下文，具体路径}
输出:
  - {期望产出，具体文件路径或代码位置}
  - {期望产出，具体文件路径或代码位置}
约束:
  - {技术约束，如：TypeScript strict mode，不允许any}
  - {技术约束，如：单元测试覆盖率≥80%}
参考:
  - {参考代码/文档路径}
  - {参考代码/文档路径}
```

**禁止模糊Prompt**：
- ❌ "参考项目现有代码"（未指定具体路径）
- ❌ "使用合适的技术实现"（未指定具体技术）
- ✅ "参考src/api/login.ts的实现方式"（具体路径）
- ✅ "使用Prisma ORM + bcrypt加密"（具体技术）

#### 技术要点具体化

- ❌ 不允许：**"实现用户注册功能"**
- ✅ 正确：
  - **POST /api/users/register**
  - **参数验证：手机号11位数字正则`/^1[3-9]\d{9}$/`**
  - **密码加密：bcrypt.hash(password, 10)**
  - **JWT生成：有效期24小时，包含userId和role**

#### 任务粒度控制

- 单任务工时：2-8h（超过8h必须拆分）
- Mock任务：通常1-2h（简单Mock）
- BE任务：Schema（2-3h）+ API实现（4-6h）
- FE任务：UI开发（3-5h）+ 接入API（1-2h）
- QA任务：E2E测试（0.5-1h/Story）
- EN工程初始化任务（EN增强版）：初始化（3-4h）+ 配置（1-2h）+ 验证（1-2h）

#### 约束覆盖检查项（完成标准模板新增）

若"关联接口/表"对应的技术设计摘要（材料3第4章"横切约束汇总"）中标注了约束（🔒/🔁/⏱等），"完成标准"清单中必须新增至少一条对应检查项，明确该约束在本任务中如何落地，例如：

- 🔒约束 → 完成标准新增：`[ ] 敏感字段已加密 / 接口已加限流`
- 🔁约束 → 完成标准新增：`[ ] 更新操作已带version字段做乐观锁校验`
- ⏱约束 → 完成标准新增：`[ ] 响应时间已实测满足SLA要求`

若该任务的关联接口/表无横切约束，可省略此项，不强行添加。

---

### 3. 格式规范

- **文档格式**：Markdown
- **表格**：用于结构化信息展示（任务属性表、时间线、风险清单）
- **emoji**：任务类型标识（🧪/🖥️/🎨/✅/🛠️）、AI模式（🟢/🟡/🔴/🟣）
- **Mermaid图表**：任务依赖关系必须使用Mermaid graph TD格式
- **代码块**：技术要点中的代码示例、API请求/响应示例

---

### 4. 特别说明

#### 关于Mock任务的必要性判断

**必须有Mock任务的情况**：
- Story涉及前后端联调，2人小队 → ✅必须有Mock（解锁并行）
- Story涉及前后端联调，1人 + AI Subagent → ✅建议保留（Mock是Subagent的契约输入）

**可省略Mock任务的情况**：
- 1人BE先行策略（独立开发者打算先完成BE → FE顺序开发）→ ⚪可省略
  - 需在任务清单开头说明：`// Mock省略：1人BE先行策略`
- 纯前端Story（静态数据）→ ❌跳过Mock
- 纯后端Story（无前端）→ ❌跳过Mock
- 第三方API集成 → ✅Mock第三方API

#### 关于技术故事（EN）的任务形态（EN增强版）

**EN 任务没有 Mock 环节**，因为工程环境本身不需要前后端联调 Mock：
- 工程初始化类 EN → 拆为 初始化/配置/验证 三类任务
- CI/CD 类 EN → 拆为 流水线脚本/构建配置/部署验证
- 测试基建类 EN → 拆为 测试框架接入/配置/冒烟验证
- 数据库版本管理类 EN → 拆为 Migration 初始化/Seed 数据/迁移验证

**EN 任务前置**：EN 任务通常排在 Sprint Day 0/1，作为业务故事的前置条件。

#### 关于🟡/🔴任务的Prompt

- 🟡（协作执行）：Prompt可简化，因为需要人工参与决策
- 🔴（人工执行）：Prompt是"辅助提示"，不是完整执行指令
- 🟣（调研任务）：Prompt重点在"输出格式"（调研报告结构）

#### 信息不足的处理方式

如果用户故事或技术设计中缺少某些信息（如API契约未定义），你应该：
1. **合理推断**：基于行业经验给出API设计（标注`（推断）`）
2. **明确标注**：在任务描述中标注 `⚠️ API契约待确认，当前为推断设计`
3. **列入风险**：在风险清单中标注 `risk: unknown — API契约未定义`

---

## ✨ 输出格式

直接输出完整的Sprint Tasks文档，不要有任何前言或解释。

文档开头必须包含：
```markdown
# Sprint {N} 任务清单（Lean精简版 · EN增强版）

> **模式**：Agent精简模式（Lean）
> **Sprint**：Sprint {N} — {主题}
> **目标**：{Sprint目标}
> **生成时间**：{YYYY-MM-DD}
> **故事数**：{N} 个（业务 {X} + 技术 {Y}）
> **任务数**：{N} 个
> **预估工时**：{X} 小时
> **模式说明**：本任务清单采用FE/BE/Mock并行策略，技术故事（EN）拆解为工程初始化任务，所有🟢任务含完整Subagent Prompt
```

文档结尾必须包含：
```markdown
---

## 📌 下一步行动

**本Sprint执行阶段**：
1. 开始执行🟢任务（AI Subagent可自主完成）
2. 🟡任务需要与负责人确认关键决策点
3. 🔴任务需要人工主导，AI辅助提供技术建议
4. 每日Stand-up跟踪任务进度，更新状态（🔲待开始 → 🔄进行中 → ✅已完成）

**下一Sprint规划**（⭐ 推荐做法）：
- ✅ **等本Sprint完成后**，再使用本提示词生成下一Sprint的任务
- ✅ 这样可以根据本Sprint的实际情况（进度、变更、风险）调整下一Sprint的计划
- ❌ **不推荐**：一次性生成所有Sprint的任务（除非是Agent流水线场景）
```

---

**生成提示**: 直接输出Sprint Tasks文档，不要有任何前言或解释。

---

## 🔄 版本历史

| 版本 | 日期       | 更新内容 | 作者 |
| ---- | ---------- | -------------------------------------------------------------- | ------ |
| v1.0 | 2026-08-29 | 阶段2版：材料3强指令改写（HLD-Sprint摘要提取输出+技术栈强指令）、任务属性表"关联接口/表"列、完成标准"约束覆盖检查项" | 流程优化-设计迭代衔接 |
| v1.1 | 2026-08-31 | **EN整合**：叠加技术故事（EN）任务拆解支持——材料2b EN详情输入、EN拆解原则（无Mock/Day 0前置）、E{NNN}{TT}编号、Sprint概览EN统计、EN任务卡片示例、依赖图/时间线/风险支持EN | 流程优化-技术故事整合 |
