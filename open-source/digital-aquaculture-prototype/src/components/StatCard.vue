<template>
  <div class="card">
    <div class="label">{{ label }}</div>
    <div class="value" :class="status">
      {{ value }} {{ unit }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  value: number | string
  unit?: string
  status?: 'normal' | 'warning' | 'danger'
}>()
</script>

<style scoped>
.card {
  width: 200px;
  padding: 16px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  margin-top: -10px;
}

.label {
  font-size: 14px;
  color: #888;
}

.value {
  margin-top: 4px;
  font-size: 24px;
  font-weight: bold;
}

.value.normal {
  color: #409eff;
}

.value.warning {
  color: #e6a23c;
}

.value.danger {
  color: #f56c6c;
}
</style>
