import { format, formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

export const formatPrice = (amount, currency = 'XOF') =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency }).format(amount)

export const formatDate = (date, pattern = 'dd MMMM yyyy') =>
  format(new Date(date), pattern, { locale: fr })

export const formatRelative = (date) =>
  formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr })

export const formatDateTime = (date) =>
  format(new Date(date), "dd/MM/yyyy 'à' HH:mm", { locale: fr })

export const truncate = (text, max = 100) =>
  text?.length > max ? text.slice(0, max) + '…' : text
