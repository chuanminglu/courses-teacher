/**
 * 用户运营分析地图组合式函数
 * @description 封装ECharts地图和折线图逻辑
 */

import { ref, shallowRef, onMounted, onUnmounted, watch, computed } from 'vue'
import * as echarts from 'echarts'
import type { ECharts, EChartsOption } from 'echarts'
import type { MapDataItem, TrendDataItem } from './types'
import { GUIZHOU_GEOJSON_URL } from './types'

// GeoJSON缓存
const geoJsonCache = new Map<string, any>()

export function useUserAnalysisMap(
  mapContainerRef: Ref<HTMLElement | null>,
  trendContainerRef: Ref<HTMLElement | null>
) {
  // 图表实例
  const mapInstance = shallowRef<ECharts | null>(null)
  const trendInstance = shallowRef<ECharts | null>(null)
  
  // 状态
  const isMapLoading = ref(true)
  const mapLoaded = ref(false)
  const selectedRegion = ref<string | null>(null)
  
  /**
   * 加载并注册GeoJSON
   */
  const loadGeoJson = async (mapName: string, url: string) => {
    // 检查ECharts缓存
    if (echarts.getMap(mapName)) {
      mapLoaded.value = true
      return true
    }
    
    // 检查本地缓存
    if (geoJsonCache.has(mapName)) {
      echarts.registerMap(mapName, geoJsonCache.get(mapName))
      mapLoaded.value = true
      return true
    }
    
    try {
      isMapLoading.value = true
      const response = await fetch(url)
      if (!response.ok) throw new Error(`Failed to load GeoJSON: ${response.status}`)
      
      const geoJson = await response.json()
      geoJsonCache.set(mapName, geoJson)
      echarts.registerMap(mapName, geoJson)
      mapLoaded.value = true
      return true
    } catch (error) {
      console.error('GeoJSON加载失败:', error)
      return false
    } finally {
      isMapLoading.value = false
    }
  }
  
  /**
   * 生成地图配置
   */
  const getMapOption = (data: MapDataItem[], mapName: string): EChartsOption => {
    const values = data.map(d => d.value)
    const min = Math.min(...values, 0)
    const max = Math.max(...values, 100)
    
    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(13, 31, 56, 0.9)',
        borderColor: 'rgba(0, 212, 255, 0.3)',
        borderWidth: 1,
        padding: [12, 16],
        textStyle: {
          color: '#fff',
          fontSize: 13
        },
        formatter: (params: any) => {
          const item = data.find(d => d.name === params.name || d.name === params.name.replace('市', ''))
          if (!item) return `${params.name}<br/>暂无数据`
          
          const percent = item.percent ?? Math.round((item.value / max) * 100)
          return `
            <div style="font-size: 14px; font-weight: 500; margin-bottom: 8px;">${params.name.replace('市', '')}</div>
            <div style="color: rgba(255,255,255,0.8);">
              影响用户数：<span style="color: #00d4ff; font-size: 16px; font-weight: bold;">${item.value}</span>
              <span style="margin-left: 8px; color: #52c41a;">${percent}%</span>
            </div>
          `
        }
      },
      visualMap: {
        type: 'continuous',
        min,
        max,
        right: 10,
        top: 'center',
        orient: 'vertical',
        itemWidth: 12,
        itemHeight: 80,
        text: ['高', '低'],
        textStyle: {
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: 12
        },
        inRange: {
          color: ['#c4d9f2', '#7eb8da', '#4a9fd4', '#1890ff', '#0050b3']
        },
        calculable: false,
        show: true
      },
      geo: {
        map: mapName,
        roam: false,
        zoom: 1.1,
        center: undefined,
        label: {
          show: false
        },
        emphasis: {
          label: {
            show: false
          },
          itemStyle: {
            areaColor: '#ffa500',
            borderColor: '#fff',
            borderWidth: 1,
            shadowColor: 'rgba(255, 165, 0, 0.5)',
            shadowBlur: 10
          }
        },
        itemStyle: {
          areaColor: '#1890ff',
          borderColor: 'rgba(255, 255, 255, 0.4)',
          borderWidth: 1
        },
        select: {
          itemStyle: {
            areaColor: '#ffa500'
          }
        }
      },
      series: [
        {
          type: 'map',
          map: mapName,
          geoIndex: 0,
          data: data.map(item => ({
            name: item.name,
            value: item.value,
            percent: item.percent
          }))
        }
      ]
    }
  }
  
  /**
   * 生成趋势折线图配置
   */
  const getTrendOption = (data: TrendDataItem[]): EChartsOption => {
    const months = data.map(d => d.month)
    const values = data.map(d => d.value)
    
    return {
      backgroundColor: 'transparent',
      grid: {
        left: 40,
        right: 10,
        top: 10,
        bottom: 25
      },
      xAxis: {
        type: 'category',
        data: months,
        axisLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.2)'
          }
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: 11
        }
      },
      yAxis: {
        type: 'value',
        name: '月活',
        nameTextStyle: {
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: 11,
          padding: [0, 30, 0, 0]
        },
        min: 25,
        max: 100,
        interval: 25,
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: 11
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.1)',
            type: 'dashed'
          }
        }
      },
      series: [
        {
          type: 'line',
          data: values,
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: {
            color: '#52c41a',
            width: 2
          },
          itemStyle: {
            color: '#52c41a',
            borderColor: '#fff',
            borderWidth: 1
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(82, 196, 26, 0.3)' },
                { offset: 1, color: 'rgba(82, 196, 26, 0.05)' }
              ]
            }
          }
        }
      ]
    }
  }
  
  /**
   * 初始化地图
   */
  const initMapChart = async (data: MapDataItem[], mapName: string = '贵州') => {
    if (!mapContainerRef.value) return
    
    // 加载GeoJSON
    const loaded = await loadGeoJson(mapName, GUIZHOU_GEOJSON_URL)
    if (!loaded) return
    
    // 初始化或获取实例
    if (!mapInstance.value) {
      mapInstance.value = echarts.init(mapContainerRef.value)
    }
    
    const option = getMapOption(data, mapName)
    mapInstance.value.setOption(option)
  }
  
  /**
   * 初始化趋势图
   */
  const initTrendChart = (data: TrendDataItem[]) => {
    if (!trendContainerRef.value) return
    
    if (!trendInstance.value) {
      trendInstance.value = echarts.init(trendContainerRef.value)
    }
    
    const option = getTrendOption(data)
    trendInstance.value.setOption(option)
  }
  
  /**
   * 更新地图数据
   */
  const updateMapData = (data: MapDataItem[], mapName: string = '贵州') => {
    if (!mapInstance.value) return
    
    const option = getMapOption(data, mapName)
    mapInstance.value.setOption(option)
  }
  
  /**
   * 更新趋势数据
   */
  const updateTrendData = (data: TrendDataItem[]) => {
    if (!trendInstance.value) return
    
    const option = getTrendOption(data)
    trendInstance.value.setOption(option)
  }
  
  /**
   * 高亮指定区域
   */
  const highlightRegion = (regionName: string) => {
    if (!mapInstance.value) return
    
    // 取消之前的高亮
    if (selectedRegion.value) {
      mapInstance.value.dispatchAction({
        type: 'downplay',
        name: selectedRegion.value
      })
    }
    
    // 高亮新区域
    mapInstance.value.dispatchAction({
      type: 'highlight',
      name: regionName
    })
    
    selectedRegion.value = regionName
  }
  
  /**
   * 绑定地图点击事件
   */
  const bindMapClickHandler = (handler: (data: MapDataItem) => void) => {
    if (!mapInstance.value) return
    
    mapInstance.value.on('click', (params: any) => {
      if (params.componentType === 'series' || params.componentType === 'geo') {
        handler({
          name: params.name,
          value: params.value ?? 0,
          percent: params.data?.percent
        })
      }
    })
  }
  
  /**
   * 调整图表尺寸
   */
  const resize = () => {
    mapInstance.value?.resize()
    trendInstance.value?.resize()
  }
  
  /**
   * 销毁图表
   */
  const dispose = () => {
    mapInstance.value?.dispose()
    trendInstance.value?.dispose()
    mapInstance.value = null
    trendInstance.value = null
  }
  
  // ResizeObserver
  let resizeObserver: ResizeObserver | null = null
  
  onMounted(() => {
    resizeObserver = new ResizeObserver(() => {
      resize()
    })
    
    if (mapContainerRef.value) {
      resizeObserver.observe(mapContainerRef.value)
    }
    if (trendContainerRef.value) {
      resizeObserver.observe(trendContainerRef.value)
    }
  })
  
  onUnmounted(() => {
    resizeObserver?.disconnect()
    dispose()
  })
  
  return {
    // 状态
    isMapLoading,
    mapLoaded,
    selectedRegion,
    
    // 实例
    mapInstance,
    trendInstance,
    
    // 方法
    initMapChart,
    initTrendChart,
    updateMapData,
    updateTrendData,
    highlightRegion,
    bindMapClickHandler,
    resize,
    dispose
  }
}

// 类型导出
import type { Ref } from 'vue'
