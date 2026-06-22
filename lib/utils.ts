export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatShortDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export const TRANSACTION_CATEGORIES = [
  'Housing',
  'Food & Dining',
  'Transport',
  'Shopping',
  'Health & Fitness',
  'Entertainment',
  'Self Care',
  'Travel',
  'Education',
  'Savings',
  'Business',
  'Other',
]

export const CATEGORY_COLORS: Record<string, string> = {
  Housing: '#E8899A',
  'Food & Dining': '#C4607A',
  Transport: '#B8904A',
  Shopping: '#A8C8F0',
  'Health & Fitness': '#88C8A4',
  Entertainment: '#B09AE0',
  'Self Care': '#F0C070',
  Travel: '#80B8D8',
  Education: '#90C890',
  Savings: '#5AAA80',
  Business: '#9E445C',
  Other: '#A8A5B8',
}

export const CATEGORY_EMOJIS: Record<string, string> = {
  Housing: '🏠',
  'Food & Dining': '🍽️',
  Transport: '🚗',
  Shopping: '🛍️',
  'Health & Fitness': '💪',
  Entertainment: '🎭',
  'Self Care': '💅',
  Travel: '✈️',
  Education: '📚',
  Savings: '💰',
  Business: '💼',
  Other: '📦',
}
