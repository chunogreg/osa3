/* eslint-disable no-unused-vars */
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

app.get('/api/persons', (request, response) => {
  Person.find({}).then((result) => response.json(result))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((_result) => response.status(204).end())
    .catch((error) => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  const person = { name, number }

  Person.findByIdAndUpdate(request.params.id, person, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then((updatedperson) => {
      response.json(updatedperson)
    })
    .catch((error) => next(error))
})

morgan.token('body', (request) => JSON.stringify(request.body))

app.use((request, response, next) => {
  morgan(
    request.method === 'GET'
      ? 'tiny'
      : ':method :url :status :res[content-length] - :response-time ms :body',
  )(request, response, next)
})

// let persons = [
//     {"id": "1", "name": "Arto Hellas",  "number": "040-123456" },
//     {"id": "2", "name": "Ada Lovelace", "number": "39-44-5323523" },
//     {"id": "3", "name": "Dan Abramov", "number": "12-43-234345" },
//     {"id": "4", "name": "Mary Poppendieck", "number": "39-23-6423122" }
// ]

app.get('/', (request, response) => {
  response.send('<h2>Hello World!</h2>')
})

// app.get('/api/persons/', (request, response) => {
//   response.json(persons)
// })

//fetching an individual note
app.get('/api/persons/:id', (request, response, next) => {
  // const id = request.params.id
  //const person = persons.find((n) => n.id === id)
  Person.findById(request.params.id)
    .then((person) => {
      //response.jason(person)

      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => next(error))
  // response.send({error: 'malfored id'})
})

// const generateId = () => {
//   const personId = persons.length > 0 ? Math.floor(Math.random() * 999) : 0

//   return String(personId)
// };

app.get('/info', async (request, response) => {
  const count = await Person.countDocuments()

  const time = new Date()
  response
    .send(
      `<p><h3>Phonebook has information for ${count} people </h3></p>
    <p><h3>${time}</h3></p>`,
    )
    .catch((error) => {
      console.log(error)
      response.status(500).send('error of counting people')
    })
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  const { name, number } = request.body
  console.log('requesting........:', body)

  if (!name) {
    return response.status(400).json({ error: 'name is missing' })
  } else if (!number) {
    return response.status(400).json({ error: 'number is missing' })
  }
  Person.findOne({ name })
    .then((existingname) => {
      if (existingname) {
        Person.findOneAndUpdate({ name }, { number }, { new: true })
          .then((updatedperson) => {
            response.status(200).json({
              message: 'name already exist, replace the phone number?',
              updatedperson,
            })
          })
          .catch((error) => next(error))
      } else {
        const person = new Person({
          name,
          number,
        })
        person
          .save()
          .then((savedContact) => {
            response.status(201).json(savedContact)
          })
          .catch((error) => next(error))
      }
      // persons =  persons.concat(person)
      //response.json(person)
    })
    .catch((error) => next(error))
})

// app.delete("/api/persons/:id", (request, response) => {
//   const id = request.params.id
//   persons = persons.filter((person) => person.id !== id)

//     response.status(204).end()
//   }
// )

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(404).send({ error: 'malformed Id' })
  } else if (error.name === 'ValidationError') {
    return response.status(404).json({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`server is running on Port ${PORT}`))
