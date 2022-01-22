const supertest = require('supertest')

const Note = require('../models/Note')

const {app, server} = require ('../index.js')

const mongoose = require('mongoose')

const api = supertest(app)

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

// Crear datos simulados de la BD que vamos a checkear
const notes = [
  {
    content: 'HTML is easy',
    date: '2019-05-30T17:30:31.098Z',
    important: true
  },
  {
    content: 'Browser can execute only JavaScript',
    date: '2019-05-30T18:39:34.091Z',
    important: false
  },
  {
    content: 'GET and POST are the most important methods of HTTP protocol',
    date: '2019-05-30T19:20:14.298Z',
    important: true
  }
]

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
  const response = await api.get('/api/notes')
  expect(response.body).toHaveLength(notes.length)
})

test('the first note is about HTML', async () => {
  const response = await api.get('/api/notes')
  expect(response.body[0].content).toBe('HTML is easy')
})

test('some note is about HTML', async () => {
  const response = await api.get('/api/notes')
  const contents = response.body.map(note => note.content)
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

  const response = await api.get('/api/notes')
  expect(response.body).toHaveLength(notes.length + 1)
})

test('note without content is not added', async () => {
  const newNote = {
    important: true
  }
  await api
    .post('/api/notes')
    .send(newNote)
    .expect(400)

  const response = await api.get('/api/notes')
  expect(response.body).toHaveLength(notes.length)
})
// Hay que cerrar el servidor una vez ejecutados los tests
afterAll((done) => {
  mongoose.connection.close(() => done())
  server.close()
})