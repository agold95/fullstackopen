const Recommendations = ({ show, user, books }) => {

    if (!show) {
        return null
    }

    const genreFilter = user.favoriteGenre
    const filteredBooks = books.filter(book => book.genres.includes(genreFilter))

    return (
        <div>
            <h2>recommendations</h2>
            <p>books in your favorite genre: <b>{genreFilter}</b></p>

            <table>
                <tbody>
                    <tr>
                        <th></th>
                        <th>author</th>
                        <th>published</th>
                    </tr>
                    {filteredBooks.map(book => (
                        <tr key={book.title}>
                            <td>{book.title}</td>
                            <td>{book.author.name}</td>
                            <td>{book.published}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Recommendations