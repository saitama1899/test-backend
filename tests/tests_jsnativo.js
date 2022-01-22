const suma = (a, b) => {
  return a - b
}

const checks = [
  { a: 0, b: 0, result: 0 },
  { a: 1, b: 3, result: 4 },
  { a: -3, b: 3, result: 0 }
]

checks.forEach(check => {
  // Con esta linea sacas los datos del objeto en variables individuales
  const { a, b, result } = check
  // El console assert comprueba si el primer parametro da true
  // y te devuelve un error en caso de false
  console.assert(
    suma(a, b) === result,
    `Suma of ${a} and ${b} expected to be ${result}`
  )
})
