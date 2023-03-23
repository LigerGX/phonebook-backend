const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.static('build'))
app.use(express.json())

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

const info = () => {
  return `<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`
}

const generateId = () => {
  return Math.floor(Math.random() * 10000000000)
}

const checkDupe = (name) => {
  return persons.some(person => person.name === name)
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
  res.send(persons)
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

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
})

app.post('/api/persons', (req, res) => {
  const body = req.body
  console.log(checkDupe(body.name))
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'Name or number is missing'
    })
  } else if (checkDupe(body.name)) {
    return res.status(400).json({
      error: 'Name must be unique'
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  }

  persons = persons.concat(person)

  res.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`phonebook_backend listening on port ${PORT}`)
})