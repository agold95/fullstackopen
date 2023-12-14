import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";

import { ALL_AUTHORS, EDIT_BORN } from "../queries";

const PersonForm = ({ setError, show, authors }) => {
    const [name, setName] = useState('')
    const [born, setBorn] = useState('')

    const [changeBorn, result] = useMutation(EDIT_BORN, {
        refetchQueries: [{ query: ALL_AUTHORS }],
        onError: (error) => {
            const messages = error.graphQLErrors.map(e => e.message).join('\n')
            setError(messages)
        }
    })

    useEffect(() => {
        if (result.data && result.data.editBorn === null) {
            setError('author not found')
        }
    }, [result.data])

  if (!show) {
    return null
  }
    
  const submit = async (event) => {
      event.preventDefault()
    
      changeBorn({ variables: { name, born: parseInt(born) } })

      setName('')
      setBorn('')
  }
    
    return (
        <div>
            <h1>Set birthyear</h1>
            <form onSubmit={submit}>
                <div>
                    <label htmlFor="name">name</label>
                    <select name="name" id="name" onChange={({ target }) => setName(target.value)}>
                        {authors.map(a => (
                            <option key={a.name} value={a.name}>{ a.name }</option>
                        ))}
                    </select>
                </div>
                <div>
                    born <input
                        value={born}
                        onChange={({ target }) => setBorn(target.value)}
                    />
                </div>
                <button type="submit">update author</button>
            </form>
        </div>
    )
}

export default PersonForm