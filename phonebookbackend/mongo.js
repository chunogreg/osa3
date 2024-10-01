const mongoose = require('mongoose')
mongoose.set('bufferTimeoutMS', 44000)

const password = process.argv[2]
const personName = process.argv[3]
const phoneNumber = process.argv[4]

const url = `mongodb+srv://aniobi:${password}@cluster0.rrqwu.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})
const Person = mongoose.model('Person', personSchema)
const person = new Person({ name: personName, number: phoneNumber })

if (process.argv.length < 3) {
  console.log('argument must have password')
  process.exit(1)
} else if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    console.log('Phonebook:')
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
} else {
  // eslint-disable-next-line no-unused-vars
  person.save().then((result) => {
    console.log(`Added ${person.name} number ${person.number} to phonebook`)
    mongoose.connection.close()
  })
}
