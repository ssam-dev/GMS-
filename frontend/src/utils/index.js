import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function createPageUrl(pageName) {
  const routes = {
    Dashboard: '/dashboard',
    Members: '/members',
    Trainers: '/trainers',
    Equipment: '/equipment',
  }
  return routes[pageName] || '/'
}
