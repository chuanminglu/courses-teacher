# PlantUML图表绘制提示词大全 - 民航业案例

## 目录
1. [用例图 (Use Case Diagram)](#用例图)
2. [类图 (Class Diagram)](#类图)
3. [序列图 (Sequence Diagram)](#序列图)
4. [活动图 (Activity Diagram)](#活动图)
5. [状态图 (State Diagram)](#状态图)
6. [组件图 (Component Diagram)](#组件图)
7. [部署图 (Deployment Diagram)](#部署图)
8. [时序图 (Timing Diagram)](#时序图)
9. [网络图 (Network Diagram)](#网络图)
10. [架构图 (Architecture Diagram)](#架构图)

---

## 用例图

### 提示词模板
```
请使用PlantUML绘制[系统名称]的用例图，包含以下参与者和用例：
- 参与者：[角色1]、[角色2]、[角色3]
- 主要用例：[用例1]、[用例2]、[用例3]
- 包含关系：[说明包含关系]
- 扩展关系：[说明扩展关系]
```

### 民航业案例
```
请使用PlantUML绘制航空货运管理系统的用例图，包含以下参与者和用例：
- 参与者：客户、货运代理、操作员、系统管理员
- 主要用例：货物托运、订单查询、货物追踪、费用结算、航班调度
- 包含关系：货物托运包含客户信息验证
- 扩展关系：货物追踪可扩展为异常处理
```

### 期望输出
```plantuml
@startuml
!theme plain
title 航空货运管理系统用例图

actor 客户 as Customer
actor 货运代理 as Agent
actor 操作员 as Operator
actor 系统管理员 as Admin

rectangle "航空货运管理系统" {
    usecase "货物托运" as UC1
    usecase "订单查询" as UC2
    usecase "货物追踪" as UC3
    usecase "费用结算" as UC4
    usecase "航班调度" as UC5
    usecase "客户信息验证" as UC6
    usecase "异常处理" as UC7
}

Customer --> UC1
Customer --> UC2
Customer --> UC3
Agent --> UC1
Agent --> UC4
Operator --> UC3
Operator --> UC5
Admin --> UC5

UC1 ..> UC6 : <<include>>
UC3 ..> UC7 : <<extend>>
@enduml
```

---

## 类图

### 提示词模板
```
请使用PlantUML绘制[系统模块]的类图，包含以下类和关系：
- 核心类：[类1]、[类2]、[类3]
- 属性：为每个类定义主要属性
- 方法：为每个类定义核心方法
- 关系：继承、组合、聚合、依赖关系
```

### 民航业案例
```
请使用PlantUML绘制航班管理系统的类图，包含以下类和关系：
- 核心类：Aircraft（飞机）、Flight（航班）、Passenger（乘客）、Booking（预订）
- 属性：飞机包含机型、座位数；航班包含航班号、起降时间；乘客包含姓名、身份证号
- 方法：飞机的维护检查、航班的起飞降落、乘客的登机、预订的确认取消
- 关系：一架飞机可以执行多个航班，一个航班可以有多个乘客，乘客通过预订关联航班
```

### 期望输出
```plantuml
@startuml
!theme plain
title 航班管理系统类图

class Aircraft {
    -aircraftId: String
    -model: String
    -seatCapacity: int
    -status: String
    +performMaintenance(): boolean
    +getAvailability(): boolean
}

class Flight {
    -flightNumber: String
    -departureTime: DateTime
    -arrivalTime: DateTime
    -origin: String
    -destination: String
    +takeOff(): boolean
    +land(): boolean
    +updateStatus(status: String): void
}

class Passenger {
    -passengerId: String
    -name: String
    -idNumber: String
    -phoneNumber: String
    +checkIn(): boolean
    +board(): boolean
}

class Booking {
    -bookingId: String
    -bookingDate: DateTime
    -seatNumber: String
    -status: String
    +confirm(): boolean
    +cancel(): boolean
}

Aircraft ||--o{ Flight : executes
Flight ||--o{ Booking : contains
Passenger ||--o{ Booking : makes
@enduml
```

---

## 序列图

### 提示词模板
```
请使用PlantUML绘制[业务流程]的序列图，包含以下参与者和交互：
- 参与者：[对象1]、[对象2]、[对象3]
- 主要交互流程：[步骤1] -> [步骤2] -> [步骤3]
- 可选流程：[备选流程说明]
- 异常处理：[异常情况处理]
```

### 民航业案例
```
请使用PlantUML绘制机票预订流程的序列图，包含以下参与者和交互：
- 参与者：乘客、预订系统、支付系统、航班系统
- 主要交互流程：查询航班 -> 选择座位 -> 填写信息 -> 支付费用 -> 确认预订
- 可选流程：如果座位已满，提供其他航班选择
- 异常处理：支付失败时回滚预订
```

### 期望输出
```plantuml
@startuml
!theme plain
title 机票预订流程序列图

participant 乘客 as P
participant 预订系统 as BS
participant 航班系统 as FS
participant 支付系统 as PS

P -> BS: 查询航班
BS -> FS: 检查航班可用性
FS -> BS: 返回航班列表
BS -> P: 显示可用航班

P -> BS: 选择航班和座位
BS -> FS: 检查座位状态
alt 座位可用
    FS -> BS: 确认座位可预订
    BS -> P: 显示座位选择成功
else 座位已满
    FS -> BS: 座位不可用
    BS -> P: 提供其他航班选择
    P -> BS: 重新选择
end

P -> BS: 填写乘客信息
P -> BS: 确认预订
BS -> PS: 发起支付请求

alt 支付成功
    PS -> BS: 支付确认
    BS -> FS: 锁定座位
    FS -> BS: 座位锁定成功
    BS -> P: 预订成功通知
else 支付失败
    PS -> BS: 支付失败
    BS -> FS: 释放座位
    BS -> P: 预订失败通知
end
@enduml
```

---

## 活动图

### 提示词模板
```
请使用PlantUML绘制[业务流程]的活动图，包含以下要素：
- 开始和结束节点
- 主要活动：[活动1]、[活动2]、[活动3]
- 决策点：[判断条件1]、[判断条件2]
- 并行活动：[可并行执行的活动]
- 异常处理路径
```

### 民航业案例
```
请使用PlantUML绘制航班安检流程的活动图，包含以下要素：
- 开始：乘客到达安检口
- 主要活动：证件检查、行李检查、人身检查、登机口验证
- 决策点：证件是否有效、是否有违禁品、是否需要二次检查
- 并行活动：行李检查和人身检查可并行进行
- 异常处理：发现违禁品需要处理流程
```

### 期望输出
```plantuml
@startuml
!theme plain
title 航班安检流程活动图

start

:乘客到达安检口;
:排队等候;
:出示证件和登机牌;

if (证件是否有效?) then (是)
    fork
        :行李安检;
        if (发现违禁品?) then (是)
            :违禁品处理;
            :重新安检;
        else (否)
        endif
    fork again
        :人身安检;
        if (需要二次检查?) then (是)
            :手动检查;
        else (否)
        endif
    end fork
    
    :安检通过;
    :前往登机口;
    :登机口验证;
    
    if (登机牌有效?) then (是)
        :进入候机区;
        stop
    else (否)
        :返回值机柜台;
        stop
    endif
else (否)
    :证件异常处理;
    :联系相关部门;
    stop
endif
@enduml
```

---

## 状态图

### 提示词模板
```
请使用PlantUML绘制[对象/实体]的状态图，包含以下要素：
- 初始状态和最终状态
- 主要状态：[状态1]、[状态2]、[状态3]
- 状态转换条件：[触发事件/条件]
- 状态内部活动：[entry/exit/do活动]
```

### 民航业案例
```
请使用PlantUML绘制航班状态的状态图，包含以下要素：
- 初始状态：计划中
- 主要状态：准备中、登机中、起飞、飞行中、降落、完成、取消、延误
- 状态转换条件：时间到达、天气条件、机械故障等
- 状态内部活动：在登机状态时执行乘客登机检查
```

### 期望输出
```plantuml
@startuml
!theme plain
title 航班状态图

[*] --> 计划中 : 创建航班

计划中 --> 准备中 : 航班日期临近
计划中 --> 取消 : 航班取消

准备中 --> 登机中 : 开始登机
准备中 --> 延误 : 出现延误
准备中 --> 取消 : 航班取消

登机中 : entry / 开放登机口
登机中 : do / 乘客登机检查
登机中 : exit / 关闭登机口

登机中 --> 起飞 : 登机完成
登机中 --> 延误 : 登机延误

起飞 --> 飞行中 : 起飞成功

飞行中 : do / 飞行监控
飞行中 --> 降落 : 到达目的地

降落 --> 完成 : 降落成功

延误 --> 准备中 : 延误解除
延误 --> 取消 : 延误过长取消

完成 --> [*]
取消 --> [*]
@enduml
```

---

## 组件图

### 提示词模板
```
请使用PlantUML绘制[系统]的组件图，包含以下要素：
- 主要组件：[组件1]、[组件2]、[组件3]
- 接口定义：[接口说明]
- 组件间依赖关系
- 外部系统接口
```

### 民航业案例
```
请使用PlantUML绘制机场管理系统的组件图，包含以下要素：
- 主要组件：航班管理、乘客服务、行李处理、安检系统、地勤服务
- 接口定义：各组件间的数据交换接口
- 组件间依赖关系：航班管理依赖乘客服务和地勤服务
- 外部系统：航空公司系统、气象系统
```

### 期望输出
```plantuml
@startuml
!theme plain
title 机场管理系统组件图

package "机场管理系统" {
    component [航班管理] as FM
    component [乘客服务] as PS
    component [行李处理] as BH
    component [安检系统] as SS
    component [地勤服务] as GS
}

package "外部系统" {
    component [航空公司系统] as ACS
    component [气象系统] as WS
}

interface "航班信息接口" as FII
interface "乘客信息接口" as PII
interface "行李追踪接口" as BTI
interface "安检结果接口" as SRI
interface "地勤状态接口" as GSI

FM -down-> FII
PS -down-> PII
BH -down-> BTI
SS -down-> SRI
GS -down-> GSI

FM ..> PS : 查询乘客信息
FM ..> GS : 协调地勤服务
PS ..> SS : 提供安检信息
PS ..> BH : 行李托运
BH ..> GS : 行李装卸

ACS --> FII : 提供航班数据
WS --> FM : 提供气象信息
@enduml
```

---

## 部署图

### 提示词模板
```
请使用PlantUML绘制[系统]的部署图，包含以下要素：
- 硬件节点：[服务器1]、[服务器2]、[客户端设备]
- 软件组件：[应用程序]、[数据库]、[中间件]
- 网络连接：[连接方式和协议]
- 部署环境：[开发/测试/生产环境]
```

### 民航业案例
```
请使用PlantUML绘制航空票务系统的部署图，包含以下要素：
- 硬件节点：Web服务器、应用服务器、数据库服务器、负载均衡器
- 软件组件：票务Web应用、预订服务、支付服务、用户数据库、航班数据库
- 网络连接：HTTPS、数据库连接、内部服务调用
- 部署环境：生产环境配置
```

### 期望输出
```plantuml
@startuml
!theme plain
title 航空票务系统部署图

node "负载均衡器" as LB {
    artifact "Nginx" as nginx
}

node "Web服务器集群" {
    node "Web服务器1" as WS1 {
        artifact "票务Web应用" as WebApp1
    }
    node "Web服务器2" as WS2 {
        artifact "票务Web应用" as WebApp2
    }
}

node "应用服务器集群" {
    node "应用服务器1" as AS1 {
        artifact "预订服务" as BookingService1
        artifact "支付服务" as PaymentService1
    }
    node "应用服务器2" as AS2 {
        artifact "预订服务" as BookingService2
        artifact "支付服务" as PaymentService2
    }
}

node "数据库服务器" as DBS {
    database "用户数据库" as UserDB
    database "航班数据库" as FlightDB
}

node "客户端设备" as Client {
    artifact "浏览器" as Browser
    artifact "移动App" as MobileApp
}

Client -down-> LB : HTTPS
LB -down-> WS1 : HTTP
LB -down-> WS2 : HTTP
WS1 -down-> AS1 : REST API
WS2 -down-> AS2 : REST API
AS1 -down-> DBS : JDBC
AS2 -down-> DBS : JDBC
@enduml
```

---

## 时序图

### 提示词模板
```
请使用PlantUML绘制[业务场景]的时序图，包含以下要素：
- 时间轴：从左到右表示时间流逝
- 参与者：[角色/系统1]、[角色/系统2]
- 时间约束：[时间窗口]、[超时设置]
- 状态变化：[状态转换时间点]
```

### 民航业案例
```
请使用PlantUML绘制航班起飞准备时序图，包含以下要素：
- 时间轴：起飞前2小时到起飞
- 参与者：地勤、乘务、机长、塔台
- 时间约束：登机开始时间、登机结束时间、起飞窗口
- 状态变化：飞机准备状态、乘客登机状态、起飞许可状态
```

### 期望输出
```plantuml
@startuml
!theme plain
title 航班起飞准备时序图

robust "地勤服务" as Ground
robust "乘务组" as Crew
robust "机长" as Captain
robust "塔台" as Tower

@0
Ground is 飞机检查
Crew is 准备中
Captain is 飞行前检查
Tower is 待命

@30
Ground is 飞机准备完成
note top : 起飞前90分钟

@45
Crew is 登机准备
Captain is 飞行计划确认

@60
Ground is 开始登机
Crew is 乘客服务
note top : 起飞前60分钟

@90
Ground is 登机完成
Crew is 安全检查
Captain is 最终检查

@105
Ground is 推出准备
Captain is 启动发动机
Tower is 地面管制

@110
Ground is 推出完成
Captain is 滑行请求
Tower is 滑行许可

@120
Captain is 起飞请求
Tower is 起飞许可
note top : 计划起飞时间

@enduml
```

---

## 网络图

### 提示词模板
```
请使用PlantUML绘制[网络架构]的网络图，包含以下要素：
- 网络设备：[路由器]、[交换机]、[防火墙]
- 网络分段：[DMZ区域]、[内网]、[外网]
- IP地址规划：[网络段划分]
- 安全策略：[访问控制规则]
```

### 民航业案例
```
请使用PlantUML绘制机场网络架构图，包含以下要素：
- 网络设备：核心路由器、接入交换机、安全防火墙
- 网络分段：办公网络、生产网络、公共WiFi、安检网络
- IP地址规划：各业务网段规划
- 安全策略：不同网段间的访问控制
```

### 期望输出
```plantuml
@startuml
!theme plain
title 机场网络架构图

package "外网" {
    cloud "互联网" as Internet
}

package "DMZ区域" {
    node "Web服务器" as WebServer
    node "邮件服务器" as MailServer
}

package "网络设备" {
    node "边界防火墙" as EdgeFW
    node "核心路由器" as CoreRouter
    node "内网防火墙" as InternalFW
    node "核心交换机" as CoreSwitch
}

package "办公网络 192.168.1.0/24" {
    node "办公终端" as Office
    node "打印机" as Printer
}

package "生产网络 192.168.2.0/24" {
    node "票务系统" as TicketSystem
    node "航班显示系统" as FlightDisplay
    node "行李系统" as BaggageSystem
}

package "安检网络 192.168.3.0/24" {
    node "安检设备" as SecurityDevice
    node "监控系统" as CCTV
}

package "公共WiFi 10.0.1.0/24" {
    cloud "乘客设备" as PublicWiFi
}

Internet -- EdgeFW
EdgeFW -- DMZ区域
EdgeFW -- CoreRouter
CoreRouter -- InternalFW
InternalFW -- CoreSwitch
CoreSwitch -- 办公网络
CoreSwitch -- 生产网络
CoreSwitch -- 安检网络
CoreRouter -- 公共WiFi

note right of EdgeFW : 阻止外网直接访问内网
note right of InternalFW : 控制内网间访问
note bottom of 生产网络 : 关键业务系统\n高可用配置
@enduml
```

---

## 架构图

### 提示词模板
```
请使用PlantUML绘制[系统]的架构图，包含以下要素：
- 架构层次：[表示层]、[业务层]、[数据层]
- 核心组件：[组件说明]
- 技术栈：[具体技术选型]
- 集成方式：[系统间集成方式]
```

### 民航业案例
```
请使用PlantUML绘制智能机场管理平台架构图，包含以下要素：
- 架构层次：用户界面层、API网关层、微服务层、数据存储层
- 核心组件：航班服务、乘客服务、行李服务、安检服务
- 技术栈：React前端、Spring Boot、Redis缓存、MySQL数据库
- 集成方式：RESTful API、消息队列、数据同步
```

### 期望输出
```plantuml
@startuml
!theme plain
title 智能机场管理平台架构图

package "用户界面层" {
    component [管理员控制台\n(React)] as AdminUI
    component [乘客移动端\n(React Native)] as MobileApp
    component [信息显示屏\n(Web)] as DisplayScreen
}

package "API网关层" {
    component [API Gateway\n(Spring Cloud Gateway)] as Gateway
    component [认证服务\n(OAuth2)] as Auth
}

package "微服务层" {
    component [航班服务\n(Spring Boot)] as FlightService
    component [乘客服务\n(Spring Boot)] as PassengerService
    component [行李服务\n(Spring Boot)] as BaggageService
    component [安检服务\n(Spring Boot)] as SecurityService
    component [通知服务\n(Spring Boot)] as NotificationService
}

package "缓存层" {
    database [Redis集群] as Redis
}

package "消息队列" {
    queue [RabbitMQ] as MQ
}

package "数据存储层" {
    database [航班数据库\n(MySQL)] as FlightDB
    database [乘客数据库\n(MySQL)] as PassengerDB
    database [行李数据库\n(MySQL)] as BaggageDB
    database [日志数据库\n(MongoDB)] as LogDB
}

package "外部系统" {
    component [航空公司API] as AirlineAPI
    component [气象服务API] as WeatherAPI
    component [短信服务API] as SMSAPI
}

AdminUI --> Gateway
MobileApp --> Gateway
DisplayScreen --> Gateway

Gateway --> Auth
Gateway --> FlightService
Gateway --> PassengerService
Gateway --> BaggageService
Gateway --> SecurityService

FlightService --> Redis
PassengerService --> Redis
BaggageService --> Redis

FlightService --> MQ
PassengerService --> MQ
SecurityService --> MQ
NotificationService --> MQ

FlightService --> FlightDB
PassengerService --> PassengerDB
BaggageService --> BaggageDB
NotificationService --> LogDB

FlightService --> AirlineAPI
FlightService --> WeatherAPI
NotificationService --> SMSAPI
@enduml
```

---

## 使用建议

### 1. 选择合适的图表类型
- **用例图**：需求分析阶段，明确系统功能和用户角色
- **类图**：系统设计阶段，定义数据模型和类结构
- **序列图**：详细设计阶段，描述对象间交互流程
- **活动图**：业务流程建模，描述工作流程
- **状态图**：对象状态变化复杂的场景
- **组件图**：系统架构设计，模块划分
- **部署图**：系统部署和运维规划

### 2. 提示词优化技巧
- 明确指定图表类型和业务领域
- 详细描述关键元素和关系
- 提供具体的业务场景和约束条件
- 说明期望的详细程度和重点关注点

### 3. PlantUML语法要点
- 使用`@startuml`和`@enduml`包围图表代码
- 使用`!theme`设置图表主题
- 使用`title`添加图表标题
- 注意不同图表类型的特定语法规则

### 4. 民航业特色元素
- 强调时间敏感性（航班时刻、延误处理）
- 注重安全性（安检流程、应急处理）
- 考虑多方协作（航空公司、机场、乘客、监管部门）
- 突出实时性（航班状态、位置追踪）

通过这些提示词模板和案例，可以快速生成符合民航业务特点的各类PlantUML图表，提升文档质量和沟通效率。
