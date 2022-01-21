// Para poder leer las variables de entorno del .env se rquiere
// la dependencia dotenv
require('dotenv').config()
// Conexion a DB
require('./mongo.js')

// Importacion commonjs
// const http = require('http')
// La importacion tipo ecmascript modules (la de react) se empieza a usar pero
// es recomendable seguir usando la commonjs por temas de documentaicon

const cors = require('cors')
// CORS: hay que instalar una extension npm install cors

const express = require('express')
const logger = require('./loggerMiddleware')
const handleErrors = require('./middleware/handleErrors.js')
const notFound = require('./middleware/notFound.js')

const Note = require('./models/Note')

const app = express()

// CORS por defecto permitirá que tu api funcione para cualquier origen
app.use(cors())

// Utilizas el modulo para parsear las request que vengan en formato json
app.use(express.json())

// El middleware es una función que intercepta la petición que pasa por la api
// Si al use no le indicas un path, pasara todas las peticiones
app.use(logger)

// Para instalar dependencias solo para desarrollo indicar -D
// EJ.  npm install nodemon -D
// Para que el servidor local se reinicie con los cambios, se instala nodemon en desarrollo
// hay que indicarle qué archivo escuchar EJ. ./node_modules/.bin/nodemon index.js

// Semanthic versioning :  ^2.0.7 cambio_grande.nueva_feature.bug_fix
// ^ indica que se actulizara a partir de ahi. Es recomendable quitarlo y controlarlo manualmente o con testing

// ESLINTER se utiliza para seguir una guía de estilo de programación en tu proyecto
// se instala en desarrollo y es recomendable utilizar la configuracion standard

// create server hace un callback que se ejecutará cada vez que le llegue
// una peticion al servidor.
// const app = http.createServer((request, response) => {
//   response.writeHead(200, { 'Content-Type': 'application/json' })
//   response.end(JSON.stringify(notes))
// })

app.get('/', (req, res) => {
  res.send('<h1>Hola mundo!</h1>')
})

app.get('/api/notes', (req, res) => {
  Note.find({}).then(notes => {
    res.json(notes)
  })
})

app.get('/api/notes/:id', (req, res) => {
  const { id } = req.params
  Note.findById(id)
    .then(note => {
      if (note) {
        res.json(note)
      } else {
        res.status(404).end()
      }
    })
    .catch(e => {
      console.error(e)
      res.status(400).end()
    })
})

app.put('/api/notes/:id', (req, res, next) => {
  const { id } = req.params
  const note = req.body
  const newNoteInfo = {
    content: note.content,
    important: note.important
  }
  // El segundo parametro es la nueva nota actualizada
  // el tercer parametro indica si quieres que te devuelva el nuevo o el viejo (si no se indica es false)
  Note.findByIdAndUpdate(id, newNoteInfo, { new: true })
    .then(result => {
      res.json(result)
      res.status(200).end()
    }).catch(error => next(error))
    // De esta forma le indicamos que vaya al siguiente middleware que capture errores
})

app.delete('/api/notes/:id', (req, res, next) => {
  const { id } = req.params
  Note.findByIdAndDelete(id)
    .then(result => {
      res.status(204).end()
    }).catch(error => next(error))
    // De esta forma le indicamos que vaya al siguiente middleware que capture errores
})

app.post('/api/notes/', (req, res) => {
  const note = req.body

  if (!note || !note.content) {
    res.status(400).json({
      error: 'note content is missing'
    })
  }
  const newNote = new Note({
    content: note.content,
    date: new Date().toISOString(),
    important: typeof note.important !== 'undefined' ? note.important : false
    // Con esto le indicas el default y que sea opcional
  })

  newNote.save().then(savedNote => {
    res.json(savedNote)
    res.status(201).json(newNote)
  })
})

// Aqui solo llegará si no entra en ninguna de las de arriba
// El orden de estos middlewares es importante
app.use(notFound)

app.use(handleErrors)

// El environment lo coge del deploy a heroku, si no existe coge el local
// Para el deploy en heroku hay que crear un Procfile y ejecutar un heroku create
// luego hay que hacer un push a github y al git de heroku con git push heroku rama
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
