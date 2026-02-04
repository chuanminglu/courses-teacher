<!--
  文件: DashboardLayout.vue
  用途: xx系统应用画像 - 数据大屏主布局组件
  作者: AI Generated
  日期: 2026-01-28
  说明: 基于精确提取的布局信息生成，采用CSS Grid实现4列不等宽布局
        布局规格来自 P00-布局信息提取结果-精确版.md
-->
<template>
  <div class="dashboard">
    <!-- 顶部导航栏 (55px) -->
    <header class="dashboard__header">
      <div class="header__left">
        <span class="header__logo">⚡</span>
        <span class="header__dept">开发者中心</span>
      </div>
      <div class="header__center">
        <h1 class="header__title">xx系统应用画像</h1>
      </div>
      <div class="header__right">
        <div class="header__search">
          <input type="text" placeholder="搜索" />
        </div>
        <div class="header__user">
          <span class="user__name">欧阳沐沐</span>
        </div>
        <div class="header__badge">24</div>
      </div>
    </header>

    <!-- 主内容区域 - 4列布局 (905px高度) -->
    <main class="dashboard__main">
      <!-- 第1列：系统概览列 (393px / 20.7%) -->
      <section class="dashboard__column dashboard__column--col1">
        <!-- 模块1: xxxxx系统概述 (180px) -->
        <div class="dashboard__block dashboard__block--system-overview">
          <div class="block__header">
            <span class="block__icon">📋</span>
            <span class="block__title">xxxxx系统概述</span>
          </div>
          <div class="block__content">
            <slot name="system-overview">
              <div class="block__placeholder">📋 系统概述卡片将在此处渲染</div>
            </slot>
          </div>
        </div>

        <!-- 模块2: 综合指标分析 (220px) -->
        <div class="dashboard__block dashboard__block--kpi-analysis">
          <div class="block__header">
            <span class="block__icon">📊</span>
            <span class="block__title">综合指标分析</span>
          </div>
          <div class="block__content">
            <slot name="kpi-analysis">
              <div class="block__placeholder">📊 综合指标仪表盘将在此处渲染</div>
            </slot>
          </div>
        </div>

        <!-- 模块3: 实时告警 (185px) -->
        <div class="dashboard__block dashboard__block--realtime-alerts">
          <div class="block__header">
            <span class="block__icon">🚨</span>
            <span class="block__title">实时告警</span>
          </div>
          <div class="block__content">
            <slot name="realtime-alerts">
              <div class="block__placeholder">🚨 实时告警列表将在此处渲染</div>
            </slot>
          </div>
        </div>

        <!-- 模块4: 作业工单 (剩余空间 ~240px) -->
        <div class="dashboard__block dashboard__block--work-orders">
          <div class="block__header">
            <span class="block__icon">📝</span>
            <span class="block__title">作业工单</span>
          </div>
          <div class="block__content">
            <slot name="work-orders">
              <div class="block__placeholder">📝 作业工单统计将在此处渲染</div>
            </slot>
          </div>
        </div>
      </section>

      <!-- 第2列：资源统计列 (564px / 29.7%) -->
      <section class="dashboard__column dashboard__column--col2">
        <!-- 模块5: 资源汇总 (200px) -->
        <div class="dashboard__block dashboard__block--resource-summary">
          <div class="block__header">
            <span class="block__icon">🖥️</span>
            <span class="block__title">资源汇总</span>
          </div>
          <div class="block__content">
            <slot name="resource-summary">
              <div class="block__placeholder">🖥️ 资源汇总环形图将在此处渲染</div>
            </slot>
          </div>
        </div>

        <!-- 模块6: 资源统计 (230px) -->
        <div class="dashboard__block dashboard__block--resource-stats">
          <div class="block__header">
            <span class="block__icon">📈</span>
            <span class="block__title">资源统计</span>
          </div>
          <div class="block__content">
            <slot name="resource-stats">
              <div class="block__placeholder">📈 资源统计折线图将在此处渲染</div>
            </slot>
          </div>
        </div>

        <!-- 模块7: 使用排行榜 (160px) - 无标题 -->
        <div class="dashboard__block dashboard__block--usage-ranking dashboard__block--no-header">
          <div class="block__content">
            <slot name="usage-ranking">
              <div class="block__placeholder">📊 磁盘/内存/CPU/网络使用排行榜</div>
            </slot>
          </div>
        </div>

        <!-- 模块8: 系统关联分析 (剩余空间 ~178px) -->
        <div class="dashboard__block dashboard__block--system-relation">
          <div class="block__header">
            <span class="block__icon">🔗</span>
            <span class="block__title">系统关联分析</span>
            <span class="block__action">更多</span>
          </div>
          <div class="block__content">
            <slot name="system-relation">
              <div class="block__placeholder">🔗 系统关联关系图将在此处渲染</div>
            </slot>
          </div>
        </div>
      </section>

      <!-- 第3列：应用分析列 (404px / 21.3%) -->
      <section class="dashboard__column dashboard__column--col3">
        <!-- 模块9: 运行状态分析 (150px) -->
        <div class="dashboard__block dashboard__block--running-status">
          <div class="block__header">
            <span class="block__icon">📉</span>
            <span class="block__title">运行状态分析</span>
          </div>
          <div class="block__content">
            <slot name="running-status">
              <div class="block__placeholder">📉 双轴折线图将在此处渲染</div>
            </slot>
          </div>
        </div>

        <!-- 模块10: 请求统计分析 (140px) -->
        <div class="dashboard__block dashboard__block--request-stats">
          <div class="block__header">
            <span class="block__icon">📊</span>
            <span class="block__title">请求统计分析</span>
          </div>
          <div class="block__content">
            <slot name="request-stats">
              <div class="block__placeholder">📊 请求统计折线图将在此处渲染</div>
            </slot>
          </div>
        </div>

        <!-- 模块11: 拨测情况统计 (200px) -->
        <div class="dashboard__block dashboard__block--dial-test">
          <div class="block__header">
            <span class="block__icon">🎯</span>
            <span class="block__title">拨测情况统计</span>
          </div>
          <div class="block__content">
            <slot name="dial-test">
              <div class="block__placeholder">🎯 拨测成功/失败饼图将在此处渲染</div>
            </slot>
          </div>
        </div>

        <!-- 模块12: 用户运营分析 (剩余空间 ~280px) -->
        <div class="dashboard__block dashboard__block--user-analysis">
          <div class="block__header">
            <span class="block__icon">👥</span>
            <span class="block__title">用户运营分析</span>
            <span class="block__action">更多</span>
          </div>
          <div class="block__content">
            <!-- 直接使用组件，不使用 slot -->
            <component 
              :is="userAnalysisComponent" 
              v-bind="userAnalysisProps"
              v-on="userAnalysisEvents"
              v-if="userAnalysisComponent" 
            />
            <div v-else class="block__placeholder">👥 用户运营柱状图+地图热力图</div>
          </div>
        </div>
      </section>

      <!-- 第4列：安全统计列 (374px / 19.7%) -->
      <section class="dashboard__column dashboard__column--col4">
        <!-- 模块13: 近24小时安全告警统计 (200px) -->
        <div class="dashboard__block dashboard__block--security-alerts">
          <div class="block__header">
            <span class="block__icon">🛡️</span>
            <span class="block__title">近 24 小时安全告警统计</span>
          </div>
          <div class="block__content">
            <slot name="security-alerts">
              <div class="block__placeholder">🛡️ 安全告警面积图将在此处渲染</div>
            </slot>
          </div>
        </div>

        <!-- 模块14: 漏洞统计 (250px) -->
        <div class="dashboard__block dashboard__block--vulnerabilities">
          <div class="block__header">
            <span class="block__icon">🐛</span>
            <span class="block__title">漏洞统计</span>
          </div>
          <div class="block__content">
            <slot name="vulnerabilities">
              <div class="block__placeholder">🐛 漏洞统计环形图+列表</div>
            </slot>
          </div>
        </div>

        <!-- 模块15: 缺陷统计 (剩余空间 ~260px) -->
        <div class="dashboard__block dashboard__block--defects">
          <div class="block__header">
            <span class="block__icon">⚠️</span>
            <span class="block__title">缺陷统计</span>
          </div>
          <div class="block__content">
            <slot name="defects">
              <div class="block__placeholder">⚠️ 缺陷统计环形图+列表</div>
            </slot>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
/**
 * DashboardLayout - xx系统应用画像主布局组件
 * 
 * 布局规格（基于精确提取 - P00-布局信息提取结果-精确版.md）：
 * 
 * 画布尺寸:
 * - 设计稿宽度: 1900px
 * - 设计稿高度: 960px
 * - 顶部导航高度: 55px
 * - 内容区高度: 905px
 * 
 * 四列布局:
 * - 第1列: 67px起始, 393px宽度, 20.7%占比
 * - 第2列: 506px起始, 564px宽度, 29.7%占比
 * - 第3列: 1100px起始, 404px宽度, 21.3%占比
 * - 第4列: 1534px起始, 374px宽度, 19.7%占比
 * 
 * 间距规范:
 * - 列间距: 30-46px
 * - 模块间距: 16-20px
 * - 内边距: 16px
 */

import type { LayoutConfig } from '@/types/layout'
import { shallowRef, ref, defineAsyncComponent } from 'vue'

// 动态引入用户运营分析组件
const userAnalysisComponent = shallowRef(defineAsyncComponent(() => 
  import('@/components/charts/UserAnalysisMap/UserAnalysisMap.vue')
))

// 模拟数据 (生产环境应从API获取)
const userAnalysisProps = ref({
  mapName: '贵州',
  showTrend: true,
  mapHeightRatio: 0.65,
  mapData: [
    { name: '贵阳市', value: 123, percent: 12 },
    { name: '遵义市', value: 98, percent: 10 },
    { name: '六盘水市', value: 76, percent: 8 },
    { name: '安顺市', value: 65, percent: 7 },
    { name: '毕节市', value: 89, percent: 9 },
    { name: '铜仁市', value: 54, percent: 5 },
    { name: '黔西南布依族苗族自治州', value: 45, percent: 5 },
    { name: '黔东南苗族侗族自治州', value: 67, percent: 7 },
    { name: '黔南布依族苗族自治州', value: 58, percent: 6 }
  ],
  trendData: [
    { month: '4月', value: 75 },
    { month: '5月', value: 82 },
    { month: '6月', value: 78 },
    { month: '7月', value: 55 },
    { month: '8月', value: 88 },
    { month: '9月', value: 72 },
    { month: '10月', value: 85 },
    { month: '11月', value: 90 },
    { month: '12月', value: 78 }
  ]
})

const userAnalysisEvents = {
  'region-click': (data: any) => console.log('点击区域:', data),
  'more-click': () => console.log('查看更多')
}

// 布局配置（精确值）
const layoutConfig: LayoutConfig = {
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

// 导出配置供子组件使用
defineExpose({ layoutConfig })
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.dashboard {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: var(--color-bg-primary);
  display: flex;
  flex-direction: column;

  // ==================== 顶部导航栏 ====================
  &__header {
    height: var(--header-height);
    min-height: var(--header-height);
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    padding: 0 var(--spacing-content);
    background: var(--color-bg-header);
    border-bottom: 1px solid var(--color-border);

    .header__left {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);

      .header__logo {
        font-size: 24px;
      }

      .header__dept {
        font-size: var(--font-size-md);
        color: var(--color-text-primary);
      }
    }

    .header__center {
      .header__title {
        font-size: var(--font-size-title);
        font-weight: var(--font-weight-medium);
        color: var(--color-text-primary);
        letter-spacing: 4px;
        text-shadow: 0 0 20px var(--color-primary-glow);
        white-space: nowrap;
      }
    }

    .header__right {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: var(--spacing-lg);

      .header__search {
        input {
          width: 120px;
          background: var(--color-bg-input);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          padding: 6px 12px;
          color: var(--color-text-primary);
          font-size: var(--font-size-sm);

          &::placeholder {
            color: var(--color-text-muted);
          }
        }
      }

      .header__user {
        .user__name {
          color: var(--color-text-primary);
          font-size: var(--font-size-md);
        }
      }

      .header__badge {
        background: var(--color-danger);
        color: #fff;
        font-size: var(--font-size-xs);
        padding: 2px 8px;
        border-radius: var(--radius-full);
      }
    }
  }

  // ==================== 主内容区域 ====================
  &__main {
    flex: 1;
    display: grid;
    // 精确的4列布局比例: 393:564:404:374 = 20.7%:29.7%:21.3%:19.7%
    grid-template-columns: 
      minmax(300px, 393fr)   /* 第1列: 20.7% - 系统概览 */
      minmax(450px, 564fr)   /* 第2列: 29.7% - 资源统计 */
      minmax(320px, 404fr)   /* 第3列: 21.3% - 应用分析 */
      minmax(290px, 374fr);  /* 第4列: 19.7% - 安全统计 */
    gap: var(--column-gap);
    padding: var(--spacing-md) var(--spacing-content);
    overflow: hidden;
  }

  // ==================== 列样式 ====================
  &__column {
    display: flex;
    flex-direction: column;
    gap: var(--module-gap);
    overflow: hidden;

    // 第1列：系统概览 - 模块高度分配
    &--col1 {
      .dashboard__block--system-overview { flex: 0 0 180px; }
      .dashboard__block--kpi-analysis { flex: 0 0 220px; }
      .dashboard__block--realtime-alerts { flex: 0 0 185px; }
      .dashboard__block--work-orders { flex: 1 1 auto; min-height: 200px; }
    }

    // 第2列：资源统计 - 模块高度分配
    &--col2 {
      .dashboard__block--resource-summary { flex: 0 0 200px; }
      .dashboard__block--resource-stats { flex: 0 0 230px; }
      .dashboard__block--usage-ranking { flex: 0 0 160px; }
      .dashboard__block--system-relation { flex: 1 1 auto; min-height: 170px; }
    }

    // 第3列：应用分析 - 模块高度分配
    &--col3 {
      .dashboard__block--running-status { flex: 0 0 150px; }
      .dashboard__block--request-stats { flex: 0 0 140px; }
      .dashboard__block--dial-test { flex: 0 0 200px; }
      .dashboard__block--user-analysis { flex: 1 1 auto; min-height: 250px; }
    }

    // 第4列：安全统计 - 模块高度分配
    &--col4 {
      .dashboard__block--security-alerts { flex: 0 0 200px; }
      .dashboard__block--vulnerabilities { flex: 0 0 250px; }
      .dashboard__block--defects { flex: 1 1 auto; min-height: 250px; }
    }
  }

  // ==================== 区块通用样式 ====================
  &__block {
    background: var(--color-bg-card);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-card);
    display: flex;
    flex-direction: column;
    overflow: hidden;

    // 区块头部
    .block__header {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-sm) var(--spacing-md);
      border-bottom: 1px solid var(--color-border-light);
      min-height: 36px;

      .block__icon {
        font-size: 14px;
        opacity: 0.8;
      }

      .block__title {
        flex: 1;
        font-size: var(--font-size-md);
        font-weight: var(--font-weight-medium);
        color: var(--color-text-primary);
        
        &::before {
          content: '';
          display: inline-block;
          width: 3px;
          height: 14px;
          background: var(--color-primary);
          margin-right: var(--spacing-sm);
          vertical-align: middle;
          border-radius: 2px;
        }
      }

      .block__action {
        font-size: var(--font-size-sm);
        color: var(--color-primary);
        cursor: pointer;
        
        &:hover {
          text-decoration: underline;
        }
      }
    }

    // 无头部的区块
    &--no-header {
      .block__content {
        padding-top: var(--spacing-md);
      }
    }

    // 区块内容
    .block__content {
      flex: 1;
      padding: var(--spacing-md);
      overflow: hidden;
    }

    // 占位符样式
    .block__placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: var(--color-text-muted);
      font-size: var(--font-size-sm);
      border: 2px dashed var(--color-border);
      border-radius: var(--radius-sm);
      background: var(--color-bg-placeholder);
    }
  }
}

// ==================== 响应式适配 ====================

// 2K屏幕 (2560px)
@media screen and (min-width: 2560px) {
  .dashboard {
    font-size: clamp(14px, 0.8vw, 18px);
    
    &__main {
      gap: calc(var(--column-gap) * 1.5);
    }
  }
}

// 1600px 以下
@media screen and (max-width: 1600px) {
  .dashboard__main {
    grid-template-columns: 
      minmax(250px, 1fr)
      minmax(350px, 1.5fr)
      minmax(280px, 1fr)
      minmax(250px, 1fr);
  }
}

// 1366px 以下 - 2列布局
@media screen and (max-width: 1366px) {
  .dashboard__main {
    grid-template-columns: repeat(2, 1fr);
    overflow-y: auto;
  }

  .dashboard__column {
    max-height: none;
    
    &--col1,
    &--col2,
    &--col3,
    &--col4 {
      .dashboard__block {
        flex: none !important;
        height: auto;
        min-height: 200px;
      }
    }
  }
}

// 768px 以下 - 单列布局
@media screen and (max-width: 768px) {
  .dashboard__main {
    grid-template-columns: 1fr;
  }
}
</style>
