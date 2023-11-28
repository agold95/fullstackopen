const Person = ({name, number, handleDeletePerson, id}) => {
    return (
      <li>
        {name}: {number}
        <button onClick={() => handleDeletePerson(id)}>delete</button>
      </li>
    )
}

export default Person