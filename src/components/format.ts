import type { Availability } from '../lib/progress'

export function formatMinutes(m: number): string {
  if (m < 60) return `${m} min`
  const h = m / 60
  return Number.isInteger(h) ? `${h} h` : `${h.toFixed(1)} h`
}

export const DIFFICULTY_LABEL = { easy: 'Easy', medium: 'Medium', hard: 'Hard' } as const

export const AVAILABILITY_LABEL: Record<Availability, string> = {
  completed: 'Completed',
  in_progress: 'In progress',
  available: 'Available',
  locked: 'Locked',
}
