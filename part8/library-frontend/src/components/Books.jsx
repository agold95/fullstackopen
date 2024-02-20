import { useState } from "react"

const Books = ({ show, books }) => {
  const [filter, setFilter] = useState('all genres')

  let genres = ['all genres']
  const filteredBooks = filter === 'all genres' ? books : books.filter(b => b.genres.includes(filter))

  books.forEach(book => {
    book.genres.map(genre => genres.includes(genre) ? null : genres = genres.concat(...book.genres))
  })

  if (!show) {
    return null
  }

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks.map((b) => (
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {genres.map(genre => (
          <button key={genre} onClick={() => setFilter(genre)}>{genre}</button>
        ))}
      </div>
    </div>
  )
}

export default Books