import { useState, useEffect } from 'react'
import axios from 'axios'
import Country from './components/Country'
import Countries from './components/Countries'
import Search from './components/Search'

function App() {
  const [countries, setCountries] = useState(null)
  const [search, setSearch] = useState("")

  useEffect(() => {
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then(res => {
        setCountries(res.data)
      })
  }, [])

  const filteredCountries = search && countries.filter(country => country.name.common.toLowerCase().includes(search.toLowerCase()))

  const handleFilterChange = (e) => setSearch(e.target.value)
  const showCountries = (countryName) => setSearch(countryName)
  
  return (
    <div>
      <Search search={search} onFilterChange={handleFilterChange} />
      {!filteredCountries ? null : filteredCountries.length === 1 ? (
        <Country country={filteredCountries[0]} />
      ) : (
          <Countries
            showCountries={showCountries}
            countries={filteredCountries ? filteredCountries : []}
          />
      )}
    </div>
  )
}

export default App