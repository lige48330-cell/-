<template>
  <el-card class="card">
    <el-form :inline="true" :model="query">
      <!-- 日期选择 -->
      <el-form-item label="日期">
        <el-date-picker v-model="query.date" type="date" placeholder="选择日期" />
      </el-form-item>

      <!-- 开始时间选择 -->
      <el-form-item label="开始时间">
        <el-time-picker v-model="query.startTime" format="HH:mm" placeholder="选择开始时间" />
      </el-form-item>

      <!-- 结束时间选择 -->
      <el-form-item label="结束时间">
        <el-time-picker v-model="query.endTime" format="HH:mm" placeholder="选择结束时间" />
      </el-form-item>

      <!-- 查询按钮 -->
      <el-form-item>
        <el-button type="primary" @click="onSearch">时间查询</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import { ref } from 'vue'

// ① 声明 emit
const emit = defineEmits(['query'])

// ② 查询条件
const query = ref({
  date: '',
  startTime: '',
  endTime: ''
})

// ③ 查询按钮
const onSearch = () => {
  console.log('查询条件:', query.value)

  // ⭐ 关键：把查询条件抛给父组件
  emit('query', {
    date: query.value.date,
    startTime: query.value.startTime,
    endTime: query.value.endTime
  })
}
</script>

<style scoped>
.card {
  width: 100%;
}
</style>
