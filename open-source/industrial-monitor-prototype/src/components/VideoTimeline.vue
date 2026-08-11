
<template>
  <el-card class="card">
    <div class="video-timeline">
      <!-- 视频关键帧时间轴 -->
      <div
        v-for="(frame, index) in frames"
        :key="frame.time"
        class="frame"
        @mouseenter="onHover(frame.time)"
        @click="onClick(frame)"
      >
        <img :src="frame.img" alt="视频帧" />
        <div class="time">{{ frame.time }}</div>
      </div>
    </div>
  </el-card>
</template>

<script setup>
import { ref, computed } from 'vue'

// 模拟的视频关键帧数据
const frames = ref([])

// 生成时间区间内的视频帧数据
const generateFrames = () => {
  const times = ['08:00', '08:05', '08:10', '08:15', '08:20', '08:25', '08:30', '08:35', '08:40', '08:45', '08:50', '08:55', '09:00',]
  return times.map((time) => ({
    time,
    img: 'https://haowallpaper.com/link/common/file/previewFileImg/16925419774594432' + time // 使用占位图
  }))
}

// 初始化视频帧
frames.value = generateFrames()

// Hover 事件
const onHover = (time) => {
  console.log('Hovered over frame at time:', time)
  // 在这里实现联动功能
}

// Click 事件
const onClick = (frame) => {
  console.log('Clicked on frame:', frame)
  // 处理点击事件，例如跳转到该视频的具体时间或触发其他操作
}
</script>

<style scoped>
.card {
  width: 100%;
}

.video-timeline {
  display: flex;
  gap: 40px; /* 每个视频帧之间的间距 */
  overflow-x: auto;
}

.frame {
  text-align: center;
  cursor: pointer;
}

.frame img {
  width: 120px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.frame .time {
  margin-top: 8px;
  font-size: 12px;
  color: #555;
}

.frame:hover {
  opacity: 0.8;
}
</style>
