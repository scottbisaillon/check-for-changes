import {expect, test} from '@jest/globals'

// Dummy test for now
test('throws invalid number', async () => {
  const input = parseInt('10', 10)
  expect(input).toEqual(10)
})
