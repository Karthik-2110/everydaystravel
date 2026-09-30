/**
 * Registration facts for the legal pages.
 *
 * These are the only things on those pages that cannot be read off the code,
 * so they live here rather than being guessed at in prose. Each one renders
 * only when it is filled in — an empty string simply drops the sentence, so
 * the published pages never carry a placeholder pretending to be a real
 * number.
 *
 * Worth completing, in rough order of how much they matter:
 *
 *  - `icoRegistration` — a business that processes personal data generally has
 *    to register with the ICO and pay the data protection fee. The number is
 *    publicly checkable and worth showing.
 *  - `companyNumber` — Companies House registration.
 *  - `operatorLicence` — the PSV Operator's Licence. Not required on a privacy
 *    notice, but it is the strongest checkable trust signal a coach operator
 *    has, and nothing on the site shows it yet.
 */

export const LEGAL_NAME = 'Everydays Travel Limited'

export const ICO_REGISTRATION = ''
export const COMPANY_NUMBER   = ''
export const OPERATOR_LICENCE = ''

/** The date the legal wording last changed — not the date of the last deploy. */
export const LEGAL_UPDATED = '30 September 2026'
