import { act, render, screen } from '@testing-library/react'
import { useEffect } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import HumanVerification from '@/app/components/HumanVerification'

vi.mock('next/script', () => ({
  default: function ScriptMock({ onReady }: { onReady: () => void }) {
    useEffect(() => { onReady() }, [onReady])
    return null
  },
}))

const renderWidget = vi.fn(() => 'widget-id')
const remove = vi.fn()
beforeEach(() => {
  vi.stubEnv('NEXT_PUBLIC_TURNSTILE_SITE_KEY', 'public-test-key')
  renderWidget.mockClear(); remove.mockClear()
  window.turnstile = { render: renderWidget, remove }
})
afterEach(() => { delete window.turnstile; vi.unstubAllEnvs() })
const options = () => (renderWidget.mock.calls as unknown as [HTMLElement, Record<string, (value?: string) => void>][])[0][1]

describe('HumanVerification', () => {
  it('does not load a widget without configuration and offers a contact option', () => {
    vi.stubEnv('NEXT_PUBLIC_TURNSTILE_SITE_KEY', '')
    render(<HumanVerification action="quote" onVerify={vi.fn()} resetKey={0} />)
    expect(screen.getByRole('status')).toHaveTextContent('If urgent, call 020 8941 8354.')
    expect(screen.queryByText(/verification is currently unavailable/i)).not.toBeInTheDocument()
    expect(renderWidget).not.toHaveBeenCalled()
    expect(screen.getByRole('link', { name: /call 020/i })).toHaveAttribute('href', 'tel:02089418354')
  })
  it('passes a verified token to the form and clears it when expired', () => {
    const onVerify = vi.fn()
    render(<HumanVerification action="quote" onVerify={onVerify} resetKey={0} />)
    expect(renderWidget).toHaveBeenCalledWith(expect.any(HTMLElement), expect.objectContaining({ action: 'quote', size: 'flexible' }))
    act(() => options().callback('fresh-token'))
    expect(onVerify).toHaveBeenLastCalledWith('fresh-token')
    act(() => options()['expired-callback']())
    expect(onVerify).toHaveBeenLastCalledWith('')
  })
  it('clears a failed challenge and exposes recovery instructions', () => {
    const onVerify = vi.fn()
    render(<HumanVerification action="contact" onVerify={onVerify} resetKey={0} />)
    act(() => options()['error-callback']())
    expect(onVerify).toHaveBeenLastCalledWith('')
    expect(screen.getByRole('alert')).toHaveTextContent(/verification could not load/i)
  })
  it('replaces the used widget when a submission is retried and cleans up on navigation', () => {
    const onVerify = vi.fn()
    const view = render(<HumanVerification action="quote" onVerify={onVerify} resetKey={0} />)
    view.rerender(<HumanVerification action="quote" onVerify={onVerify} resetKey={1} />)
    expect(remove).toHaveBeenCalledWith('widget-id')
    expect(renderWidget).toHaveBeenCalledTimes(2)
    view.unmount()
    expect(remove).toHaveBeenCalledTimes(2)
    expect(onVerify).toHaveBeenLastCalledWith('')
  })
})
