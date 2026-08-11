<template>
  <div v-if="visible" class="alarm">
    ⚠️ {{ message }}
  </div>
</template>

<script setup lang="ts">
defineProps<{
  visible: boolean
  message: string
}>()
</script>

<style scoped>
.alarm {
  margin-bottom: 0px;
  padding: 12px ;
  background: #fef0f0;
  color: #f56c6c;
  border-radius: 6px;
  font-size: 14px;
}
</style>
