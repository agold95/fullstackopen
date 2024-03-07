const mongoose = require('mongoose')
const Person = mongoose.model('Person', personSchema)

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

mongoose.set('strictQuery',false)
mongoose.connect(process.env.MOGODB_URI)

const person = new Person({
  name: name,
  number: number,
})

if (process.argv.length === 3) {
  Person.find({}).then(result => {
    console.log('phonebook: ')
    result.forEach(persons => {
      console.log(`${persons.name} ${persons.number}`)
    })
    mongoose.connection.close()
  })
} else {
  person.save().then(() => {
    console.log(`added ${person.name} number ${person.number} to phonebook`)
    mongoose.connection.close()
  })
}