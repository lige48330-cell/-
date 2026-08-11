<script setup lang="ts">
interface StatItem {
  label: string
  value: number | string
  unit: string
  status: 'normal' | 'warning' | 'danger'
}

const stats: StatItem[] = [
  { label: '水温', value: 26.5, unit: '℃', status: 'normal' },
  { label: 'pH', value: 7.2, unit: '', status: 'normal' },
  { label: '溶解氧', value: 4.1, unit: 'mg/L', status: 'warning' },
  { label: '氨氮', value: 0.18, unit: 'mg/L', status: 'normal' },
  { label: '亚硝酸盐', value: 0.06, unit: 'mg/L', status: 'normal' },
  { label: '浊度', value: 12, unit: 'NTU', status: 'normal' },
  { label: '盐度', value: 3.2, unit: '‰', status: 'normal' },
  { label: '电导率', value: 520, unit: 'μS/cm', status: 'normal' },
  { label: 'ORP', value: 210, unit: 'mV', status: 'normal' }
]
</script>
<template>
  <div class="stat-grid">
    <StatCard
      v-for="item in stats"
      :key="item.label"
      :label="item.label"
      :value="item.value"
      :unit="item.unit"
      :status="item.status"
    />
  </div>
<template>
  <div class="alarm-row">
    <AlarmMessage />
    <AutoActionButton />
  </div>

  <SampleTable />
</template>

</template>
<style scoped>
.stat-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
.alarm-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

</style>
