const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('please give a password')
  process.exit()
}

const password = process.argv[2]
const url = `mongodb+srv://fullstack:${password}@cluster0.ky7wy.mongodb.net/?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  Person.find({}).then(persons => {
    console.log('Phonebook:')
    persons.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
} else if (process.argv.length === 5) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })
  
  person.save().then(result => {
    console.log(result)
    mongoose.connection.close()
  })
} else {
  console.log('Error: incorrect argument formatting')
  mongoose.connection.close()
}

