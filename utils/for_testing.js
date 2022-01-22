// Metodos de apoyo para le testing

const palindrome = (string) => {
  if (typeof string === 'undefined') return
  return string
    .split('')
    .reverse()
    .join('')
}

const average = (nums) => {
  if (nums.length === 0) return 0
  let sum = 0
  nums.forEach(num => { sum += num })
  return sum / nums.length
}

module.exports = {
  palindrome,
  average
}
