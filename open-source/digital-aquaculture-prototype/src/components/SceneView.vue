<template>
  <div class="scene">场景图 / 监控画面
  <img
    :src="src"
    alt="养殖区域监控画面"
    class="scene-img"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  /** 图片地址（本地 / 网络） */
  src: string
}>()
</script>
<style scoped>
.scene {
  height: 100%;
  width: 100%;
  background: #000;
  border-radius: 8px;
  overflow: hidden;

  display: flex;
  align-items: center;
  justify-content: center;
}

.scene-img {
  width: 1200px;
  height: 500px;
  object-fit: cover; /* 关键：铺满但不变形 */
}

</style>
