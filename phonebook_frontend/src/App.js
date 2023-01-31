import { useEffect, useState } from 'react'
import Filter from './components/Filter'
import Form from './components/PersonForm'
import Persons from './components/Persons'
import './index.css'
import PersonService from './services/PersonService'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)


  useEffect(() => {
    PersonService
    .getAll()
    .then(initialPersons =>{
      setPersons(initialPersons)
    })
  }, [])

  const Notification = ({message}) => {
    if (message == null) {
      return null
    }
    return (
      <div className ="notification">
        {message}
      </div>
    )
  }

  const ErrorMessage = ({errorMessage}) => {
    if (errorMessage == null) {
      return null
    }
    return(
      <div className ="error">
        {errorMessage}
      </div>
    )
  }

  const removePerson = id => {
    const name = persons.find((n) => n.id === id).name

    if (window.confirm(`Delete ${name}?`)) { 
      PersonService
      .remove(id)
      .then(() => {
        setPersons(persons.filter(p => p.id !== id))
      })
      setMessage(`${name} was removed`)
      setTimeout(() => {
        setMessage(null)}, 5000)
    }
  }

  const addPerson = (event) => {
    event.preventDefault()
    const personObject= {
      name: newName,
      number: newNumber
    }

    const existingPerson = persons.find((person) => person.name === newName)

    if (existingPerson) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        PersonService.replace(existingPerson.id, personObject)
        .then((response) => {
          setPersons(persons.map(person => person.id !== existingPerson.id ? person : response))
        })
        .catch(error => {
          setErrorMessage(`${newName} was already deleted from server`)
          setTimeout(() => {
            setErrorMessage(null)},5000)
        })
        setPersons(persons.filter(n => n.id !== existingPerson.id))
      }
      else {
          setMessage(`${newName}'s number was replaced`)
          setTimeout(() => {
            setMessage(null)}, 5000)
          
      }
    }
      
    else {

    PersonService
      .create(personObject)
      .then((response) => {
        setPersons(persons.concat(response))
        setMessage(`${newName} was added`)
        setTimeout(() => {
          setMessage(null)}, 5000)
      })
      .catch(error => {
        setErrorMessage(error.response.data.error)
        setTimeout(()=> {
          setErrorMessage(null)
        }, 5000)
    }) 
    
  }
  setNewName('')
  setNewNumber('')

  }
  const handleNameChange = (event) => {
      setNewName(event.target.value)
    }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange= (event) => {
    setFilter(event.target.value)
  }


  const PersonsToShow = filter
  ? persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase())) 
  : persons

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message = {message}/>
      <ErrorMessage errorMessage = {errorMessage}/>
      <Filter filter = {filter} onFilterChange = {handleFilterChange}/>
      <h2>add a new</h2>
      <Form addPerson = {addPerson} name = {newName} onNameChange = {handleNameChange}
                  number = {newNumber} onNumberChange = {handleNumberChange}/>
      <h2>Numbers</h2>
      <ul>
      <Persons filter = {PersonsToShow} removePerson={removePerson}
      />
      </ul>
    </div>
  )

}

export default App