<template>
  <div class="layout">
    <Sidebar />
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from './Sidebar.vue'
</script>

<style scoped>
.layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
  padding-top: 0px;

}

.content {
  flex: 1;
  padding: 0px;
  background: #f5f7fa;
  overflow: hidden;
  min-width: 0;
  min-height: 0;
}
</style>
