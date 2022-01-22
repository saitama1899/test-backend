// Para que eslint no se queje con jest, añadir en el package.json
// "eslintConfig": {
//   "env": {
//     "jest": true
//   }
// },

// Y añadir en el archivo eslintrc
// "overrides": [
//   {
//     "files": [
//       "**/*.test.js"
//     ],
//     "env": {
//       "jest": true // now **/*.test.js files' env has both es6 *and* jest
//     },
//     // Can't extend in overrides: https://github.com/eslint/eslint/issues/8813
//     // "extends": ["plugin:jest/recommended"]
//     "plugins": ["jest"],
//     "rules": {
//       "jest/no-disabled-tests": "warn",
//       "jest/no-focused-tests": "error",
//       "jest/no-identical-title": "error",
//       "jest/prefer-to-have-length": "warn",
//       "jest/valid-expect": "error"
//     }
//   }
// ]

// Para definir que estas usand jest en entorno backend en el package.json
// "jest": {
//     "testEnvironment": "node"
// }

// Para ejectuar los test hayque añadir el script en el packacge
// "test": "jest --verbose"

const { palindrome } = require('../utils/for_testing')

// Test unitarios
// https://jestjs.io/docs/expect para checkear las funciones disponibles
test('palindrome of eric', () => {
  const result = palindrome('eric')

  expect(result).toBe('cire')
})

test('palindrome of empty string', () => {
  const result = palindrome('')

  expect(result).toBe('')
})

test('palindrome of undefined', () => {
  const result = palindrome()

  expect(result).toBeUndefined()
})
