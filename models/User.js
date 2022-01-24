const { Schema, model } = require('mongoose')

// Crear un esquema para el modelo definiendo tipos. Id no hace falta porque mongodb lo genera
const userSchema = new Schema({
  username: String,
  name: String,
  passwordHash: String,
  notes: [{
    type: Schema.Types.ObjectId,
    ref: 'Note'
  }]
})

// Con esto modificamos los campos que devolverá la DB para mostrarlos modificados u ocultar algunos
userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v

    delete returnedObject.passwordHash
  }
})

// crear  Modelo
const User = model('User', userSchema)

module.exports = User
