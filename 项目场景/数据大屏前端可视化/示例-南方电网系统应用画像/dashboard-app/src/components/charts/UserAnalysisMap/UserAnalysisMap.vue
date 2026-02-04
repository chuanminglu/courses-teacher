<script setup lang="ts">
/**
 * 用户运营分析组件
 * @description 贵州省地图热力图 + 月活趋势折线图
 * @author AI Generated
 * @date 2026-01-28
 */

import { ref, onMounted, watch } from 'vue'
import { useUserAnalysisMap } from './useUserAnalysisMap'
import type { UserAnalysisMapProps, UserAnalysisMapEmits, MapDataItem, TrendDataItem } from './types'

// Props定义
const props = withDefaults(defineProps<UserAnalysisMapProps>(), {
  mapName: '贵州',
  showTrend: true,
  mapHeightRatio: 0.65
})

// Emits定义
const emit = defineEmits<UserAnalysisMapEmits>()

// DOM引用
const mapContainer = ref<HTMLElement | null>(null)
const trendContainer = ref<HTMLElement | null>(null)

// 组合式函数
const {
  isMapLoading,
  mapLoaded,
  initMapChart,
  initTrendChart,
  updateMapData,
  updateTrendData,
  bindMapClickHandler
} = useUserAnalysisMap(mapContainer, trendContainer)

// 初始化
onMounted(async () => {
  // 初始化地图
  await initMapChart(props.mapData, props.mapName)
  
  // 绑定点击事件
  bindMapClickHandler((data: MapDataItem) => {
    emit('region-click', data)
  })
  
  // 初始化趋势图
  if (props.showTrend && props.trendData.length > 0) {
    initTrendChart(props.trendData)
  }
})

// 监听数据变化
watch(() => props.mapData, (newData) => {
  updateMapData(newData, props.mapName)
}, { deep: true })

watch(() => props.trendData, (newData) => {
  if (props.showTrend) {
    updateTrendData(newData)
  }
}, { deep: true })

// 更多点击
const handleMoreClick = () => {
  emit('more-click')
}
</script>

<template>
  <div class="user-analysis-map">
    <!-- 标题栏 -->
    <div class="module-header">
      <div class="module-title">
        <span class="icon">👥</span>
        <span class="text">用户运营分析</span>
      </div>
      <button class="more-btn" @click="handleMoreClick">
        更多
      </button>
    </div>
    
    <!-- 内容区 -->
    <div class="module-content">
      <!-- 地图区域 -->
      <div 
        class="map-section"
        :style="{ height: `${mapHeightRatio * 100}%` }"
      >
        <!-- 加载状态 -->
        <div v-if="isMapLoading" class="loading-mask">
          <div class="loading-spinner"></div>
          <span>地图加载中...</span>
        </div>
        
        <!-- 地图容器 -->
        <div 
          ref="mapContainer" 
          class="map-container"
          :class="{ 'is-loading': isMapLoading }"
        ></div>
      </div>
      
      <!-- 趋势折线图 -->
      <div 
        v-if="showTrend"
        class="trend-section"
        :style="{ height: `${(1 - mapHeightRatio) * 100}%` }"
      >
        <div ref="trendContainer" class="trend-container"></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.user-analysis-map {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: transparent;
  // border: 1px solid rgba(0, 212, 255, 0.2);
  // border-radius: 4px;
  overflow: hidden;
}

// 标题栏
.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  // background: linear-gradient(90deg, rgba(0, 212, 255, 0.15) 0%, transparent 100%);
  // border-bottom: 1px solid rgba(0, 212, 255, 0.1);
  flex-shrink: 0;
  display: none; // 隐藏标题栏，因为 DashboardLayout 已经有标题了
}

.module-title {
  display: flex;
  align-items: center;
  gap: 8px;
  
  .icon {
    font-size: 16px;
  }
  
  .text {
    font-size: 14px;
    font-weight: 500;
    color: #fff;
    letter-spacing: 0.5px;
  }
}

.more-btn {
  padding: 4px 12px;
  font-size: 12px;
  color: var(--color-primary, #00d4ff);
  background: transparent;
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(0, 212, 255, 0.1);
    border-color: var(--color-primary, #00d4ff);
  }
}

// 内容区
.module-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0; // 去除padding
  min-height: 0;
}

// 地图区域
.map-section {
  position: relative;
  flex-shrink: 0;
}

.map-container {
  width: 100%;
  height: 100%;
  transition: opacity 0.3s ease;
  
  &.is-loading {
    opacity: 0.3;
  }
}

// 加载状态
.loading-mask {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  z-index: 10;
  
  span {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.6);
  }
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 2px solid rgba(0, 212, 255, 0.2);
  border-top-color: var(--color-primary, #00d4ff);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

// 趋势图区域
.trend-section {
  flex-shrink: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 8px;
  padding-top: 8px;
}

.trend-container {
  width: 100%;
  height: 100%;
}
</style>
