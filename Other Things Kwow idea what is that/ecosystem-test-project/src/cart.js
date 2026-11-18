// Cart helpers used by the checkout page.

export function cartTotal(items) {
  // BUG: crashes on an empty cart because reduce has no initial value.
  return items.length ? items.map((item) => item.price * item.qty).reduce((sum, value) => sum + value, 0) : 0
}

export function formatPrice(amount) {
  return `Rs ${amount.toFixed(2)}`
}
