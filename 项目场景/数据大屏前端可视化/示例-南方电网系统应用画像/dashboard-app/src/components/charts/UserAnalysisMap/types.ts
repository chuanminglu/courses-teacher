/**
 * 用户运营分析组件类型定义
 * @description 贵州省地图 + 月活趋势折线图
 */

/** 地图数据项 */
export interface MapDataItem {
  /** 区域名称（需与GeoJSON中的name匹配） */
  name: string
  /** 数值（影响用户数） */
  value: number
  /** 百分比 */
  percent?: number
}

/** 趋势数据项 */
export interface TrendDataItem {
  /** 月份 */
  month: string
  /** 月活数值 */
  value: number
}

/** 组件Props */
export interface UserAnalysisMapProps {
  /** 地图数据 */
  mapData: MapDataItem[]
  /** 趋势数据 */
  trendData: TrendDataItem[]
  /** 地图名称（用于GeoJSON注册） */
  mapName?: string
  /** 是否显示趋势图 */
  showTrend?: boolean
  /** 地图高度占比 */
  mapHeightRatio?: number
}

/** 组件Emits */
export interface UserAnalysisMapEmits {
  /** 区域点击事件 */
  (e: 'region-click', data: MapDataItem): void
  /** 查看更多点击 */
  (e: 'more-click'): void
}

/** Tooltip数据 */
export interface TooltipData {
  name: string
  value: number
  percent: number
}

/** 贵州省各市州编码映射 */
export const GUIZHOU_CITIES = [
  { name: '贵阳市', code: '520100' },
  { name: '六盘水市', code: '520200' },
  { name: '遵义市', code: '520300' },
  { name: '安顺市', code: '520400' },
  { name: '毕节市', code: '520500' },
  { name: '铜仁市', code: '520600' },
  { name: '黔西南布依族苗族自治州', code: '522300' },
  { name: '黔东南苗族侗族自治州', code: '522600' },
  { name: '黔南布依族苗族自治州', code: '522700' }
] as const

/** GeoJSON来源URL（阿里云DataV） */
export const GUIZHOU_GEOJSON_URL = 'https://geo.datav.aliyun.com/areas_v3/bound/520000_full.json'
