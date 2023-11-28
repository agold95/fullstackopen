const Countries = ({ countries, showCountries }) => {
    return (
        <div>
            {countries.length > 10 ? (
                <p>Too many matches, specify another filter</p>
            ) : (
                    <div>
                        {countries.map((country) => (
                            <div key={country.name.official}>
                                {country.name.common}
                                <button onClick={() => showCountries(country.name.common)}>show</button>
                            </div>
                        ))}    
                    </div>
            )}
        </div>
    )
}

export default Countries