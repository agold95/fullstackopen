import { useState, useEffect } from 'react'
import Person from './components/Person'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import personsService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)

  useEffect(() => {
    personsService
      .getAll()
      .then(response => {
        setPersons(response)
      })
  }, [])

  const addPerson = (e) => {
    e.preventDefault()

    // person object
    const personObject = {
      name: newName,
      number: newNumber
    }

    // checks if person's name already exists
    const personExists = persons.find((person) => person.name === newName)

    if (personExists) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        handleUpdatePerson(personExists.id, personObject)
      }
    } else {
        personsService
          .create(personObject)
          .then(returnedPerson => {
            setPersons(persons.concat(returnedPerson))
            handleNotification(`${personObject.name} added`, 'message')
          })
          .catch(error => {
            console.log(error)
            handleNotification(`${error.response.data.error}`)
          })
    }
  }

  const handleAddName = (e) => setNewName(e.target.value)

  const handleAddNumber = (e) => setNewNumber(e.target.value)

  const handleUpdatePerson = (id, updatedPerson) => {
    personsService
      .update(id, updatedPerson)
      .then((response) => {
        const updatedPersons = persons.map((person) => (person.id !== id ? person : response))
        setPersons(updatedPersons)
        handleNotification(`${updatedPerson.name}'s number updated`, 'message')
      })
      .catch(error => {
        console.log(error)
        handleNotification(`${updatedPerson.name} has already been deleted`, 'error')
      })
  }

  const handleDeletePerson = (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      personsService
        .deletePerson(id)
        .then(() => {
          const updatedPersons = persons.filter(person => person.id !== id)
          setPersons(updatedPersons)
          handleNotification(`successfully deleted`, 'message')
        })
        .catch(error => {
          console.log(error)
          handleNotification(`already removed`, 'error')
      })
    }
  }

  const handleNotification = (message, type) => {
    if (type !== 'error') {
      setNewName('')
      setNewNumber('')
    }

    setMessage({
      message: message,
      type: type
    })

    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  // filters by name
  const filteredName = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
  const handleFilter = (e) => setFilter(e.target.value)

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Filter filter={filter} handleFilter={handleFilter} />
      <h1>Add new number</h1>
      <PersonForm newName={newName} newNumber={newNumber} handleAddName={handleAddName} handleAddNumber={handleAddNumber} addPerson={addPerson} />
      <h2>Numbers</h2>
      <ul>
        {filteredName.map(person => 
          <Person name={person.name} id={person.id} key={person.id} number={person.number} handleDeletePerson={handleDeletePerson} />
          )}
      </ul>
    </div>
  )
}

export default App