const mongoose = require('mongoose')

const Note = require('../models/Note')

const { server } = require ('../index.js')

// De esta forma el test no se ejecuta correctamente, ya que hay que ejecutarlo
// de forma asincrona. Hay que esperar a que termine la ejecución de la peticion para 
// poder realizar el test
// test('notes are returned as json', () => {
//   api
//     .get('/api/notes')
//     .expect(200)
//     .expect('Content-Type', /application\/json/)
// })

// Es conveniente configurar en el package el modo --silent para el jest y evitar ruido en consola

const {api, notes, getAllContentFromNotes} = require('./helpers/helpers')

// Abrir la conexión para ejecutar los tests en la BD
beforeAll((done) => {
  const connectionString = process.env.MONGO_DB_URI_TEST
  const connectionOptions = {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
  }

  mongoose
    .connect(connectionString, connectionOptions, () => done())
})

// Antes de cada test...
beforeEach(async () => {
  await Note.deleteMany({})

  // Ejecución en paralelo | no es la mejor opcion ya que no controlas
  // el orden en el que se insertan en la colección (una puede terminar antes que la otra)
  // const notesObjects = notes.map(note => new Note(note))
  // const promises = notesObjects.map(note => note.save())
  // await Promise.all(promises)
  
  // Ejecución secuencial | respetan el orden en el que se van a guardar
  for (const note of notes) {
    const notesObject = new Note(note)
    await notesObject.save()
  } 
})

describe('GET Notes', () => {

  test('notes are returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  // Los tests tienen que ser predecibles y siempre dar el resultado esperado
  test('there are three notes', async () => {
    const { response } = await getAllContentFromNotes()
    expect(response.body).toHaveLength(notes.length)
  })

  test('some note is about HTML', async () => {
    const { contents } = await getAllContentFromNotes()
    expect(contents).toContain('HTML is easy')
  })
}) 

describe('POST Notes', () => {

  test('a valid note can be added', async () => {
    const newNote = {
      content: 'Esto es una nota de testing',
      important: true
    }
    await api
      .post('/api/notes')
      .send(newNote)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const { contents, response } = await getAllContentFromNotes()
    expect(response.body).toHaveLength(notes.length + 1)
    expect(contents).toContain(newNote.content)
  })  

  test('note without content is not added', async () => {
    const newNote = {
      important: true
    }
    await api
      .post('/api/notes')
      .send(newNote)
      .expect(400)
  
    const { response } = await getAllContentFromNotes()
    expect(response.body).toHaveLength(notes.length)
  })
})

describe('DELETE Notes', () => {

  test('a note can be deleted', async () => {
    const { response: firstResponse } = await getAllContentFromNotes()
    const { body: notes } = firstResponse

    await api
      .delete(`/api/notes/${notes[0].id}`)
      .expect(204)

    const { contents, response: secondResponse } = await getAllContentFromNotes()
    expect(secondResponse.body).toHaveLength(notes.length - 1)
    expect(contents).not.toContain(notes[0].content)
  })

  test('a note that do not exist can not be deleted', async () => {
    await api
      .delete('/api/notes/1234')
      .expect(400)

    const { response } = await getAllContentFromNotes()
    expect(response.body).toHaveLength(notes.length)
  })  
})

// Hay que cerrar el servidor una vez ejecutados los tests
afterAll((done) => {
  mongoose.connection.close(() => done())
  server.close()
})