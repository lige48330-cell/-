<template>
  <div class="device-timeline-wrapper">
    <!-- 时间刻度轴 -->
    <div class="time-scale">
      <div
        v-for="tick in timeTicks"
        :key="tick.time"
        class="time-tick"
        :style="{ left: tick.left + 'px' }"
      >
        {{ tick.label }}
      </div>
    </div>

    <!-- 设备时间轴 -->
    <div class="timeline-scroll">
      <div
        v-for="device in devices"
        :key="device.id"
        class="device-row"
      >
        <!-- 左侧设备名称 -->
        <div class="device-name">
          {{ device.name }}
        </div>

        <!-- 设备轨道 -->
        <div class="device-track">
          <div
            v-for="block in device.blocks"
            :key="block.id"
            class="device-block"
            :style="getBlockStyle(block)"
            :class="`source-${block.sourceDevice}`"
            @mouseenter="onHover(device.id, block)"
            @mouseleave="onLeave"
            @click="onClick(device.id, block)">
            <span class="block-text">
              {{ block.sourceName ||device.name }}

            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

/**
 * ===== 时间配置 =====
 */
const startTime = 8 * 60   // 08:00
const endTime = 10 * 60    // 10:00
const timelineWidth = 1200
const pxPerMinute = timelineWidth / (endTime - startTime)

/**
 * ===== mock 设备数据 =====
 */
const devices = ref([
  {
    id: 'A',
    name: '翻板A',
    blocks: [
      { id: 1, start: 480, end: 510 ,sourceDevice: 'F',sourceName: '桂F7535'},
      { id: 2, start: 545, end: 570,sourceDevice: 'B', sourceName: '桂B23464'},
      { id: 3, start: 570, end: 600, sourceDevice: 'C', sourceName: '桂C23552'},
    ]
  },
  {
    id: 'B',
    name: '翻板B',
    blocks: [
      { id: 1, start: 500, end: 560 ,sourceDevice: 'A',sourceName: '桂A12345'}
    ]
  },
  {
    id: 'C',
    name: '翻板C',
    blocks: [
      { id: 1, start: 480, end: 500 ,sourceDevice: 'J',sourceName: '桂J2346'},
      { id: 2, start: 520, end: 580 ,sourceDevice: 'U',sourceName: '桂U2353'}
    ]
  },
  {
  id: 'F',
  name: '翻板F',
  blocks: [  { id:  2,start: 520,end: 580,sourceDevice: 'H',sourceName: '桂A2353'}
    ]
  }
])

/**
 * ===== 时间刻度 =====
 */
const timeTicks = computed(() => {
  const ticks = []
  for (let t = startTime; t <= endTime; t += 30) {
    ticks.push({
      time: t,
      label: `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`,
      left: (t - startTime) * pxPerMinute
    })
  }
  return ticks
})

/**
 * ===== 样式计算 =====
 */
const getBlockStyle = (block) => {
  return {
    left: (block.start - startTime) * pxPerMinute + 'px',
    width: (block.end - block.start) * pxPerMinute + 'px'
  }
}

/**
 * ===== 事件联动 =====
 */
const emit = defineEmits(['hover', 'select'])

const onHover = (deviceId, block) => {
  emit('hover', {
    deviceId,
    time: block.start
  })
}

const onLeave = () => {
  emit('hover', null)
}

const onClick = (deviceId, block) => {
  emit('select', {
    deviceId,
    time: block.start
  })
}
</script>

<style scoped>
.device-timeline-wrapper {
  background: #fff;
  border: 1px solid #ccc;
  overflow-x: auto;
}

/* ===== 时间刻度轴 ===== */
.time-scale {
  position: relative;
  height: 32px;
  margin-left: 120px;
  border-bottom: 1px solid #ddd;
}

.time-tick {
  position: absolute;
  top: 6px;
  font-size: 12px;
  color: #666;
  transform: translateX(-50%);
}

/* ===== 设备行 ===== */
.timeline-scroll {
  min-width: 1200px;
}

.device-row {
  display: flex;
  height: 44px;
  border-bottom: 1px solid #eee;
}

/* 左侧设备名 */
.device-name {
  width: 120px;
  text-align: center;
  line-height: 44px;
  background: #f5f7fa;
  border-right: 1px solid #ddd;
  font-weight: 500;
}

/* 设备轨道 */
.device-track {
  position: relative;
  flex: 1;
}

/* 设备块 */
.device-block {
  position: absolute;
  top: 6px;
  height: 32px;
  background: #409eff;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #00000000;
}

/* 块内文字 */
.block-text {
  color: #fff;
  font-size: 12px;
  pointer-events: none;
}
.device-block.foreign {
  background: #57ff03 !important; /* 绿色，表示外部设备 */
border: 2px dashed #40ff00!important; /* 绿色边框 */
}
.source-A{
  background-color: #409eff; /* 蓝色 */
}

/* 设备 J */
.source-J {
  background-color: #67c23a; /* 绿色 */
}

/* 设备 U */
.source-U {
  background-color: #e6a23c; /* 橙色 */
}

/* 如果以后还有 */
.source-F {
  background-color: #f56c6c; /* 红色 */
  }
  .source-H {
  background-color: #e6ef43; /*  色 */
}
.source-B {
  background-color: #909399; /* 灰色 */
}
.source-C {
  background-color: #10a9cb; /* 清色 */
}
</style>
