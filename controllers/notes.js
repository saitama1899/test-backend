const notesRouter = require('express').Router()
const Note = require('../models/Note.js')

notesRouter.get('/', async (req, res) => {
  const notes = await Note.find({})
  res.json(notes)
})

notesRouter.get('/:id', async (req, res) => {
  const { id } = req.params

  try {
    const note = await Note.findById(id)
    res.json(note)
  } catch (e) {
    res.status(404).end()
    console.error(e)
  }
})

notesRouter.put('/:id', async (req, res, next) => {
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

notesRouter.delete('/:id', async (req, res, next) => {
  const { id } = req.params
  try {
    await Note.findByIdAndDelete(id)
    res.status(204).end()
  } catch (e) { next(e) }
  // De esta forma le indicamos que vaya al siguiente middleware que capture errores
})

notesRouter.post('/', async (req, res, next) => {
  const note = req.body

  if (!note || !note.content) {
    return res.status(400).json({
      error: 'note content is missing'
    })
  }
  const newNote = new Note({
    content: note.content,
    date: new Date().toISOString(),
    important: typeof note.important !== 'undefined' ? note.important : false
    // Con esto le indicas el default y que sea opcional
  })

  try {
    const savedNote = await newNote.save()
    res.status(201).json(newNote)
    res.json(savedNote)
  } catch (e) { next(e) }
})

module.exports = notesRouter
