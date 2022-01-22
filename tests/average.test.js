const { average } = require('../utils/for_testing')

// El describe se utiliza para describir el contexto de un grupo de test
// y de esta forma hacerlo mas legible en consola
describe('average', () => {

  test('of one value is the value itself', () => {
    expect(average([1])).toBe(1)
  })

  test('of many is calculated correctly', () => {
    expect(average([1, 2, 3, 4, 5, 6])).toBe(3.5)
  })
  // El sentido de los tests es probar todos los casos y cubrir los
  // corner cases en tu función cuando peta 
  // test('of empty array is zero', () => {
  //   expect(average([])).toBe(0)
  // })
  test('of empty array is zero', () => {
    expect(average([])).toBe(0)
  })
})