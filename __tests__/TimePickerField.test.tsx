import { useState } from 'react'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import TimePickerField from '@/app/components/TimePickerField'

function Controlled({ initial = '', onChange }: { initial?: string; onChange?: (v: string) => void }) {
  const [value, setValue] = useState(initial)
  return (
    <TimePickerField
      id="t"
      value={value}
      onChange={(v) => { setValue(v); onChange?.(v) }}
    />
  )
}

// The trigger reads 'Select time' when empty and '6:30 AM' once set, so it is
// addressed by id rather than by name.
const openPanel = () => fireEvent.click(document.getElementById('t') as HTMLElement)
const panel = () => within(screen.getByRole('dialog'))

const tap = (name: string | RegExp) => fireEvent.click(panel().getByRole('button', { name }))

describe('TimePickerField', () => {
  it('prompts for a time until one is chosen', () => {
    render(<Controlled />)
    expect(screen.getByRole('button', { name: /select time/i })).toBeInTheDocument()
  })

  // The form stores 24-hour values; only the display is ever 12-hour.
  it.each([
    ['09:30', '9:30 AM'],
    ['19:45', '7:45 PM'],
    ['00:15', '12:15 AM'],
    ['12:00', '12:00 PM'],
  ])('shows %s as %s', (stored, shown) => {
    render(<Controlled initial={stored} />)
    // The trigger is named for the field it fills, so the value is read off it.
    expect(document.getElementById('t')).toHaveTextContent(shown)
  })

  it('heads the panel with the field it is filling', () => {
    render(
      <TimePickerField id="t" title="Return time" value="" onChange={() => {}} />,
    )
    fireEvent.click(document.getElementById('t') as HTMLElement)
    expect(screen.getByRole('dialog')).toHaveTextContent('Return time')
  })

  it('falls back to a generic title when the field is not named', () => {
    render(<Controlled />)
    openPanel()
    expect(screen.getByRole('dialog')).toHaveTextContent('Select time')
  })

  it('opens on the hour dial', () => {
    render(<Controlled />)
    openPanel()
    expect(panel().getByRole('button', { name: '7 hours' })).toBeInTheDocument()
    expect(panel().queryByRole('button', { name: '35 minutes' })).not.toBeInTheDocument()
  })

  it('moves to the minute dial once an hour is picked', () => {
    render(<Controlled />)
    openPanel()
    tap('7 hours')
    expect(panel().getByRole('button', { name: '35 minutes' })).toBeInTheDocument()
    expect(panel().queryByRole('button', { name: '7 hours' })).not.toBeInTheDocument()
  })

  // Nothing reaches the form until Apply — that is what Cancel is for.
  it('holds the choice back until Apply', () => {
    const onChange = vi.fn()
    render(<Controlled onChange={onChange} />)
    openPanel()

    tap('7 hours')
    tap('45 minutes')
    tap('PM')
    expect(onChange).not.toHaveBeenCalled()

    tap(/apply/i)
    expect(onChange).toHaveBeenCalledWith('19:45')
  })

  it('leaves the value alone on Cancel', () => {
    const onChange = vi.fn()
    render(<Controlled initial="09:30" onChange={onChange} />)
    openPanel()

    tap('7 hours')
    tap(/cancel/i)

    expect(onChange).not.toHaveBeenCalled()
    expect(document.getElementById('t')).toHaveTextContent('9:30 AM')
  })

  it('maps the 12 AM and 12 PM hours onto the right end of the day', () => {
    const onChange = vi.fn()
    render(<Controlled initial="06:30" onChange={onChange} />)

    openPanel()
    tap('12 hours')
    tap(/apply/i)
    expect(onChange).toHaveBeenLastCalledWith('00:30')

    openPanel()
    tap('PM')
    tap(/apply/i)
    expect(onChange).toHaveBeenLastCalledWith('12:30')
  })

  it('reopens on the time already chosen rather than a fresh draft', () => {
    render(<Controlled initial="19:45" />)
    openPanel()
    expect(panel().getByRole('button', { name: 'Hour' })).toHaveTextContent('07')
    expect(panel().getByRole('button', { name: 'Minutes' })).toHaveTextContent('45')
    expect(panel().getByRole('button', { name: 'PM' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('switches dials from the hour and minute readouts', () => {
    render(<Controlled initial="09:30" />)
    openPanel()

    tap('Minutes')
    expect(panel().getByRole('button', { name: '35 minutes' })).toBeInTheDocument()

    tap('Hour')
    expect(panel().getByRole('button', { name: '7 hours' })).toBeInTheDocument()
  })

  it('steps minutes in fives', () => {
    render(<Controlled />)
    openPanel()
    tap('Minutes')
    for (const m of ['00', '05', '30', '55']) {
      expect(panel().getByRole('button', { name: `${Number(m)} minutes` })).toBeInTheDocument()
    }
    expect(panel().queryByRole('button', { name: '7 minutes' })).not.toBeInTheDocument()
  })
})
