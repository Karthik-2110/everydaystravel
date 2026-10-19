import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CRM workspace | Everydays Travel',
  description: 'Redirect to the Everydays Travel CRM workspace.',
  robots: { index: false, follow: false },
}

export default function DashboardPage() {
  redirect('/crm')
}
