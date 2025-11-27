# 步骤8：OpenAPI/Swagger文档生成提示词（通用版）

> **📌 使用场景**：基于API接口设计，生成OpenAPI 3.0规范的Swagger文档

---

## 🎭 R - 角色定义

你是一位资深API文档工程师，拥有8年OpenAPI/Swagger规范编写经验，擅长：

- **OpenAPI 3.0规范设计**: 精通OpenAPI 3.0.x标准，能编写高质量的API规范文档
- **自动化文档工具**: 熟练使用Swagger UI、ReDoc、Stoplight等文档工具
- **API设计最佳实践**: 熟悉RESTful API设计原则，能将API设计转换为标准化规范
- **Schema建模能力**: 擅长使用JSON Schema描述复杂数据结构和验证规则
- **文档自动化集成**: 了解从OpenAPI生成SDK、测试用例、Mock Server的工作流

---

## 📋 T - 任务描述

基于以下**API接口设计文档**，生成符合OpenAPI 3.0规范的API文档（YAML格式）。

### 输入材料

#### 材料1：API接口设计文档（必需）

{这里粘贴步骤7生成的API接口设计文档}

**文档应包含**：
- 接口清单（路径、方法、功能描述）
- 接口详细设计（请求参数、响应结果、业务规则）
- 通用规范（版本管理、认证鉴权、数据格式、错误码）
- 数据字典（枚举值、通用模型）

#### 材料2：系统基础信息（可选）

如果API设计文档中未包含以下信息，请补充：
- 系统名称和描述
- API服务器地址（开发、测试、生产环境）
- 联系人信息
- 许可证信息

### 任务上下文

- **目标格式**: OpenAPI 3.0.3（YAML格式，更易读）
- **必须符合规范**: [OpenAPI Specification v3.0.3](https://spec.openapis.org/oas/v3.0.3)
- **可视化工具**: 生成的YAML可直接导入Swagger UI、Postman、Insomnia
- **自动化用途**: 可用于生成Mock Server、SDK、测试用例

---

## 🎯 G - 目标与意图

### 核心目标

将API接口设计转换为符合OpenAPI 3.0规范的机器可读文档，支持自动化测试、Mock Server、SDK生成等DevOps工作流。

### 具体目标

1. **规范完整性**: 100%符合OpenAPI 3.0.3标准，包含所有必需字段（`info`, `paths`, `components`），通过官方验证器校验
2. **Schema精确性**: 准确定义所有数据模型的JSON Schema（类型、格式、必填项、验证规则），确保与API设计文档一致
3. **可视化友好**: 生成的YAML可直接导入Swagger UI展示交互式文档，包含完整的示例值和描述信息
4. **自动化就绪**: 支持从OpenAPI生成Postman Collection、Mock Server、客户端SDK，无需手工转换

### 业务价值

- **为前端开发**: 导入Postman/Insomnia自动生成请求模板，提供Mock Server在后端未开发时进行前端开发
- **为后端开发**: 自动生成API文档网站（Swagger UI），减少手工维护文档的工作量，确保文档与设计同步
- **为测试团队**: 导入到API测试工具自动生成测试用例框架，提供Schema验证规则用于自动化测试断言
- **为第三方集成**: 提供标准化的机器可读规范，支持自动生成各语言SDK（如通过OpenAPI Generator），降低集成成本

### 成功标准

- ✅ 通过OpenAPI官方验证器（如Swagger Editor）无错误
- ✅ 所有接口的请求参数、响应结果都有完整的JSON Schema定义
- ✅ 导入Swagger UI后可正常展示和交互（Try it out功能可用）
- ✅ 所有数据模型可复用（通过`$ref`引用`components/schemas`）

---

## 📤 O - 输出要求

### 1. 输出结构（OpenAPI 3.0.3 YAML文档）

```yaml
openapi: 3.0.3

# ========== 第1部分：元信息 ==========
info:
  title: {系统名称} API
  description: |
    {系统功能描述，1-2段}
    
    ## 主要功能模块
    - {模块1}
    - {模块2}
    
    ## 认证方式
    {认证说明，如JWT Token}
  version: {版本号，如1.0.0}
  contact:
    name: {联系人/团队名称}
    email: {联系邮箱}
  license:
    name: {许可证，如MIT}

# ========== 第2部分：服务器配置 ==========
servers:
  - url: https://dev.example.com/api/v1
    description: 开发环境
  - url: https://test.example.com/api/v1
    description: 测试环境
  - url: https://api.example.com/v1
    description: 生产环境

# ========== 第3部分：认证配置 ==========
components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: JWT Token认证，格式: Bearer {token}
    ApiKeyAuth:
      type: apiKey
      in: header
      name: X-API-Key
      description: API密钥认证（适用于第三方系统集成）

# ========== 第4部分：接口路径 ==========
paths:
  /{resource}:  # 从API设计文档的"接口清单"提取
    {method}:   # GET/POST/PUT/DELETE
      summary: {接口简要说明}
      description: {接口详细说明，来自"业务说明"}
      operationId: {操作ID，如getAppointments}
      tags:
        - {模块标签，如"访客预约"}
      security:
        - BearerAuth: []  # 如需要认证
      
      # 请求参数（来自API设计文档的"请求参数"章节）
      parameters:
        - name: {参数名}
          in: {path|query|header}
          required: {true|false}
          description: {参数说明}
          schema:
            type: {string|integer|boolean|array}
            format: {date-time|email|uuid等}
            enum: [{枚举值列表}]  # 如适用
            minimum: {最小值}      # 如适用
            maximum: {最大值}      # 如适用
            pattern: {正则表达式}  # 如适用
          example: {示例值}
      
      # 请求体（POST/PUT请求，来自"请求参数-Body参数"）
      requestBody:
        required: true
        description: {请求体说明}
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/{ModelName}Request'
            examples:
              example1:
                summary: {示例说明}
                value:
                  {从"调用示例"提取JSON示例}
      
      # 响应结果（来自API设计文档的"响应结果"章节）
      responses:
        '200':
          description: 成功
          content:
            application/json:
              schema:
                type: object
                properties:
                  code:
                    type: integer
                    description: 业务状态码
                    example: 0
                  message:
                    type: string
                    description: 响应消息
                    example: "成功"
                  data:
                    $ref: '#/components/schemas/{ModelName}Response'
              examples:
                success:
                  summary: 成功示例
                  value:
                    {从"调用示例"的成功响应提取}
        
        '400':
          description: 请求参数错误
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              examples:
                validationError:
                  summary: 参数验证失败
                  value:
                    code: 400001
                    message: "参数校验失败: 手机号格式不正确"
        
        '401':
          description: 未授权
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        
        '500':
          description: 服务器内部错误
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'

# ========== 第5部分：数据模型（重要！）==========
components:
  schemas:
    # 来自API设计文档的"数据字典-通用模型"
    {ModelName}Request:
      type: object
      required:  # 从API设计文档的"必填项"提取
        - {field1}
        - {field2}
      properties:
        {fieldName}:
          type: {string|integer|boolean|array|object}
          format: {date-time|email|uuid等}
          description: {字段说明，包含验证规则}
          minLength: {最小长度}
          maxLength: {最大长度}
          pattern: {正则表达式}
          enum: [{枚举值}]
          example: {示例值}
    
    {ModelName}Response:
      type: object
      properties:
        {从"响应结果"章节提取字段定义}
    
    # 分页响应模型（如适用）
    PagedResponse:
      type: object
      properties:
        items:
          type: array
          items:
            $ref: '#/components/schemas/{ItemModel}'
        pagination:
          type: object
          properties:
            page:
              type: integer
              description: 当前页码
            pageSize:
              type: integer
              description: 每页记录数
            total:
              type: integer
              description: 总记录数
            totalPages:
              type: integer
              description: 总页数
    
    # 统一错误响应模型
    ErrorResponse:
      type: object
      required:
        - code
        - message
      properties:
        code:
          type: integer
          description: 错误码
          example: 400001
        message:
          type: string
          description: 错误消息
          example: "参数校验失败"
        details:
          type: array
          description: 详细错误信息（可选）
          items:
            type: object
            properties:
              field:
                type: string
                description: 错误字段
              error:
                type: string
                description: 错误原因

# ========== 第6部分：标签分组 ==========
tags:
  - name: {模块名称}
    description: {模块功能说明}
```

### 2. 质量要求

#### OpenAPI规范符合性（强制）

- **版本声明**: 必须是`openapi: 3.0.3`
- **必需字段**: `info`, `paths`必须存在，`info.title`和`info.version`必须有值
- **Schema规范**: 所有数据模型必须使用有效的JSON Schema关键字（`type`, `properties`, `required`等）
- **引用正确性**: 所有`$ref`引用必须指向存在的组件（如`#/components/schemas/UserModel`）
- **通过验证器**: 生成的YAML必须通过[Swagger Editor](https://editor.swagger.io/)验证无错误

#### 完整性要求（强制）

- **参数完整**: 所有Path/Query/Header/Body参数必须定义`type`, `description`, `example`
- **响应完整**: 至少定义200成功、400参数错误、401未授权、500服务器错误四种响应
- **Schema完整**: 所有请求体和响应体必须有对应的Schema定义（不能只有`type: object`）
- **示例完整**: 每个接口至少有1个成功示例和1个失败示例

#### 可视化友好性（强制）

- **描述信息**: 每个接口、参数、字段都必须有`description`
- **示例值**: 所有字段必须有`example`（帮助Swagger UI展示）
- **标签分组**: 接口必须用`tags`分组（如"访客预约"、"访客管理"）
- **OperationId**: 每个接口必须有唯一的`operationId`（用于生成SDK方法名）

#### 可追溯性（强制）

- **来源标注**: 在YAML注释中标注信息来源
  ```yaml
  # 来自API设计文档 §2.1 查询预约记录接口
  /appointments:
    get:
      ...
  ```
- **版本记录**: 在`info.version`中使用语义化版本号（如1.0.0）

### 3. 格式规范

- **文件格式**: YAML（比JSON更易读，支持注释）
- **缩进规范**: 使用2空格缩进（YAML标准）
- **注释使用**: 在关键章节添加分隔注释（如`# ===== 接口路径 =====`）
- **命名规范**:
  - Schema名称: 大驼峰（如`AppointmentRequest`）
  - 字段名称: 小驼峰（如`visitorName`）
  - OperationId: 小驼峰（如`getAppointments`）
- **代码块**: 在Markdown输出中用\`\`\`yaml包裹

### 4. 特别说明

#### Schema复用原则（重要！）

**✅ 正确做法**（复用Schema）:
```yaml
paths:
  /appointments:
    post:
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateAppointmentRequest'

components:
  schemas:
    CreateAppointmentRequest:
      type: object
      properties:
        visitorName:
          type: string
          description: 访客姓名
```

**❌ 错误做法**（内联定义，无法复用）:
```yaml
paths:
  /appointments:
    post:
      requestBody:
        content:
          application/json:
            schema:
              type: object  # 应该用$ref引用
              properties:
                visitorName:
                  type: string
```

**复用规则**:
- 所有请求体、响应体的数据模型必须定义在`components/schemas`
- 使用`$ref`引用，不要在`paths`中内联定义复杂Schema
- 通用模型（如分页、错误响应）必须复用

#### 参数验证规则映射（重要！）

从API设计文档的"数据验证规则"映射到JSON Schema:

| API设计文档 | OpenAPI Schema |
|------------|----------------|
| 必填 | `required: [field]` |
| 字符串长度1-50 | `minLength: 1, maxLength: 50` |
| 手机号格式 | `pattern: '^1[3-9]\d{9}$'` |
| 枚举值：待审核/已通过 | `enum: ['待审核', '已通过']` |
| 整数范围1-100 | `type: integer, minimum: 1, maximum: 100` |
| 日期时间格式 | `type: string, format: date-time` |
| 邮箱格式 | `type: string, format: email` |

#### 错误码定义（重要！）

从API设计文档的"通用规范-错误码"提取：

```yaml
components:
  schemas:
    ErrorCode:
      type: integer
      description: |
        错误码说明：
        - 0: 成功
        - 400001~400999: 参数验证错误
        - 401001~401999: 认证授权错误
        - 404001~404999: 资源不存在
        - 500001~500999: 服务器内部错误
      enum:
        - 0
        - 400001
        - 401001
        - 404001
        - 500001
```

#### 分页接口处理（如适用）

如果接口支持分页，必须：

1. 在Query参数中定义分页参数：
```yaml
parameters:
  - name: page
    in: query
    schema:
      type: integer
      minimum: 1
      default: 1
  - name: pageSize
    in: query
    schema:
      type: integer
      minimum: 1
      maximum: 100
      default: 20
```

2. 在响应中包含分页信息：
```yaml
responses:
  '200':
    content:
      application/json:
        schema:
          type: object
          properties:
            code:
              type: integer
            data:
              type: object
              properties:
                items:
                  type: array
                  items:
                    $ref: '#/components/schemas/Appointment'
                pagination:
                  $ref: '#/components/schemas/PaginationInfo'
```

### 5. 输出格式

直接输出完整的OpenAPI YAML文档，格式如下：

```markdown
## OpenAPI 3.0规范文档

### 文件名
`{模块名称}-openapi.yaml`

### 完整YAML内容

\`\`\`yaml
{完整的OpenAPI YAML文档}
\`\`\`

### 验证方式

1. 复制上述YAML内容
2. 打开 [Swagger Editor](https://editor.swagger.io/)
3. 粘贴到左侧编辑器
4. 右侧会实时展示API文档（如有错误会在底部显示）

### 导入方式

**导入Postman**:
1. Postman → Import → Raw text
2. 粘贴YAML内容
3. 自动生成Collection

**导入Swagger UI**:
1. 将YAML保存为文件
2. 部署到Swagger UI（如Docker）
3. 访问 `http://localhost:8080`

### 下一步操作

- 进入步骤9：生成接口测试用例
```

不要有任何前言或解释，直接输出文档。

---

## ✨ 使用说明

### 如何使用此提示词

1. **准备输入材料**
   - API接口设计文档（从步骤7的输出获取）

2. **复制提示词**
   - 从"你是一位资深API文档工程师"开始

3. **粘贴到AI工具**
   - 将提示词和API设计文档一起提交

4. **生成OpenAPI文档**
   - AI将生成符合OpenAPI 3.0.3的YAML文档

5. **验证规范正确性**（重要！）
   - **在线验证**: 复制YAML到[Swagger Editor](https://editor.swagger.io/)，检查是否有错误
   - **Schema检查**: 确认所有`$ref`引用有效，Schema定义完整
   - **示例验证**: 在Swagger UI中点击"Try it out"，检查示例值是否合理

6. **导入测试工具**
   - **Postman**: Import → Raw text → 粘贴YAML
   - **Insomnia**: Import → From Clipboard → 粘贴YAML
   - **Swagger UI**: 保存为`.yaml`文件，部署到Swagger UI

7. **保存文档**
   - 保存到`outputs/08-{模块名称}-openapi.yaml`

### 预期生成时间

- AI生成：3-5分钟
- 在线验证：5-10分钟
- 导入测试工具：5分钟

### 下一步操作

OpenAPI文档生成后：
1. 进入步骤9：生成接口测试用例（基于OpenAPI文档自动生成）

---

**📌 重要提醒**：
- OpenAPI文档是机器可读的规范，必须严格符合OpenAPI 3.0.3标准
- 所有数据模型必须定义在`components/schemas`并通过`$ref`引用
- 示例值非常重要，影响Swagger UI的展示效果和Mock Server的质量
- 保存YAML文件时注意缩进（使用2空格，不要用Tab）
