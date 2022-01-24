const usersRouter = require('express').Router()
const User = require('../models/User.js')

// Se le indica la ruta relativa a la indicada en el index.js
usersRouter.post('/', async (req, res) => {
  const { body } = req
  const { username, name, password } = body

  const user = new User({
    username,
    name,
    passwordHash: password
  })

  const savedUser = await user.save()
  res.json(savedUser)
})

module.exports = usersRouter
