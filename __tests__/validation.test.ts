import { describe, expect, it } from 'vitest'
import { validateEmail, validateUkPhone } from '@/app/lib/validation'

describe('validateEmail', () => {
  it('accepts ordinary addresses', () => {
    for (const email of ['jane@example.com', 'j.smith+quote@company.co.uk', "o'brien@firm.org"]) {
      expect(validateEmail(email)).toBe('')
    }
  })

  it('requires a value', () => {
    expect(validateEmail('')).toBe('Email address is required')
    expect(validateEmail('   ')).toBe('Email address is required')
  })

  it('rejects malformed addresses', () => {
    for (const email of ['jane', 'jane@', '@example.com', 'jane@example', 'jane @example.com', 'jane@@example.com']) {
      expect(validateEmail(email)).toBe('Please enter a valid email address')
    }
  })

  it('rejects the dot patterns that look valid but are not', () => {
    for (const email of ['.jane@example.com', 'jane.@example.com', 'ja..ne@example.com', 'jane@example..com']) {
      expect(validateEmail(email)).toBe('Please enter a valid email address')
    }
  })

  it('rejects a numeric-only top level domain', () => {
    expect(validateEmail('jane@example.123')).toBe('Please enter a valid email address')
  })

  it('turns away throwaway inboxes', () => {
    for (const email of ['a@mailinator.com', 'b@yopmail.com', 'c@guerrillamail.com', 'd@10minutemail.com']) {
      expect(validateEmail(email)).toBe('Please use a permanent email address so we can send your quote')
    }
  })

  it('catches a mistyped common provider and names the correction', () => {
    expect(validateEmail('jane@gmial.com')).toBe('Did you mean gmail.com?')
    expect(validateEmail('jane@hotmial.com')).toBe('Did you mean hotmail.com?')
  })

  it('ignores surrounding whitespace and case', () => {
    expect(validateEmail('  Jane@Example.COM  ')).toBe('')
  })
})

describe('validateUkPhone', () => {
  it('treats an empty value as acceptable because the field is optional', () => {
    expect(validateUkPhone('')).toBe('')
    expect(validateUkPhone('   ')).toBe('')
  })

  it('accepts UK mobiles in the formats people actually type', () => {
    for (const phone of ['07538724000', '+447538724000', '+44 7538 724000', '07538 724 000', '(07538) 724000']) {
      expect(validateUkPhone(phone)).toBe('')
    }
  })

  it('accepts UK landlines including the London area code', () => {
    for (const phone of ['02089418354', '020 8941 8354', '+442089418354', '01932 123456']) {
      expect(validateUkPhone(phone)).toBe('')
    }
  })

  it('rejects numbers that are too short or too long', () => {
    expect(validateUkPhone('0753872')).toBe('Please enter a valid UK phone number')
    expect(validateUkPhone('075387240001234')).toBe('Please enter a valid UK phone number')
  })

  it('rejects anything that is not a UK number', () => {
    for (const phone of ['+1 415 555 2671', '12345678901', 'not a phone']) {
      expect(validateUkPhone(phone)).toBe('Please enter a valid UK phone number')
    }
  })

  it('rejects filler like repeated or sequential digits', () => {
    for (const phone of ['00000000000', '07777777777', '01234567890']) {
      expect(validateUkPhone(phone)).toBe('Please enter a real phone number')
    }
  })
})
