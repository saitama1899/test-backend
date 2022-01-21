const mongoose = require('mongoose')

// La uri te la indica al crear una db en cloud mongodb
const connectionString = process.env.MONGO_DB_URI

// Conexión a mongodb
mongoose.connect(connectionString)
  .then(() => {
    console.log('DB connected')
  }).catch(e => {
    console.error(e)
  })
