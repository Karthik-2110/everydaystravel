// Company contact facts, in one place so the contact page and the map strip
// can never drift apart.

export const ADDRESS = 'The Reeves, Snakey Lane, Feltham TW13 7NB'

export const PHONE         = '020 8941 8354'
export const PHONE_HREF    = 'tel:02089418354'
export const EMAIL         = 'info@everydaystravel.co.uk'
export const EMAIL_HREF    = `mailto:${EMAIL}`

export const CONTACT_LINES: {
  icon:  'phone' | 'mail' | 'clock'
  label: string
  href?: string
}[] = [
  { icon: 'phone', label: PHONE,                          href: PHONE_HREF },
  { icon: 'mail',  label: EMAIL,                          href: EMAIL_HREF },
  { icon: 'clock', label: 'Mon – Fri: 7:00 AM – 7:00 PM' },
  { icon: 'clock', label: 'Sat & Sun: 8:00 AM – 4:00 PM' },
]
