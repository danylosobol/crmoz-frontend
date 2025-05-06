import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function normalizeLaravelErrors(errors) {
  const result = []

  Object.entries(errors).forEach(([key, messages]) => {
    const label = key.replace(/(?:\w+\.)?(\d+)(?:\.\w+)?/, (_, number) => `field #${+number + 1}`)

    messages.forEach((msg) => {
      let clean = msg.replace(key, label)

      if (!label.includes('field') && /\bfield\b/i.test(clean)) {
        clean = clean.replace(/\bfield\b/i, '')
      }

      clean = clean.replace(/\s+/g, ' ').trim()
      result.push(clean)
    })
  })

  return result
}
