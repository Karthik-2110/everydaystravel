import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import ChristmasQuoteForm from '@/app/christmas/ChristmasQuoteForm'
import { todayISO } from '@/app/components/form-fields'

vi.mock('@/app/components/HumanVerification', () => ({
  default: () => null,
  useHumanVerification: () => ({ token: 'test-token', setToken: vi.fn(), resetKey: 0, reset: vi.fn() }),
}))

afterEach(() => {
  vi.unstubAllGlobals()
  window.history.replaceState(null, '', '/')
})

it('submits a Christmas quote with the ad attribution and confirms receipt', async () => {
  window.history.replaceState(null, '', '/christmas?utm_source=facebook&utm_medium=paid_social&utm_campaign=christmas&utm_content=party_video')
  const fetchQuote = vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 200 }))
  vi.stubGlobal('fetch', fetchQuote)
  render(<ChristmasQuoteForm />)

  for (const [label, value] of Object.entries({
    'Pickup location': 'Richmond',
    'Party venue': 'Central London',
    'Passenger count': '24',
    'Full name': 'Ada Lovelace',
    Email: 'ada@example.com',
    Phone: '07538 724000',
  })) {
    fireEvent.change(screen.getByLabelText(label, { exact: false }), { target: { value } })
  }
  fireEvent.click(screen.getByRole('button', { name: 'Travel date' }))
  fireEvent.click(screen.getByRole('button', { name: /today/i }))
  fireEvent.click(screen.getByRole('button', { name: 'Pickup time' }))
  fireEvent.click(screen.getByRole('button', { name: '6 hours' }))
  fireEvent.click(screen.getByRole('button', { name: '0 minutes' }))
  fireEvent.click(screen.getByRole('button', { name: 'PM' }))
  fireEvent.click(screen.getByRole('button', { name: 'Apply' }))
  const source = screen.getByRole('combobox', { name: 'How did you hear about us?' })
  expect(source).toBeRequired()
  fireEvent.change(source, { target: { value: 'Facebook' } })
  fireEvent.click(screen.getByRole('button', { name: 'Request my quote' }))

  expect(await screen.findByRole('heading', { name: 'Quote request received' })).toBeVisible()
  const [url, options] = fetchQuote.mock.calls[0]
  expect(url).toBe('/api/quote')
  expect(JSON.parse(String(options?.body))).toMatchObject({
    eventType: 'Christmas party or dinner',
    landingPage: '/christmas',
    passengers: '24',
    travelDate: todayISO(),
    pickupTime: '18:00',
    referralSource: 'Facebook',
    utm_source: 'facebook',
    utm_medium: 'paid_social',
    utm_campaign: 'christmas',
    utm_content: 'party_video',
  })
})
