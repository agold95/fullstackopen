import { useState } from 'react'
import { useQuery } from '@apollo/client'

import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'

import { ALL_AUTHORS, ALL_BOOKS } from './queries'
import Notify from './components/Notify'

const App = () => {
  const authorsResult = useQuery(ALL_AUTHORS)
  const booksResult = useQuery(ALL_BOOKS)
  
  const [page, setPage] = useState('authors')
  const [errorMessage, setErrorMessage] = useState(null)

  if (authorsResult.loading || booksResult.loading)  {
    return <div>loading...</div>
  }

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
      </div>
      
      <Notify errorMessage={errorMessage} />

      <Authors show={page === 'authors'} authors={authorsResult.data.allAuthors} />

      <Books show={page === 'books'} books={booksResult.data.allBooks} />

      <NewBook show={page === 'add'} setError={notify} />

    </div>
  )
}

export default App