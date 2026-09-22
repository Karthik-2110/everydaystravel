/**
 * Quote-form validation.
 *
 * This catches malformed and throwaway input, which is most of the junk a
 * public form attracts. It cannot tell you whether a well-formed address is
 * real — only a confirmation email or a verification service does that.
 */

/**
 * Local part allows the printable characters RFC 5322 does, but no leading,
 * trailing or doubled dots. Domain needs at least one dot and an alphabetic
 * TLD, which rules out `user@localhost` and `user@example.123`.
 */
const EMAIL_PATTERN =
  /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/

/** Inboxes that expire, so a quote sent there is never read. */
const DISPOSABLE_DOMAINS = new Set([
  '10minutemail.com',
  'dispostable.com',
  'fakeinbox.com',
  'getnada.com',
  'guerrillamail.com',
  'mailinator.com',
  'maildrop.cc',
  'sharklasers.com',
  'temp-mail.org',
  'tempmail.com',
  'throwawaymail.com',
  'trashmail.com',
  'yopmail.com',
])

/** Near-misses on the big providers, which are almost always a slip. */
const DOMAIN_TYPOS: Record<string, string> = {
  'gmai.com': 'gmail.com',
  'gmial.com': 'gmail.com',
  'gmail.co': 'gmail.com',
  'gnail.com': 'gmail.com',
  'hotmai.com': 'hotmail.com',
  'hotmial.com': 'hotmail.com',
  'hotmail.co': 'hotmail.com',
  'outlok.com': 'outlook.com',
  'outloook.com': 'outlook.com',
  'yahooo.com': 'yahoo.com',
  'yaho.com': 'yahoo.com',
  'iclould.com': 'icloud.com',
  'icloud.co': 'icloud.com',
}

export function validateEmail(value: string): string {
  const email = value.trim()
  if (!email) return 'Email address is required'
  if (!EMAIL_PATTERN.test(email)) return 'Please enter a valid email address'

  const domain = email.slice(email.lastIndexOf('@') + 1).toLowerCase()
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return 'Please use a permanent email address so we can send your quote'
  }
  if (DOMAIN_TYPOS[domain]) return `Did you mean ${DOMAIN_TYPOS[domain]}?`

  return ''
}

/** Strings people type into a phone field when they do not want to give one. */
const SEQUENTIAL_RUNS = ['0123456789', '1234567890', '9876543210']

/**
 * Reduces the ways a UK number gets typed to a single national form starting
 * with 0, or returns null when it is not a UK number at all.
 */
function toNationalDigits(value: string): string | null {
  const cleaned = value.replace(/[\s()\-.]/g, '')
  if (!/^\+?\d+$/.test(cleaned)) return null

  if (cleaned.startsWith('+44')) return `0${cleaned.slice(3)}`
  if (cleaned.startsWith('0044')) return `0${cleaned.slice(4)}`
  if (cleaned.startsWith('+')) return null // some other country
  if (cleaned.startsWith('0')) return cleaned

  return null
}

/** Optional field — an empty value passes, anything present must be a real UK number. */
export function validateUkPhone(value: string): string {
  if (!value.trim()) return ''

  const national = toNationalDigits(value)
  const invalid = 'Please enter a valid UK phone number'
  if (!national) return invalid
  // UK national numbers are 10 or 11 digits with the trunk 0.
  if (national.length < 10 || national.length > 11) return invalid

  const subscriber = national.slice(1)
  const allSameDigit = new Set(subscriber).size === 1
  const isSequential = SEQUENTIAL_RUNS.some((run) => national.includes(run))
  if (allSameDigit || isSequential) return 'Please enter a real phone number'

  return ''
}
