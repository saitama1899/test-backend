const User = require('../models/User')
const bcrypt = require('bcrypt')
const { api, getAllUsers } = require('./helpers/helpers')
const mongoose = require('mongoose')
const { server } = require ('../index.js')

// Para evitar que jest de problemas con los puertos, hay que indicar en el 
// package.json que no ejecute en paralelo todos los archivos de testing

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('password', 10)
  const user = new User({username: 'erictest', passwordHash})
  
  await user.save()
})

describe('creating a new user', () => {
  test('works as expecting creating a fresh username', async () => {
    const users = await getAllUsers()
    
    const newUser = {
      username: 'testuser',
      name: 'Eric',
      password: 'Tw1tch'
    }

    await api 
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    const usersAfter = await getAllUsers()
    expect(usersAfter).toHaveLength(users.length + 1)

    const usernames = usersAfter.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username is already taken', async () => {
    const users = await getAllUsers()
    const newUser = {
      username: 'erictest',
      name: 'Manuel',
      password: 'fdfdfff'
    }
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.errors.username.message).toContain('`username` to be unique')
    const usersAfter = await getAllUsers()
    expect(usersAfter).toHaveLength(users.length)
  })
})

// Hay que cerrar el servidor una vez ejecutados los tests
afterAll((done) => {
  mongoose.connection.close(() => done())
  server.close()
})