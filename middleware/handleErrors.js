module.exports = (error, req, res, next) => {
  console.error(error)
  console.log(res.path)
  if (error.name === 'CastError') {
    res.status(400).send({ error: 'ID used is malformed' })
  } else {
    res.status(500).end()
  }
}
