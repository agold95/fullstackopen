const mongoose = require('mongoose')

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

mongoose.set('strictQuery',false)
mongoose.connect(process.env.MOGODB_URI)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

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
    person.save().then(result => {
        console.log(`added ${person.name} number ${person.number} to phonebook`)
        mongoose.connection.close()
    })
}