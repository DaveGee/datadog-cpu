

export const timeFormatter = time => {
  const t = new Date(time)
  const hours = t.getHours()
  const min = t.getMinutes()
  const sec = t.getSeconds()

  const zeroed = x => x < 10 ? '0' + x : x

  return `${hours}:${zeroed(min)}:${zeroed(sec)}`
}

export const cpuLoadFormatter = load => load.toFixed(2)