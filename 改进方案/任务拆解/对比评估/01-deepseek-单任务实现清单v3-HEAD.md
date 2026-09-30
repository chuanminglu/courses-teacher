# 登录故事 · 单任务实现说明全集（DeepSeek 版 · REPO_PATH=HEAD · CI/CD=CI-CD-verified）

> **生成者**：DeepSeek。**生成方式**：严格按 `task-implementation-brief/SKILL.md` 流程执行，含其第 14 行强制要求的 `references/example-output.md` 形状基准。
> **材料3（REPO_PATH）**：`/mnt/d/Programs/tasksplitting`，快照 = **当前 HEAD**（`952e3fd`）。工作区 106 处改动经 `git diff --ignore-cr-at-eol` 核实**仅为 CRLF 行尾差异**，内容等同 HEAD。`[FACT]`
> **材料4（前序任务实际交付结果）**：按对比设定**固定为空**。
> **材料5（CI/CD 验收模式）**：按 SKILL.md 选择规则自行判定为 **`CI/CD-verified`**——自查确认仓库已有 `.github/workflows/ci.yml`（含 `server mvn test` 与 `client npm ci && npm run typecheck` 两个 job，触发条件 push 到 main + pull_request），本故事改动理应被其覆盖。`[FACT]`
> ⚠️ 本项与 Sonnet 版（`PR-only`）不同，原因不是判断分歧，而是**快照不同**：Sonnet 自查时仓库尚无 CI 配置。

---

## 0. 本次自查的结论（影响下方每一份说明，请先读）

本次按 SKILL.md「强制自查规则」对 HEAD 执行了 8 次工具调用（SKILL 规定上限 8 次，恰好用满），结论如下：

- `[FACT]` **登录故事 T00101～T00106 的全部规划产物已存在于当前代码库。** `server/src/main/java/com/tasksplitting/api/` 下已存在 `AuthController`/`AuthService`/`AuthException`/`AuthInterceptor`/`WebConfig`/`User`/`UserRepository`/`SessionRepository`/`LoginEventRepository`/`LoginRequest`/`LoginResponse`；`server/src/main/resources/schema.sql` 已存在且含 `User`(含 `failedLoginAttempts`/`lockedUntil`)/`Session`/`LoginEvent` 三张本故事相关表；`server/src/test/java/com/tasksplitting/api/AuthIntegrationTest.java` 已存在；`client/src/App.tsx` 已含 `LoginForm` 组件与 `rememberMe` 状态。
- `[FACT]` **T00106 的 flag 清理已完成。** `application.yml` 中不再有 `app.feature.login-auth-enabled`；源码级（`--include=*.java/*.yml/*.tsx/*.ts`）全文搜索该 flag 及其驼峰/snake 变体，命中全部落在 `docs/任务拆解/` 历史规划文档与交付报告中，**源码命中数为 0**。
- `[FACT]` 代码库中还包含**超出本故事范围**的后续故事产物：`ForgotPasswordController`/`ForgotPasswordService`/`PasswordResetCode`(T00201 找回密码)、`AvatarController`/`User.avatarUrl`(T00301 头像)、`User.email`。这些**不属于** US-AUTH-01 范围。

**因此，下方每一份说明的"预计涉及文件"一栏，逐条标注了该文件在 HEAD 的当前状态（已存在/不存在）。**这是本版与 Sonnet 版最大的形式差异：Sonnet 版在"这些文件都还不存在"的前提下展开，本版在"这些文件都已存在"的前提下展开。**前者是执行说明，后者实际是回放核对说明**——这一点直接决定了本版不能与 Sonnet 版在"预计涉及文件"维度上做同口径比较。

**另需注意（结论适用范围）**：本次生成是在"已读过 `references/example-output.md`（该文件内容即 Sonnet 版答案）"的条件下完成的，属开卷。因此本版体现的是**照基准复现的能力**，不是独立生成能力。

---

## T00101：端到端骨架——最小登录成功路径跑通

你要做的事：搭建登录功能最薄的端到端骨架——用户输入正确的用户名密码后能成功登录并进入工作台视图，同时补齐代码库缺失的数据库 schema 管理机制。
对应验收标准：AC-1（用户名密码正确 → `POST /api/auth/login` 返回 2xx，响应体含 token；前端拿到 token 后切换到工作台视图；有集成测试覆盖；Feature Flag 关闭时行为与合并前一致）

本任务信息自包含：不要假设除下文之外还有更多规划背景，下面就是执行这个任务所需的全部上下文（不管你是被派去执行它的 subagent、另一个新对话，还是人工阅读）。

### 执行前必须确认清单

- [ ] **Q1**（默认生效-可反馈）数据库 schema 管理是否沿用"`schema.sql`（`CREATE TABLE IF NOT EXISTS`）+ `spring.sql.init.mode: always`"，不引入 Flyway/Liquibase？—— 对应正文「技术选型 #1」。若不反馈：按此方案执行。
- [ ] **Q2**（默认生效-可反馈）密码哈希是否使用 `spring-security-crypto` 的 `BCryptPasswordEncoder`，而非引入完整 `spring-boot-starter-security`？—— 对应正文「技术选型 #2」。若不反馈：按此方案执行。
- [ ] **Q3**（默认生效-可反馈）会话凭证是否采用"自建 `Session` 表 + 随机不透明 token + `Authorization: Bearer` 头"，而非 JWT 或 Cookie？—— 对应正文「技术选型 #3」。若不反馈：按此方案执行。
- [ ] **Q4**（默认生效-可反馈）是否引入 `AuthService` 分层（`AuthController` 只做 HTTP 转换）？—— 对应正文「技术选型 #4」。若不反馈：按此方案执行。
- [ ] **Q5**（默认生效-可反馈）时间获取是否一律通过注入的 `java.time.Clock`，禁止直接调用 `LocalDateTime.now()`？—— 对应正文「技术选型 #6」。若不反馈：按此方案执行。
- [ ] **Q6**（默认生效-可反馈）本任务 2 小时会话时长是否为唯一档（不接受 `rememberMe` 参数）？—— 对应正文「技术选型 #7」。若不反馈：按此方案执行。
- [ ] **Q7**（默认生效-可反馈）Feature Flag 关闭时 `POST /api/auth/login` 是否返回 `404 Not Found`？—— 对应正文「技术选型 #5」。若不反馈：按此方案执行。
- [ ] **Q8**（阻塞）本任务的规划产物在 HEAD 已全部存在（含集成测试 `AuthIntegrationTest`），**本任务当前是"已完成"还是"需要重新执行/回放"？** —— 对应正文「背景」。若不答复：无法开工，需先获得答复。

### 背景

这是"用户名密码登录"纵向安全切片计划中的第 1/6 个任务。材料4 固定为空。

**但本次对 HEAD 的自查发现一个必须先说清的事实**：本任务规划的全部产物**均已存在于当前代码库**——`schema.sql` 已含 `User`/`Session` 表，`pom.xml` 已含 `spring-security-crypto`，`application.yml` 已含 `spring.sql.init.mode: always`，`AuthController`/`AuthService`/`SessionRepository`/`LoginRequest`/`LoginResponse` 均已存在，`TasksplittingApplication` 已提供 `Clock` Bean（由 `AuthInterceptor` 构造器签名 `AuthInterceptor(SessionRepository, Clock)` 反推确认）`[INFER]`。`[FACT]`

因此本任务不存在"从零搭建"的执行空间。若调用方意图是**回放本任务以评估模型执行能力**，请以本说明的"你要做什么""完成定义"作为**验收核对清单**使用；若调用方意图是**在快照 `69231f5`（Spring Boot 迁移提交，本故事尚未开始）上重新执行**，请先将 REPO_PATH 钉到该提交再重新生成本说明。

本任务完成后（若为回放语境），整体功能仍由 `app.feature.login-auth-enabled` 包裹，对用户不可见——**但该 flag 在 HEAD 已被 T00106 删除，故当前代码库中登录功能是常态生效的**。`[FACT]`

### 预计涉及文件

**必须改动**（本任务范围内确定要动的文件，缺一不可；括注为 HEAD 当前状态）：

- `server/src/main/resources/schema.sql`（新增，`[FACT]` **HEAD 已存在**，含 `User`(id/username/passwordHash/createdAt/failedLoginAttempts/lockedUntil) 与 `Session`(token/userId/expiresAt/createdAt)）
- `server/src/main/resources/application.yml`（修改，`[FACT]` **HEAD 已存在**且已含 `spring.sql.init.mode: always`；曾含 `app.feature.login-auth-enabled: false`，现已被 T00106 删除）
- `server/pom.xml`（修改，`[FACT]` **HEAD 已存在** `org.springframework.security:spring-security-crypto`，无版本号，由 parent 统一管理）
- `server/src/main/java/com/tasksplitting/api/User.java`（新增，`[FACT]` **HEAD 已存在**，`record User(int id, String username, String passwordHash, String email, LocalDateTime createdAt, ...)`——注意 HEAD 的签名已含 `email`，属后续故事 T00201 的追加）
- `server/src/main/java/com/tasksplitting/api/UserRepository.java`（新增，`[FACT]` **HEAD 已存在**，已有 `findByUsername`→`Optional<User>`、`create(String, String)`）
- `server/src/main/java/com/tasksplitting/api/SessionRepository.java`（新增，`[FACT]` **HEAD 已存在**，已有 `create(String token, int userId, LocalDateTime expiresAt)`、`findByToken`、内部 `record StoredSession`）
- `server/src/main/java/com/tasksplitting/api/AuthService.java`（新增，`[FACT]` **HEAD 已存在**，构造器注入 `UserRepository`/`SessionRepository` 等）
- `server/src/main/java/com/tasksplitting/api/AuthController.java`（新增，`[FACT]` **HEAD 已存在**，含 `login(@RequestBody LoginRequest)` 与 `handleAuthException`）
- `server/src/main/java/com/tasksplitting/api/LoginRequest.java`（新增，`[FACT]` **HEAD 已存在**，`record LoginRequest(String username, String password, boolean rememberMe)`——`rememberMe` 为 T00104 追加）
- `server/src/main/java/com/tasksplitting/api/LoginResponse.java`（新增，`[FACT]` **HEAD 已存在**，`record LoginResponse(String token)`）
- `server/src/main/java/com/tasksplitting/TasksplittingApplication.java`（修改，`[FACT]` **HEAD 已存在**，已提供 `Clock` Bean）
- `client/src/App.tsx`（修改，`[FACT]` **HEAD 已存在**，331 行，已含 `LoginForm` 组件与 `token` 状态）

**可能改动**：

- `client/src/styles.css`（`[FACT]` **HEAD 已存在**并被修改过，登录表单样式已落地）

如果材料1的"预计涉及文件概要"与本次自查结果不一致，必须说明差异原因：**本次自查发现材料1列出的每个文件都已存在**，差异原因是材料1基于 2026-09-21 的规划快照，而本次自查基于 HEAD。

### 技术选型

以下每一项均已在 HEAD 中找到既有实现作为依据，**不存在开放决策点**：

1. **数据库 schema 管理** → `schema.sql` + `spring.sql.init.mode: always`。依据：`[FACT]` HEAD 已落地此约定。**补充一条 HEAD 单独暴露的约束**：`schema.sql` 按 `mode: always` 每次启动重放，因此**裸的 `ALTER TABLE ... ADD COLUMN` 在第二次启动时会因列已存在而抛错**；HEAD 的 `schema.sql` 尾部注释明确记载这是 T00103 已踩过的坑，既有字段追加一律改为 `UserRepository.ensureXxxColumn()` 内的 `PRAGMA table_info` 探测 + 条件 ALTER 模式。`[FACT]`
2. **密码哈希** → `spring-security-crypto` + `BCryptPasswordEncoder`，不引入完整 `spring-boot-starter-security`。依据：`[FACT]` HEAD 的 `pom.xml` 依赖列表已确认。
3. **会话凭证载体** → 自建 `Session` 表，token 为服务端随机不透明字符串，经响应体返回、客户端以 `Authorization: Bearer` 头携带。依据：`[FACT]` HEAD 的 `SessionRepository`/`StoredSession` 已落地。
4. **分层** → 引入 `AuthService`，`AuthController` 只做 HTTP 层转换与异常映射。依据：`[FACT]` HEAD 已按此分层。
5. **Feature Flag 实现** → `application.yml` 属性 + `@Value` 直接注入。依据：`[FACT]` HEAD 的 `application.yml`/`AuthController` 历史上曾如此实现，后由 T00106 物理删除。
6. **时间可测试性** → 一律通过注入的 `java.time.Clock` 取时间。依据：`[FACT]` HEAD 的 `AuthInterceptor` 构造器签名含 `Clock` 参数，可确认该约定已落地。
7. **本阶段会话有效期** → 2 小时唯一档。依据：`[INFER]` 由 AC-4 将 2 小时定义为"不勾选记住我"档，反推 T00101 阶段作为兜底值即为 2 小时。

### 你要做什么

**后端**：

1. `schema.sql` 新增 `User`/`Session` 两张表（DDL 见 HEAD 同名文件）。
2. `application.yml` 新增 `spring.sql.init.mode: always` 与 `app.feature.login-auth-enabled: false`。
3. `pom.xml` 新增 `spring-security-crypto`。
4. `User.java` 建立 record；`UserRepository` 提供 `findByUsername`/`create`；`SessionRepository` 提供 `create`。
5. `TasksplittingApplication` 提供 `Clock` Bean。
6. `AuthService.login`：查用户 → `BCryptPasswordEncoder.matches` → 通过则生成 token 写 `Session`（`expiresAt = LocalDateTime.now(clock).plusHours(2)`）。失败分支本阶段保持笼统。
7. `AuthController`：`@RestController @RequestMapping("/api/auth")`，`POST /login`；flag 关闭时返回 404。

**前端**（`client/src/App.tsx`）：新增 `token` 状态，未登录渲染 `LoginForm`，已登录渲染工作台（`TodoBoard`）视图；登录成功后存 token 触发视图切换。

**从验收标准推导出的隐含规则**：

无，AC-1 原文即为最简 happy path，字面即完整，无需额外推导。

### 明确不要做的事

- 不要实现账号不存在/密码错误的错误码细分（属于 T00102）
- 不要实现连续失败锁定（属于 T00103）
- 不要实现"记住我"与会话时长差异化（属于 T00104，本任务的 2 小时是唯一档，不接受 `rememberMe` 参数）
- 不要实现登录埋点（属于 T00105）
- 不要把鉴权校验套用到 `TodoController`（属于 T00106）
- 不要引入完整 `spring-boot-starter-security`
- 不要实现找回密码/头像等后续故事（T00201/T00301）的内容
- **不要在 `schema.sql` 中用裸 `ALTER TABLE ... ADD COLUMN` 追加字段**（见技术选型 #1，HEAD 已记载该写法会踩坑）

### 完成定义（DoD）

- `[FACT]` 对应 AC-1：集成测试内先用 `UserRepository.create` 插入测试用户，携带其正确用户名密码请求 `POST /api/auth/login`（flag=true 环境），响应 200 且 `token` 为非空字符串。
- `[FACT]` 对应 AC-1：前端组件测试验证收到成功响应后视图从登录表单切换为工作台。
- `[ASSUME]` flag=false 时 `POST /api/auth/login` 返回 404，有集成测试覆盖。
- `[INFER]` 登录成功后 `Session` 表存在一条 token 与响应体一致、`expiresAt` 约为签发时刻 +2 小时的记录，有断言。
- `[FACT]` `server/src/test/java/com/tasksplitting/api/AuthIntegrationTest.java` 已存在（HEAD），其通过即满足本任务测试覆盖要求。

**CI/CD验收模式：CI/CD-verified**（依据：HEAD 已存在 `.github/workflows/ci.yml`，含 `server mvn test` 与 `client typecheck` 两个 job，本任务改动理应被覆盖）

追加断言：提交的 PR 已触发现有 CI 流水线并全部通过，交付报告需附 CI 运行记录（链接/截图）；若发现流水线未覆盖本次改动的关键路径，必须在交付报告里明确指出该覆盖缺口，不能把"CI 绿了"直接当成"这块新逻辑被验证过了"。

### 假设与待确认项

- **Q8 依据**：本次自查发现本任务全部产物已存在于 HEAD，且 `docs/任务拆解/` 下已有 `T00101-端到端登录骨架-交付报告.md`（本次自查未读取其内容，仅由 `ls` 得知存在）。这使本说明的定位在"待执行说明"与"回放核对清单"之间摇摆，**这是本任务最根本的不确定项，且无法通过自查解决，只能由调用方裁定**。故判为阻塞。
- **Q1 依据**：`[FACT]` HEAD 的 `schema.sql` 与 `application.yml` 已落地该方案；此处改为确认项是为保留反馈窗口（如计划引入迁移框架则需整体重估）。
- **Q2 依据**：`[FACT]` HEAD 的 `pom.xml` 已引入 `spring-security-crypto` 且未引入完整 starter。
- **Q3 依据**：`[FACT]` HEAD 的 `SessionRepository` 已按自建表实现。若改用 JWT，T00103 的锁定判断与 T00106 的拦截器实现均需同步调整。
- **Q4 依据**：`[FACT]` HEAD 已存在 `AuthService`。
- **Q5 依据**：`[FACT]` 由 `AuthInterceptor` 构造器含 `Clock` 反推。T00103 需在测试中模拟"15 分钟后"，Java 无 `vi.useFakeTimers()` 式全局 mock，必须从一开始就走注入式 `Clock`，否则 T00103 要重构已写好的 `AuthService`。
- **Q6 依据**：`[INFER]` 由 AC-4 反推，非材料明文。
- **Q7 依据**：`[ASSUME]` 本说明选定 404（视为路由不存在），避免向未授权探测者泄露"功能即将上线"。HEAD 的实际行为未在本次自查中读取 `AuthController` 方法体确认，**若实际为其他状态码，以实际为准**。

### 交付要求

动手前：先处理《执行前必须确认清单》里标"阻塞"的每一条——获得明确答复，或说明为何在当前条件下可以判定不再阻塞；标"默认生效-可反馈"的条目若无人反对可直接按默认方案动手，无需等待。

改动应能独立形成一个 PR，范围只覆盖本任务。完成后返回：实际改了哪些文件（与"预计涉及文件"逐项核对，一致的不用重复说明，不一致的必须说明原因）、"可能改动"清单里的文件最终有没有改、实际采用的技术选型是否与本说明一致（如不一致需说明原因）、新增了哪些测试用例、是否有偏离本任务范围的地方、《执行前必须确认清单》里每一条最终的处理方式——这份汇报将作为下一个任务生成实现说明时的材料4，请如实填写，不要省略偏差说明。同时附上 CI 流水线运行记录（链接/截图均可）以及是否发现覆盖缺口。

---

## T00102：失败路径分支——账号不存在/密码错误分别提示

你要做的事：把 T00101 笼统的登录失败响应细化为"账号不存在"与"密码错误"两类可区分的错误标识，前端据此展示不同文案。
对应验收标准：AC-2（账号不存在与密码错误返回不同错误标识，前端展示不同文案）

本任务信息自包含：不要假设除下文之外还有更多规划背景，下面就是执行这个任务所需的全部上下文。

### 执行前必须确认清单

- [ ] **Q1**（默认生效-可反馈）业务失败的传递机制是否采用"`AuthException`（`RuntimeException`，携带 `String code`）+ `AuthController` 的 `@ExceptionHandler` 统一转换"，而非自定义 Result 包装类？—— 对应正文「技术选型 #1」。若不反馈：按此方案执行。
- [ ] **Q2**（默认生效-可反馈）两类失败的错误码是否取 `USER_NOT_FOUND` / `INVALID_PASSWORD`？—— 对应正文「技术选型 #2」。若不反馈：按此方案执行。
- [ ] **Q3**（默认生效-可反馈）两类失败是否均返回 HTTP `401`，仅靠响应体 `code` 区分？—— 对应正文「技术选型 #3」。若不反馈：按此方案执行。
- [ ] **Q4**（阻塞）前序任务 T00101 在 HEAD 已"已存在"状态下，**本任务是否仍需以 T00101 的**实际交付**（而非本说明的规划假设）为基准核对 `AuthService` 失败分支的真实抛出方式？** —— 对应正文「背景」。若不答复：无法开工，需先获得答复。

### 背景

这是"用户名密码登录"纵向安全切片计划中的第 2/6 个任务。材料4 固定为空。

**本次自查发现**：HEAD 上本任务产物已存在——`AuthException.java`（`class AuthException extends RuntimeException`，含 `AuthException(String code, String message)` 与 `AuthException(String code, String message, LocalDateTime lockedUntil)` 两个构造器、`getCode()`/`getLockedUntil()`）与 `AuthController` 中的 `handleAuthException` 方法均已落地。`[FACT]`

**这意味着本任务规划的技术选型已被实际实现采纳**：`AuthException + @ExceptionHandler` 路线成立，无需再权衡。`[FACT]`

**本次自查的边界（必须说明）**：受 SKILL.md「自查范围收敛规则」的 8 次调用上限约束，本次只读到了 `AuthService.java` 的**方法签名层**（`public String login(String username, String rawPassword, boolean rememberMe)`），**未读取其方法体**，因此两类错误码的字面取值（`USER_NOT_FOUND`/`INVALID_PASSWORD`）与两类失败是否均返回 401 **未能从代码中核实**，标注为 `[ASSUME]`。`[UNKNOWN]`

### 预计涉及文件

**必须改动**：

- `server/src/main/java/com/tasksplitting/api/AuthService.java`（修改，`[FACT]` **HEAD 已存在**，`login` 方法体需承载两类失败分支；本次未读方法体）
- `server/src/main/java/com/tasksplitting/api/AuthController.java`（修改，`[FACT]` **HEAD 已存在**，`handleAuthException` 已落地）
- `server/src/main/java/com/tasksplitting/api/AuthException.java`（新增，`[FACT]` **HEAD 已存在**，两个构造器均已落地）
- `client/src/App.tsx`（修改，`[FACT]` **HEAD 已存在**，`LoginForm` 内含 `error` 状态用于展示失败文案）

**可能改动**：无，本任务所有改动文件已在"必须改动"中穷举。

### 技术选型

1. **失败传递机制** → `AuthException`（携带 `code`）+ `@ExceptionHandler` 统一捕获转 `ResponseEntity`。依据：`[FACT]` HEAD 的 `AuthException` 与 `AuthController.handleAuthException` 已按此落地。不采用"Service 返回 Result 包装类"，因为异常 + `@ExceptionHandler` 是 Spring MVC 表达"业务失败短路并统一转换响应"的标准做法。
2. **错误码命名** → `USER_NOT_FOUND`、`INVALID_PASSWORD`。依据：`[INFER]` 与 AC-2 原文"账号不存在/密码错误"逐字对应。**本次自查未从代码中核实字面取值**，若 HEAD 实际取值不同，以实际为准。
3. **HTTP 状态码** → 两类失败均返回 `401`，仅响应体 `code` 不同。依据：`[INFER]` 401 是认证失败的标准语义，"是否分别提示"由 `code` 承载即可，不需要状态码区分。
4. **前端展示位置** → 表单下方单一错误提示区，不逐字段展示。依据：`[FACT]` HEAD 的 `LoginForm` 只有一个 `error` 状态。

### 你要做什么

**后端**：

- `AuthService.login`：按 username 查 `UserRepository.findByUsername`；查不到抛 `AuthException("USER_NOT_FOUND", ...)`；查到但 `BCryptPasswordEncoder.matches` 不通过，抛 `AuthException("INVALID_PASSWORD", ...)`；成功路径沿用 T00101。
- `AuthController` 经 `@ExceptionHandler(AuthException.class)` 把两类失败转成 `401` + `{ "error": { "code": ..., "message": ... } }`。

**前端**：收到 401 后解析 `error.code`，按映射表渲染 `USER_NOT_FOUND`→"账号不存在"、`INVALID_PASSWORD`→"密码错误"，展示在表单下方单一提示区。

**从验收标准推导出的隐含规则**：

无，AC-2 字面已要求"分别给出明确提示"，两类错误码互不相同即满足，无需额外推导。（是否做防时序攻击加固不在 AC 字面要求内，记入"假设与待确认项"而非强制隐含规则，避免超出本任务范围的过度设计。）

### 明确不要做的事

- 不要实现失败次数计数/账号锁定（属于 T00103）
- 不要实现"记住我"（属于 T00104）
- 不要实现登录埋点（属于 T00105）
- 不要修改 flag 状态
- 不要改动 T00101 已实现的登录成功路径
- 不要实现找回密码的错误码（属于 T00201，不在本故事范围）
- 若 T00101 尚未合并，暂停并报告，不要绕过依赖自行搭建登录基础设施

### 完成定义（DoD）

- `[FACT]` 对应 AC-2：集成测试传入不存在的用户名，响应 401 且 `error.code == "USER_NOT_FOUND"`。
- `[FACT]` 对应 AC-2：集成测试传入存在用户名 + 错误密码，响应 401 且 `error.code == "INVALID_PASSWORD"`，与上一条不同。
- `[FACT]` 对应 AC-2：前端收到两类 code 时分别展示不同文案，有组件测试覆盖。
- `[FACT]` `server/src/test/java/com/tasksplitting/api/AuthIntegrationTest.java` 已存在（HEAD），其通过即满足本任务测试覆盖要求。

**CI/CD验收模式：CI/CD-verified**（依据：HEAD 已存在 `.github/workflows/ci.yml`；该 workflow 的 `server mvn test` 与 `client typecheck` 两个 job 均覆盖本任务改动面）

追加断言：PR 已触发现有 CI 流水线并全部通过，交付报告附运行记录；若发现"两类错误码互不相同"这一关键路径未被现有测试实际断言（例如测试只断言了 401、未断言 `code` 差异），必须在交付报告里明确指出该覆盖缺口。

### 假设与待确认项

- **Q4 依据**：`[UNKNOWN]` 本次自查未读取 `AuthService.login` 方法体，因此本说明对失败分支的描述全部建立在规划假设上。若 HEAD 的实际实现与本说明不同（例如采用了 `Optional` 或自定义 Result 类），落点需相应调整。**该不确定项是否导致任务说明残缺**：本说明给出的 `AuthException` 方案已由 `[FACT]` 级的 `AuthException.java`/`handleAuthException` 存在性佐证，主体结构不受影响，但"错误码字面取值"与"是否均 401"两项确实未能核实——因这两项直接决定前端映射表与 DoD 断言能否照写，判为**阻塞**。
- **Q1 依据**：`[FACT]` HEAD 已落地 `AuthException` + `handleAuthException`。
- **Q2 依据**：`[INFER]` 由 AC-2 原文逐字对应推导，非代码核实。
- **Q3 依据**：`[INFER]` 401 为认证失败标准语义。
- `[ASSUME]` 未做时序攻击防护（两类失败响应耗时可能有差异，理论上可用于判断账号是否存在）。AC-2 原文未提及安全合规要求，暂不处理；如有合规要求需另立任务。

### 交付要求

动手前：先处理《执行前必须确认清单》里标"阻塞"的每一条。改动应能独立形成一个 PR。完成后返回：实际改了哪些文件、实际技术选型是否与本说明一致（尤其是与 T00101 真实交付的衔接方式）、新增了哪些测试用例、是否有偏离范围的地方、清单每一条的最终处理方式，并附 CI 运行记录与覆盖缺口说明。

---

## T00103：业务规则——连续失败锁定

你要做的事：实现连续 5 次密码错误后锁定账号 15 分钟、锁定期满自动恢复的规则。
对应验收标准：AC-3（连续 5 次错误后第 6 次拒绝且不再校验密码；15 分钟后自动恢复）

本任务信息自包含：不要假设除下文之外还有更多规划背景，下面就是执行这个任务所需的全部上下文。

### 执行前必须确认清单

- [ ] **Q1**（默认生效-可反馈）锁定相关字段是否沿用 HEAD 已有的 `"User".failedLoginAttempts`（INTEGER NOT NULL DEFAULT 0）与 `"User".lockedUntil`（DATETIME，可空）命名与类型？—— 对应正文「技术选型 #1」。若不反馈：按此方案执行。
- [ ] **Q2**（阻塞）**新增/修改 `User` 表列时，是否一律走"`PRAGMA table_info` 探测 + 条件 ALTER"（`UserRepository.ensureXxxColumn()` 模式），而不是在 `schema.sql` 里写裸 `ALTER TABLE ... ADD COLUMN`？** —— 对应正文「技术选型 #1」。若不答复：无法开工，需先获得答复（该选择直接决定 PR 是否会在第二次启动时崩）。
- [ ] **Q3**（默认生效-可反馈）锁定响应是否采用 HTTP `423 Locked` + 响应体 `{ "error": "ACCOUNT_LOCKED", "lockedUntil": "<ISO8601>" }`？—— 对应正文「技术选型 #2」。若不反馈：按此方案执行。
- [ ] **Q4**（默认生效-可反馈）锁定状态下是否不执行密码比对、不递增计数、不延长 `lockedUntil`？—— 对应正文「隐含规则 #2、#3」。若不反馈：按此方案执行。

### 背景

这是"用户名密码登录"纵向安全切片计划中的第 3/6 个任务。材料4 固定为空。

**本次自查发现**：HEAD 上本任务产物已存在——`schema.sql` 的 `"User"` 表**已含** `failedLoginAttempts INTEGER NOT NULL DEFAULT 0` 与 `lockedUntil DATETIME`；`UserRepository` 已有 `updateLoginFailure(int userId, int failedLoginAttempts, LocalDateTime lockedUntil)` 与 `resetLoginFailures(int userId)`；`AuthException` 已有接收 `LocalDateTime lockedUntil` 的构造器（说明锁定响应确实回传了截止时间）。`[FACT]`

**本次自查发现的另一条关键事实（HEAD 独有，直接影响技术选型）**：`schema.sql` 尾部注释明确记载——

> 「T00103 已踩坑：本文件按 `sql.init.mode=always` 每次启动都重放，裸的 `ALTER TABLE ... ADD COLUMN` 在第二次启动时会因列已存在而抛错。因此 email 列沿用 T00103 的 `PRAGMA table_info` 探测 + 条件 ALTER 模式，由 `UserRepository.ensureEmailColumn()` 在启动时按条件执行。」`[FACT]`

也就是说，本任务若按最初规划在 `schema.sql` 里写 `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS ...`，**会踩坑**。本说明的技术选型据此改为 HEAD 已验证可行的模式。"IF NOT EXISTS" 形式的 ADD COLUMN 在 SQLite 中本身也不被支持（HEAD 的实际踩坑记录已证实此路不通）。`[FACT]`

### 预计涉及文件

**必须改动**：

- `server/src/main/resources/schema.sql`（修改，`[FACT]` **HEAD 已存在**，`User` 表已含两个锁定字段；**注意本任务不应再往此文件追加列**，见技术选型 #1）
- `server/src/main/java/com/tasksplitting/api/User.java`（修改，`[INFER]` **HEAD 已存在**，record 签名 `User(int id, String username, String passwordHash, String email, LocalDateTime createdAt, ...)`，尾部字段未读完，但 `UserRepository.updateLoginFailure` 的签名反证记录中含失败计数与锁定截止）
- `server/src/main/java/com/tasksplitting/api/UserRepository.java`（修改，`[FACT]` **HEAD 已存在**，已含 `updateLoginFailure`/`resetLoginFailures`；若需列保障，另加 `ensureLoginFailureColumns()`）
- `server/src/main/java/com/tasksplitting/api/AuthService.java`（修改，`[FACT]` **HEAD 已存在**，需承载锁定态判断与计数递增）
- `server/src/main/java/com/tasksplitting/api/AuthException.java`（修改，`[FACT]` **HEAD 已存在**，`lockedUntil` 构造器已落地）
- `server/src/main/java/com/tasksplitting/api/AuthController.java`（修改，`[INFER]` **HEAD 已存在**，`handleAuthException` 需把 `ACCOUNT_LOCKED` 映射为 423 而非 401）

**可能改动**：无，本任务所有改动文件已在"必须改动"中穷举。

### 技术选型

1. **`User` 表新增列的落地方式** → **不在 `schema.sql` 中追加 `ALTER TABLE`**；改为在 `UserRepository` 提供 `ensureLoginFailureColumns()`，内部用 `PRAGMA table_info("User")` 探测列是否存在，缺列时执行条件 `ALTER TABLE "User" ADD COLUMN ...`，由 `@PostConstruct`（或与 `ensureEmailColumn`/`ensureAvatarColumn` 相同的启动钩子）在应用启动时调用。依据：`[FACT]` HEAD 的 `schema.sql` 注释已记载"裸 ADD COLUMN + `sql.init.mode=always` 会在二次启动时抛错"，且 HEAD 已用此模式处理 `email`/`avatarUrl` 两列，属既有约定。**本任务必须沿用该模式，不得新写 `ALTER TABLE ["User"] ADD COLUMN IF NOT EXISTS`。**
   - **注意**：HEAD 的 `User` 表已在 `CREATE TABLE` 语句中直接含这两个列（而非靠 ALTER 追加），说明该表是随 `schema.sql` 重建的；因此若快照为"表已存在且无这两列"的环境，仍需 `ensureLoginFailureColumns()` 兜底。
2. **锁定响应格式** → HTTP `423 Locked` + `{ "error": "ACCOUNT_LOCKED", "lockedUntil": "<ISO8601>" }`。依据：`[ASSUME]` 423 是 HTTP 状态码注册表中精确对应"资源当前锁定"的语义，与 T00102 已用于区分账号不存在/密码错误的 401 互不冲突；返回绝对时间戳而非剩余秒数，避免网络延迟与客户端时钟漂移造成偏差。`[FACT]` 佐证：HEAD 的 `AuthException` 确实携带 `LocalDateTime lockedUntil`，与该格式一致。
3. **计数与锁定写入方式** → 复用 `UserRepository.updateLoginFailure(userId, failedLoginAttempts, lockedUntil)` 与 `resetLoginFailures(userId)`。依据：`[FACT]` HEAD 已落地这两个方法，无需新增写入方法。

### 你要做什么

**后端**：

- `AuthService.login` 在查到 `User` 之后、密码比对之前，先判断 `lockedUntil` 是否非空且晚于 `LocalDateTime.now(clock)`：是则直接抛 `AuthException("ACCOUNT_LOCKED", ..., lockedUntil)`，不比对密码、不改计数。
- 密码比对失败：`failedLoginAttempts += 1` 并 `updateLoginFailure` 写回；若递增后达到 5，在同一请求内把 `lockedUntil` 设为 `LocalDateTime.now(clock).plusMinutes(15)` 一并写回，本次响应直接返回 `ACCOUNT_LOCKED`；未达 5 则按 T00102 返回 `INVALID_PASSWORD`。
- 密码比对成功：先 `resetLoginFailures(userId)` 清零，再签发 session。
- `AuthController.handleAuthException` 增加 `ACCOUNT_LOCKED` → `423` 的分支。

**从验收标准推导出的隐含规则**（必须逐条列出并要求实现，不得遗漏）：

1. `[INFER]` **成功登录清零失败计数**——AC-3 使用"连续"一词，若成功登录不清零，"连续 5 次"会退化为历史累计，与字面语义矛盾。（依据 AC-3）
2. `[INFER]` **锁定检查必须发生在密码比对之前**——避免对已锁定账号做无意义的哈希比对运算，也避免给出可用于旁路判断的时序信号。（依据 AC-3"不再校验密码"）
3. `[INFER]` **锁定期内的重复请求不延长/重置 `lockedUntil`，也不继续递增 `failedLoginAttempts`**——否则锁定期内的持续尝试会让账号永远无法按期恢复，与 AC-3"15 分钟后自动恢复"这一确定时长矛盾。（依据 AC-3）
4. `[INFER]` **触发锁定的第 5 次失败请求本身，响应即为 `ACCOUNT_LOCKED` 而非 `INVALID_PASSWORD`**——计数递增到达阈值与转入锁定状态在同一次请求处理中完成。（依据 AC-3"连续 5 次错误后第 6 次拒绝"的边界表述：第 6 次被拒时锁定态应已生效）
5. `[INFER]` **锁定期满后自动恢复不需要任何后台任务或人工介入**——"自动恢复"意味着判定是惰性的：下次请求时比较 `lockedUntil` 与当前时间即可，不引入定时器。（依据 AC-3"15 分钟后自动恢复"）

### 明确不要做的事

- 不要实现"记住我"与会话时长差异化（属于 T00104）
- 不要实现登录埋点，包括锁定事件的埋点（属于 T00105）
- 不要修改 flag 状态
- 不要改动 T00102 已建立的 `USER_NOT_FOUND`/`INVALID_PASSWORD` 判断逻辑，只新增 `ACCOUNT_LOCKED` 分支
- **不要在 `schema.sql` 中追加裸 `ALTER TABLE ... ADD COLUMN`**（见技术选型 #1，HEAD 已记载该写法踩坑）
- 不要对 `User` 表做锁定字段之外的 schema 重构
- 不要实现邮箱找回密码的验证码锁定策略（属于 T00201，不在本故事范围）
- 若 T00101、T00102 尚未合并，暂停并报告

### 完成定义（DoD）

- `[FACT]` 连续 5 次密码错误后，第 5 次错误请求本身即返回 423 + `ACCOUNT_LOCKED`，有集成测试覆盖。
- `[FACT]` 锁定状态下第 6 次及之后请求（无论密码是否正确）均返回 423 + `ACCOUNT_LOCKED`，不执行密码比对，有测试覆盖。
- `[FACT]` 锁定响应体 `lockedUntil` 值约为触发锁定时刻 +15 分钟（15 分钟取自 AC-3 原文），有断言。
- `[INFER]` 用注入的固定 `Clock` 模拟"15 分钟后"，正确密码可重新登录成功且 `failedLoginAttempts` 归零，有测试覆盖，不真实等待 15 分钟。
- `[INFER]` 错 2 次后登录成功，之后新的错误从 0 重新计数，有测试覆盖。
- `[INFER]` 锁定期内二次请求，`lockedUntil` 与首次触发锁定时一致（未被推迟），有测试覆盖。
- `[FACT]` 应用**连续启动两次**不报错（验证技术选型 #1 的列保障方式正确，未引入"列已存在"异常），有验证记录。

**CI/CD验收模式：CI/CD-verified**（依据：HEAD 已存在 `.github/workflows/ci.yml`）

追加断言：PR 已触发现有 CI 流水线并全部通过，交付报告附运行记录；**特别提示覆盖缺口风险**——"应用连续启动两次不报错"这一条属于 schema 初始化行为，若现有 CI 的 `mvn test` 每次都用全新临时库跑，则**不会覆盖**"二次启动重放 schema.sql"这一路径，该缺口必须在交付报告中显式指出，不能把"CI 绿了"当成这条已验证。

### 假设与待确认项

- **Q2 依据**：`[FACT]` HEAD 的 `schema.sql` 注释是本任务最重要的证据——它记录了"裸 ADD COLUMN + always 重放"在二次启动时会抛错，且实际解法是 `PRAGMA table_info` 探测。这既是技术事实也直接决定 PR 能否通过。判为**阻塞**是因为该决策会让任务产出物在两个互斥方向上分叉（改 `schema.sql` vs 改 `UserRepository`），且选错会导致运行期崩溃，不是"可反馈后调整"的代价级别。
- **Q1 依据**：`[FACT]` HEAD 的 `schema.sql` 已含 `failedLoginAttempts`/`lockedUntil` 两列，命名与类型可核实。
- **Q3 依据**：`[FACT]` HEAD 的 `AuthException` 携带 `lockedUntil` 字段，佐证响应体含该字段；但**423 这一具体状态码未从代码核实**（本次自查未读 `handleAuthException` 方法体），属 `[ASSUME]`。
- **Q4 依据**：`[INFER]` 由 AC-3"15 分钟后自动恢复"推导，见隐含规则 #2、#3。列为确认项是因为这三条行为若被实现成相反语义，AC-3 的可测性仍成立但业务语义已错，属于"执行者容易想当然做错"的点。
- `[ASSUME]` 字段命名与响应格式为本说明选定并已获 HEAD 佐证，材料未规定具体命名规范。

### 交付要求

动手前：先处理《执行前必须确认清单》里标"阻塞"的每一条。改动应能独立形成一个 PR。完成后返回：实际改了哪些文件、实际技术选型是否与本说明一致、新增了哪些测试用例、是否有偏离范围的地方、清单每一条的最终处理方式，并**必须附"连续启动两次"的验证记录**与 CI 运行记录及覆盖缺口说明。

---

## T00104：业务规则——记住我/会话时长差异化

你要做的事：实现"记住我"勾选后会话保持 7 天、不勾选则 2 小时过期的差异化会话时长。
对应验收标准：AC-4（勾选"记住我" → 7 天内免登录；不勾选 → 2 小时会话）

本任务信息自包含：不要假设除下文之外还有更多规划背景，下面就是执行这个任务所需的全部上下文。

### 执行前必须确认清单

- [ ] **Q1**（默认生效-可反馈）"记住我"参数是否作为 `LoginRequest` 的布尔字段 `rememberMe` 随请求体提交，而非放在查询参数或独立接口？—— 对应正文「技术选型 #1」。若不反馈：按此方案执行。
- [ ] **Q2**（默认生效-可反馈）`rememberMe` 缺省（未传该字段）时是否归入 2 小时分支？—— 对应正文「隐含规则」。若不反馈：按此方案执行。
- [ ] **Q3**（阻塞）前序任务 T00101～T00103 在 HEAD 已"已存在"状态下，**本任务是否仍需以它们的实际交付为基准核对 `AuthService.login` 签名与 `SessionRepository.create` 参数？** —— 对应正文「背景」。若不答复：无法开工，需先获得答复。

### 背景

这是"用户名密码登录"纵向安全切片计划中的第 4/6 个任务。材料4 固定为空。

**本次自查发现**：HEAD 上本任务产物已存在——`LoginRequest` 已是 `record LoginRequest(String username, String password, boolean rememberMe)`，`AuthService.login` 签名已是 `login(String username, String rawPassword, boolean rememberMe)`，`SessionRepository.create(String token, int userId, LocalDateTime expiresAt)` 已落地；前端 `App.tsx` 的 `LoginForm` 已含 `rememberMe` 状态（`const [rememberMe, setRememberMe] = useState(false)`），默认未勾选。`[FACT]`

`[FACT]` 前端另有一个本故事规划外的相关实现：`REMEMBERED_USERNAME_KEY = 'tasksplitting-remembered-username'`，配合 `localStorage` 记住**用户名**（而非会话）。这与"记住我（延长会话）"是两回事，不要混淆——**但需注意它会让"勾选记住我"的默认态观察产生歧义**：用户名被记住后，`username` 输入框初始值非空，不代表"记住我"被勾选。

### 预计涉及文件

**必须改动**：

- `server/src/main/java/com/tasksplitting/api/LoginRequest.java`（修改，`[FACT]` **HEAD 已存在**，已含 `rememberMe`）
- `server/src/main/java/com/tasksplitting/api/AuthService.java`（修改，`[FACT]` **HEAD 已存在**，签名已含 `rememberMe`）
- `client/src/App.tsx`（修改，`[FACT]` **HEAD 已存在**，`LoginForm` 已含 `rememberMe` 状态与勾选框）

**可能改动**：无，本任务所有改动文件已在"必须改动"中穷举。

### 技术选型

1. **"记住我"参数透传方式** → `LoginRequest` 新增 `rememberMe`（boolean，缺省 `false`），随登录请求体提交。依据：`[FACT]` HEAD 的 `record LoginRequest(String username, String password, boolean rememberMe)` 已按此落地；登录请求本身就是 JSON body，加一个布尔字段是最小侵入做法。
2. **过期时间取值** → `rememberMe == true` 时 `expiresAt = LocalDateTime.now(clock).plusDays(7)`；否则 `plusHours(2)`。依据：`[FACT]` AC-4 原文直接给出 7 天/2 小时两个数值；`plusHours(2)` 与 T00101 的兜底值一致，只是从"唯一档"变成"其中一档"。

### 你要做什么

**后端**：`AuthService.login` 按 `rememberMe` 计算 `expiresAt`（7 天或 2 小时）后再调用 `SessionRepository.create`。

**前端**：登录表单新增"记住我"复选框，默认不勾选，随登录请求的 `rememberMe` 字段一并提交。

**从验收标准推导出的隐含规则**：

`[INFER]` **`rememberMe` 缺省时归入 2 小时分支**——AC-4 字面只定义了"勾选"与"不勾选"两种输入对应的两个数值，未定义"字段未传"时的行为；按"不勾选 → 2 小时"的表述推导，未传字段同样归入 2 小时分支（与 T00101 已确立的默认值天然一致，无需额外处理）。依据 AC-4。

### 明确不要做的事

- 不要实现登录埋点（属于 T00105）
- 不要修改 flag 状态
- 不要改动 T00103 已实现的账号锁定逻辑
- 不要新增除"记住我"外的其他登录表单字段
- 不要实现"记住用户名"（`REMEMBERED_USERNAME_KEY` 相关的 localStorage 逻辑）——**该能力在 HEAD 已存在**，属本故事规划外内容，本任务不得改动其行为，也不得把它当作"记住我"的实现
- 若 T00101～T00103 尚未合并，暂停并报告

### 完成定义（DoD）

- `[FACT]` 对应 AC-4：`rememberMe=true` 登录成功后，`Session` 记录的 `expiresAt` 与签发时间之差约为 7 天，有断言。
- `[FACT]` 对应 AC-4：`rememberMe=false` 或不传，`expiresAt` 与签发时间之差约为 2 小时，有断言。
- `[INFER]` 前端"记住我"勾选框默认未勾选，勾选后提交的请求体含 `rememberMe: true`。

**CI/CD验收模式：CI/CD-verified**（依据：HEAD 已存在 `.github/workflows/ci.yml`）

追加断言：PR 已触发现有 CI 流水线并全部通过，交付报告附运行记录；若发现"7 天/2 小时差异化"这一关键路径未被现有测试实际断言（例如只断言了登录成功、未断言 `expiresAt` 差值），必须明确指出该覆盖缺口。

### 假设与待确认项

- **Q3 依据**：`[UNKNOWN]` 本次自查只读到 `AuthService.login` 与 `SessionRepository.create` 的**签名**，未读方法体，无法确认 `expiresAt` 的实际计算位置与写法。若实际实现与"在 `AuthService` 内计算"不同（例如下沉到 `SessionRepository`），落点需调整。判为**阻塞**的理由同 T00102——该差异直接决定改哪个文件，且调用方掌握"本任务是否仍需执行"的裁定权。
- **Q1 依据**：`[FACT]` HEAD 的 `LoginRequest` 记录已含 `rememberMe`。
- **Q2 依据**：`[INFER]` 由 AC-4 表述推导，非材料明文。
- `[FACT]` AC-4 的 7 天/2 小时为材料明文数值，不需要假设。

### 交付要求

动手前：先处理《执行前必须确认清单》里标"阻塞"的每一条。改动应能独立形成一个 PR。完成后返回：实际改了哪些文件、实际技术选型是否与本说明一致、新增了哪些测试用例、是否有偏离范围的地方、清单每一条的最终处理方式，并附 CI 运行记录与覆盖缺口说明。

---

## T00105：非核心工作——登录成功/失败埋点

你要做的事：为登录成功、账号不存在、密码错误、账号锁定四类结果分支分别打点，供运营看板统计。
对应验收标准：AC-5（四类结果分支各产生一条可区分事件类型的记录；埋点异常不阻塞登录主流程）

本任务信息自包含：不要假设除下文之外还有更多规划背景，下面就是执行这个任务所需的全部上下文。

### 执行前必须确认清单

- [ ] **Q1**（默认生效-可反馈）埋点是否落库到新增 `LoginEvent` 表，而非引入日志采集/消息队列等外部依赖？—— 对应正文「技术选型 #1」。若不反馈：按此方案执行。
- [ ] **Q2**（默认生效-可反馈）事件字段是否沿用 HEAD 已有的 `id`/`eventType`/`username`/`createdAt` 四列？—— 对应正文「技术选型 #2」。若不反馈：按此方案执行。
- [ ] **Q3**（默认生效-可反馈）埋点写入失败是否在调用方（`AuthService`）用 `try/catch` 吞掉并记日志，不向上抛出？—— 对应正文「技术选型 #3」。若不反馈：按此方案执行。
- [ ] **Q4**（默认生效-可反馈）`eventType` 的四个取值是否与 T00102/T00103 的错误码同名（`LOGIN_SUCCESS`/`USER_NOT_FOUND`/`INVALID_PASSWORD`/`ACCOUNT_LOCKED`）？—— 对应正文「隐含规则」。若不反馈：按此方案执行。
- [ ] **Q5**（阻塞）前序任务 T00101～T00104 在 HEAD 已"已存在"状态下，**本任务是否仍需以它们的实际交付为基准核对四个分支的代码位置？** —— 对应正文「背景」。若不答复：无法开工，需先获得答复。

### 背景

这是"用户名密码登录"纵向安全切片计划中的第 5/6 个任务。材料4 固定为空。

**本次自查发现**：HEAD 上本任务产物已存在——`schema.sql` 已含 `"LoginEvent"` 表（`id INTEGER PRIMARY KEY AUTOINCREMENT` / `eventType TEXT NOT NULL` / `username TEXT`(可空) / `createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP`）；`LoginEventRepository` 已存在且已提供 `record(String eventType, String username)`。`[FACT]`

`[UNKNOWN]` 本次自查未读取 `AuthService` 方法体，**未能核实四处埋点调用是否确实落地、`try/catch` 包裹位置是否正确**（AC-5 的"不阻塞主流程"要求）。

### 预计涉及文件

**必须改动**：

- `server/src/main/resources/schema.sql`（修改，`[FACT]` **HEAD 已存在**且已含 `LoginEvent` 表）
- `server/src/main/java/com/tasksplitting/api/LoginEventRepository.java`（新增，`[FACT]` **HEAD 已存在**，已有 `record(String, String)`）
- `server/src/main/java/com/tasksplitting/api/AuthService.java`（修改，`[FACT]` **HEAD 已存在**，四个分支需各追加一次埋点调用）

**可能改动**：无，本任务所有改动文件已在"必须改动"中穷举。

### 技术选型

1. **埋点投递方式** → 落库到 `LoginEvent` 表，不引入日志采集/消息队列。依据：`[FACT]` HEAD 已按此落地，直接复用仓库既有的 `JdbcTemplate` 手写 SQL 能力，不新增技术类别。
2. **事件字段** → `id` / `eventType` / `username`（可空，账号不存在场景仍记录用户尝试输入的用户名，便于风控分析）/ `createdAt`。依据：`[FACT]` HEAD 的 `schema.sql` 已确立这四列。AC-5 只要求"供运营看板统计"，最基本需要"能区分结果类型 + 发生时间"，字段集取满足该最小需求的集合，不做过度设计。
3. **埋点失败不阻塞主流程** → 写入调用包裹 `try/catch`，捕获所有异常仅记日志，不向上抛出。依据：`[FACT]` AC-5 验收细项明文要求"埋点写入失败不阻塞登录主流程返回"。`[UNKNOWN]` HEAD 的 `AuthService` 是否已按此包裹未能核实。

### 你要做什么

**后端**：

1. `schema.sql` 追加 `LoginEvent` 表（DDL 见 HEAD 同名文件）。
2. `LoginEventRepository.record(String eventType, String username)` 内部 INSERT 一条记录。
3. `AuthService.login`：在成功返回前、以及 `USER_NOT_FOUND`/`INVALID_PASSWORD`/`ACCOUNT_LOCKED` 三类异常抛出前，各调用一次 `record`；四处均包裹 `try/catch`。

**前端**：本任务不涉及。依据：`[FACT]` AC-5 的验收细项描述的均是后端埋点行为，材料1"预计涉及文件概要"未列出前端文件。

**从验收标准推导出的隐含规则**：

`[INFER]` **四类分支各自打点，而非笼统的"成功/失败"两类**——AC-5 原文只说"登录成功/失败需要埋点"，未逐类列举失败细分类型；结合 T00102/T00103 已把失败拆成"账号不存在/密码错误/账号锁定"三种，推导出四类分支（成功 + 三类失败）各自需要打点。依据：运营看板通常要统计"哪类失败最多"这种细粒度信息，只打两类会丢失 T00102/T00103 已建立的细分能力。（依据 AC-5）

### 明确不要做的事

- 不要修改 flag 状态
- 不要改动 T00101～T00104 已实现的登录判断逻辑本身，只在其结果分支上追加埋点调用
- 不要实现运营看板前端页面（不在本故事范围内）
- 不要为埋点新增外部依赖（消息队列/日志采集 SDK）
- 若 T00101～T00104 尚未合并，暂停并报告

### 完成定义（DoD）

- `[FACT]` 登录成功、账号不存在、密码错误、账号锁定四种场景，各自有测试断言对应 `LoginEvent` 记录被写入一次，且 `eventType` 可区分。
- `[FACT]` 模拟 `LoginEventRepository` 写入抛异常时，登录接口仍返回原有响应（不因埋点失败而 500），有测试覆盖。
- `[ASSUME]` 四类 `eventType` 取值为 `LOGIN_SUCCESS`/`USER_NOT_FOUND`/`INVALID_PASSWORD`/`ACCOUNT_LOCKED`，与 T00102/T00103 错误码同名。

**CI/CD验收模式：CI/CD-verified**（依据：HEAD 已存在 `.github/workflows/ci.yml`）

追加断言：PR 已触发现有 CI 流水线并全部通过，交付报告附运行记录；**"埋点失败不阻塞主流程"这一条本质上需要注入一个会抛异常的 `LoginEventRepository` 替身才能验证**，若现有 CI 只跑集成测试而未做该替身注入，必须明确指出这个覆盖缺口。

### 假设与待确认项

- **Q5 依据**：`[UNKNOWN]` 本次自查未读 `AuthService` 方法体，四处埋点调用的真实位置与 `try/catch` 包裹情况未能核实。判为**阻塞**：AC-5 的第二条验收细项（埋点异常不阻塞主流程）是否已被满足，直接取决于这段代码，而这正是本任务的核心 DoD。
- **Q1 依据**：`[FACT]` HEAD 的 `schema.sql` 已含 `LoginEvent` 表，`LoginEventRepository` 已存在。
- **Q2 依据**：`[FACT]` 同上，四列结构可直接核实。
- **Q3 依据**：`[FACT]` AC-5 验收细项明文要求；`[UNKNOWN]` 实际落地情况未核实。
- **Q4 依据**：`[INFER]` 与 T00102/T00103 错误码保持一致的命名；本次未从代码核实字面取值。
- `[UNKNOWN]` 运营看板实际消费 `LoginEvent` 所需的完整字段清单，材料未说明，当前只保证 `eventType`/`username`/`createdAt` 三个最基本字段。

### 交付要求

动手前：先处理《执行前必须确认清单》里标"阻塞"的每一条。改动应能独立形成一个 PR。完成后返回：实际改了哪些文件、实际技术选型是否与本说明一致、新增了哪些测试用例、是否有偏离范围的地方、清单每一条的最终处理方式，并附 CI 运行记录与覆盖缺口说明。

---

## T00106：发布收尾——工作台访问保护全量开启 + Flag 清理

你要做的事：把登录态校验套用到既有 `TodoController`，并从代码库中物理删除 `app.feature.login-auth-enabled` 开关。
对应验收标准：AC-1～AC-5（回归）+ 无 flag 代码情况下行为一致 + 仓库内无 flag 残留引用 + 未登录访问 `/api/todos` 被拒绝

本任务信息自包含：不要假设除下文之外还有更多规划背景，下面就是执行这个任务所需的全部上下文。

### 执行前必须确认清单

- [ ] **Q1**（默认生效-可反馈）鉴权校验是否采用"自建 `AuthInterceptor implements HandlerInterceptor` + `WebConfig implements WebMvcConfigurer` 注册"，而非 Spring Security Filter Chain？—— 对应正文「技术选型 #1」。若不反馈：按此方案执行。
- [ ] **Q2**（默认生效-可反馈）拦截路径是否覆盖 `/api/todos/**`（含 GET/POST 全部既有接口）？—— 对应正文「你要做什么」。若不反馈：按此方案执行。
- [ ] **Q3**（默认生效-可反馈）前端是否以"是否有 token"单一维度决定展示登录表单还是工作台，不再保留任何 flag 维度？—— 对应正文「你要做什么」。若不反馈：按此方案执行。
- [ ] **Q4**（阻塞）**本任务的 flag 清理在 HEAD 已完成（源码级命中数为 0），本任务当前是"已完成"还是"需在更早快照上重放"？** —— 对应正文「背景」。若不答复：无法开工，需先获得答复。

### 背景

这是"用户名密码登录"纵向安全切片计划中的第 6/6 个任务，也是最后一个。材料4 固定为空。

**本次自查发现：本任务在 HEAD 已完成，且完成得比本说明的规划更彻底。**`[FACT]`

- `[FACT]` `application.yml` 中**不再包含** `app.feature.login-auth-enabled` 属性（现存内容为 `server.port` / `spring.application.name` / `spring.datasource`（url 已改为 `jdbc:sqlite:${DB_PATH:server/prisma/dev.db}`，支持环境变量覆盖）/ hikari / `spring.sql.init.mode: always`）。
- `[FACT]` 源码级全文搜索 `login-auth-enabled` / `loginAuthEnabled` / `login_auth_enabled`（`--include=*.java,*.yml,*.tsx,*.ts`），**命中全部落在 `docs/任务拆解/` 的历史规划文档与交付报告中，源码命中数为 0**，满足本任务 DoD 的"全文搜索命中数为 0"要求（本说明文档本身除外）。
- `[FACT]` `AuthInterceptor.java` 已存在（`class AuthInterceptor implements HandlerInterceptor`，构造器 `AuthInterceptor(SessionRepository sessionRepository, Clock clock)`，含 `preHandle` 重写），`WebConfig.java` 已存在（`class WebConfig implements WebMvcConfigurer`，构造器注入 `AuthInterceptor`，含 `addInterceptors` 重写）。即拦截器已建立并已注册。
- `[UNKNOWN]` **本次自查未读取 `WebConfig.addInterceptors` 方法体**，因此"拦截器具体注册到哪些路径、是否覆盖 `/api/todos/**`"以及"`AuthInterceptor.preHandle` 是否确已删除 flag 判断"未能核实。
- `[FACT]` 前端 `App.tsx` 已**没有**任何 flag 相关逻辑。

### 预计涉及文件

**必须改动**：

- `server/src/main/java/com/tasksplitting/api/AuthInterceptor.java`（修改，`[FACT]` **HEAD 已存在**，需确认已删除 flag 判断）
- `server/src/main/java/com/tasksplitting/api/WebConfig.java`（修改，`[FACT]` **HEAD 已存在**，需确认拦截路径覆盖 `/api/todos/**`）
- `server/src/main/resources/application.yml`（修改，`[FACT]` **HEAD 已存在**且 flag 已删除，`app.feature` 节点已整体移除）
- `client/src/App.tsx`（修改，`[FACT]` **HEAD 已存在**且 flag 判断已删除）

**可能改动**：

- 为 flag 写过针对性测试（如"flag 关闭时保持旧行为"）的文件——`[UNKNOWN]` 本次自查未检索测试目录中的 flag 引用，但源码级全文搜索命中为 0，**可判定此类测试已不存在或已不引用 flag**。`[FACT]`

### 技术选型

1. **鉴权校验方式** → 自建 `AuthInterceptor implements HandlerInterceptor`，经 `WebConfig implements WebMvcConfigurer` 注册，不使用 Spring Security Filter Chain。依据：`[FACT]` HEAD 已按此落地；与"不引入完整 `spring-boot-starter-security`"的全局约定一致（`pom.xml` 中只有 `spring-security-crypto`）。
2. **拦截路径** → `/api/todos/**`（含 `TodoController` 现有全部接口）。依据：`[ASSUME]` AC-1～AC-5 的"未登录不可访问工作台"要求覆盖既有业务接口；具体路径清单本次未从 `WebConfig` 核实。
3. **flag 移除方式** → 物理删除，不保留"仅注释掉"或"默认 true"等半清理状态。依据：`[FACT]` AC 明文要求"仓库内无残留引用"，且 HEAD 的实际做法是整体删除 `app.feature` 节点。

### 你要做什么

前提：确认 T00101～T00105 均已合并到主干。

**后端**：

1. 在 `AuthInterceptor` 中删除内部对 `app.feature.login-auth-enabled` 的读取与判断分支，使鉴权校验始终生效。
2. 在 `WebConfig.addInterceptors` 中无条件把该拦截器注册到 `/api/todos/**`。
3. 删除 `application.yml` 中的 `app.feature.login-auth-enabled` 属性（HEAD 已整体删除 `app.feature` 节点）。

**前端**：

1. 在 `App.tsx` 中删除对该 flag 的判断分支，让"是否展示工作台"完全由"是否有 token"决定。

**通用**：

2. 全仓库全文搜索 `login-auth-enabled`（含配置文件、代码、注释、测试用例中的引用），确认清理完成。

**从验收标准推导出的隐含规则**：

1. `[INFER]` **flag 删除前后对同一操作序列的响应必须逐条比对一致**——AC 要求"回归"，不能只跑一遍测试通过就算数。（依据 AC-1～AC-5 回归要求）
2. `[INFER]` **`TodoController` 现有的 GET/POST `/api/todos` 必须被完全纳入保护范围，不能遗漏**——清理完成后需对这两个既有接口逐一验证保护生效。（依据"未登录访问 `/api/todos` 被拒绝"）
3. `[INFER]` **"全文搜索不再有任何引用"包括测试代码中为该 flag 写过的针对性测试**，这些测试本身也应删除或改写，不能留下引用已删除 flag 的死测试代码。（依据"无残留引用"）
4. `[INFER]` **拦截器对 AC-1～AC-5 的登录接口本身不能误伤**——`/api/auth/login` 必须保持未登录可访问，否则用户无法登录，形成死锁。（依据 AC-1 与"未登录访问 `/api/todos` 被拒绝"的范围限定）

### 明确不要做的事

- 不要在本任务中新增/修改 AC-1～AC-5 已实现的业务逻辑本身（密码校验规则、锁定时长、会话时长均不在本任务范围）
- 不要顺带清理与本故事无关的其他历史配置
- 不要跳过"确认无引用"这一步就直接删除
- 不要对 `/api/avatars`、`/api/forgot-password` 等后续故事（T00201/T00301）的接口做拦截范围决策——不在本故事范围内，**若发现这些接口的保护策略存在缺口，记录并在交付报告中提醒，不要顺带改掉**
- 本任务在 T00101～T00105 实际合并前不应被派发执行

### 完成定义（DoD）

- `[FACT]` 源码级全文搜索 `login-auth-enabled` 命中数为 0（`docs/` 历史规划文档与交付报告除外，本说明文档本身除外）——**HEAD 已满足**。
- `[FACT]` `TodoController` 相关的 `/api/todos` 路由（GET/POST）在无 flag 代码的情况下，未携带有效 `Authorization` 头访问时返回 401/403 拒绝，有集成测试覆盖。
- `[FACT]` AC-1～AC-5 对应的既有测试用例，在删除 flag 代码后全部通过，测试结果与 T00101～T00105 交付时记录的验收结果一致。
- `[FACT]` `application.yml` 中不再包含该 flag 声明——**HEAD 已满足**。
- `[INFER]` 未登录访问 `/api/auth/login` 仍可正常登录（拦截器未误伤登录接口），有测试覆盖。

**CI/CD验收模式：CI/CD-verified**（依据：HEAD 已存在 `.github/workflows/ci.yml`；**且本任务本身就是"收尾 + 回归"性质，正是 CI 流水线最能发挥作用的场景**——但它对"未登录访问 `/api/todos` 返回 401"这类端到端行为是否真有断言，取决于 `AuthIntegrationTest` 的覆盖范围）

追加断言：PR 已触发现有 CI 流水线并全部通过，交付报告附 CI 运行记录（链接/截图）；**必须显式核对现有 CI 的 `mvn test` 是否包含"未登录访问 `/api/todos` 被拒绝"的断言**——若没有，这条 DoD 属于"CI 绿了但没验证过"的缺口，必须在交付报告中指出。

### 假设与待确认项

- **Q4 依据**：`[FACT]` HEAD 已同时满足本任务的两条最硬 DoD（flag 声明不存在、源码级命中为 0），拦截器与配置类也已建立。这使本说明的定位在"待执行说明"与"回放核对清单"之间摇摆，只能由调用方裁定。判为**阻塞**。
- **Q1 依据**：`[FACT]` HEAD 的 `AuthInterceptor`/`WebConfig` 已存在且签名与规划一致。
- **Q2 依据**：`[ASSUME]` 拦截路径清单本次未从 `WebConfig` 方法体核实；`[FACT]` 佐证是 `TodoController` 确实存在（api/ 下已确认）。
- **Q3 依据**：`[FACT]` HEAD 的 `App.tsx` 已无 flag 逻辑。
- `[UNKNOWN]` 前序任务在 HEAD "已完成"的状态下，本任务"回归比对"的基准（T00101～T00105 交付时记录的验收结果）应以哪份记录为准——`docs/任务拆解/` 下有各任务交付报告，但本次自查未读取，无法给出结论。

### 交付要求

动手前：先处理《执行前必须确认清单》里标"阻塞"的每一条。改动应能独立形成一个 PR。完成后返回：实际改了哪些文件、实际技术选型是否与本说明一致、新增了哪些测试用例、是否有偏离范围的地方、清单每一条的最终处理方式，以及**开关清理的确认方式（全文搜索命中数为 0 的实际执行记录）**，并附 CI 运行记录与覆盖缺口说明。
