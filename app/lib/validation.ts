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

  // A local part that is nothing but a keyboard run is not an inbox anyone
  // reads. Only the local part is judged — the domain has already been vetted.
  if (looksLikeMashing(email.slice(0, email.lastIndexOf('@')))) {
    return 'Please enter a valid email address'
  }

  return ''
}

/**
 * Rows of a QWERTY keyboard, forwards and backwards. What someone types when
 * they want past a required field without giving a real answer.
 */
const KEYBOARD_RUNS = [
  'qwertyuiop', 'asdfghjkl', 'zxcvbnm',
  'poiuytrewq', 'lkjhgfdsa', 'mnbvcxz',
]

/**
 * True when a string looks typed rather than meant.
 *
 * Deliberately narrow: it only fires when the *whole* string is a keyboard
 * run or a single repeated character. Matching a run anywhere inside would
 * reject real names — "Flaherty", "Doherty" and "Rafferty" all contain
 * "erty". Non-Latin scripts reduce to an empty string here and are left
 * alone rather than guessed at.
 */
export function looksLikeMashing(value: string): boolean {
  const letters = value.toLowerCase().replace(/[^a-z\u00C0-\u024F]/g, '')
  if (letters.length < 3) return false

  // One key held down, or the same letter four or more times in a row.
  if (new Set(letters).size === 1) return true
  if (/(.)\1{3,}/.test(letters)) return true

  // The whole string lifted off one row — "asdf", "qwerty", "zxcvb".
  if (KEYBOARD_RUNS.some((row) => row.includes(letters))) return true

  // That same short run typed over and over — "asdfasdf", "fgfgfg".
  const repeated = letters.match(/^(.{2,6})\1+$/)
  if (repeated && KEYBOARD_RUNS.some((row) => row.includes(repeated[1]))) return true

  return false
}

/** Strings people type into a phone field when they do not want to give one. */
const SEQUENTIAL_RUNS = ['0123456789', '1234567890', '9876543210']

/**
 * Optional field. Anything present has to look like a real phone number, but
 * not a British one — enquiries arrive from tour operators and travellers
 * abroad, so a number is accepted whichever country it belongs to.
 */
export function validatePhone(value: string): string {
  if (!value.trim()) return ''

  const invalid = 'Please enter a valid phone number'
  const cleaned = value.replace(/[\s()\-.]/g, '')
  if (!/^\+?\d+$/.test(cleaned)) return invalid

  // Drop whatever routes the call — a leading +, an international 00 prefix,
  // or a national trunk 0 — leaving the digits that identify the subscriber.
  const significant = cleaned.replace(/^\+/, '').replace(/^00/, '').replace(/^0/, '')

  // E.164 caps a full international number at 15 digits, and below 7 there is
  // not enough left for one.
  if (significant.length < 7 || significant.length > 15) return invalid

  // Two distinct digits cannot spell a real number of this length; a genuine
  // one draws on far more of the keypad than that.
  const tooFewDigits = new Set(significant).size < 3
  const isSequential = SEQUENTIAL_RUNS.some((run) => significant.includes(run))
  if (tooFewDigits || isSequential) return 'Please enter a real phone number'

  return ''
}

/** Placeholders people type instead of a name. */
const FILLER_NAMES = new Set([
  'abc', 'abcd', 'anon', 'anonymous', 'blah', 'customer', 'dummy', 'fake',
  'first last', 'firstname', 'foo', 'foobar', 'guest', 'john doe', 'jane doe',
  'lastname', 'me', 'na', 'n/a', 'name', 'no name', 'none', 'nobody', 'null',
  'sample', 'test', 'test test', 'testing', 'tester', 'unknown', 'user', 'xyz',
])

/** Latin vowels, accents included. `y` counts — Welsh and Slavic names lean on it. */
const VOWELS = /[aeiouyàáâãäåæèéêëìíîïòóôõöøùúûüýÿ]/i

/**
 * Names vary far more than form validation usually allows — a single word,
 * apostrophes, hyphens and non-Latin scripts are all ordinary. So the format
 * itself is barely policed; what gets rejected is input that is plainly not a
 * name at all: placeholders, keyboard runs, digits, consonant soup.
 */
export function validateFullName(value: string): string {
  const name = value.trim().replace(/\s+/g, ' ')
  if (!name) return 'Full name is required'

  const notAName = 'Please enter your full name'
  if (/\d/.test(name)) return notAName
  if (FILLER_NAMES.has(name.toLowerCase())) return notAName
  if (looksLikeMashing(name)) return notAName

  const letters = name.replace(/[^\p{L}]/gu, '')
  if (letters.length < 2) return notAName

  // Consonant soup — but only judged on Latin script, since a name written in
  // Han, Arabic or Cyrillic characters has no Latin vowel to find.
  const latinOnly = /^[\p{Script=Latin}\s'’.-]+$/u.test(name)
  if (latinOnly && letters.length >= 4 && !VOWELS.test(letters)) return notAName

  return ''
}
