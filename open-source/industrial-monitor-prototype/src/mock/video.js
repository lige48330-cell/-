/**
 * 定时抽帧（如每 5 分钟）
 */
export function mockVideoFrames(startTime, endTime, interval = 5) {
  const start = Number(startTime.split(':')[0]) * 60
  const end = Number(endTime.split(':')[0]) * 60

  const frames = []

  for (let t = start; t <= end; t += interval) {
    frames.push({
      time: `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`,
      img: 'https://via.placeholder.com/120x68?text=Frame'
    })
  }

  return frames
}
