require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

app.use(cors())
app.use(express.static('build'))
app.use(express.json())

const info = () => {
  return `<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`
}

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

// morgan logging middleware
morgan.token('data', (req, res) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }

  return null
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

app.get('/api/persons', (req, res) => {
  Person.find({}).then(result => {
    res.json(result)
  })
})

app.get('/info', (req, res) => {
  res.send(info())
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    res.json(person)
  }
  res.status(404).end()
})

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  
  Person
    .findByIdAndRemove(id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => {
      next(error)
    })
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'Name or number is missing'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(result => {
    res.json(person)
  })

})

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`phonebook_backend listening on port ${PORT}`)
})