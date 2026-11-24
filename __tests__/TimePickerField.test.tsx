import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import TimePickerField from '@/app/components/TimePickerField'

describe('TimePickerField', () => {
  it.each([
    ['12', 'AM', '00:30'],
    ['12', 'PM', '12:30'],
    ['7', 'PM', '19:30'],
  ])('applies %s:30 %s as %s', (hour, period, expected) => {
    const onChange = vi.fn()
    render(<TimePickerField id="pickup" title="Pickup time" value="" onChange={onChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'Pickup time' }))
    for (const [label, value] of [['Hour', hour], ['Minute', '30'], ['AM/PM', period]]) {
      fireEvent.click(screen.getByRole('combobox', { name: label }))
      fireEvent.click(screen.getByRole('option', { name: value }))
      expect(screen.getByRole('dialog')).toBeVisible()
    }
    expect(onChange).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }))
    expect(onChange).toHaveBeenCalledWith(expected)
  })

  it('saves the draft and closes when clicking outside', async () => {
    const onChange = vi.fn()
    render(<TimePickerField id="pickup" value="14:07" onChange={onChange} />)
    fireEvent.click(screen.getByRole('button'))
    fireEvent.click(screen.getByRole('combobox', { name: 'Hour' }))
    fireEvent.click(screen.getByRole('option', { name: '3' }))
    await new Promise(resolve => setTimeout(resolve, 0))
    fireEvent.pointerDown(document.body, { pointerType: 'mouse' })
    expect(onChange).toHaveBeenCalledWith('15:07')
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('opens on the stored time including off-interval minutes', () => {
    render(<TimePickerField id="return" title="Return time" value="14:07" onChange={() => {}} />)
    fireEvent.click(screen.getByRole('button', { name: 'Return time, 2:07 PM' }))
    expect(screen.getByLabelText('Hour')).toHaveTextContent('2')
    expect(screen.getByLabelText('Minute')).toHaveTextContent('07')
    expect(screen.getByLabelText('AM/PM')).toHaveTextContent('PM')
  })
})
