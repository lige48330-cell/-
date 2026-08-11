<template>
  <div class="sidebar">
    <h3 class="title">
    <img src="/icons/logo.png" class="title-icon" />
    数字渔业系统
    </h3>

      <nav class="menu">
      <router-link
        v-for="item in menuList"
        :key="item.path"
        :to="item.path"
        class="menu-item"
        active-class="active"
      >
        <img :src="item.icon" class="menu-icon" />
        <span>{{ item.title }}</span>
      </router-link>
    </nav>
  </div>
</template>
<script setup lang="ts">
const menuList = [
  {
    title: '系统首页',
    path: '/home',
    icon: '/icons/home.png'
  },

 {

    title: '水质监控',
    path: '/water-quality',
    icon: '/icons/water.png'
  },
  {
    title: '气象监控',
    path: '/weather',
    icon: '/icons/weather.png'
  },
  {
    title: '设备管理',
    path: '/device',
    icon: '/icons/device.png'
  },
  {
    title: '视频监控',
    path: '/video',
    icon: '/icons/video.png'
  },
  {
    title: '养殖数据',
    path: '/farming-data',
    icon: '/icons/data.png'
  },
  {
    title: '报表分析',
    path: '/report',
    icon: '/icons/report.png'
  },
]

</script>

<style scoped>
.sidebar {
  width: 200px;
  height: 100vh;
  background-color: #1c466e;
  display: flex;
  flex-direction: column;

}
.title {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  margin-top:0px ;
  color: #34607c;
  font-size: 19px;
  background-color: #7cc3d3;



}

.title-icon {
  width: 20px;
  height: 20px;
}

.menu {
  display: flex;
  flex-direction: column;
}

.menu-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  color: #fff;
  text-decoration: none;
  transition: background-color 0.3s ;
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
}

.menu-item.active {
  background: rgba(22, 119, 255, 0.4);
  color: #fff;
}

.menu-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  opacity: 0.8;
}
.menu-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 3px;
  height: 100%;
  background-color: #1677ff;
}
.menu-item.active .menu-icon {
  opacity: 1;
}
</style>
