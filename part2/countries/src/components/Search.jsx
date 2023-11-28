const Search = ({ filter, onFilterChange }) => {
    return (
        <div>
            Find countries: <input value={filter} onChange={onFilterChange} type="search" />
        </div>
    )
}

export default Search