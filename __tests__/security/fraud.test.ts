import { checkFraud } from '@/lib/security/fraud'

const makeItem = (quantity: number, price: number) => ({
  quantity,
  product: { name: 'Test Tee', price },
})

describe('checkFraud', () => {
  it('passes clean order', () => {
    const result = checkFraud([makeItem(2, 39)], 78)
    expect(result.flagged).toBe(false)
  })

  it('flags quantity > 10', () => {
    const result = checkFraud([makeItem(11, 39)], 429)
    expect(result.flagged).toBe(true)
    expect(result.reason).toContain('Quantity 11')
  })

  it('flags total > 2000', () => {
    const result = checkFraud([makeItem(1, 2001)], 2001)
    expect(result.flagged).toBe(true)
    expect(result.reason).toContain('fraud threshold')
  })
})
