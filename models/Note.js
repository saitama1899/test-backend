const { Schema, model } = require('mongoose')

// Crear un esquema para el modelo definiendo tipos. Id no hace falta porque mongodb lo genera
const noteSchema = new Schema({
  content: String,
  date: Date,
  important: Boolean
})

// Con esto modificamos los campos que devolverá la DB para mostrarlos modificados u ocultar algunos
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

// crear  Modelo
const Note = model('Note', noteSchema)

module.exports = Note
