const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

//const password = process.argv[2]

 const url = process.env.MONGODB_URI

 console.log('connecting to', url)

 mongoose.connect(url)
 .then((result)=> { console.log('connected to MONGODB')
 })
 .catch(error=>{console.log('error connecting to MONGODB:', error.message)
 })

 const personSchema =  new mongoose.Schema({
  name: {
    type: String, 
    minLength: 3,
     required: true
    }, 
    number: {
      type: String,
      minLength: 8,
      validate: {
        validator: v=>/\d{2,3}-\d+/.test(v),
        message: prop=> `${prop.value} is not a valid pkone number`, 
      },
      
      required: true, 
      }
    })

 personSchema.set('toJSON',{
  transform: (document, returnedObject)=>{
  returnedObject.id= returnedObject._id.toString()
  delete returnedObject._id
  delete returnedObject.__v
}
})

 module.exports = mongoose.model('Person', personSchema)

//  const mySchema = new mongoose.Schema({name: String, condition: Boolean})

//  mySchema.set('toJSON', {
//   transform: (document, rtned)=>{
//     rtned.id = rtned._id.toString()
//     delete rtned._id
//     delete rtned.__v
//   }
//  })

//  module.exports = mongoose.model('MyPerson', mySchema)

// const mongoose = require('mongoose')

// mongoose.set('strictQuery', false)
// const url = process.env.MMMM_URI

// console.log('connec......')
// mongoose.connect(url).then((result)=>{console.log('connected to MONGODB')})
// .catch((error)=>console.log('error connect....', error.message))