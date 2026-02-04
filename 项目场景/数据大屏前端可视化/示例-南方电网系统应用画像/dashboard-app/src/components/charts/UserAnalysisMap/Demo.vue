<script setup lang="ts">
/**
 * 用户运营分析组件演示
 */

import { ref } from 'vue'
import { UserAnalysisMap } from './index'
import type { MapDataItem, TrendDataItem } from './types'

// 模拟地图数据 - 贵州省各市州
const mapData = ref<MapDataItem[]>([
  { name: '贵阳市', value: 123, percent: 12 },
  { name: '遵义市', value: 98, percent: 10 },
  { name: '六盘水市', value: 76, percent: 8 },
  { name: '安顺市', value: 65, percent: 7 },
  { name: '毕节市', value: 89, percent: 9 },
  { name: '铜仁市', value: 54, percent: 5 },
  { name: '黔西南布依族苗族自治州', value: 45, percent: 5 },
  { name: '黔东南苗族侗族自治州', value: 67, percent: 7 },
  { name: '黔南布依族苗族自治州', value: 58, percent: 6 }
])

// 模拟趋势数据 - 月活
const trendData = ref<TrendDataItem[]>([
  { month: '4月', value: 75 },
  { month: '5月', value: 82 },
  { month: '6月', value: 78 },
  { month: '7月', value: 55 },
  { month: '8月', value: 88 },
  { month: '9月', value: 72 },
  { month: '10月', value: 85 },
  { month: '11月', value: 90 },
  { month: '12月', value: 78 }
])

// 事件处理
const handleRegionClick = (data: MapDataItem) => {
  console.log('点击区域:', data)
  alert(`选中区域: ${data.name}\n影响用户数: ${data.value}\n占比: ${data.percent}%`)
}

const handleMoreClick = () => {
  console.log('点击更多')
  alert('查看更多用户运营分析数据')
}
</script>

<template>
  <div class="demo-container">
    <h2>用户运营分析组件演示</h2>
    
    <div class="demo-card">
      <UserAnalysisMap
        :map-data="mapData"
        :trend-data="trendData"
        map-name="贵州"
        :show-trend="true"
        :map-height-ratio="0.65"
        @region-click="handleRegionClick"
        @more-click="handleMoreClick"
      />
    </div>
    
    <div class="demo-info">
      <h3>组件说明</h3>
      <ul>
        <li>地图展示贵州省各市州数据分布</li>
        <li>颜色深浅表示数据量级</li>
        <li>鼠标悬停显示详细Tooltip</li>
        <li>点击区域触发事件</li>
        <li>下方折线图展示月活趋势</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.demo-container {
  padding: 20px;
  background: #0a1628;
  min-height: 100vh;
}

h2 {
  color: #fff;
  margin-bottom: 20px;
}

.demo-card {
  width: 382px;
  height: 280px;
}

.demo-info {
  margin-top: 30px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.demo-info h3 {
  color: #00d4ff;
  margin-bottom: 12px;
}

.demo-info ul {
  color: rgba(255, 255, 255, 0.8);
  padding-left: 20px;
}

.demo-info li {
  margin-bottom: 8px;
}
</style>
