/**
 * 文件: layout.ts
 * 用途: 布局相关TypeScript类型定义
 * 作者: AI Generated
 * 日期: 2026-01-28
 * 说明: 基于精确提取的布局信息定义类型 (P00-布局信息提取结果-精确版.md)
 */

/** 尺寸 */
export interface Dimension {
  width: number
  height: number
}

/** 位置 */
export interface Position {
  x: number
  y: number
}

/** 矩形区域 */
export interface Rect extends Position, Dimension {}

/** 列配置 */
export interface ColumnConfig {
  /** 起始X坐标 (px) */
  x: number
  /** 列宽度 (px) */
  width: number
  /** 百分比占比 */
  percent: number
  /** 列标识名称 */
  name: 'overview' | 'resource' | 'application' | 'security'
}

/** 模块配置 */
export interface ModuleConfig extends Rect {
  /** 模块宽度 (px) */
  w?: number
  /** 模块高度 (px) */
  h?: number
}

/** 所有模块配置映射 */
export interface ModulesConfig {
  // 第1列 - 系统概览
  systemOverview: ModuleConfig
  kpiAnalysis: ModuleConfig
  realtimeAlerts: ModuleConfig
  workOrders: ModuleConfig
  
  // 第2列 - 资源统计
  resourceSummary: ModuleConfig
  resourceStats: ModuleConfig
  usageRanking: ModuleConfig
  systemRelation: ModuleConfig
  
  // 第3列 - 应用分析
  runningStatus: ModuleConfig
  requestStats: ModuleConfig
  dialTest: ModuleConfig
  userAnalysis: ModuleConfig
  
  // 第4列 - 安全统计
  securityAlerts: ModuleConfig
  vulnerabilities: ModuleConfig
  defects: ModuleConfig
}

/** 完整布局配置 */
export interface LayoutConfig {
  /** 视口尺寸 */
  viewport: Dimension
  /** 顶部导航配置 */
  header: {
    height: number
  }
  /** 内容区配置 */
  content: {
    startY: number
    height: number
  }
  /** 四列配置 */
  columns: ColumnConfig[]
  /** 所有模块配置 */
  modules: ModulesConfig
}

/** 模块标识枚举 */
export type ModuleId = keyof ModulesConfig

/** 列标识枚举 */
export type ColumnId = ColumnConfig['name']

/** 插槽名称映射 */
export const SLOT_NAMES = {
  // 第1列
  systemOverview: 'system-overview',
  kpiAnalysis: 'kpi-analysis',
  realtimeAlerts: 'realtime-alerts',
  workOrders: 'work-orders',
  
  // 第2列
  resourceSummary: 'resource-summary',
  resourceStats: 'resource-stats',
  usageRanking: 'usage-ranking',
  systemRelation: 'system-relation',
  
  // 第3列
  runningStatus: 'running-status',
  requestStats: 'request-stats',
  dialTest: 'dial-test',
  userAnalysis: 'user-analysis',
  
  // 第4列
  securityAlerts: 'security-alerts',
  vulnerabilities: 'vulnerabilities',
  defects: 'defects'
} as const

/** 插槽名称类型 */
export type SlotName = typeof SLOT_NAMES[keyof typeof SLOT_NAMES]

/** 模块元数据 */
export interface ModuleMeta {
  id: ModuleId
  slot: SlotName
  title: string
  icon: string
  column: ColumnId
  hasAction?: boolean
}

/** 所有模块元数据 */
export const MODULE_META: ModuleMeta[] = [
  // 第1列
  { id: 'systemOverview', slot: 'system-overview', title: 'xxxxx系统概述', icon: '📋', column: 'overview' },
  { id: 'kpiAnalysis', slot: 'kpi-analysis', title: '综合指标分析', icon: '📊', column: 'overview' },
  { id: 'realtimeAlerts', slot: 'realtime-alerts', title: '实时告警', icon: '🚨', column: 'overview' },
  { id: 'workOrders', slot: 'work-orders', title: '作业工单', icon: '📝', column: 'overview' },
  
  // 第2列
  { id: 'resourceSummary', slot: 'resource-summary', title: '资源汇总', icon: '🖥️', column: 'resource' },
  { id: 'resourceStats', slot: 'resource-stats', title: '资源统计', icon: '📈', column: 'resource' },
  { id: 'usageRanking', slot: 'usage-ranking', title: '使用排行榜', icon: '📊', column: 'resource' },
  { id: 'systemRelation', slot: 'system-relation', title: '系统关联分析', icon: '🔗', column: 'resource', hasAction: true },
  
  // 第3列
  { id: 'runningStatus', slot: 'running-status', title: '运行状态分析', icon: '📉', column: 'application' },
  { id: 'requestStats', slot: 'request-stats', title: '请求统计分析', icon: '📊', column: 'application' },
  { id: 'dialTest', slot: 'dial-test', title: '拨测情况统计', icon: '🎯', column: 'application' },
  { id: 'userAnalysis', slot: 'user-analysis', title: '用户运营分析', icon: '👥', column: 'application', hasAction: true },
  
  // 第4列
  { id: 'securityAlerts', slot: 'security-alerts', title: '近24小时安全告警统计', icon: '🛡️', column: 'security' },
  { id: 'vulnerabilities', slot: 'vulnerabilities', title: '漏洞统计', icon: '🐛', column: 'security' },
  { id: 'defects', slot: 'defects', title: '缺陷统计', icon: '⚠️', column: 'security' }
]

/** 
 * 精确布局配置常量
 * 数据来源: P00-布局信息提取结果-精确版.md
 */
export const LAYOUT_CONFIG: LayoutConfig = {
  viewport: { width: 1900, height: 960 },
  header: { height: 55 },
  content: { startY: 72, height: 888 },
  columns: [
    { x: 67, width: 393, percent: 20.7, name: 'overview' },
    { x: 506, width: 564, percent: 29.7, name: 'resource' },
    { x: 1100, width: 404, percent: 21.3, name: 'application' },
    { x: 1534, width: 374, percent: 19.7, name: 'security' }
  ],
  modules: {
    // 第1列
    systemOverview: { x: 67, y: 113, width: 393, height: 180 },
    kpiAnalysis: { x: 67, y: 303, width: 393, height: 220 },
    realtimeAlerts: { x: 67, y: 529, width: 393, height: 185 },
    workOrders: { x: 67, y: 722, width: 393, height: 240 },
    // 第2列
    resourceSummary: { x: 506, y: 113, width: 564, height: 200 },
    resourceStats: { x: 506, y: 319, width: 564, height: 230 },
    usageRanking: { x: 506, y: 562, width: 564, height: 160 },
    systemRelation: { x: 507, y: 773, width: 593, height: 178 },
    // 第3列
    runningStatus: { x: 1115, y: 113, width: 382, height: 150 },
    requestStats: { x: 1115, y: 272, width: 382, height: 140 },
    dialTest: { x: 1115, y: 420, width: 382, height: 200 },
    userAnalysis: { x: 1115, y: 638, width: 382, height: 280 },
    // 第4列
    securityAlerts: { x: 1534, y: 225, width: 374, height: 200 },
    vulnerabilities: { x: 1535, y: 436, width: 374, height: 250 },
    defects: { x: 1535, y: 692, width: 374, height: 260 }
  }
}
