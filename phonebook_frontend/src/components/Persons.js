import Person from './Person'

const Persons = ({filter, removePerson}) => {
    return (
      <div>
      {filter.map(person => <Person key={person.id} person = {person} remove= {()=>removePerson(person.id)}/>)}
      </div>
    )
  }

export default Persons