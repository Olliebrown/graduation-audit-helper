export function studentStatusComparator (v1, v2) {
  const A = (typeof v1 === 'string') ? v1 : v1.collapsed.toString()
  const B = (typeof v2 === 'string') ? v2 : v2.collapsed.toString()
  return A.localeCompare(B)
}
