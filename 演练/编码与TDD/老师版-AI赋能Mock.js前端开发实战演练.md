# AI赋能Mock.js前端开发实战演练 - 老师版

> **📌 文档定位**: 本文档为讲师提供完整的Mock.js前端开发演练指导，包括概念讲解、流程指导、注意事项和FAQ  
> **🎯 培训目标**: 让学员掌握使用AI工具完成Mock.js前端独立开发的完整流程，效率提升5-6倍  
> **⏱️ 建议时长**: 3小时（理论60分钟 + 演练90分钟 + 答疑30分钟）

---

## 📚 第一部分：Mock.js前端开发基础概念

### 1.1 什么是Mock.js？

#### 核心定义

Mock.js是一个**拦截器级别的前端Mock方案**，通过重写浏览器原生的`XMLHttpRequest`对象，在浏览器层面拦截Ajax请求并返回模拟数据，**不会发出真实的网络请求**。

#### 与其他Mock方案的对比

| 方案类型 | 实现原理 | 优势 | 劣势 | 适用场景 |
|---------|---------|------|------|---------|
| **Mock.js** | 浏览器拦截器 | 无需后端支持，简单快速 | 只能模拟Ajax请求 | 前端独立开发、Demo演示 |
| **Mock Server**（如MSW） | Service Worker拦截 | 更真实的网络模拟 | 配置复杂，需部署 | 大型项目、团队协作 |
| **Proxy代理** | Webpack/Vite代理 | 可转发真实后端 | 需要后端部分就绪 | 前后端联调阶段 |
| **JSON Server** | 本地REST API | 真实的HTTP请求 | 需要单独启动服务 | 需要真实HTTP场景 |

#### Mock.js的工作原理

```javascript
// 1. Mock.js重写XMLHttpRequest
const _XMLHttpRequest = window.XMLHttpRequest;
window.XMLHttpRequest = function() {
  const xhr = new _XMLHttpRequest();
  
  // 2. 拦截send方法
  const _send = xhr.send;
  xhr.send = function(data) {
    // 3. 匹配URL规则
    if (匹配Mock规则) {
      // 4. 直接返回Mock数据，不发起真实请求
      返回Mock数据();
    } else {
      // 5. 未匹配规则，发起真实请求
      _send.call(xhr, data);
    }
  };
  
  return xhr;
};
```

**关键特性**:
- ✅ **无侵入性**: 组件代码无需修改，只需在入口引入Mock
- ✅ **真实模拟**: 模拟网络延迟、Loading状态
- ✅ **随机数据**: 提供Random API生成真实感数据
- ✅ **业务逻辑**: 可编写if-else实现复杂业务规则

---

### 1.2 前端Mock开发的核心价值

#### 问题场景：前后端分离的阻塞困境

**传统开发流程**:
```
前端开发 → 等待后端接口 → 联调 → 发现问题 → 修改 → 再联调 → ...
```

**核心问题**:
- ❌ **依赖阻塞**: 前端被后端进度阻塞，无法独立开发
- ❌ **沟通成本高**: 前后端频繁沟通接口字段、格式
- ❌ **联调效率低**: 后端接口不稳定，前端难以测试边界场景
- ❌ **交付风险高**: 集成阶段才发现兼容性问题

#### Mock方案的价值

**AI赋能Mock开发流程**:
```
Story → AI生成契约 → AI生成Mock → 前端独立开发 → 一次性联调成功
```

**核心价值**:
1. **前后端并行开发**（效率×2）
   - 前端基于Mock独立开发UI和交互
   - 后端基于契约开发真实接口
   - 互不阻塞，同步进行

2. **契约先行，减少返工**（质量×2）
   - 前后端基于Swagger契约达成一致
   - 契约一致性检查，联调前发现问题
   - 减少集成阶段的返工成本

3. **边界场景全覆盖**（测试覆盖率+60%）
   - Mock可模拟各种异常场景（网络超时、500错误）
   - 前端提前测试错误处理逻辑
   - 提升产品质量

4. **快速验收，加速交付**（交付周期-40%）
   - 产品经理基于Mock验收UI和交互
   - 无需等待后端接口就绪
   - 缩短需求到交付的周期

---

### 1.3 Mock.js核心API速查

#### 1.3.1 Mock.mock() - 定义拦截规则

```javascript
// 语法
Mock.mock(rurl, rtype, template|function)

// 参数说明
rurl     : RegExp | String  - 拦截的URL（支持正则）
rtype    : String           - 拦截的Ajax类型（GET/POST/PUT/DELETE）
template : Object | Function - 返回的数据模板或处理函数

// 示例1: 使用数据模板
Mock.mock('/api/user', 'get', {
  'code': 200,
  'data|10': [{  // 生成10条数据
    'id|+1': 1,  // id自增
    'name': '@cname'  // 随机中文姓名
  }]
});

// 示例2: 使用处理函数
Mock.mock(/\/api\/login/, 'post', (options) => {
  const params = JSON.parse(options.body);
  if (params.code === '123456') {
    return { code: 200, msg: '成功' };
  } else {
    return { code: 400, msg: '验证码错误' };
  }
});
```

#### 1.3.2 Mock.Random - 随机数据生成

| 类别 | 方法 | 示例 | 生成结果 |
|------|------|------|---------|
| **基础** | `boolean()` | `Mock.Random.boolean()` | `true` / `false` |
| | `integer(min, max)` | `Mock.Random.integer(1, 100)` | `42` |
| | `float(min, max, dmin, dmax)` | `Mock.Random.float(0, 100, 2, 2)` | `15.23` |
| **文本** | `string(pool, min, max)` | `Mock.Random.string('lower', 5, 10)` | `"abcde"` |
| | `cword(pool, min, max)` | `Mock.Random.cword('零一二三四五六七八九', 3)` | `"二五八"` |
| **姓名** | `name()` | `Mock.Random.name()` | `"Larry Wilson"` |
| | `cname()` | `Mock.Random.cname()` | `"张三"` |
| **网址** | `url()` | `Mock.Random.url()` | `"http://example.com"` |
| | `domain()` | `Mock.Random.domain()` | `"example.com"` |
| **地址** | `province()` | `Mock.Random.province()` | `"广东省"` |
| | `city()` | `Mock.Random.city()` | `"广州市"` |
| **日期** | `date()` | `Mock.Random.date()` | `"2025-12-07"` |
| | `datetime()` | `Mock.Random.datetime()` | `"2025-12-07 14:30:45"` |
| **图片** | `image(size, background, text)` | `Mock.Random.image('200x100', '#4A7BF7', 'Logo')` | `"data:image/png;base64,..."` |
| **ID** | `guid()` | `Mock.Random.guid()` | `"662C63B4-FD43-66F4-3328-C54E3FD14D35"` |
| | `id()` | `Mock.Random.id()` | `"420000200512071234"` |

#### 1.3.3 数据模板定义（DTD）

Mock.js使用特殊语法定义数据模板：

```javascript
// 1. 属性值是字符串String
'name|min-max': string
'name|count': string
// 示例
'title|1-10': '★'  // 生成1-10个★，如"★★★"

// 2. 属性值是数字Number
'name|+1': number
'name|min-max': number
'name|min-max.dmin-dmax': number
// 示例
'id|+1': 1  // id自增，1, 2, 3, ...
'age|18-60': 1  // 随机18-60之间的整数
'price|1-100.2-2': 1  // 随机1-100，保留2位小数

// 3. 属性值是布尔型Boolean
'name|1': boolean
'name|min-max': value
// 示例
'enabled|1': true  // 随机true/false
'status|1-3': true  // 1-3次true

// 4. 属性值是对象Object
'name|count': object
'name|min-max': object
// 示例
'config|2': { a: 1, b: 2, c: 3 }  // 随机选2个属性

// 5. 属性值是数组Array
'name|1': array
'name|+1': array
'name|min-max': array
'name|count': array
// 示例
'list|1-10': [{id: '@guid', name: '@cname'}]  // 生成1-10条数据
'items|5': [{title: '@ctitle'}]  // 生成5条数据

// 6. 属性值是函数Function
'name': function() { return value }
// 示例
'timestamp': function() { return Date.now() }
```

#### 1.3.4 占位符 Placeholder

使用`@`符号引用Mock.Random方法：

```javascript
{
  'name': '@cname',          // 等同于 Mock.Random.cname()
  'age|18-60': 1,
  'birthday': '@date',       // 等同于 Mock.Random.date()
  'avatar': '@image("200x200", "#4A7BF7", "Avatar")',
  'address': '@province@city@county',  // 拼接占位符
  'email': '@email',
  'intro': '@cparagraph(1, 3)'  // 中文段落1-3句
}
```

---

### 1.4 前端Mock开发的4个核心阶段

基于参考文档《实战指南：基于Mock.js的前端独立开发方案.md》，前端Mock开发遵循以下4个标准阶段：

#### 阶段一：签订API契约（Contract）

**目标**: 前后端基于文档达成一致，定义接口规范

**产出物**: Swagger/OpenAPI契约文档

**关键要素**:
```yaml
# 约定内容
接口地址: POST /api/v1/login
Content-Type: application/json

Request:
  phone: string (11位手机号)
  code: string (6位数字验证码)

Response:
  code: 200|400|500
  msg: string
  data:
    token: string
    userInfo:
      uid: number
      nickname: string
      avatar: string
```

**注意事项**:
- ✅ 契约必须包含所有必填字段和类型定义
- ✅ 契约必须定义多种响应场景（成功、业务异常、系统异常）
- ✅ 契约必须包含校验规则（手机号正则、验证码长度）
- ✅ 契约必须提供Request/Response示例

---

#### 阶段二：搭建Mock环境（Mock Setup）

**目标**: 配置Mock.js拦截器，实现请求拦截和数据返回

**产出物**:
```
src/mock/
├── index.js      # Mock入口，全局配置
└── user.js       # 用户相关Mock规则
```

**关键代码结构**:

```javascript
// src/mock/user.js
import Mock from 'mockjs';

const loginMock = (options) => {
  const params = JSON.parse(options.body);
  
  // 业务逻辑校验
  if (params.code === '123456') {
    return {
      code: 200,
      msg: '登录成功',
      data: {
        token: Mock.Random.string('lower', 32),
        userInfo: {
          uid: 10001,
          nickname: Mock.Random.cname(),
          avatar: Mock.Random.image('100x100', '#4A7BF7')
        }
      }
    };
  } else {
    return {
      code: 400,
      msg: '验证码错误，请输入123456',
      data: null
    };
  }
};

export default {
  setup: () => {
    // 注意：使用正则匹配，防止查询参数导致匹配失败
    Mock.mock(/\/api\/v1\/login/, 'post', loginMock);
  }
};
```

```javascript
// src/mock/index.js
import Mock from 'mockjs';
import userMock from './user.js';

// 全局设置：模拟网络延迟
Mock.setup({
  timeout: '300-800'  // 300-800ms随机延迟
});

// 加载所有Mock模块
userMock.setup();

console.log('🚀 Mock Server 已启动');
```

```javascript
// src/main.js
import { createApp } from 'vue';
import App from './App.vue';

// 只在开发环境引入Mock
if (import.meta.env.MODE === 'development') {
  import('./mock/index.js');
}

createApp(App).mount('#app');
```

**注意事项**:
- ✅ Mock规则使用正则匹配URL（防止查询参数影响）
- ✅ 配置延迟模拟（300-800ms），验证Loading状态
- ✅ 使用环境变量控制Mock开关（开发开启，生产关闭）
- ✅ 日志输出要清晰（便于调试）

---

#### 阶段三：UI与交互开发（UI Development）

**目标**: 基于Mock数据完成UI组件和交互逻辑开发

**产出物**:
```
src/
├── api/
│   └── auth.ts          # API调用层
├── components/
│   └── Login.vue        # 登录组件
└── utils/
    └── message.ts       # Toast组件
```

**关键代码结构**:

```typescript
// src/api/auth.ts
import axios from 'axios';

const service = axios.create({
  baseURL: '',  // Mock.js拦截不需要baseURL
  timeout: 5000
});

export const loginApi = (data: { phone: string; code: string }) => {
  return service({
    url: '/api/v1/login',
    method: 'post',
    data
  });
};
```

```vue
<!-- src/components/Login.vue -->
<script setup lang="ts">
import { ref, reactive } from 'vue';
import { loginApi } from '@/api/auth';
import { message } from '@/utils/message';

const form = reactive({
  phone: '',
  code: ''
});

const loading = ref(false);

const handleLogin = async () => {
  loading.value = true;
  
  try {
    const res = await loginApi(form);
    
    if (res.data.code === 200) {
      message.success('登录成功');
      // Token存储、页面跳转...
    } else {
      message.error(res.data.msg);
    }
  } catch (error) {
    message.error('系统繁忙');
  } finally {
    loading.value = false;
  }
};
</script>
```

**注意事项**:
- ✅ API调用层与Mock完全解耦（组件不感知Mock）
- ✅ 完整的错误处理（try-catch + 分级错误）
- ✅ 状态管理清晰（loading/error/data三态）
- ✅ 交互细节完整（Loading动画、Toast提示、页面跳转）

---

#### 阶段四：验收标准（Acceptance Criteria）

**目标**: 产品经理和UI设计师基于Mock验收功能

**验收清单**:
- [ ] **Happy Path**: 输入"123456"，提示"登录成功"，跳转首页
- [ ] **Sad Path**: 输入"111111"，提示"验证码错误"
- [ ] **UI还原度**: 按钮颜色、间距、Loading样式符合设计稿
- [ ] **代码规范**: Mock逻辑与业务逻辑完全解耦

**关键价值**:
- ✅ **无需等待后端**，产品经理可提前验收
- ✅ **真实交互体验**，包含Loading、Toast、页面跳转
- ✅ **快速迭代**，UI问题当场修改，无需等联调

---

### 1.5 Mock到真实接口的无缝切换

#### 切换步骤

**Step 1: 修改环境变量**

```bash
# .env.development
VITE_USE_MOCK=false  # 关闭Mock
VITE_API_BASE_URL=http://192.168.1.100:8080  # 真实后端地址
```

**Step 2: 修改main.js**

```javascript
// src/main.js
// 条件引入Mock
if (import.meta.env.VITE_USE_MOCK === 'true') {
  import('./mock/index.js');
}
```

**Step 3: 重启项目**

```bash
npm run dev
```

**切换后的效果**:
- ✅ Mock.js拦截器失效
- ✅ axios请求穿透到真实后端
- ✅ 组件代码无需任何修改

#### 契约一致性检查

在切换前，使用AI进行契约一致性检查：

```markdown
# AI提示词
对比以下两个契约，找出差异：

Mock契约（Swagger）:
{Mock_Contract}

真实接口契约（Postman/Swagger）:
{Real_Contract}

要求：
1. 列出字段差异（缺失、类型不匹配、命名不一致）
2. 生成适配层代码（字段映射、默认值填充）
3. 给出风险评估和回滚方案
```

---

## 📌 第一部分总结

### 核心概念回顾

1. **Mock.js是什么**？拦截器级别的前端Mock方案，重写XMLHttpRequest
2. **为什么要用Mock**？前后端并行开发，减少阻塞，提升效率×2
3. **Mock.js核心API**：Mock.mock()定义规则、Mock.Random生成随机数据
4. **4个核心阶段**：契约签订 → Mock环境 → UI开发 → 验收标准
5. **无缝切换**：环境变量控制，组件代码零修改

### 讲师引导要点

- **演示对比**：展示传统开发（等待后端）vs Mock开发（独立开发）的时间差异
- **强调契约先行**：前后端基于契约开发，减少返工
- **现场演示**：打开DevTools，展示Mock拦截（Network无请求、Console有日志）
- **互动提问**："大家在项目中遇到过前后端阻塞的情况吗？"

---

## 📝 第二部分：AI赋能Mock开发演练流程指导

### 2.1 演练总体流程设计

#### 时间分配（总计90-120分钟）

| 阶段 | 任务 | 预计时间 | AI工具使用 |
|------|------|---------|-----------|
| **阶段一** | API契约生成 | 15分钟 | Cursor/Copilot Chat |
| **阶段二** | Mock代码生成 | 20分钟 | AI代码生成 |
| **阶段三** | API调用层生成 | 15分钟 | AI代码生成 |
| **阶段四** | UI组件生成 | 30分钟 | AI代码生成 + 人工Review |
| **阶段五** | 本地验证 | 15分钟 | 手动测试 |
| **阶段六** | 环境切换（可选） | 10分钟 | AI生成后端服务 |
| **总计** | | **105分钟** | |

#### 演练成功标准

- [ ] ✅ 所有学员完成API契约生成（100%参与）
- [ ] ✅ 80%+学员完成Mock代码生成并成功拦截请求
- [ ] ✅ 70%+学员完成UI组件开发并通过本地验证
- [ ] ✅ 每位学员记录至少1个AI提示词优化案例
- [ ] ✅ 每位学员完成演练总结和自我评估

---

### 2.2 阶段一：API契约生成（15分钟）

#### 讲师演示要点（5分钟）

**Step 1: 打开Cursor/Copilot Chat**

```markdown
演示内容：
1. 打开Cursor IDE（或VS Code + Copilot）
2. 按快捷键打开Chat面板（Ctrl+L / Cmd+L）
3. 展示Chat界面的基本操作
```

**Step 2: 展示User Story**

```markdown
# Story A：手机号登录功能

作为一个新用户，我希望通过手机号+验证码登录系统，以便快速注册和登录。

验收标准：
- 输入11位手机号（格式：1[3-9]xxxxxxxxx）
- 输入6位数字验证码
- 验证码为"123456"时，登录成功
- 验证码为其他值时，提示"验证码错误"
```

**Step 3: 使用AI生成契约（现场演示）**

```markdown
演示操作：
1. 打开提示词文档：`提示词/1-API契约生成提示词.md`
2. 复制提示词到Chat
3. 粘贴User Story到提示词中
4. 发送给AI
5. 等待AI生成Swagger YAML
6. 复制生成结果到 `docs/api-contract.yml`
```

**Step 4: Review生成结果（重点讲解）**

```yaml
# 检查要点
/api/v1/login:
  post:
    summary: "手机号登录"
    requestBody:
      content:
        application/json:
          schema:
            type: object
            properties:
              phone:
                type: string
                pattern: '^1[3-9]\d{9}$'  # 重点：正则校验
                example: "13800138000"
              code:
                type: string
                pattern: '^\d{6}$'  # 重点：长度校验
                example: "123456"
    responses:
      200:
        description: "登录成功"
        content:
          application/json:
            schema:
              type: object
              properties:
                code:
                  type: integer
                  enum: [200]  # 重点：枚举类型
                msg:
                  type: string
                data:
                  type: object
                  properties:
                    token:
                      type: string
                    userInfo:
                      type: object
```

**讲解重点**:
- ✅ **正则校验**：`pattern: '^1[3-9]\d{9}$'` 确保手机号格式正确
- ✅ **枚举类型**：`enum: [200]` 明确状态码取值范围
- ✅ **嵌套对象**：`userInfo` 的结构定义要完整
- ✅ **示例数据**：`example` 帮助理解字段含义

#### 学员实践任务（10分钟）

**Task 1.1: 生成Swagger契约**

```markdown
操作步骤：
1. 打开 `提示词/1-API契约生成提示词.md`
2. 复制提示词到Cursor Chat
3. 粘贴User Story内容
4. 发送给AI，等待生成结果
5. 创建 `docs/api-contract.yml`，保存生成的Swagger YAML
```

**验收标准**:
- [ ] API路径为 `POST /api/v1/login`
- [ ] Request包含 `phone` 和 `code` 字段，带正则校验
- [ ] Response包含 `code`、`msg`、`data` 字段
- [ ] 包含成功(200)和失败(400)两种响应

**Task 1.2: 生成TypeScript类型定义**

```markdown
操作步骤：
1. 继续在Chat中输入："请基于这个契约生成TypeScript类型定义"
2. 创建 `src/api/types/auth.ts`
3. 粘贴生成的代码
4. 检查类型定义是否完整
```

**验收标准**:
- [ ] 包含 `LoginRequest` 接口（phone、code）
- [ ] 包含 `LoginResponse` 接口（code、msg、data）
- [ ] 包含 `UserInfo` 接口（uid、nickname、avatar）
- [ ] 添加JSDoc注释

#### 常见问题处理（讲师准备）

**Q1: AI生成的契约缺少校验规则怎么办？**

```markdown
解决方案：
1. 优化提示词，明确要求：
   "请为phone字段添加正则校验：^1[3-9]\d{9}$"
2. 手动补充pattern字段
3. 记录到"提示词优化记录"表格
```

**Q2: AI生成的Response结构不完整？**

```markdown
解决方案：
1. 检查User Story是否包含完整的验收标准
2. 在提示词中补充："Response必须包含成功和失败两种场景"
3. 重新生成
```

**Q3: TypeScript类型定义与Swagger不一致？**

```markdown
解决方案：
1. 使用工具自动转换：swagger-typescript-api
2. 或在提示词中明确："请确保TS类型与Swagger完全一致"
```

#### 讲师巡场要点

- 观察学员是否成功打开Chat界面
- 检查学员是否正确使用提示词（而非自由发挥）
- 帮助卡住的学员（网络问题、AI响应慢）
- 收集学员生成的契约，随机抽查1-2份进行点评

---

### 2.3 阶段二：Mock代码生成（20分钟）

#### 讲师演示要点（5分钟）

**Step 1: 展示Mock代码结构**

```javascript
// src/mock/user.js 的标准结构
import Mock from 'mockjs';

// 1. 定义Mock处理函数
const loginMock = (options) => {
  // 2. 解析请求参数
  const params = JSON.parse(options.body);
  
  // 3. 业务逻辑判断
  if (params.code === '123456') {
    // 4. 成功场景
    return { code: 200, msg: '登录成功', data: {...} };
  } else {
    // 5. 失败场景
    return { code: 400, msg: '验证码错误', data: null };
  }
};

// 6. 导出setup函数
export default {
  setup: () => {
    Mock.mock(/\/api\/v1\/login/, 'post', loginMock);
  }
};
```

**讲解重点**:
- ✅ **options.body是字符串**，需要JSON.parse()解析
- ✅ **使用正则匹配URL**：`/\/api\/v1\/login/`（防止查询参数影响）
- ✅ **业务逻辑清晰**：if-else分支处理不同场景
- ✅ **Mock.Random生成真实感数据**：token、头像、姓名

**Step 2: 演示AI生成过程**

```markdown
演示操作：
1. 打开 `提示词/2-Mock代码生成提示词.md`
2. 准备输入材料：
   - API契约（从步骤1复制）
   - 业务规则："验证码为123456时成功"
3. 发送给AI
4. 展示生成的mock/user.js和mock/index.js
5. 解释关键代码
```

**Step 3: 配置Mock入口（重点讲解）**

```javascript
// src/mock/index.js
import Mock from 'mockjs';
import userMock from './user.js';

// 重点1: 设置延迟模拟
Mock.setup({
  timeout: '300-800'  // 为什么要延迟？验证Loading状态
});

// 重点2: 加载Mock模块
userMock.setup();

// 重点3: 日志输出
console.log('🚀 Mock Server 已启动');
```

```javascript
// src/main.js
import { createApp } from 'vue';
import App from './App.vue';

// 重点4: 条件引入Mock（只在开发环境）
if (import.meta.env.MODE === 'development') {
  import('./mock/index.js');
}

createApp(App).mount('#app');
```

**讲解重点**:
- ✅ **为什么要延迟**？模拟真实网络，验证Loading状态
- ✅ **为什么用条件引入**？生产环境不能有Mock代码
- ✅ **为什么用动态import**？避免打包到生产代码

#### 学员实践任务（15分钟）

**Task 2.1: 生成Mock拦截规则**

```markdown
操作步骤：
1. 打开 `提示词/2-Mock代码生成提示词.md`
2. 复制API契约到提示词中
3. 添加业务规则："验证码为123456时返回成功"
4. 发送给AI
5. 创建 `src/mock/user.js`，粘贴生成代码
6. 检查代码：是否包含if-else、是否使用Mock.Random
```

**验收标准**:
- [ ] Mock拦截规则：`Mock.mock(/\/api\/v1\/login/, 'post', loginMock)`
- [ ] 验证码"123456"返回 `code: 200`
- [ ] 验证码其他值返回 `code: 400`
- [ ] Token使用 `Mock.Random.string('lower', 32)` 生成
- [ ] 包含日志输出：`console.log('🚧 [Mock] 拦截到登录请求')`

**Task 2.2: 配置Mock入口**

```markdown
操作步骤：
1. 创建 `src/mock/index.js`
2. 粘贴生成的配置代码
3. 修改 `src/main.js`，添加条件引入
4. 保存所有文件
```

**验收标准**:
- [ ] `Mock.setup({ timeout: '300-800' })` 配置正确
- [ ] `userMock.setup()` 调用正确
- [ ] `main.js` 中条件引入：`if (import.meta.env.MODE === 'development')`

#### 常见问题处理

**Q1: Mock拦截不生效，Network还是发出真实请求？**

```markdown
排查步骤：
1. 检查main.js是否引入mock/index.js
2. 检查浏览器Console是否有"Mock Server已启动"日志
3. 检查URL匹配规则是否正确（使用正则）
4. 检查axios的baseURL配置（应为空或与Mock规则一致）
```

**Q2: options.body解析报错？**

```markdown
解决方案：
1. 检查Content-Type是否为application/json
2. 添加try-catch保护：
   try {
     const params = JSON.parse(options.body);
   } catch (error) {
     console.error('参数解析失败', error);
     return { code: 500, msg: '参数格式错误' };
   }
```

**Q3: Mock.Random生成的数据不符合预期？**

```markdown
优化方案：
1. 查阅Mock.js文档，选择合适的Random方法
2. 自定义格式：
   token: Mock.Random.string('0123456789abcdef', 32)
   phone: '138' + Mock.Random.string('number', 8)
```

#### 讲师巡场要点

- 检查学员的mock/user.js是否正确导出setup函数
- 提醒学员测试验证码"123456"和"111111"两种场景
- 帮助遇到拦截不生效问题的学员（常见原因：URL匹配错误）

---

### 2.4 阶段三：API调用层生成（15分钟）

#### 讲师演示要点（5分钟）

**Step 1: 展示API调用层架构**

```
src/api/
├── request.ts          # axios实例、拦截器
├── auth.ts             # 登录相关API
└── types/
    └── auth.ts         # TypeScript类型定义
```

**Step 2: 演示axios实例配置**

```typescript
// src/api/request.ts
import axios from 'axios';

const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 5000
});

// 请求拦截器：注入Token
service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);

// 响应拦截器：统一错误处理
service.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('请求错误', error);
    return Promise.reject(error);
  }
);

export default service;
```

**讲解重点**:
- ✅ **baseURL配置**：Mock环境为空，真实环境为后端地址
- ✅ **请求拦截器**：自动注入Token，无需每个接口手动添加
- ✅ **响应拦截器**：统一处理401、500等错误
- ✅ **TypeScript类型**：使用泛型约束返回类型

**Step 3: 演示API封装函数**

```typescript
// src/api/auth.ts
import service from './request';
import type { LoginRequest, LoginResponse } from './types/auth';

export function loginApi(data: LoginRequest) {
  return service<LoginResponse>({
    url: '/api/v1/login',
    method: 'post',
    data
  });
}
```

**讲解重点**:
- ✅ **类型约束**：data参数类型为LoginRequest
- ✅ **泛型返回**：service<LoginResponse>约束返回类型
- ✅ **IDE智能提示**：调用时自动提示phone、code字段

#### 学员实践任务（10分钟）

**Task 3.1: 生成axios实例**

```markdown
操作步骤：
1. 打开 `提示词/3-API调用层生成提示词.md`
2. 输入API契约
3. 发送给AI，生成request.ts
4. 创建 `src/api/request.ts`，粘贴代码
5. 检查拦截器配置
```

**Task 3.2: 生成登录API封装**

```markdown
操作步骤：
1. 继续使用AI生成auth.ts
2. 创建 `src/api/auth.ts`
3. 确保引用了types/auth.ts的类型定义
```

**验收标准**:
- [ ] `request.ts` 包含axios实例创建
- [ ] 包含请求拦截器（注入Token）
- [ ] 包含响应拦截器（错误处理）
- [ ] `auth.ts` 使用TypeScript类型约束
- [ ] IDE中调用loginApi时有智能提示

#### 常见问题处理

**Q1: TypeScript类型导入报错？**

```markdown
解决方案：
1. 检查types/auth.ts是否存在
2. 检查import路径是否正确：import type { ... } from './types/auth'
3. 确保使用 import type 语法（而非 import）
```

**Q2: axios拦截器不生效？**

```markdown
排查步骤：
1. 检查是否正确导出service实例
2. 检查auth.ts是否使用了导出的service
3. 在拦截器中添加console.log验证是否执行
```

---

### 2.5 阶段四：UI组件生成（30分钟）

#### 讲师演示要点（10分钟）

**Step 1: 展示组件结构**

```vue
<template>
  <div class="login-container">
    <form @submit.prevent="handleLogin">
      <input v-model="form.phone" placeholder="手机号" />
      <input v-model="form.code" placeholder="验证码" />
      <button :disabled="!isFormValid || loading">
        {{ loading ? '登录中...' : '登录' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { loginApi } from '@/api/auth';

const form = reactive({ phone: '', code: '' });
const loading = ref(false);

const isFormValid = computed(() => {
  return /^1[3-9]\d{9}$/.test(form.phone) && /^\d{6}$/.test(form.code);
});

const handleLogin = async () => {
  loading.value = true;
  try {
    const res = await loginApi(form);
    if (res.data.code === 200) {
      // 成功逻辑
    }
  } finally {
    loading.value = false;
  }
};
</script>
```

**讲解重点**:
- ✅ **表单验证**：使用computed实时验证，禁用按钮
- ✅ **Loading状态**：按钮文案切换、禁用状态
- ✅ **错误处理**：try-catch + 分级错误（200/400/500）
- ✅ **交互细节**：Toast提示、页面跳转、Token存储

**Step 2: 演示AI生成过程**

```markdown
演示操作：
1. 打开 `提示词/4-UI组件生成提示词.md`
2. 输入材料：
   - API定义（LoginRequest/LoginResponse）
   - 验收标准（User Story中的验收标准）
3. 发送给AI
4. 展示生成的Login.vue
5. 解释关键代码
```

**Step 3: 演示本地运行**

```bash
# 启动开发服务器
npm run dev

# 访问 http://localhost:5173
```

**演示验证清单**:
- [ ] 打开浏览器DevTools
- [ ] Network标签：没有真实网络请求
- [ ] Console标签：看到Mock日志
- [ ] 输入"123456"，看到"登录成功"
- [ ] 输入"111111"，看到"验证码错误"

#### 学员实践任务（20分钟）

**Task 4.1: 生成Login组件**

```markdown
操作步骤：
1. 打开 `提示词/4-UI组件生成提示词.md`
2. 复制API定义和验收标准
3. 发送给AI
4. 创建 `src/views/Login.vue`
5. 粘贴生成的代码
6. Review代码：检查表单验证、错误处理
```

**Task 4.2: 配置路由**

```markdown
操作步骤：
1. 创建 `src/router/index.ts`
2. 配置/login和/home路由
3. 在App.vue中添加<router-view/>
4. 测试路由跳转
```

**Task 4.3: 本地验证**

```markdown
操作步骤：
1. 运行 `npm run dev`
2. 打开浏览器访问 `http://localhost:5173`
3. 打开DevTools
4. 测试登录功能（123456成功、111111失败）
5. 检查Network、Console、LocalStorage
```

**验收标准**:
- [ ] 页面正常显示，UI符合设计要求
- [ ] 输入"123456"，显示Loading → "登录成功" → 跳转首页
- [ ] 输入"111111"，显示"验证码错误"
- [ ] DevTools Network无真实请求
- [ ] Console有Mock日志输出
- [ ] LocalStorage存储了Token

#### 常见问题处理

**Q1: 路由跳转不生效？**

```markdown
排查步骤：
1. 检查router/index.ts是否正确配置
2. 检查main.js是否挂载router
3. 检查App.vue是否有<router-view/>
4. 使用router.push({ name: 'Home' })替代router.push('/home')
```

**Q2: Mock日志没有输出？**

```markdown
排查步骤：
1. 检查main.js是否引入mock/index.js
2. 检查浏览器Console是否过滤了日志
3. 刷新页面，重新触发Mock加载
```

**Q3: 样式不生效？**

```markdown
解决方案：
1. 检查<style scoped>标签是否正确
2. 检查CSS语法是否有错误
3. 使用浏览器DevTools检查元素样式
```

#### 讲师巡场要点

- 帮助学员解决npm install依赖安装问题
- 检查学员的浏览器DevTools是否打开
- 随机抽查2-3位学员的代码，现场点评
- 收集学员遇到的问题，记录到FAQ

---

### 2.6 阶段五：本地验证（15分钟）

#### 讲师演示完整验收流程

**Step 1: 功能验证**

```markdown
验收清单：
1. ✅ Happy Path
   - 输入"13800138000"
   - 输入"123456"
   - 点击登录
   - 看到Loading状态（约0.5秒）
   - 看到"登录成功"Toast
   - 页面跳转到/home

2. ✅ Sad Path
   - 输入"13800138000"
   - 输入"111111"
   - 点击登录
   - 看到"验证码错误"Toast
   - 保持在登录页

3. ✅ 边界场景
   - 输入错误格式手机号（如"123"）
   - 按钮应该禁用
   - 输入空验证码
   - 按钮应该禁用
```

**Step 2: DevTools检查**

```markdown
检查清单：
1. ✅ Network标签
   - 没有/api/v1/login的真实请求
   - 如果有请求，说明Mock未生效

2. ✅ Console标签
   - 看到"🚀 Mock Server已启动"
   - 看到"🚧 [Mock] 拦截到登录请求"
   - 看到请求参数日志

3. ✅ Application → LocalStorage
   - 登录成功后，看到token字段
   - 检查token格式（32位小写字母）
```

**Step 3: 代码Review**

```markdown
Review要点：
1. ✅ Mock代码与业务代码完全解耦
   - Login.vue中没有任何Mock相关代码
   - Mock逻辑都在mock/目录

2. ✅ 错误处理完整
   - try-catch包裹
   - 分级错误处理（200/400/500）
   - finally中恢复loading状态

3. ✅ 代码规范
   - TypeScript类型定义完整
   - 添加JSDoc注释
   - 变量命名清晰
```

#### 学员自查任务

```markdown
自查清单（每位学员填写）：
- [ ] 功能验证：Happy Path ✅ / Sad Path ✅ / 边界场景 ✅
- [ ] DevTools检查：Network ✅ / Console ✅ / LocalStorage ✅
- [ ] 代码质量：Mock解耦 ✅ / 错误处理 ✅ / 代码规范 ✅
- [ ] 遇到的问题：_________________
- [ ] 解决方案：_________________
```

---

### 2.7 阶段六：环境切换（可选，10分钟）

#### 讲师演示Mock到真实接口的切换

**Step 1: 生成简易后端服务**

```javascript
// server.js（使用AI生成）
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/v1/login', (req, res) => {
  const { phone, code } = req.body;
  
  if (code === '123456') {
    res.json({
      code: 200,
      msg: '登录成功',
      data: {
        token: Math.random().toString(36).slice(2),
        userInfo: {
          uid: 10001,
          nickname: '真实用户',
          avatar: 'https://via.placeholder.com/100'
        }
      }
    });
  } else {
    res.json({
      code: 400,
      msg: '验证码错误',
      data: null
    });
  }
});

app.listen(3000, () => {
  console.log('后端服务启动：http://localhost:3000');
});
```

**Step 2: 修改环境变量**

```bash
# .env.development
VITE_USE_MOCK=false
VITE_API_BASE_URL=http://localhost:3000
```

**Step 3: 重启前端项目**

```bash
# 停止原服务（Ctrl+C）
# 重新启动
npm run dev
```

**Step 4: 验证真实请求**

```markdown
验证清单：
1. ✅ DevTools Network标签
   - 看到/api/v1/login的真实请求
   - 状态码200
   - Response与Mock返回一致

2. ✅ Console标签
   - 没有"Mock Server已启动"日志
   - 没有Mock拦截日志

3. ✅ 功能正常
   - 登录成功依然跳转
   - 数据存储正常
```

**讲解重点**:
- ✅ **组件代码零修改**：只改环境变量，组件无感知
- ✅ **契约一致性**：Mock返回与真实返回结构完全一致
- ✅ **无缝切换**：重启项目即可切换，无需手动修改代码

---

### 2.8 演练总结与复盘（10分钟）

#### 讲师引导总结

**Step 1: 数据收集**

```markdown
收集内容：
1. 每位学员的"时间统计"表
2. 每位学员的"AI提示词优化记录"
3. 每位学员的"遇到的问题"

汇总分析：
- 平均完成时间：___ 分钟
- 最快完成时间：___ 分钟
- 最慢完成时间：___ 分钟
- 常见问题Top 3：___
```

**Step 2: 核心收获分享**

```markdown
每位学员分享（1分钟/人）：
- 对Mock.js的理解加深了什么？
- AI工具使用中的最大收获？
- 提示词工程的关键技巧？
- 遇到的最大挑战和解决方案？
```

**Step 3: 讲师点评**

```markdown
点评要点：
1. ✅ 肯定学员的进步
   - "大家都成功完成了Mock开发"
   - "AI提示词使用越来越熟练"

2. ✅ 指出共性问题
   - "很多人在URL匹配规则上遇到问题，需要使用正则"
   - "TypeScript类型导入容易出错，要注意import type语法"

3. ✅ 强化核心价值
   - "传统开发需要8小时，AI赋能后只需1.5小时"
   - "前后端并行开发，效率提升5-6倍"

4. ✅ 布置后续任务
   - "大家回去后，尝试将Mock方案应用到实际项目"
   - "继续优化AI提示词，形成个人知识库"
```

---

## ⚠️ 第三部分：演练注意事项与常见问题FAQ

### 3.1 演练前准备清单（讲师必check）

#### 技术环境准备

- [ ] ✅ 准备演练用的GitHub仓库（包含初始项目和完成项目）
- [ ] ✅ 测试Cursor/GitHub Copilot账号是否正常（避免学员现场激活失败）
- [ ] ✅ 准备备用网络（AI服务可能需要科学上网）
- [ ] ✅ 准备离线版提示词文档（万一网络不稳定）
- [ ] ✅ 本地启动演示项目，确保能正常运行

#### 学员设备检查

```markdown
演练开始前30分钟，逐一检查：
1. Node.js版本：node --version（要求16+）
2. npm是否正常：npm --version
3. 编辑器安装：Cursor或VS Code + Copilot
4. 项目依赖安装：cd 项目-初始版 && npm install
5. 项目能否启动：npm run dev
```

#### 讲师设备准备

- [ ] ✅ 投影仪连接测试（确保学员能看清代码）
- [ ] ✅ 浏览器DevTools字体调大（方便远处学员观看）
- [ ] ✅ VS Code字体调大（推荐18-20号字体）
- [ ] ✅ 准备计时器（控制每个阶段时间）
- [ ] ✅ 准备白板或PPT（讲解概念时使用）

---

### 3.2 演练过程中的注意事项

#### 3.2.1 时间控制技巧

**问题**：学员进度参差不齐，如何控制整体节奏？

**解决方案**：

```markdown
1. 采用"快慢分流"策略
   - 快速学员：布置进阶任务（如添加"记住密码"功能）
   - 慢速学员：讲师或助教一对一辅导
   - 避免因少数学员拖慢整体进度

2. 设置"硬性截止时间"
   - 每个阶段到时间就停止
   - 未完成的学员标记为"待课后辅导"
   - 允许学员课后继续完成

3. 预留"弹性缓冲时间"
   - 每个阶段预留5分钟缓冲
   - 用于处理突发问题
   - 避免整体超时
```

#### 3.2.2 AI工具使用注意事项

**注意1：AI响应速度慢**

```markdown
原因：
- 网络延迟（服务器在海外）
- AI服务高峰期
- 提示词过长

应对策略：
1. 提前测试AI服务可用性
2. 准备备用提示词（精简版）
3. 提前生成好示例代码（万一AI不可用）
4. 告知学员耐心等待（不要重复发送）
```

**注意2：AI生成代码有错误**

```markdown
常见错误类型：
1. 语法错误（如缺少括号、分号）
2. 类型错误（TypeScript类型不匹配）
3. 逻辑错误（if-else条件判断错误）
4. 依赖缺失（import路径错误）

应对策略：
1. 强调"AI生成代码必须Review"
2. 教学员使用ESLint自动检查
3. 鼓励学员提问："这段代码为什么报错？"
4. 现场演示如何调试AI生成的代码
```

**注意3：AI理解提示词偏差**

```markdown
现象：
- AI生成的代码结构与预期不符
- 缺少关键功能
- 添加了不需要的功能

应对策略：
1. 优化提示词（增加约束条件）
2. 使用"分步提示"（不要一次性要求太多）
3. 示例驱动（提供期望的代码示例）
4. 迭代优化（让AI基于上一次结果改进）
```

#### 3.2.3 学员常见操作错误

**错误1：忘记保存文件**

```markdown
现象：
- 代码修改后未保存
- 项目未重启，看不到效果

解决方案：
- 强调"修改代码后，Ctrl+S保存"
- 演示VS Code的自动保存功能
- 提醒学员重启开发服务器
```

**错误2：文件路径错误**

```markdown
现象：
- import路径写错（大小写、相对路径）
- 文件创建在错误目录

解决方案：
- 演示如何使用VS Code的文件树
- 强调相对路径规范（@/表示src/）
- 演示如何使用Ctrl+点击跳转验证路径
```

**错误3：复制代码时格式错乱**

```markdown
现象：
- AI生成的代码复制后缩进混乱
- Markdown代码块标记被复制进去

解决方案：
- 演示如何正确复制（只复制代码部分）
- 使用Prettier自动格式化
- 教学员使用Shift+Alt+F格式化代码
```

---

### 3.3 常见问题FAQ（按频率排序）

#### FAQ Top 1: Mock拦截不生效

**问题现象**：
- Network标签看到真实请求
- Console没有"Mock Server已启动"日志
- 接口报404或CORS错误

**排查步骤**：

```markdown
Step 1: 检查main.js是否引入Mock
- 打开src/main.js
- 确认有：if (import.meta.env.MODE === 'development') { import('./mock/index.js'); }
- 刷新浏览器，查看Console

Step 2: 检查URL匹配规则
- 打开src/mock/user.js
- 确认使用正则：Mock.mock(/\/api\/v1\/login/, 'post', loginMock)
- 不要使用字符串：Mock.mock('/api/v1/login', 'post', loginMock)

Step 3: 检查axios baseURL配置
- 打开src/api/request.ts
- 确认baseURL为空或与Mock规则一致
- baseURL: '' 或 baseURL: import.meta.env.VITE_API_BASE_URL

Step 4: 检查Mock.js是否安装
- 运行：npm list mockjs
- 如果未安装：npm install mockjs --save-dev

Step 5: 清除缓存
- 浏览器强制刷新：Ctrl+Shift+R
- 或清除浏览器缓存后重试
```

**根本原因分析**：
1. **80%情况**：URL匹配规则使用字符串而非正则
2. **15%情况**：main.js未引入Mock或条件判断错误
3. **5%情况**：axios配置了非空baseURL

---

#### FAQ Top 2: TypeScript类型报错

**问题现象**：
- 红色波浪线提示类型错误
- "Cannot find module './types/auth'"
- "Property 'code' does not exist on type..."

**排查步骤**：

```markdown
Step 1: 检查类型文件是否存在
- 确认src/api/types/auth.ts文件存在
- 确认导出了interface LoginRequest、LoginResponse

Step 2: 检查import语法
- 错误：import { LoginRequest } from './types/auth'
- 正确：import type { LoginRequest } from './types/auth'
- 或者：import { type LoginRequest } from './types/auth'

Step 3: 检查tsconfig.json配置
- 确认"include": ["src/**/*.ts", "src/**/*.vue"]
- 确认"moduleResolution": "node"

Step 4: 重启TypeScript服务
- VS Code命令面板：Ctrl+Shift+P
- 输入：TypeScript: Restart TS Server
- 等待重新加载
```

**根本原因分析**：
1. **50%情况**：import语法错误（缺少type关键字）
2. **30%情况**：类型文件路径错误
3. **20%情况**：TypeScript服务未识别新文件

---

#### FAQ Top 3: axios请求报CORS错误

**问题现象**：
- Console报错："Access to XMLHttpRequest...has been blocked by CORS policy"
- 这个问题**只在真实接口联调时出现**，Mock环境不会有

**原因分析**：
- 前端：`http://localhost:5173`
- 后端：`http://localhost:3000`
- 浏览器同源策略阻止跨域请求

**解决方案（3种）**：

```markdown
方案1：后端配置CORS（推荐）
// server.js
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

方案2：Vite配置代理
// vite.config.js
export default {
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
}

方案3：使用Mock环境（演练推荐）
- Mock.js在浏览器拦截，不发出真实请求
- 无CORS问题
```

---

#### FAQ Top 4: Loading状态看不到

**问题现象**：
- 点击登录按钮，立即显示结果
- 看不到"登录中..."状态
- Loading动画闪一下就消失

**原因分析**：
- Mock未配置延迟，或延迟太短
- 网速太快（本地Mock返回速度极快）

**解决方案**：

```javascript
// src/mock/index.js
Mock.setup({
  timeout: '500-1000'  // 增加延迟到500-1000ms
});

// 或者在loginMock函数中添加延迟
const loginMock = (options) => {
  // 模拟延迟
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        code: 200,
        msg: '登录成功',
        data: {...}
      });
    }, 800);
  });
};
```

---

#### FAQ Top 5: Token存储但未自动注入

**问题现象**：
- localStorage有Token
- 但请求Header没有Authorization字段

**排查步骤**：

```markdown
Step 1: 检查请求拦截器
- 打开src/api/request.ts
- 确认有：
  service.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

Step 2: 检查Token存储key
- Console输入：localStorage.getItem('token')
- 确认key名称一致（注意大小写）

Step 3: 验证拦截器是否执行
- 在拦截器中添加：console.log('注入Token:', token);
- 发起请求，查看Console日志
```

---

#### FAQ Top 6: 验证码"123456"也提示错误

**问题现象**：
- 明明输入了"123456"
- 但Mock返回"验证码错误"

**排查步骤**：

```markdown
Step 1: 检查Mock函数中的判断逻辑
const loginMock = (options) => {
  const params = JSON.parse(options.body);
  console.log('接收到的验证码：', params.code, '类型：', typeof params.code);
  
  // 问题：params.code可能是字符串或数字
  if (params.code === '123456') { // 严格相等
    // 成功逻辑
  }
};

Step 2: 类型转换
- 问题原因：前端可能传递数字type的验证码
- 解决方案：String(params.code) === '123456' 或 params.code == '123456'
```

---

#### FAQ Top 7: 页面跳转404

**问题现象**：
- 登录成功后，跳转到`/home`报404
- 或页面空白

**排查步骤**：

```markdown
Step 1: 检查路由配置
- 打开src/router/index.ts
- 确认有/home路由：
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  }

Step 2: 检查Home.vue是否存在
- 确认src/views/Home.vue文件存在
- 至少有基本内容：<template><div>首页</div></template>

Step 3: 检查App.vue
- 确认有<router-view />组件
- 确认router已挂载到App
```

---

### 3.4 进阶问题处理

#### 问题1：如何模拟网络超时？

```javascript
// src/mock/user.js
const loginMock = (options) => {
  // 10%概率返回超时错误
  if (Math.random() < 0.1) {
    return {
      code: 500,
      msg: '网络超时，请稍后重试',
      data: null
    };
  }
  
  // 正常逻辑
  const params = JSON.parse(options.body);
  // ...
};
```

#### 问题2：如何模拟分页数据？

```javascript
// src/mock/list.js
const listMock = (options) => {
  const url = new URL(options.url, 'http://localhost');
  const page = Number(url.searchParams.get('page')) || 1;
  const pageSize = Number(url.searchParams.get('pageSize')) || 10;
  
  return {
    code: 200,
    data: {
      total: 100,
      page,
      pageSize,
      list: Mock.mock({
        [`list|${pageSize}`]: [{
          'id|+1': (page - 1) * pageSize + 1,
          'name': '@cname'
        }]
      }).list
    }
  };
};
```

#### 问题3：如何模拟文件上传？

```javascript
// src/mock/upload.js
const uploadMock = (options) => {
  // 模拟上传成功
  return {
    code: 200,
    msg: '上传成功',
    data: {
      url: Mock.Random.image('200x200', '#4A7BF7', 'Image'),
      filename: 'avatar_' + Date.now() + '.jpg'
    }
  };
};
```

---

### 3.5 演练效果评估标准

#### 3.5.1 学员完成度评估

```markdown
优秀（90分以上）：
- ✅ 所有阶段按时完成
- ✅ 代码质量高（无语法错误、TypeScript类型完整）
- ✅ 能独立解决遇到的问题
- ✅ 记录了3个以上AI提示词优化案例

良好（80-89分）：
- ✅ 完成了4个以上阶段
- ✅ 代码基本正确（有少量语法错误但能运行）
- ✅ 遇到问题能在讲师提示下解决
- ✅ 记录了2个AI提示词优化案例

及格（60-79分）：
- ✅ 完成了3个以上阶段
- ✅ 核心功能能正常运行
- ✅ 遇到问题需要讲师直接指导
- ✅ 记录了1个AI提示词优化案例

待提高（60分以下）：
- ❌ 完成少于3个阶段
- ❌ 核心功能无法运行
- ❌ 需要讲师全程辅导
- ❌ 未记录AI提示词优化
```

#### 3.5.2 讲师自评清单

```markdown
授课效果自评：
- [ ] 概念讲解是否清晰（学员反馈理解度≥80%）
- [ ] 演示操作是否流畅（无卡顿、无错误）
- [ ] 时间控制是否合理（总时长±10分钟）
- [ ] 学员参与度是否高（提问≥5次）
- [ ] 常见问题是否覆盖（FAQ解决率≥90%）

改进方向：
- [ ] 下次演练需要调整的地方：___________
- [ ] 需要补充的知识点：___________
- [ ] 需要优化的提示词：___________
```

---

### 3.6 课后跟进建议

#### 3.6.1 学员作业布置

```markdown
作业1：应用到实际项目（必做）
- 任务：将Mock方案应用到自己的项目
- 要求：至少包含2个接口的Mock
- 提交：代码仓库链接 + 截图

作业2：优化AI提示词（必做）
- 任务：基于演练经验，优化6个提示词
- 要求：每个提示词都标注优化点和效果对比
- 提交：Markdown文档

作业3：编写技术博客（可选）
- 任务：总结Mock.js+AI开发的心得
- 要求：包含完整的代码示例和效果展示
- 提交：博客链接
```

#### 3.6.2 学员答疑渠道

```markdown
1. 微信群答疑（推荐）
   - 创建专属学习群
   - 讲师每天固定时间在线答疑（如晚上8-9点）
   - 学员互相帮助，形成学习社区

2. GitHub Issues答疑
   - 在演练仓库创建Issues
   - 学员提问使用Issue模板
   - 讲师回复后关闭Issue

3. 一对一辅导（预约制）
   - 针对完成度<60分的学员
   - 预约30分钟一对一辅导
   - 帮助学员补齐知识盲点
```

---

## 📊 第三部分总结

### 关键注意事项回顾

1. **演练前准备**
   - ✅ 技术环境测试（AI工具、网络、依赖）
   - ✅ 学员设备检查（Node.js、编辑器、项目能否启动）
   - ✅ 讲师设备准备（投影仪、字体、计时器）

2. **演练过程控制**
   - ✅ 时间控制（快慢分流、硬性截止、弹性缓冲）
   - ✅ AI工具注意事项（响应慢、代码错误、理解偏差）
   - ✅ 学员常见错误（忘记保存、路径错误、格式错乱）

3. **常见问题TOP 7**
   - ✅ Mock拦截不生效（URL匹配规则）
   - ✅ TypeScript类型报错（import type语法）
   - ✅ CORS错误（Mock环境无此问题）
   - ✅ Loading状态看不到（增加延迟）
   - ✅ Token未自动注入（检查拦截器）
   - ✅ 验证码"123456"也错误（类型转换）
   - ✅ 页面跳转404（路由配置）

4. **效果评估**
   - ✅ 学员完成度（优秀/良好/及格/待提高）
   - ✅ 讲师自评（授课效果、改进方向）
   - ✅ 课后跟进（作业、答疑、辅导）

---

**老师版文档完成！** 🎉

下一步：创建演练项目代码（初始版和完成版）+ 提示词文档（符合RTGO框架）

