<template>
  <div class="table-box">
    <h3 class="title">水质采样记录</h3>

    <table>
      <thead>
        <tr>
          <th>时间</th>
          <th>溶解氧 (mg/L)</th>
          <th>水温 (℃)</th>
          <th>pH</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="item in tableData" :key="item.time">
          <td>{{ item.time }}</td>
          <td :class="{ danger: item.do < 5 }">
            {{ item.do }}
          </td>
          <td>{{ item.temp }}</td>
          <td>{{ item.ph }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
/**
 * 实时数据表组件
 * - 独立生成模拟数据
 * - 定时追加记录
 * - 超出条数自动滚动
 */

import { onMounted, onBeforeUnmount, ref } from 'vue'

/** 单条记录类型 */
interface TableRow {
  time: string
  do: number
  temp: number
  ph: number
}

/** 表格数据源 */
const tableData = ref<TableRow[]>([])

/** 定时器 */
let timer: number | null = null

/**
 * 生成当前时间
 */
function getTimeLabel() {
  return new Date().toLocaleTimeString()
}

/**
 * 生成一条“水质采样记录”
 */
function generateRow(): TableRow {
  return {
    time: getTimeLabel(),
    do: +(4 + Math.random() * 3).toFixed(2),
    temp: +(20 + Math.random() * 5).toFixed(1),
    ph: +(6.8 + Math.random() * 0.6).toFixed(2)
  }
}

onMounted(() => {
  /** 初始化 5 条数据 */
  for (let i = 0; i < 5; i++) {
    tableData.value.unshift(generateRow())
  }

  /** 每 2 秒追加一条 */
  timer = window.setInterval(() => {
    tableData.value.unshift(generateRow())

    /** 只保留最近 10 条 */
    if (tableData.value.length > 10) {
      tableData.value.pop()
    }
  }, 2000)
})

onBeforeUnmount(() => {
  /** 清理定时器 */
  if (timer) {
    clearInterval(timer)
    timer = null
  }
})
</script>

<style scoped>
.table-box {
  height: 100%;
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  overflow: auto;
}

.title {
  margin-bottom: 12px;
  font-size: 14px;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

th,
td {
  padding: 8px;
  border-bottom: 1px solid #ebeef5;
  text-align: center;
}

th {
  background: #f5f7fa;
  font-weight: normal;
}

.danger {
  color: #f56c6c;
  font-weight: bold;
}
</style>
