export const formatDate = (iso8601Date: Date | string): string => {
  const toFormat = typeof iso8601Date === "string" ? new Date(iso8601Date) : iso8601Date
  const isToday = new Date().toDateString() === toFormat.toDateString()

  return toFormat.toLocaleString("en-US", {
    minute: "numeric",
    hour: "numeric",
    month: !isToday ? "long" : undefined,
    day: !isToday ? "numeric" : undefined,
  })
}
