import { checkoutSchema } from '@/lib/schemas/checkout'

describe('checkoutSchema', () => {
  const valid = {
    full_name: 'John Doe',
    email: 'john@example.com',
    line1: '123 Street Lane',
    city: 'London',
    postcode: 'SW1A 1AA',
    country: 'GB',
  }

  it('accepts valid input', () => {
    expect(() => checkoutSchema.parse(valid)).not.toThrow()
  })

  it('rejects invalid email', () => {
    expect(() => checkoutSchema.parse({ ...valid, email: 'notanemail' })).toThrow()
  })

  it('rejects country code longer than 2 chars', () => {
    expect(() => checkoutSchema.parse({ ...valid, country: 'GBR' })).toThrow()
  })

  it('rejects short full_name', () => {
    expect(() => checkoutSchema.parse({ ...valid, full_name: 'A' })).toThrow()
  })
})
