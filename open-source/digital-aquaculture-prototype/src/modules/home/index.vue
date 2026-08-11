<template>
  <div style="padding:0px">
    <div class="page-header">
    <h2 class="page-title">水质监控</h2>
    </div>
<div class="page">
    <!-- 告警组件 -->
     <div class="fixed-header">
    <AlarmBar
      :visible="alarmVisible"
      :message="`当前溶解氧偏低（${alarmValue} mg/L），请及时处理`"
    />
<ActionPanel
  :oxygen-loading="oxygenLoading"
  :feed-loading="feedLoading"
  :highlight-oxygen="isLowOxygen"
  :message="actionMessage"
  @oxygen="handleOxygen"
  @feed="handleFeed"
/>

</div>
    <div class="card-list">
      <StatCard
        v-for="item in stats"
        :key="item.key"
        :label="item.label"
        :value="item.value"
        :unit="item.unit"
        :status="item.status"
      />
</div>
    <!-- 中间区 -->

<div class="middle">
  <SceneView src= "/images/fish-pond.jpg" />
  <TrendChart />

</div>
<!-- 底部区 -->

<div class="bottom">
  <DataTable />
  <AlarmTable />
 </div>

</div>
</div>


</template>

<script setup lang="ts">
import SceneView from '../../components/SceneView.vue'
import TrendChart from '../../components/TrendChart.vue'
import DataTable from '../../components/DataTable.vue'
import AlarmTable from '../../components/AlarmTable.vue'
import { reactive, onMounted, onBeforeUnmount, computed } from 'vue'
import StatCard from '../../components/StatCard.vue'
import AlarmBar from '../../components/AlarmBar.vue'
import { ref } from 'vue'
import ActionPanel from '../../components/ActionPanel.vue'

const oxygenLoading = ref(false)
const feedLoading = ref(false)
const actionMessage = ref('')
const isLowOxygen = computed(() =>
  alarmVisible.value
)

function handleOxygen() {
  if (oxygenLoading.value) return

  oxygenLoading.value = true
  actionMessage.value = ''

  setTimeout(() => {
    const doItem = stats.find(item => item.key === 'do')
    if (doItem) {
      doItem.value = 6.5
      doItem.status = 'normal'
    }

    oxygenLoading.value = false
    actionMessage.value = '✅ 已执行自动增氧，溶解氧恢复正常'
  }, 1500)
}

function handleFeed() {
  if (feedLoading.value) return

  feedLoading.value = true
  actionMessage.value = ''

  setTimeout(() => {
    feedLoading.value = false
    actionMessage.value = '✅ 已执行自动投喂操作'
  }, 1500)
}
type Status = 'normal' | 'warning' | 'danger'

const stats = reactive([
  {
    key: 'do',
    label: '溶解氧',
    value: 5.2,
    unit: 'mg/L',
    status: 'danger' as Status
  },
  {
    key: 'ph',
    label: 'pH 值',
    value: 7.1,
    unit: '',
    status: 'normal' as Status
  },
  {
    key: 'temp',
    label: '水温',
    value: 26.4,
    unit: '℃',
    status: 'normal' as Status
  }
])

let timer: number

function refresh() {
  stats.forEach(item => {
    if (item.key === 'do') {
      item.value = +(4.5 + Math.random() * 2).toFixed(2)
      item.status =
        item.value < 5 ? 'danger' :
        item.value < 6 ? 'warning' : 'normal'
    }

    if (item.key === 'ph') {
      item.value = +(6.8 + Math.random() * 0.6).toFixed(2)
    }

    if (item.key === 'temp') {
      item.value = +(24 + Math.random() * 4).toFixed(1)
    }
  })
}

/* === 告警派生状态 === */
const alarmItem = computed(() =>
  stats.find(item => item.key === 'do')
)

const alarmVisible = computed(() =>
  alarmItem.value !== undefined && alarmItem.value.value < 5
)

const alarmValue = computed(() =>
  alarmItem.value?.value
)

onMounted(() => {
  timer = window.setInterval(refresh, 3000)
})

onBeforeUnmount(() => {
  clearInterval(timer)
})
</script>

<style scoped>
.card-list {
  display: flex;
  gap: 16px;

}
.middle {

  height: 240px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  min-height: 0px;
  padding-left: 13px;
  padding-right: 13px;

}
.bottom {

  min-height: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  height: 260px;
  padding-left: 13px;
  padding-right: 13px;
}
/* 内部网格只负责排列 */

.middle > *,.bottom > * {
  min-height: 0;
}
.page {
  display: flex;
  flex-direction: column;
  gap: 16px; /* ⬅️ 所有模块统一间距 */
  min-height: 0;
  gap: 16px;
}
.stats-panel,
.action-panel {
  flex-shrink: 0;
}
.fixed-header {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.page-title {
  margin-top: 0;        /* 往上靠 */
  margin-bottom: 0px;  /* 给下面留一点呼吸 */
  color: #000000;
  padding-left: 16px;
}
.page-header {
  background: linear-gradient(-270deg, #e2e8ea, #10a4d1);
  padding: 6px 0px;


}


</style>
