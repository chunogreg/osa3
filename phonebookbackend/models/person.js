const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

//const password = process.argv[2]

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose
  .connect(url)
  // eslint-disable-next-line no-unused-vars
  .then((_result) => {
    console.log('connected to MONGODB')
  })
  .catch((error) => {
    console.log('error connecting to MONGODB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: (v) => /\d{2,3}-\d+/.test(v),
      message: (prop) => `${prop.value} is not a valid pkone number`,
    },

    required: true,
  },
})

personSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Person', personSchema)

