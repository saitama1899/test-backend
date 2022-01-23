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

  const note0 = new Note(notes[0])
  await note0.save()
  const note1 = new Note(notes[1])
  await note1.save()
  const note2 = new Note(notes[2])
  await note2.save()
})


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
// Hay que cerrar el servidor una vez ejecutados los tests
afterAll((done) => {
  mongoose.connection.close(() => done())
  server.close()
})