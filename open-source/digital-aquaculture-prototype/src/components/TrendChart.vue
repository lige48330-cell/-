<template>
  <!-- 图表容器：宽高由父容器控制 -->
  <div ref="chartRef" class="chart"></div>
</template>

<script setup lang="ts">
/**
 * 这是一个“标准实时监控图表组件”
 * 特点：
 * - 自己管理 ECharts 实例
 * - 自己生成模拟实时数据
 * - 不依赖页面逻辑（可复用）
 */

import { onMounted, onBeforeUnmount, ref } from 'vue'
import * as echarts from 'echarts'

/** DOM 引用，用来挂载 echarts */
const chartRef = ref<HTMLDivElement | null>(null)

/** echarts 实例 */
let chart: echarts.ECharts | null = null

/** 定时器（模拟实时数据） */
let timer: number | null = null

/** X 轴时间数据 */
const timeData: string[] = []

/** Y 轴溶解氧数据 */
const valueData: number[] = []

/**
 * 生成当前时间字符串（HH:mm:ss）
 */
function getTimeLabel() {
  const now = new Date()
  return now.toLocaleTimeString()
}

/**
 * 生成一个“合理的”溶解氧值
 * - 4 ~ 7 之间波动
 */
function generateValue() {
  return +(4 + Math.random() * 3).toFixed(2)
}

onMounted(() => {
  if (!chartRef.value) return

  /** 1️⃣ 初始化 echarts */
  chart = echarts.init(chartRef.value)

  /** 2️⃣ 初始化 6 个点作为起始数据 */
  for (let i = 0; i < 6; i++) {
    timeData.push(getTimeLabel())
    valueData.push(generateValue())
  }

  /** 3️⃣ 设置初始配置 */
  chart.setOption({
    title: {
      text: '溶解氧实时趋势',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: timeData
    },
    yAxis: {
      type: 'value',
      name: 'mg/L',
      min: 0,
      max: 10
    },
    series: [
      {
        name: '溶解氧',
        type: 'line',
        data: valueData,
        smooth: true
      }
    ]
  })

  /** 4️⃣ 启动定时器：每 2 秒推入一个新点 */
  timer = window.setInterval(() => {
    timeData.push(getTimeLabel())
    valueData.push(generateValue())

    /** 只保留最近 10 个点（模拟滚动窗口） */
    if (timeData.length > 10) {
      timeData.shift()
      valueData.shift()
    }

    /** 更新图表 */
    chart?.setOption({
      xAxis: {
        data: timeData
      },
      series: [
        {
          data: valueData
        }
      ]
    })
  }, 2000)

  /** 5️⃣ 监听窗口变化，让图表自适应 */
  window.addEventListener('resize', resizeChart)
})

/**
 * 图表 resize
 * 用于窗口变化 / 父容器尺寸变化
 */
function resizeChart() {
  chart?.resize()
}

onBeforeUnmount(() => {
  /** 清理定时器，防止内存泄漏 */
  if (timer) {
    clearInterval(timer)
    timer = null
  }

  /** 销毁 echarts 实例 */
  chart?.dispose()
  chart = null

  window.removeEventListener('resize', resizeChart)
})
</script>

<style scoped>
/**
 * 自动铺满父容器
 * 父容器高度由页面布局控制
 */
.chart {
  width: 100%;
  height: 100%;
  background:20px solid #050505;
  border-radius: 8px;
  box-shadow: 0 0 16px rgba(0, 0, 0, 0.1);

}
</style>
