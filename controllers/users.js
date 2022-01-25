const usersRouter = require('express').Router()
const User = require('../models/User.js')
const bcrypt = require('bcrypt')

// Se le indica la ruta relativa a la indicada en el index.js
usersRouter.post('/', async (req, res) => {
  const { body } = req
  const { username, name, password } = body

  // Coste de computación del hash
  const saltRounds = 10
  // Creamos la encriptacion
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash
  })
  try {
    const savedUser = await user.save()
    res.status(201).json(savedUser)
  } catch (e) { res.status(400).json(e) }
})

usersRouter.get('/', async (req, res) => {
  try {
    // El populate se utiliza para agregar los datos de otra colección
    // El segundo parametro le indicas que no quieres recibir el id del usuario de cada nota, ya que ya lo tienes
    const users = await User.find({}).populate('notes', {
      content: 1,
      date: 1
    })
    res.json(users)
  } catch (e) { console.error(e) }
})
module.exports = usersRouter
