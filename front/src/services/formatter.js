

export const timeFormatter = time => {
  const t = new Date(time)
  const min = t.getMinutes()
  const sec = t.getSeconds()

  const zeroed = x => x < 10 ? '0' + x : x

  return `${zeroed(min)}:${zeroed(sec)}`
}