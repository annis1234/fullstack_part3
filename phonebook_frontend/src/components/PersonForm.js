const Form = ({name, number, onNameChange, onNumberChange, addPerson}) => {
    return (
        <form onSubmit = {addPerson}>
            <div>
                name: <input value = {name}
                    onChange = {onNameChange} />
            </div>
            <div>
                number: <input value = {number}
                    onChange = {onNumberChange} />
            </div>
            <div>
                <button type ="submit">add</button>
            </div>
            
        </form> 
    )
}

export default Form