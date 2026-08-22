import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import EnquiryForm from '@/app/components/contact/EnquiryForm'
import React from 'react'

vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, initial, animate, exit, transition, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

function fillRequired() {
  fireEvent.change(screen.getByLabelText('First name'), { target: { value: 'Jane' } })
  fireEvent.change(screen.getByLabelText('Last name'), { target: { value: 'Smith' } })
  fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'jane@example.com' } })
  fireEvent.change(screen.getByLabelText('Phone'), { target: { value: '07000 000000' } })
  fireEvent.change(screen.getByLabelText('Type your enquiries here'), {
    target: { value: 'Need a 16 seater for a wedding in June.' },
  })
}

const submit = () => fireEvent.click(screen.getByRole('button', { name: /send enquiry/i }))

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({}) })))
})

describe('EnquiryForm', () => {
  it('links Get Quote through to the booking page', () => {
    render(<EnquiryForm />)
    expect(screen.getByRole('link', { name: /get quote/i })).toHaveAttribute('href', '/book')
  })

  it('blocks submit and shows errors when required fields are empty', async () => {
    render(<EnquiryForm />)
    submit()

    await waitFor(() => {
      expect(screen.getByText('First name is required')).toBeInTheDocument()
    })
    expect(screen.getByText('Email address is required')).toBeInTheDocument()
    expect(screen.getByText('Please tell us about your enquiry')).toBeInTheDocument()
    expect(globalThis.fetch).not.toHaveBeenCalled()
  })

  it('rejects a malformed email address', async () => {
    render(<EnquiryForm />)
    fillRequired()
    fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'nope' } })
    submit()

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument()
    })
    expect(globalThis.fetch).not.toHaveBeenCalled()
  })

  it('posts the enquiry and shows the confirmation panel', async () => {
    render(<EnquiryForm />)
    fillRequired()
    submit()

    await waitFor(() => expect(globalThis.fetch).toHaveBeenCalledTimes(1))

    const [url, init] = (globalThis.fetch as any).mock.calls[0]
    expect(url).toBe('/api/contact')
    expect(JSON.parse(init.body)).toEqual({
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      phone: '07000 000000',
      message: 'Need a 16 seater for a wedding in June.',
    })

    await waitFor(() => {
      expect(screen.getByText(/enquiry sent/i)).toBeInTheDocument()
    })
  })
})
