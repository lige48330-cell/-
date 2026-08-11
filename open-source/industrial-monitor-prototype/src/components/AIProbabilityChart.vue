<template>
  <el-card class="card" :body-style="{ padding: '0' }">
    <!--标题-->
    <div class="chart-title">  AI概率分析  </div>
    <!--图表-->
    <div class="card-body">
      <div ref="chartRef" class="chart"></div>
    </div>
  </el-card>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, defineExpose } from 'vue'
import * as echarts from 'echarts'

const chartRef = ref(null)
let chartInstance = null

const timeList = [
  '08:00','08:05','08:10','08:15','08:20','08:25',
  '08:30','08:35','08:40','08:45','08:50','08:55','09:00'
]

const probabilityList = timeList.map(() =>
  Math.floor(Math.random() * 100)
)

const initChart = () => {
  chartInstance = echarts.init(chartRef.value)

  chartInstance.setOption({
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: 40,
      right: 20,
      top: 30,
      bottom: 30
    },
    xAxis: {
      type: 'category',
      data: timeList
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      axisLabel: {
        formatter: '{value}%'
      }
    },
    series: [
      {
        type: 'line',
        data: probabilityList,
        smooth: true,
        areaStyle: {}
      }
    ]
  })
}

const resizeChart = () => {
  chartInstance?.resize()
}

onMounted(() => {
  initChart()
  window.addEventListener('resize', resizeChart)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeChart)
  chartInstance?.dispose()
})

/**
 * ===== 对外暴露：时间联动 =====
 */
const highlightByTime = (time) => {
  const index = timeList.indexOf(time)
  if (index === -1 || !chartInstance) return

  chartInstance.dispatchAction({
    type: 'showTip',
    seriesIndex: 0,
    dataIndex: index
  })
}

defineExpose({
  highlightByTime
})
</script>

<style scoped>
.card {
  width: 100%;
  height: 100%;
}

.card-body {
  width: 100%;
  height: 100%;
}

.chart {
  width: 100%;
  height: 100%;
  min-height: 300px;
}
.chart-title {
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  border-bottom: 1px solid #ebeef5;
  background: #f5f7fa;
}
</style>
