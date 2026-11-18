import test from "node:test"
import assert from "node:assert/strict"
import { cartTotal, formatPrice } from "../src/cart.js"

test("total of two items", () => {
  assert.equal(cartTotal([{ price: 10, qty: 2 }, { price: 5, qty: 1 }]), 25)
})

test("total of empty cart", () => {
  assert.equal(cartTotal([]), 0)
})

test("formats a price", () => {
  assert.equal(formatPrice(25), "Rs 25.00")
})
