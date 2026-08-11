/**
 * 根据查询时间生成设备时间块
 * @param {string} startTime '08:00'
 * @param {string} endTime '18:00'
 */
export function mockDeviceTimeline(startTime, endTime) {
  const startHour = Number(startTime.split(':')[0])
  const endHour = Number(endTime.split(':')[0])

  const devices = [
    { id: 'A', name: '设备A' },
    { id: 'B', name: '设备B' },
    { id: 'C', name: '设备C' }
  ]

  return devices.map((device) => {
    const blocks = []

    for (let i = 0; i < 3; i++) {
      const s = startHour * 60 + Math.floor(Math.random() * 120)
      const e = s + 30 + Math.floor(Math.random() * 60)

      blocks.push({
        id: `${device.id}-${i}`,
        start: s,
        end: Math.min(e, endHour * 60),
        sourceDevice: i === 1 ? 'F' : device.id,
        sourceName: i === 1 ? '设备F' : device.name
      })
    }

    return {
      ...device,
      blocks
    }
  })
}
