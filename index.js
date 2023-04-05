require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

app.use(cors())
app.use(express.static('build'))
app.use(express.json())

const info = (persons) => {
	return `<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`
}

// morgan logging middleware
morgan.token('data', (req) => {
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

app.get('/api/persons/:id', (req, res, next) => {
	const id = req.params.id

	Person
		.findById(id)
		.then(result => {
			res.json(result)
		})
		.catch(error => {
			next(error)
		})
})

app.get('/info', (req, res, next) => {
	Person
		.find({})
		.then(result => {
			res.send(info(result))
		})
		.catch(error => {
			next(error)
		})
})

app.delete('/api/persons/:id', (req, res, next) => {
	const id = req.params.id

	Person
		.findByIdAndRemove(id)
		.then(() => {
			res.status(204).end()
		})
		.catch(error => {
			next(error)
		})
})

app.post('/api/persons', (req, res,next) => {
	const body = req.body

	const person = new Person({
		name: body.name,
		number: body.number,
	})

	person
		.save()
		.then(result => {
			res.json(result)
		})
		.catch(error => {
			next(error)
		})
})

app.put('/api/persons/:id', (req, res, next) => {
	const id = req.params.id
	const body = req.body

	const person = {
		name: body.name,
		number: body.number
	}

	Person
		.findByIdAndUpdate(id, person, { new: true, runValidators: true })
		.then(result => {
			res.json(result)
		})
		.catch(error => {
			next(error)
		})
})

const unknownEndpoint = (req, res) => {
	res.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
	if (error.name === 'CastError') {
		return res.status(400).send({ error: 'malformatted id' })
	} else if (error.name === 'ValidationError') {
		return res.status(400).json({ error: error.message })
	}

	next(error)
}
app.use(errorHandler)

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`phonebook_backend listening on port ${PORT}`)
})