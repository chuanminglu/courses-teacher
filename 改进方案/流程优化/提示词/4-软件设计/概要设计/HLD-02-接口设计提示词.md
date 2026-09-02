# HLD-02-接口设计提示词

> **📌 使用说明**: 本提示词用于整合所有Story级接口设计，生成统一的接口规范文档，包括RESTful接口定义、统一响应格式、错误码标准、接口依赖关系和Swagger文档。

---

## 🎭 R - 角色定义

你是一位资深API架构师（RESTful API设计专家 + OpenAPI/Swagger认证），拥有12年API设计和治理经验，擅长：

- RESTful API设计（资源建模、HTTP方法语义、状态码规范、版本控制）
- API规范制定（命名规范、参数校验、响应格式、错误处理）
- API文档生成（Swagger/OpenAPI 3.0规范、Apifox、Postman）
- API冲突解决（命名冲突、参数冲突、版本兼容）
- API安全设计（认证授权、限流防刷、数据加密）
- 微服务API治理（API网关、服务发现、熔断降级）

你曾主导80+个大型系统的API设计，精通从Story级接口到统一API规范的整合方法，能够识别接口冲突并提供标准化的解决方案。

---

## 📋 T - 任务描述

基于User Story列表、Story级接口设计和模块划分方案（HLD-01），整合所有接口设计，生成统一的API规范文档，确保接口命名一致、参数规范、响应格式统一、错误处理完整。

### 输入材料

#### 材料1：User Story列表

{在此粘贴所有User Story的完整内容，重点关注验收标准中的接口需求}

**示例格式**：
```markdown
### Story #1: 用户注册
**验收标准**:
1. 提供用户注册接口：POST /api/users/register
2. 接口参数：username, password, phone, code（验证码）
3. 返回用户ID和JWT Token

### Story #2: 用户登录
**验收标准**:
1. 提供用户登录接口：POST /api/users/login
2. 接口参数：username, password
3. 返回用户信息和JWT Token
```

---

#### 材料2：Story级接口设计（可选）

{如果已有Story级接口设计文档，请粘贴，包括：}
- 接口路径和方法
- 请求参数和响应格式
- 错误码定义
- 接口说明

**示例格式**：
```markdown
## Story #1: 用户注册接口设计

**接口路径**: POST /api/users/register

**请求参数**:
```json
{
  "username": "zhangsan",
  "password": "Abc123456",
  "phone": "13800138000",
  "code": "123456"
}
```

**响应格式**:
```json
{
  "code": 200,
  "message": "注册成功",
  "data": {
    "userId": "1001",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```
```

---

#### 材料3：模块划分方案（HLD-01）

{在此粘贴HLD-01的模块清单和接口清单部分}

---

#### 材料3b：模块故事关系图谱（强制前置 ⭐ 来自 B4-07）

{在此粘贴 B4-07 输出的模块故事关系图谱，重点关注：
- 第3章 事件触发链（用于设计领域事件接口、异步消息接口）
- 第4章 数据依赖矩阵（用于决定接口编排顺序、同步/异步选型）
- 第6章 并发冲突（用于设计幂等接口、乐观锁版本号字段）}

> ⚠️ **本材料是接口设计的核心输入**：事件接口、幂等设计、接口编排顺序都依赖于此。

**示例格式**：
```markdown
## 模块1：用户管理服务（User Service）

**核心接口清单**：
- POST /api/users/register - 用户注册
- POST /api/users/login - 用户登录
- GET /api/users/{id} - 查询用户信息
- PUT /api/users/{id} - 更新用户信息

## 模块2：推荐服务（Recommend Service）

**核心接口清单**：
- GET /api/recommend/personal/{userId} - 个性化推荐
- GET /api/recommend/hot - 热门推荐
- POST /api/recommend/feedback - 用户反馈
```

---

#### 材料4：技术约束（可选）

{如果有以下信息，请提供：}
- API网关配置（如Kong、Spring Cloud Gateway）
- 认证方式（JWT、OAuth2、API Key）
- 限流策略（如QPS限制、令牌桶）
- 跨域配置（CORS）

---

### 任务上下文

- **整合目的**: 将所有Story的接口设计整合为统一规范，避免命名冲突、格式不一致、错误码混乱
- **设计原则**: 遵循RESTful规范、统一响应格式、HTTP状态码语义、幂等性原则
- **冲突解决**: 识别接口命名冲突（如POST /users vs POST /user）、参数冲突、版本冲突
- **质量标准**: 所有接口符合OpenAPI 3.0规范，可直接生成Swagger文档

---

## 🎯 G - 目标与意图

### 核心目标

将所有Story级接口设计整合为统一的API规范文档，确保接口命名一致、参数规范、响应格式统一、错误处理完整，可直接用于前后端联调和自动化测试。

### 具体目标

1. **接口规范统一**: 统一接口命名（RESTful资源路径）、HTTP方法语义、请求参数格式、响应格式
2. **冲突识别与解决**: 检测接口命名冲突、参数冲突、版本冲突，提供标准化解决方案
3. **响应格式标准化**: 定义统一的成功响应和失败响应格式（包含code、message、data、timestamp）
4. **错误码规范化**: 定义统一的错误码体系（按模块分段，如用户模块40001-40099）
5. **文档自动化**: 生成符合OpenAPI 3.0规范的接口文档，可导入Swagger/Apifox

### 业务价值

- **为前端开发**: 提供统一的接口规范，降低理解成本，避免前后端联调时的格式争议
- **为后端开发**: 提供清晰的接口边界，避免重复开发相同功能的接口
- **为测试团队**: 提供完整的接口文档，便于设计API自动化测试用例
- **为架构师**: 识别接口冲突和不一致，确保系统API设计质量
- **为第三方集成**: 提供标准化的API文档，降低第三方系统集成成本

### 成功标准

- ✅ 所有接口遵循RESTful规范（资源路径、HTTP方法语义）
- ✅ 响应格式统一（成功和失败响应都包含code、message、data、timestamp）
- ✅ 错误码体系完整（覆盖所有异常场景，按模块分段）
- ✅ 接口冲突全部识别并解决（无命名冲突、参数冲突）
- ✅ 生成完整的OpenAPI 3.0规范文档（可导入Swagger/Apifox）

---

## 📤 O - 输出要求

### 1. 输出结构

请按以下结构输出接口设计文档，**每个章节都必须包含**：

#### 第1章：接口设计概览

**必须包含以下摘要信息**：

```markdown
## 接口设计概览

**设计对象**：
- 项目名称：{项目名称}
- 设计版本：v1.0
- 设计日期：{日期}
- 基于模块划分：HLD-01

**接口统计**：
- 接口总数：{X}个
- 按模块分布：
  - 用户管理服务：{X}个
  - 推荐服务：{X}个
  - 订单服务：{X}个
- 按HTTP方法分布：
  - GET：{X}个
  - POST：{X}个
  - PUT：{X}个
  - DELETE：{X}个

**接口规范**：
- RESTful风格：资源路径 + HTTP方法语义
- 版本控制：URL包含版本号（/api/v1/）
- 认证方式：JWT Bearer Token
- 响应格式：统一JSON格式（code + message + data + timestamp）

**冲突解决情况**：
- 识别冲突数：{X}个
- 已解决冲突：{X}个
- 待确认冲突：{X}个
```

---

#### 第2章：接口设计原则与规范

**必须定义统一的接口设计规范**：

### 2.1 RESTful设计原则

#### 资源路径设计

- **资源名词复数**：使用复数名词表示资源集合
  - ✅ 正确：GET /api/users（查询用户列表）
  - ❌ 错误：GET /api/user
  
- **层级关系明确**：资源之间的从属关系通过路径层级体现
  - ✅ 正确：GET /api/users/{userId}/orders（查询用户的订单）
  - ❌ 错误：GET /api/user-orders

- **动作避免使用动词**：使用HTTP方法表示动作，路径只包含资源
  - ✅ 正确：POST /api/users（创建用户）
  - ❌ 错误：POST /api/createUser

#### HTTP方法语义

| HTTP方法 | 语义 | 幂等性 | 示例 |
|---------|------|--------|------|
| GET | 查询资源 | ✅ 幂等 | GET /api/users/{id} - 查询单个用户 |
| POST | 创建资源 | ❌ 非幂等 | POST /api/users - 创建新用户 |
| PUT | 全量更新资源 | ✅ 幂等 | PUT /api/users/{id} - 更新用户全部信息 |
| PATCH | 部分更新资源 | ❌ 非幂等 | PATCH /api/users/{id} - 更新用户部分信息 |
| DELETE | 删除资源 | ✅ 幂等 | DELETE /api/users/{id} - 删除用户 |

#### HTTP状态码规范

| 状态码 | 含义 | 使用场景 |
|--------|------|---------|
| 200 OK | 成功 | GET/PUT/PATCH/DELETE成功 |
| 201 Created | 创建成功 | POST创建资源成功 |
| 204 No Content | 成功但无返回内容 | DELETE成功 |
| 400 Bad Request | 请求参数错误 | 参数校验失败 |
| 401 Unauthorized | 未认证 | Token缺失或无效 |
| 403 Forbidden | 无权限 | 用户无权限访问该资源 |
| 404 Not Found | 资源不存在 | 查询的资源ID不存在 |
| 409 Conflict | 资源冲突 | 用户名已存在 |
| 500 Internal Server Error | 服务器错误 | 系统异常 |

---

### 2.2 统一响应格式

#### 成功响应格式

```json
{
  "code": 200,
  "message": "success",
  "data": {
    // 具体业务数据
  },
  "timestamp": 1704528000000
}
```

**字段说明**：
- `code`：业务状态码（与HTTP状态码可以不同）
- `message`：响应消息（成功时为"success"，失败时为错误描述）
- `data`：业务数据（成功时包含数据，失败时为null）
- `timestamp`：响应时间戳（Unix毫秒时间戳）

#### 失败响应格式

```json
{
  "code": 40001,
  "message": "用户名已存在",
  "data": null,
  "timestamp": 1704528000000,
  "errors": [  // 可选：参数校验错误详情
    {
      "field": "username",
      "message": "用户名长度必须在4-20字符之间"
    }
  ]
}
```

**字段说明**：
- `errors`：可选字段，用于参数校验失败时返回详细错误信息

---

### 2.3 错误码体系

**错误码分段规则**：

| 模块 | 错误码范围 | 示例 |
|------|-----------|------|
| 用户管理服务 | 40001-40099 | 40001: 用户名已存在 |
| 推荐服务 | 40101-40199 | 40101: 推荐算法服务超时 |
| 订单服务 | 40201-40299 | 40201: 库存不足 |
| 系统通用错误 | 50001-50099 | 50001: 数据库连接失败 |

**错误码定义示例**：

| 错误码 | 错误信息 | 模块 | HTTP状态码 | 处理建议 |
|--------|---------|------|-----------|---------|
| 40001 | 用户名已存在 | 用户服务 | 409 | 提示用户更换用户名 |
| 40002 | 手机号已注册 | 用户服务 | 409 | 提示用户直接登录 |
| 40003 | 验证码错误或已过期 | 用户服务 | 400 | 重新发送验证码 |
| 40004 | 用户名或密码错误 | 用户服务 | 401 | 提示用户检查输入 |
| 40101 | 推荐算法服务超时 | 推荐服务 | 500 | 返回热门榜单（降级方案） |

---

### 2.4 版本控制策略

**版本号规则**：
- URL路径包含版本号：`/api/v1/users`、`/api/v2/users`
- 版本号变更规则：
  - **v1 → v2**：接口响应格式变更、字段删除、不兼容的参数变更
  - **v1.1 → v1.2**：新增可选参数、新增响应字段（向后兼容）

**版本废弃策略**：
- 旧版本保留时间：6个月
- 废弃通知：在响应Header中添加 `Deprecated: true`

---

### 2.5 认证授权规范

**认证方式**：JWT Bearer Token

**请求Header示例**：
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Token失效处理**：
- 401 Unauthorized：Token缺失或无效
- 403 Forbidden：Token有效但用户无权限访问该资源

---

#### 第3章：接口清单（按模块分组）

**必须按模块分组列出所有接口**：

### 3.1 模块1：用户管理服务（User Service）

#### 接口清单表

| 接口编号 | 接口路径 | HTTP方法 | 接口名称 | 认证要求 | 优先级 | 状态 |
|---------|---------|---------|---------|---------|--------|------|
| API-001 | /api/v1/users/register | POST | 用户注册 | 无需认证 | P0 | ✅ 已设计 |
| API-002 | /api/v1/users/login | POST | 用户登录 | 无需认证 | P0 | ✅ 已设计 |
| API-003 | /api/v1/users/{id} | GET | 查询用户信息 | 需要认证 | P0 | ✅ 已设计 |
| API-004 | /api/v1/users/{id} | PUT | 更新用户信息 | 需要认证 | P1 | ✅ 已设计 |
| API-005 | /api/v1/users/{id} | DELETE | 删除用户 | 需要认证+管理员权限 | P2 | ⏳ 待设计 |

---

### 3.2 模块2：推荐服务（Recommend Service）

#### 接口清单表

| 接口编号 | 接口路径 | HTTP方法 | 接口名称 | 认证要求 | 优先级 | 状态 |
|---------|---------|---------|---------|---------|--------|------|
| API-101 | /api/v1/recommend/personal/{userId} | GET | 个性化推荐 | 需要认证 | P0 | ✅ 已设计 |
| API-102 | /api/v1/recommend/hot | GET | 热门推荐 | 无需认证 | P0 | ✅ 已设计 |
| API-103 | /api/v1/recommend/feedback | POST | 用户反馈 | 需要认证 | P1 | ✅ 已设计 |

---

#### 第4章：接口详细设计

**必须为每个接口提供详细定义**：

### 接口详细定义模板

---

#### API-001: 用户注册

**基本信息**：
- **接口编号**: API-001
- **接口路径**: /api/v1/users/register
- **HTTP方法**: POST
- **接口功能**: 用户注册，创建新用户账号
- **所属模块**: 用户管理服务（M-01）
- **认证要求**: 无需认证
- **优先级**: P0（MVP阶段）
- **关联模块**: M-01 | **关联Story**: US001（追溯行，需与第8章索引一致）

---

**请求参数**：

| 参数名 | 类型 | 位置 | 必填 | 说明 | 校验规则 | 示例 |
|--------|------|------|------|------|---------|------|
| username | String | Body | 是 | 用户名 | 4-20字符，字母数字下划线 | zhangsan |
| password | String | Body | 是 | 密码 | 8-20字符，包含大小写字母+数字 | Abc123456 |
| phone | String | Body | 是 | 手机号 | 11位数字 | 13800138000 |
| code | String | Body | 是 | 短信验证码 | 6位数字 | 123456 |
| email | String | Body | 否 | 邮箱 | 符合邮箱格式 | zhangsan@example.com |

---

**请求示例**：

```http
POST /api/v1/users/register HTTP/1.1
Host: api.geekbooks.com
Content-Type: application/json

{
  "username": "zhangsan",
  "password": "Abc123456",
  "phone": "13800138000",
  "code": "123456",
  "email": "zhangsan@example.com"
}
```

---

**响应参数**：

| 参数名 | 类型 | 说明 |
|--------|------|------|
| code | Integer | 业务状态码 |
| message | String | 响应消息 |
| data | Object | 用户信息 |
| data.userId | String | 用户ID |
| data.username | String | 用户名 |
| data.token | String | JWT Token（有效期24小时） |
| timestamp | Long | 响应时间戳 |

---

**成功响应示例**：

```json
{
  "code": 200,
  "message": "注册成功",
  "data": {
    "userId": "1001",
    "username": "zhangsan",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "timestamp": 1704528000000
}
```

---

**失败响应示例**：

```json
// 用户名已存在
{
  "code": 40001,
  "message": "用户名已存在",
  "data": null,
  "timestamp": 1704528000000
}

// 参数校验失败
{
  "code": 400,
  "message": "参数校验失败",
  "data": null,
  "timestamp": 1704528000000,
  "errors": [
    {
      "field": "password",
      "message": "密码长度必须在8-20字符之间"
    },
    {
      "field": "phone",
      "message": "手机号格式错误"
    }
  ]
}
```

---

**错误码说明**：

| 错误码 | 错误信息 | HTTP状态码 | 处理建议 |
|--------|---------|-----------|---------|
| 200 | 注册成功 | 201 | 跳转到登录页或首页 |
| 400 | 参数校验失败 | 400 | 提示用户修改输入 |
| 40001 | 用户名已存在 | 409 | 提示用户更换用户名 |
| 40002 | 手机号已注册 | 409 | 提示用户直接登录 |
| 40003 | 验证码错误或已过期 | 400 | 重新发送验证码 |
| 50001 | 系统异常 | 500 | 稍后重试或联系客服 |

---

**业务逻辑**：

1. 参数校验（用户名、密码、手机号格式）
2. 查询手机号是否已注册（防止重复注册）
3. 验证短信验证码（从Redis查询，有效期5分钟）
4. 密码加密（使用BCrypt）
5. 创建用户记录（写入t_user表）
6. 生成JWT Token（包含userId、username、过期时间）
7. 返回用户信息和Token

---

**性能要求**：
- 响应时间：P95<200ms
- 并发支持：≥500 QPS

**安全要求**：
- 密码必须BCrypt加密存储
- 验证码验证失败后立即失效
- 同一手机号1分钟内只能发送1次验证码（防刷）
- 同一IP 1分钟内最多注册3次（防批量注册）

---

**依赖服务**：
- 短信服务（第三方API）：发送验证码
- Redis：缓存验证码
- MySQL：存储用户信息

---

**接口变更历史**：

| 版本 | 变更日期 | 变更内容 | 变更人 |
|------|---------|---------|--------|
| v1.0 | 2026-01-06 | 初始版本 | 架构组 |

---

{为每个接口重复上述结构}

---

#### 第5章：接口冲突检测与解决

**必须识别所有接口冲突并提供解决方案**：

### 5.1 冲突检测结果

#### 冲突1：接口命名不一致

**冲突描述**：
- Story #1设计的接口：POST /api/users/register
- Story #5设计的接口：POST /api/user/signup

**冲突分析**：
- `users` vs `user`：资源名词单复数不一致
- `register` vs `signup`：动作名词不一致

**解决方案**：
- ✅ 统一使用复数名词：`/api/users`
- ✅ 统一使用`register`（更正式的术语）
- 最终接口：POST /api/v1/users/register

---

#### 冲突2：响应格式不一致

**冲突描述**：
- Story #1的接口返回格式：
```json
{
  "success": true,
  "data": {...}
}
```
- Story #2的接口返回格式：
```json
{
  "code": 200,
  "message": "success",
  "result": {...}
}
```

**冲突分析**：
- 字段名不一致：`success` vs `code`
- 数据字段不一致：`data` vs `result`

**解决方案**：
- ✅ 统一使用`code`+`message`+`data`格式
- ✅ 增加`timestamp`字段
- 最终格式：
```json
{
  "code": 200,
  "message": "success",
  "data": {...},
  "timestamp": 1704528000000
}
```

---

#### 冲突3：错误码重复

**冲突描述**：
- 用户服务：错误码40001表示"用户名已存在"
- 订单服务：错误码40001表示"库存不足"

**解决方案**：
- ✅ 按模块分段定义错误码：
  - 用户服务：40001-40099
  - 订单服务：40201-40299
- 最终错误码：
  - 40001: 用户名已存在（用户服务）
  - 40201: 库存不足（订单服务）

---

### 5.2 冲突汇总表

| 冲突ID | 冲突类型 | 冲突描述 | 涉及接口 | 解决方案 | 状态 |
|--------|---------|---------|---------|---------|------|
| C-001 | 命名不一致 | users vs user | API-001, API-010 | 统一使用users | ✅ 已解决 |
| C-002 | 响应格式不一致 | success vs code | API-001, API-002 | 统一使用code+message+data | ✅ 已解决 |
| C-003 | 错误码重复 | 40001重复使用 | API-001, API-201 | 按模块分段 | ✅ 已解决 |
| C-004 | HTTP方法不规范 | 使用GET删除用户 | API-005 | 改为DELETE方法 | ✅ 已解决 |

---

#### 第6章：接口依赖关系

**必须分析接口间的调用关系**：

### 6.1 接口依赖关系图

```
【前端调用链路】
前端Web/App
  ↓ POST /api/v1/users/register (API-001)
用户服务
  ↓ 调用短信服务API
短信服务（第三方）

【服务间调用链路】
推荐服务
  ↓ GET /api/v1/users/{id} (API-003)
用户服务
  ↓ 查询MySQL
用户表（t_user）
```

### 6.2 接口依赖关系表

| 调用方 | 被调用接口 | 调用场景 | 依赖类型 | 失败处理 |
|--------|-----------|---------|---------|---------|
| 前端Web/App | API-001: POST /api/v1/users/register | 用户注册 | 同步调用 | 提示错误信息 |
| 推荐服务 | API-003: GET /api/v1/users/{id} | 获取用户画像 | 同步调用 | 降级：使用默认画像 |
| 订单服务 | API-003: GET /api/v1/users/{id} | 验证用户身份 | 同步调用 | 直接返回401错误 |

---

#### 第7章：OpenAPI 3.0规范文档

**必须生成符合OpenAPI 3.0的YAML格式文档**：

```yaml
openapi: 3.0.3
info:
  title: GeekBooks API
  description: GeekBooks智能推荐系统API文档
  version: 1.0.0
  contact:
    name: 架构组
    email: arch@geekbooks.com

servers:
  - url: https://api.geekbooks.com/api/v1
    description: 生产环境
  - url: https://test-api.geekbooks.com/api/v1
    description: 测试环境

tags:
  - name: 用户管理
    description: 用户注册、登录、信息管理
  - name: 推荐服务
    description: 个性化推荐、热门推荐

paths:
  /users/register:
    post:
      tags:
        - 用户管理
      summary: 用户注册
      description: 创建新用户账号
      operationId: registerUser
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - username
                - password
                - phone
                - code
              properties:
                username:
                  type: string
                  minLength: 4
                  maxLength: 20
                  example: zhangsan
                password:
                  type: string
                  minLength: 8
                  maxLength: 20
                  example: Abc123456
                phone:
                  type: string
                  pattern: '^1[3-9]\d{9}$'
                  example: '13800138000'
                code:
                  type: string
                  pattern: '^\d{6}$'
                  example: '123456'
      responses:
        '201':
          description: 注册成功
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/SuccessResponse'
        '400':
          description: 参数校验失败
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '409':
          description: 用户名或手机号已存在
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'

components:
  schemas:
    SuccessResponse:
      type: object
      properties:
        code:
          type: integer
          example: 200
        message:
          type: string
          example: success
        data:
          type: object
        timestamp:
          type: integer
          format: int64
          example: 1704528000000

    ErrorResponse:
      type: object
      properties:
        code:
          type: integer
          example: 40001
        message:
          type: string
          example: 用户名已存在
        data:
          type: object
          nullable: true
        timestamp:
          type: integer
          format: int64
          example: 1704528000000
        errors:
          type: array
          items:
            type: object
            properties:
              field:
                type: string
              message:
                type: string

  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

security:
  - bearerAuth: []
```

---

#### 第8章：Sprint对接摘要索引

**必须输出一张目录级索引表，供下游"HLD-Sprint摘要提取"直接按行检索，无需通读全文**：

```markdown
## 第8章：Sprint对接摘要索引

| 接口编号 | 接口名称 | 一句话职责 | 关联模块 | 关联Story | 约束标记 |
|---------|---------|-----------|---------|-----------|---------|
| API-001 | 用户注册 | 校验并创建新用户账号 | M-01 用户管理服务 | US001 | 🔒需限流防刷 |
| API-003 | 查询用户信息 | 按ID返回用户基本信息 | M-01 用户管理服务 | US001 | - |
| API-101 | 个性化推荐 | 按用户画像返回Top3推荐 | M-02 推荐服务 | US003 | 🔁需降级方案 |
```

**字段说明**：
- **关联模块**：对应 HLD-01 的模块编号（如 M-01），保持与第3/4章一致
- **关联Story**：对应用户故事编号（如 US001），用于反向追溯需求来源
- **约束标记**：用简短符号标注该接口的横切约束，常见如 🔒（安全/限流/权限相关）、🔁（幂等/重试/降级相关）、⏱（性能SLA相关）；无特殊约束填 `-`

---

### 2. 质量要求

#### RESTful规范符合性（强制要求）

- **资源路径必须使用名词**：避免动词（如`/createUser`）
- **HTTP方法语义正确**：GET查询、POST创建、PUT更新、DELETE删除
- **幂等性保证**：PUT/DELETE操作必须幂等（多次调用结果一致）

#### 响应格式一致性（强制要求）

- **所有接口统一格式**：包含code、message、data、timestamp
- **错误响应完整**：参数校验失败时返回errors数组

#### 错误码规范性（强制要求）

- **按模块分段**：避免错误码重复
- **错误信息清晰**：不要使用"系统错误"这类模糊表述，要说明具体原因

---

### 3. 格式规范

- **文档格式**: Markdown + OpenAPI YAML
- **表格**: 所有接口清单必须使用表格
- **代码块**: 请求/响应示例使用JSON代码块
- **视觉标识**: 
  - ✅ 已解决/符合规范
  - ⚠️ 警告/待确认
  - ❌ 冲突/不规范
  - ⏳ 待设计/后续迭代

---

### 4. 特别说明

#### Story级接口如何整合

**情况1：Story级接口已完整设计**
- 直接复用Story级接口设计
- 检查是否符合RESTful规范
- 统一响应格式和错误码

**情况2：Story级接口只有简单描述**
- 基于Story的验收标准推断接口需求
- 补充完整的接口定义（参数、响应、错误码）
- 标注为"基于Story推断，需开发团队确认"

**情况3：Story未明确接口需求**
- 基于Story功能点设计合理的接口
- 与HLD-01模块划分保持一致
- 标注为"AI推荐接口，需与产品经理确认"

#### 接口冲突的常见类型

1. **命名冲突**：/api/users vs /api/user
2. **参数冲突**：同一个接口在不同Story中参数定义不一致
3. **响应格式冲突**：不同接口返回格式不一致
4. **错误码冲突**：不同模块使用相同错误码
5. **HTTP方法不规范**：使用GET方法创建/删除资源

#### 信息不足的处理方式

如果Story未明确接口参数或响应格式，你应该：
1. **基于业务逻辑推断**：参考类似功能的接口设计
2. **标注推断依据**：`（基于Story #1的登录接口推断，需确认）`
3. **列入待办**：在"待确认接口清单"中标注

---

## ✨ 输出格式

直接输出完整的接口设计文档，不要有任何前言或解释。文档开头直接是：

```markdown
# 【项目名称】接口设计文档（HLD-02）

> **设计对象**: {项目名称}  
> **设计版本**: v1.0  
> **设计日期**: {日期}  
> **基于模块划分**: HLD-01

---

## 第1章：接口设计概览

{按要求输出内容}

---

## 第2章：接口设计原则与规范

{按要求输出内容}

...
```

---

**⚠️ 重要提醒**: 

1. 必须遵循RESTful规范，资源路径使用名词复数，HTTP方法语义正确
2. 响应格式必须统一（code + message + data + timestamp）
3. 错误码必须按模块分段，避免重复
4. 接口冲突必须全部识别并提供解决方案
5. OpenAPI 3.0文档必须完整，可直接导入Swagger
6. 所有接口必须定义清晰的请求参数、响应格式、错误码
7. 依赖关系必须分析清楚，标注失败处理方式
8. 第8章"Sprint对接摘要索引"必须输出，且每行的关联模块/关联Story编号需与第3/4章保持一致，供下游"HLD-Sprint摘要提取"直接引用
9. 第4章每个接口的"基本信息"块必须包含"关联模块/关联Story"追溯行，编号与第8章索引一致
