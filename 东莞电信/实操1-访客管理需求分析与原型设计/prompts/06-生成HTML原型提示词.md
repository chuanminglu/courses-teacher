# 步骤6：生成HTML原型提示词（通用版）

> **📌 使用场景**：基于页面元素和交互逻辑，生成可交互的HTML原型

---

## 🎭 R - 角色定义

你是一位资深前端开发工程师，拥有8年Web前端开发经验，擅长：

- HTML5/CSS3/JavaScript编写标准和规范代码
- 响应式Web设计，适配多种设备和屏幕
- 前端框架应用（Bootstrap、Tailwind CSS等）
- 表单验证和用户交互实现
- 原型快速开发，平衡美观和开发效率

---

## 📋 T - 任务描述

基于页面元素分析和交互逻辑设计，生成**可交互的HTML原型代码**。

### 输入材料

#### 材料1：页面元素分析

```
【请粘贴步骤4生成的"页面元素分析"文档内容】

重点关注：
- 页面列表
- 每个页面的元素清单
- 表单字段定义
```

#### 材料2：交互逻辑设计

```
【请粘贴步骤5生成的"交互逻辑设计"文档内容】

重点关注：
- 页面流转逻辑
- 元素交互行为
- 验证规则和错误提示
```

### 任务上下文

- **原型目的**：用于产品演示和用户体验测试
- **技术栈**：纯HTML + CSS + JavaScript（不依赖构建工具）
- **UI框架**：缺省使用Ant Design风格（通过CDN引入）
- **复杂度**：中低保真原型，重点展示交互逻辑而非视觉细节
- **可运行性**：双击HTML文件即可在浏览器中运行

---

## 🎯 G - 目标与意图

### 核心目标

生成可独立运行的HTML原型文件，准确实现页面布局、表单验证和交互逻辑，支持产品演示和用户测试。

### 具体目标

1. **布局准确性**：页面布局与元素分析一致，元素位置和层次合理
2. **交互完整性**：实现所有定义的交互行为（点击、验证、跳转、提示）
3. **验证有效性**：表单验证规则准确实现，错误提示友好
4. **可运行性**：代码无依赖外部资源，双击即可运行

### 业务价值

- **为产品经理**：快速验证产品设计，收集用户反馈
- **为UI设计师**：提供可交互的参考原型，指导视觉设计
- **为开发团队**：提供前端实现参考，减少理解偏差
- **为测试团队**：提供早期测试环境，提前发现问题

### 成功标准

- ✅ 所有页面可正常访问和跳转
- ✅ 表单验证规则正确实现
- ✅ 交互反馈（成功/失败/加载）清晰可见
- ✅ 代码结构清晰，易于修改

---

## 📤 O - 输出要求

### 1. 输出结构

为每个页面生成一个独立的HTML文件：

```
{Story-ID}-原型/
├── index.html          （主页面或第一个页面）
├── page2.html          （第二个页面）
├── page3.html          （第三个页面）
├── ...
├── css/
│   └── style.css       （公共样式，可选）
└── js/
    └── common.js       （公共脚本，可选）
```

**或者**，将所有页面整合到一个HTML文件中，使用JavaScript控制页面切换。

---

### 2. HTML文件模板

每个HTML文件应包含以下结构：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{页面标题}</title>
    
    <!-- Ant Design CSS (CDN) -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/antd@5.12.0/dist/reset.css">
    
    <style>
        /* Ant Design风格样式 */
        :root {
            /* Ant Design 主题色 */
            --primary-color: #1890ff;
            --primary-hover: #40a9ff;
            --primary-active: #096dd9;
            --success-color: #52c41a;
            --warning-color: #faad14;
            --error-color: #ff4d4f;
            --text-color: rgba(0, 0, 0, 0.85);
            --text-secondary: rgba(0, 0, 0, 0.65);
            --border-color: #d9d9d9;
            --background-color: #f0f2f5;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
            background-color: var(--background-color);
            padding: 24px;
            color: var(--text-color);
            line-height: 1.5715;
        }
        
        .container {
            max-width: 680px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 2px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
            padding: 24px;
        }
        
        .header {
            margin-bottom: 24px;
            padding-bottom: 16px;
            border-bottom: 1px solid #f0f0f0;
        }
        
        .header h1 {
            font-size: 20px;
            font-weight: 600;
            color: var(--text-color);
            margin-bottom: 8px;
        }
        
        .header p {
            font-size: 14px;
            color: var(--text-secondary);
        }
        
        .form-group {
            margin-bottom: 24px;
        }
        
        .form-group label {
            display: inline-block;
            margin-bottom: 8px;
            font-size: 14px;
            color: var(--text-color);
            font-weight: normal;
        }
        
        .form-group label.required::before {
            content: "* ";
            color: var(--error-color);
            margin-right: 4px;
        }
        
        .form-group input,
        .form-group select,
        .form-group textarea {
            width: 100%;
            padding: 4px 11px;
            height: 32px;
            border: 1px solid var(--border-color);
            border-radius: 2px;
            font-size: 14px;
            color: var(--text-color);
            background-color: #fff;
            transition: all 0.3s;
        }
        
        .form-group textarea {
            height: auto;
            min-height: 80px;
            padding: 8px 11px;
            resize: vertical;
        }
        
        .form-group input:hover,
        .form-group select:hover,
        .form-group textarea:hover {
            border-color: var(--primary-hover);
        }
        
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: var(--primary-color);
            box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
        }
        
        .form-group .error-message {
            color: var(--error-color);
            font-size: 14px;
            margin-top: 8px;
            display: none;
            line-height: 1.5715;
        }
        
        .form-group.has-error input,
        .form-group.has-error select,
        .form-group.has-error textarea {
            border-color: var(--error-color);
            background-color: #fff;
        }
        
        .form-group.has-error input:focus,
        .form-group.has-error select:focus,
        .form-group.has-error textarea:focus {
            box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.2);
        }
        
        .form-group.has-error .error-message {
            display: block;
        }
        
        .btn {
            height: 32px;
            padding: 4px 15px;
            border: 1px solid transparent;
            border-radius: 2px;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
            user-select: none;
            touch-action: manipulation;
            line-height: 1.5715;
            display: inline-block;
            font-weight: 400;
            white-space: nowrap;
            text-align: center;
        }
        
        .btn-primary {
            background-color: var(--primary-color);
            color: #fff;
            border-color: var(--primary-color);
            box-shadow: 0 2px 0 rgba(0, 0, 0, 0.043);
        }
        
        .btn-primary:hover {
            background-color: var(--primary-hover);
            border-color: var(--primary-hover);
        }
        
        .btn-primary:active {
            background-color: var(--primary-active);
            border-color: var(--primary-active);
        }
        
        .btn-primary:disabled {
            background-color: #f5f5f5;
            border-color: var(--border-color);
            color: rgba(0, 0, 0, 0.25);
            cursor: not-allowed;
            box-shadow: none;
        }
        
        .btn-default {
            background-color: #fff;
            border-color: var(--border-color);
            color: var(--text-color);
            margin-left: 8px;
        }
        
        .btn-default:hover {
            color: var(--primary-hover);
            border-color: var(--primary-hover);
        }
        
        .btn-default:active {
            color: var(--primary-active);
            border-color: var(--primary-active);
        }
        
        .message {
            position: fixed;
            top: 24px;
            left: 50%;
            transform: translateX(-50%);
            padding: 10px 16px;
            border-radius: 2px;
            box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12), 
                        0 6px 16px 0 rgba(0, 0, 0, 0.08), 
                        0 9px 28px 8px rgba(0, 0, 0, 0.05);
            display: none;
            z-index: 1010;
            background: #fff;
            font-size: 14px;
            line-height: 1.5715;
        }
        
        .message.success {
            color: var(--success-color);
        }
        
        .message.success::before {
            content: "✓ ";
            font-weight: bold;
            margin-right: 8px;
        }
        
        .message.error {
            color: var(--error-color);
        }
        
        .message.error::before {
            content: "✕ ";
            font-weight: bold;
            margin-right: 8px;
        }
        
        .loading {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.45);
            z-index: 1000;
            align-items: center;
            justify-content: center;
        }
        
        .loading.show {
            display: flex;
        }
        
        .spinner {
            width: 32px;
            height: 32px;
            border: 3px solid rgba(24, 144, 255, 0.2);
            border-top-color: var(--primary-color);
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        /* 响应式设计 */
        @media (max-width: 768px) {
            body {
                padding: 16px;
            }
            
            .container {
                padding: 16px;
            }
            
            .header h1 {
                font-size: 18px;
            }
        }
    </style>
</head>
<body>
    <!-- 加载动画 -->
    <div class="loading" id="loading">
        <div class="spinner"></div>
    </div>
    
    <!-- 消息提示 -->
    <div class="message" id="message"></div>
    
    <!-- 主容器 -->
    <div class="container">
        <!-- 页面头部 -->
        <div class="header">
            <h1>{页面标题}</h1>
            <p>{页面描述}</p>
        </div>
        
        <!-- 表单区域 -->
        <form id="mainForm" novalidate>
            <!-- 表单字段 -->
            <div class="form-group">
                <label for="{fieldId}" class="required">{字段标签}</label>
                <input 
                    type="{fieldType}" 
                    id="{fieldId}" 
                    name="{fieldName}" 
                    placeholder="{占位符文本}"
                    required
                />
                <div class="error-message">{错误提示文本}</div>
            </div>
            
            <!-- 更多字段... -->
            
            <!-- 按钮组 -->
            <div class="form-group" style="text-align: right; margin-top: 24px; padding-top: 24px; border-top: 1px solid #f0f0f0;">
                <button type="button" class="btn btn-default" id="cancelBtn">
                    取消
                </button>
                <button type="submit" class="btn btn-primary" id="submitBtn">
                    {按钮文本}
                </button>
            </div>
        </form>
    </div>
    
    <script>
        // ========== 工具函数 ==========
        
        // 显示消息提示
        function showMessage(text, type = 'success') {
            const messageEl = document.getElementById('message');
            messageEl.textContent = text;
            messageEl.className = `message ${type}`;
            messageEl.style.display = 'block';
            
            setTimeout(() => {
                messageEl.style.display = 'none';
            }, 3000);
        }
        
        // 显示/隐藏加载动画
        function showLoading(show) {
            const loadingEl = document.getElementById('loading');
            loadingEl.className = show ? 'loading show' : 'loading';
        }
        
        // 表单验证函数
        const validators = {
            // 手机号验证
            phone: (value) => {
                const regex = /^1[3-9]\d{9}$/;
                return regex.test(value) ? null : '请输入正确的手机号';
            },
            
            // 身份证号验证
            idCard: (value) => {
                const regex = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/;
                return regex.test(value) ? null : '请输入正确的身份证号';
            },
            
            // 邮箱验证
            email: (value) => {
                const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return regex.test(value) ? null : '请输入正确的邮箱地址';
            },
            
            // 必填验证
            required: (value) => {
                return value.trim() !== '' ? null : '此字段为必填项';
            }
        };
        
        // 验证单个字段
        function validateField(field) {
            const formGroup = field.closest('.form-group');
            const errorEl = formGroup.querySelector('.error-message');
            const fieldType = field.dataset.validate;
            
            // 清除之前的错误状态
            formGroup.classList.remove('has-error');
            
            // 必填验证
            if (field.hasAttribute('required')) {
                const error = validators.required(field.value);
                if (error) {
                    formGroup.classList.add('has-error');
                    errorEl.textContent = error;
                    return false;
                }
            }
            
            // 特定类型验证
            if (fieldType && validators[fieldType]) {
                const error = validators[fieldType](field.value);
                if (error) {
                    formGroup.classList.add('has-error');
                    errorEl.textContent = error;
                    return false;
                }
            }
            
            return true;
        }
        
        // 验证整个表单
        function validateForm(form) {
            const fields = form.querySelectorAll('input[required], select[required], textarea[required]');
            let isValid = true;
            
            fields.forEach(field => {
                if (!validateField(field)) {
                    isValid = false;
                }
            });
            
            return isValid;
        }
        
        // ========== 页面初始化 ==========
        
        document.addEventListener('DOMContentLoaded', function() {
            const form = document.getElementById('mainForm');
            const submitBtn = document.getElementById('submitBtn');
            const cancelBtn = document.getElementById('cancelBtn');
            
            // 字段失焦验证
            form.querySelectorAll('input, select, textarea').forEach(field => {
                field.addEventListener('blur', () => {
                    validateField(field);
                });
                
                // 输入时清除错误状态
                field.addEventListener('input', () => {
                    const formGroup = field.closest('.form-group');
                    formGroup.classList.remove('has-error');
                });
            });
            
            // 表单提交
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // 验证表单
                if (!validateForm(form)) {
                    showMessage('请检查表单填写是否正确', 'error');
                    return;
                }
                
                // 收集表单数据
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());
                
                console.log('提交的数据：', data);
                
                // 显示加载动画
                showLoading(true);
                submitBtn.disabled = true;
                submitBtn.textContent = '提交中...';
                
                // 模拟API调用（2秒延迟）
                setTimeout(() => {
                    showLoading(false);
                    submitBtn.disabled = false;
                    submitBtn.textContent = '{按钮文本}';
                    
                    // 模拟成功
                    showMessage('提交成功', 'success');
                    
                    // 跳转到下一页（2秒后）
                    setTimeout(() => {
                        window.location.href = '{下一页面.html}';
                    }, 2000);
                    
                    // 如需模拟失败，使用：
                    // showMessage('提交失败，请重试', 'error');
                }, 2000);
            });
            
            // 取消按钮
            if (cancelBtn) {
                cancelBtn.addEventListener('click', function() {
                    if (confirm('确定要取消吗？')) {
                        window.location.href = '{上一页面.html}';
                    }
                });
            }
        });
    </script>
</body>
</html>
```

---

### 3. 代码实现要求

#### HTML结构（强制）

- 使用语义化HTML5标签
- 表单使用`<form>`标签，字段使用正确的`type`属性
- 所有`<label>`关联对应的`<input>`（使用`for`属性）
- 图片必须有`alt`属性

#### CSS样式（强制）

- **UI风格**：使用Ant Design设计规范（通过CDN引入CSS或使用内联样式模拟）
- **主题色**：使用Ant Design默认主题色（#1890ff）
- **组件样式**：按钮、表单、消息提示等遵循Ant Design风格
- 使用内联`<style>`标签，避免外部CSS文件依赖
- 实现响应式布局（@media查询）
- 提供必要的交互反馈样式（hover、focus、disabled）
- 错误状态使用Ant Design错误色（#ff4d4f），成功状态使用成功色（#52c41a）

#### JavaScript逻辑（强制）

- 使用原生JavaScript，不依赖jQuery或其他库
- 实现所有定义的表单验证规则
- 实现页面跳转和交互反馈
- 代码结构清晰，添加必要注释

#### 可访问性（建议）

- 支持键盘导航（Tab键切换）
- 表单验证错误有明确提示
- 颜色对比度符合WCAG 2.1 AA级别

---

### 4. 特别说明

#### 数据存储

- 使用`localStorage`临时存储表单数据（模拟后端）
- 页面间传递参数使用URL参数或`sessionStorage`

#### API模拟

- 使用`setTimeout`模拟网络延迟（1-3秒）
- 使用随机数模拟成功/失败（可选）
- 在控制台打印模拟的API请求和响应

#### 原型局限性说明

在HTML文件顶部添加说明注释：

```html
<!--
    【原型说明】
    - 这是一个中低保真交互原型，用于演示核心功能和交互流程
    - UI风格：采用Ant Design设计规范
    - 数据提交为模拟实现，不会真实发送到服务器
    - 样式为基础样式，实际UI设计请参考设计稿
    - 仅支持现代浏览器（Chrome、Edge、Firefox、Safari）
-->
```

---

### 5. 输出格式

直接输出完整的HTML代码文件内容，按照上述模板和要求实现。

**如果有多个页面**，分别生成每个页面的完整HTML代码。

**注意**：不要有任何前言、说明或总结性文字，直接输出HTML代码。

---

## ✨ 使用说明

### 如何使用此提示词

1. **准备输入材料**
   - 页面元素分析结果（步骤4）
   - 交互逻辑设计（步骤5）

2. **复制提示词**
   - 从"你是一位资深前端开发工程师"开始

3. **粘贴到AI工具**
   - 将提示词和输入材料一起提交
   - **建议每次只生成1个页面**，避免回复过长

4. **生成HTML代码**
   - AI将生成完整的HTML文件代码

5. **保存和测试**
   - 将代码保存为`.html`文件
   - 双击文件在浏览器中打开
   - 测试所有交互功能

6. **人工优化**（可选）
   - 调整样式细节
   - 优化交互动画
   - 补充遗漏的功能

7. **交付**
   - 打包所有HTML文件
   - 提供原型使用说明
   - 演示给相关方

### 预期生成时间

- AI生成单个页面：2-3分钟
- 保存和测试：5分钟/页面
- 全部页面完成：根据页面数量

### 测试清单

生成的HTML原型应测试以下内容：

- [ ] 页面在浏览器中正常显示
- [ ] 所有表单字段可输入
- [ ] 必填字段验证正常工作
- [ ] 格式验证（手机号、邮箱等）正确
- [ ] 提交按钮点击后有加载状态
- [ ] 成功/失败提示正常显示
- [ ] 页面跳转功能正常
- [ ] 响应式布局在移动端正常

---

**📌 重要提醒**：
- HTML原型是中低保真原型，重点是交互逻辑而非视觉细节
- 代码应简洁易读，方便后续修改
- 如果页面较多，建议分批生成（每次1-2个页面）
- 测试时注意浏览器兼容性（建议使用Chrome）
- 交付时提供README说明如何运行原型
