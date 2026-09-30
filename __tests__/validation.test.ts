import { describe, expect, it } from 'vitest'
import { validateEmail, validatePhone, validateFullName } from '@/app/lib/validation'

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

describe('validatePhone', () => {
  it('treats an empty value as acceptable because the field is optional', () => {
    expect(validatePhone('')).toBe('')
    expect(validatePhone('   ')).toBe('')
  })

  it('accepts UK mobiles in the formats people actually type', () => {
    for (const phone of ['07538724000', '+447538724000', '+44 7538 724000', '07538 724 000', '(07538) 724000']) {
      expect(validatePhone(phone)).toBe('')
    }
  })

  it('accepts UK landlines including the London area code', () => {
    for (const phone of ['02089418354', '020 8941 8354', '+442089418354', '01932 123456']) {
      expect(validatePhone(phone)).toBe('')
    }
  })

  it('accepts numbers from outside the UK, with or without a country code', () => {
    for (const phone of [
      '+1 415 555 2671',    // US
      '96774 34707',        // India, no country code
      '+91 96774 34707',    // the same number dialled internationally
      '0033 1 42 68 53 00', // France via the 00 international prefix
      '+61 2 9374 4000',    // Australia
    ]) {
      expect(validatePhone(phone)).toBe('')
    }
  })

  it('rejects numbers that are too short or too long for E.164', () => {
    expect(validatePhone('0753872')).toBe('Please enter a valid phone number')
    expect(validatePhone('07538724000123456')).toBe('Please enter a valid phone number')
  })

  it('rejects anything that is not a number at all', () => {
    for (const phone of ['not a phone', '+44 7538 ABCDEF', '@@@@@@@@@@']) {
      expect(validatePhone(phone)).toBe('Please enter a valid phone number')
    }
  })

  it('rejects filler like repeated or sequential digits', () => {
    for (const phone of ['00000000000', '07777777777', '01234567890', '12345678901']) {
      expect(validatePhone(phone)).toBe('Please enter a real phone number')
    }
  })
})

describe('validateFullName', () => {
  it('requires a value', () => {
    expect(validateFullName('')).toBe('Full name is required')
    expect(validateFullName('   ')).toBe('Full name is required')
  })

  it('accepts the many shapes a real name takes', () => {
    for (const name of [
      'Karthik',
      'Jane Smith',
      "Siobhán O'Connor",
      'Anne-Marie Dupont',
      'Ng Wei Ming',
      'Flaherty',          // contains "erty" — a keyboard run, but a real surname
      'Doherty',
      'Rafferty',
      'Krzysztof Wójcik',
      '李伟',               // no Latin vowel to look for
      'Нина Иванова',
    ]) {
      expect(validateFullName(name)).toBe('')
    }
  })

  it('rejects keyboard runs and held-down keys', () => {
    for (const name of ['asdf', 'qwerty', 'zxcvb', 'asdfasdf', 'aaaa', 'jjjjjj', 'hjkl']) {
      expect(validateFullName(name)).toBe('Please enter your full name')
    }
  })

  it('rejects placeholders people type to get past the field', () => {
    for (const name of ['test', 'Test Test', 'n/a', 'none', 'unknown', 'John Doe', 'xyz', 'dummy']) {
      expect(validateFullName(name)).toBe('Please enter your full name')
    }
  })

  it('rejects digits and consonant soup', () => {
    expect(validateFullName('User123')).toBe('Please enter your full name')
    expect(validateFullName('bcdfg')).toBe('Please enter your full name')
    expect(validateFullName('K')).toBe('Please enter your full name')
  })
})

describe('validateEmail — gibberish local parts', () => {
  it('rejects a local part that is only a keyboard run', () => {
    for (const email of ['asdf@gmail.com', 'qwerty@outlook.com', 'aaaa@company.co.uk']) {
      expect(validateEmail(email)).toBe('Please enter a valid email address')
    }
  })

  it('still accepts short or consonant-heavy real addresses', () => {
    for (const email of ['jsmth@company.com', 'hr@company.com', 'k.p@example.org']) {
      expect(validateEmail(email)).toBe('')
    }
  })
})
