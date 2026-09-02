# Sprint 1 技术设计摘要（HLD-Sprint摘要提取）

> 使用提示词：`../提示词/4-软件设计/概要设计/HLD-Sprint摘要提取提示词.md`
> 材料1：`06-HLD-02-接口设计.md`（全文，含第8章）
> 材料2：`07-HLD-03-数据库设计.md`（全文，含第8章）
> 材料3：Sprint 1 Story列表（摘自`10-发布计划.md`）
> 材料4：`05-HLD-01-模块划分.md` 第7章 模块与Story映射矩阵（MOD-001部分）

**提取来源**：HLD-02（`06-HLD-02-接口设计.md`）+ HLD-03（`07-HLD-03-数据库设计.md`）
**Sprint范围**：4条Story
**提取日期**：2026-08-29

---

## 第1章：Sprint范围摘要

| 项 | 内容 |
|----|------|
| Sprint编号 | Sprint 1 |
| 覆盖Story | US001（用户登录认证）、US002（用户账号管理）、US003-Rev（角色权限控制/权限矩阵）、US004（会话超时管理） |
| 覆盖模块 | MOD-001 用户认证与访问控制 |
| 涉及接口数 | 5个（API-101～API-105） |
| 涉及数据表数 | 4个（T-001～T-004） |

---

## 第2章：涉及接口清单

### 2.1 索引表（摘自HLD-02第8章，按Story过滤）

| 接口编号 | 接口名称 | 一句话职责 | 关联模块 | 关联Story | 约束标记 |
|---------|---------|-----------|---------|-----------|---------|
| API-101 | 用户注册 | 校验并创建新用户账号 | MOD-001 | US002 | 🔒BCrypt加密(ADR-007) |
| API-102 | 用户登录 | 校验密码并签发JWT | MOD-001 | US001 | 🔒防暴力破解限流 |
| API-103 | 查询权限矩阵 | 返回当前用户全局+项目角色权限 | MOD-001 | US003-Rev | 🔒Redis缓存TTL5分钟 |
| API-104 | 刷新Token | 用Refresh Token换发新Access Token | MOD-001 | US004 | 🔒黑名单校验 |
| API-105 | 登出 | Token加入黑名单 | MOD-001 | US004 | - |

### 2.2 接口详细设计（摘自HLD-02第4章，仅保留2.1列出的条目）

**API-102: 用户登录**（原文第4章唯一给出完整详设的MOD-001代表性接口，原样摘录）

**基本信息**：
- **接口路径**：POST /api/v1/auth/login
- **接口功能**：校验密码，签发JWT Access Token与Refresh Token
- **所属模块**：MOD-001 用户认证与访问控制
- **认证要求**：无需认证
- **优先级**：P0
- **关联模块**：MOD-001 | **关联Story**：US001

**请求参数**：

| 参数名 | 类型 | 位置 | 必填 | 说明 | 校验规则 |
|--------|------|------|------|------|---------|
| username | String | Body | 是 | 用户名 | 4-20字符 |
| password | String | Body | 是 | 密码明文（HTTPS传输） | 8-20字符 |

**成功响应示例**：
```json
{
  "code": 200, "message": "success",
  "data": {
    "userId": "1001", "username": "zhangsan",
    "accessToken": "eyJhbGciOi...", "accessTokenExpiresIn": 1800,
    "refreshToken": "eyJhbGciOi...", "refreshTokenExpiresIn": 604800
  },
  "timestamp": 1735084800000
}
```

**失败响应示例**：
```json
{ "code": 41001, "message": "用户名或密码错误", "data": null, "timestamp": 1735084800000 }
```

**错误码说明**：

| 错误码 | 错误信息 | HTTP状态码 | 处理建议 |
|--------|---------|-----------|---------|
| 41001 | 用户名或密码错误 | 401 | 提示用户检查输入，不区分"用户名不存在/密码错误"以防用户名枚举攻击 |
| 41003 | 账号已被锁定（连续失败5次） | 403 | 提示用户15分钟后重试 |

**业务逻辑**：
1. 查询用户，BCrypt比对密码（追溯ADR-007）
2. 连续失败计数（Redis），达阈值锁定账号15分钟
3. 签发Access Token（30分钟）+ Refresh Token（7天），追溯ADR-001
4. 记录登录成功事件（异步，供MOD-006审计使用，追溯ADR-006）

**性能要求**：P95 < 500ms（追溯SAD 3.1性能效率指标）

> **⚠️ 提取说明（如实标注，不推测补全）**：API-101（用户注册）、API-103（查询权限矩阵）、API-104（刷新Token）、API-105（登出）在HLD-02第3章索引中状态均为"✅ 已设计"，但未标注"详设见第4章"——即HLD-02原文第4章仅对每个模块选取1个代表性接口给出完整详细设计（追溯`00-执行计划.md`三、范围说明），这4个接口目前只有第3章的路径/方法/认证要求信息，**没有**请求参数/响应示例/错误码/业务逻辑等完整详设内容。按本提示词"不改写、不新增、不推测"的核心原则，此处如实标注缺失，不代为编造。若步骤12的Sprint任务拆解需要用到这4个接口的完整详设，需要先回到HLD-02针对性补充，本摘要提取步骤职责仅为"筛选已有内容"，不承担"补全缺口"的职责。

---

## 第3章：涉及数据表清单

### 3.1 索引表（摘自HLD-03第8章，按Story过滤）

| 表编号 | 表名 | 一句话职责 | 关联模块 | 关联Story | 约束标记 |
|--------|------|-----------|---------|-----------|---------|
| T-001 | t_user | 存储用户基本信息与登录凭证 | MOD-001 | US001-US004 | 🔒BCrypt加密(ADR-007) |
| T-002 | t_role | 系统级角色定义 | MOD-001 | US003-Rev | - |
| T-003 | t_permission | 权限点定义 | MOD-001 | US003-Rev | - |
| T-004 | t_role_permission | 角色-权限关联 | MOD-001 | US003-Rev | - |

### 3.2 表结构详情（摘自HLD-03第3章，仅保留3.1列出的条目）

**T-001: t_user（用户表）**（原文第3章唯一给出完整详设的MOD-001代表性表，原样摘录）

**关联模块**: MOD-001 | **关联Story**: US001-US004

**表说明**：存储用户基本信息与登录凭证

**字段清单**：

| 字段名 | 类型 | 长度 | 主键 | 非空 | 默认值 | 说明 | 索引 |
|--------|------|------|------|------|--------|------|------|
| id | BIGINT | - | ✅ | ✅ | AUTO_INCREMENT | 用户ID | PRIMARY |
| username | VARCHAR | 20 | - | ✅ | - | 用户名 | UNIQUE |
| password_hash | VARCHAR | 100 | - | ✅ | - | BCrypt密文（追溯ADR-007，🔒不可逆加密） | - |
| email | VARCHAR | 100 | - | ✅ | - | 邮箱 | UNIQUE |
| nickname | VARCHAR | 50 | - | - | NULL | 昵称 | - |
| status | TINYINT | - | - | ✅ | 1 | 账号状态：1正常/0锁定（追溯US001登录失败锁定逻辑） | INDEX |
| failed_login_count | TINYINT | - | - | ✅ | 0 | 连续登录失败次数 | - |
| created_at | DATETIME | - | - | ✅ | CURRENT_TIMESTAMP | 创建时间 | - |
| updated_at | DATETIME | - | - | ✅ | CURRENT_TIMESTAMP ON UPDATE | 更新时间 | - |

**建表SQL**：
```sql
CREATE TABLE t_user (
  id BIGINT NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  username VARCHAR(20) NOT NULL COMMENT '用户名',
  password_hash VARCHAR(100) NOT NULL COMMENT 'BCrypt密文(ADR-007)',
  email VARCHAR(100) NOT NULL COMMENT '邮箱',
  nickname VARCHAR(50) DEFAULT NULL COMMENT '昵称',
  status TINYINT NOT NULL DEFAULT 1 COMMENT '1正常/0锁定',
  failed_login_count TINYINT NOT NULL DEFAULT 0 COMMENT '连续登录失败次数',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_username (username),
  UNIQUE KEY uk_email (email),
  KEY idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';
```

**分表策略**：数据量预估≤5000，MVP阶段不分表；若未来支持SaaS多租户对外开放，需评估按注册来源分表

**数据量预估**：首年≤5000行，年增长率约30%

> **⚠️ 提取说明（如实标注，不推测补全）**：T-002（t_role）、T-003（t_permission）、T-004（t_role_permission）在HLD-03第8章索引中已登记，但HLD-03原文第3章仅对每个模块选取1张代表性表给出完整字段清单/建表SQL（同样追溯`00-执行计划.md`三、范围说明），这3张表目前**仅有表名与一句话职责**，没有字段清单和建表SQL。与第2章的处理原则一致，此处不代为编造字段设计。

---

## 第4章：横切约束汇总

对第2/3章中出现的全部约束标记去重合并：

| 约束标记 | 含义 | 涉及接口/表 | 落地要求 |
|---------|------|-----------|---------|
| 🔒 密码加密 | 敏感信息不可逆加密 | API-101, T-001 | 密码使用BCrypt加密存储，禁止明文/可逆加密（追溯ADR-007） |
| 🔒 登录防护 | 防暴力破解/账号锁定 | API-102 | Redis连续失败计数，达阈值（5次）锁定账号15分钟 |
| 🔒 权限缓存 | 权限查询性能与一致性平衡 | API-103 | 权限矩阵结果Redis缓存TTL 5分钟，需在验收标准中明确"权限变更后最长5分钟生效"是否可接受（追溯`09-Product-Backlog.md`风险R1） |
| 🔒 Token黑名单 | 会话失效控制 | API-104, API-105 | Refresh Token刷新前校验黑名单；登出时将当前Token加入黑名单，追溯ADR-001会话生命周期设计 |

**本Sprint未涉及的约束类型**：🔁（幂等/并发控制，如乐观锁）、⏱（时效性/性能SLA专项标记）在Sprint 1范围内的接口/表上均未出现——这两类约束集中出现在MOD-004任务生命周期管理模块（T-008 t_task的🔁乐观锁version等），不属于Sprint 1范围，待对应Sprint的摘要提取时再汇总。

---

## 第5章：跨Sprint依赖提示

| 依赖方（本Sprint内） | 被依赖的接口/表 | 所属Sprint（若已知） | 风险说明 |
|---------------------|----------------|---------------------|---------|
| US001 用户登录认证 | API-102、T-001 | 已在本Sprint覆盖 | 无风险 |
| US002 用户账号管理 | API-101、T-001 | 已在本Sprint覆盖 | 无风险 |
| US004 会话超时管理 | API-104、API-105、T-001 | 已在本Sprint覆盖 | 无风险 |
| US003-Rev 角色权限控制（权限矩阵） | API-103、T-002/T-003/T-004 | 已在本Sprint覆盖 | 全局角色权限部分无风险 |
| US003-Rev 角色权限控制（项目级角色部分） | T-007 t_project_member（项目成员表，`07-HLD-03-数据库设计.md`第3章代表性表之一） | Sprint 2（`10-发布计划.md`已排期，尚未开始） | **已知风险，与`10-发布计划.md`第三节记录一致**：权限矩阵中"项目级角色"（如团队负责人/团队成员）的数据来源是`t_project_member`表，该表由MOD-002/Sprint 2的US006（项目成员管理）产出。Sprint 1阶段建议先用内存Mock的项目角色数据完成`PermissionEvaluator`接口本身的开发与单元测试，Sprint 2 T-007落地后再做一次前后端联调验证项目级权限生效。 |

**一致性核验说明**：本章识别出的唯一跨Sprint依赖（US003-Rev → T-007 t_project_member）与`10-发布计划.md`第三节"跨Sprint依赖检查"中记录的"US003-Rev -.-> US006"弱依赖调整完全对应——两份文档在不同层级（Story级 vs 表级）独立识别出同一个风险点，相互印证了该依赖调整决策的合理性，也验证了本轮全链路各步骤之间的追溯链路是通的。
