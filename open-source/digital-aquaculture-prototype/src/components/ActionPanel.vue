<template>
  <div class="action-panel">
    <div class="actions">
      <button
        class="action-btn"
        :class="{ primary: highlightOxygen }"
        :disabled="oxygenLoading"
        @click="$emit('oxygen')"
      >
        {{ oxygenLoading
          ? '增氧中...'
          : highlightOxygen
            ? '建议执行增氧'
            : '自动增氧'
        }}
      </button>

      <button
        class="action-btn"
        :disabled="feedLoading"
        @click="$emit('feed')"
      >
        {{ feedLoading ? '投喂中...' : '自动投喂' }}
      </button>

      <!-- 状态提示：与按钮同一行 -->
      <span v-if="message" class="action-msg">
        {{ message }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  oxygenLoading: boolean
  feedLoading: boolean
  highlightOxygen: boolean
  message: string
}>()

defineEmits<{
  (e: 'oxygen'): void
  (e: 'feed'): void
}>()
</script>

<style scoped>
  .action-panel {
  /* 操作区：不参与压缩 */
  flex-shrink: 0;
  margin-bottom: 16px;
}
.actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.action-btn {
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid #dcdfe6;
  background: #fff;
  cursor: pointer;
  font-size: 14px;
  white-space: nowrap;
}

.action-btn.primary {
  background: #f56c6c;
  border-color: #f56c6c;
  color: #fff;
}

.action-msg {
  margin-top: 12px;
  color: #67c23a;
  font-size: 14px;
}
</style>
