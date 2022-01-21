// Importacion commonjs
// const http = require('http')
// La importacion tipo ecmascript modules (la de react) se empieza a usar pero
// es recomendable seguir usando la commonjs por temas de documentaicon

const cors = require('cors')
// CORS: hay que instalar una extension npm install cors

const express = require('express')

const logger = require('./loggerMiddleware')

const app = express()

// CORS por defecto permitirá que tu api funcione para cualquier origen
app.use(cors())

// Utilizas el modulo para parsear las request que vengan en formato json
app.use(express.json())

// El middleware es una función que intercepta la petición que pasa por la api
// Si al use no le indicas un path, pasara todas las peticiones
app.use(logger)

// Para instalar dependencias solo para desarrollo insidcar -D
// EJ.  npm install nodemon -D
// Para que el servidor se reinicie con los cambios, se instala nodemon en desarrollo
// hay que indicarle qué archivo escuchar EJ. ./node_modules/.bin/nodemon index.js

// Semanthic versioning :  ^2.0.7 cambio_grande.nueva_feature.bug_fix
// ^ indica que se actulizara a partir de ahi. Es recomendable quitarlo y controlarlo manualmente o con testing

// ESLINTER se utiliza para seguir una guía de estilo de programación en tu proyecto
// se instala en desarrollo y es reocmendable instalar standard
// standard utiliza por detrás eslint, asi que no haria falta instalarla
// hay que indicar en el package que utilice este eslint
// 'eslintConfig': {
//   'extends': './node_modules/standard/eslintrc.json'
// }

let notes = [
  {
    id: 1,
    content: 'HTML is easy',
    date: '2019-05-30T17:30:31.098Z',
    important: true
  },
  {
    id: 2,
    content: 'Browser can execute only Javascript',
    date: '2019-05-30T18:39:34.091Z',
    important: false
  },
  {
    id: 3,
    content: 'GET and POST are the most important methods of HTTP protocol',
    date: '2019-05-30T19:20:14.298Z',
    important: true
  }
]

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
  res.json(notes)
})

app.get('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  const note = notes.find(note => {
    return note.id === id
  })

  if (note) {
    res.json(note)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  notes = notes.filter(note => {
    return note.id !== id
  })
  res.status(204).end()
})

app.post('/api/notes/', (req, res) => {
  const note = req.body
  const ids = notes.map(note => note.id)
  const maxId = Math.max(...ids)

  if (!note || !note.content) {
    res.status(400).json({
      error: 'note content is missing'
    })
  }
  const newNote = {
    id: maxId + 1,
    content: note.content,
    important: typeof note.important !== 'undefined' ? note.important : false,
    // Con esto le indicas el default y que sea opcional
    date: new Date().toISOString()
  }
  notes = [...notes, newNote]
  res.status(201).json(newNote)
})

// Aqui solo llegará si no entra en ninguna de las de arriba
app.use((req, res) => {
  console.log(res.path)
  res.status(404).json({
    error: 'Not found'
  })
})

// El environment lo coge del deploy a heroku, si no existe coge el local
// Para el deploy en heroku hay que crear un Procfile y ejecutar un heroku create
// luego hay que hacer un push a github y al git de heroku con git push heroku rama
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
