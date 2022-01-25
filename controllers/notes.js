const notesRouter = require('express').Router()
const Note = require('../models/Note.js')
const User = require('../models/User.js')
const userExtractor = require('../middleware/userExtractor')

notesRouter.get('/', async (req, res) => {
  const notes = await Note.find({}).populate('user', {
    username: 1,
    name: 1
  })
  res.json(notes)
})

notesRouter.get('/:id', userExtractor, async (req, res) => {
  const { id } = req.params

  try {
    const note = await Note.findById(id).populate('user', {
      username: 1,
      name: 1
    })
    res.json(note)
  } catch (e) {
    res.status(404).end()
    console.error(e)
  }
})

notesRouter.put('/:id', userExtractor, async (req, res, next) => {
  const { id } = req.params
  const note = req.body
  const newNoteInfo = {
    content: note.content,
    important: note.important
  }
  // El segundo parametro es la nueva nota actualizada
  // el tercer parametro indica si quieres que te devuelva el nuevo o el viejo (si no se indica es false)
  try {
    await Note.findByIdAndUpdate(id, newNoteInfo, { new: true })
    res.json(newNoteInfo)
    res.status(200).end()
  } catch (e) { next(e) }
})

notesRouter.delete('/:id', userExtractor, async (req, res, next) => {
  const { id } = req.params
  try {
    await Note.findByIdAndDelete(id)
    res.status(204).end()
  } catch (e) { next(e) }
  // De esta forma le indicamos que vaya al siguiente middleware que capture errores
})

// De segundo parametro le indicas que pase antes por el middleware que quieras
// en este caso, para recuperar el id de usuario a partir del jwt
notesRouter.post('/', userExtractor, async (req, res, next) => {
  const {
    content,
    important = false // Con esto le indicas el default y que sea opcional
  } = req.body

  // Sacar userid de request del middleware userExtractor
  const { userId } = req

  const user = await User.findById(userId)

  if (!content) {
    return res.status(400).json({
      error: 'required "content" field is missing'
    })
  }
  const newNote = new Note({
    content,
    date: new Date().toISOString(),
    important,
    user: user._id
  })

  try {
    const savedNote = await newNote.save()
    user.notes = user.notes.concat(savedNote._id)
    await user.save()

    res.status(201).json(newNote)
    // res.json(savedNote)
  } catch (e) { next(e) }
})

module.exports = notesRouter
