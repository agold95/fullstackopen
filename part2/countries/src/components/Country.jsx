import { useState, useEffect } from "react"
import Weather from "./Weather"
import axios from "axios"

const api_key = import.meta.env.VITE_API_KEY

const Country = ({ country }) => {
    const [weather, setWeather] = useState(null)

    useEffect(() => {
        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${country.capital[0]}&units=metric&appid=${api_key}`)
        .then(res => setWeather(res.data))
    }, [country.capital])

    return (
        <div>
            <h1>{country.name.common}</h1>
            <h2>Capital: {country.capital}</h2>
            <h3>Area: {country.area} </h3>
            <h4>Languages</h4>
            <ul>
                {Object.values(country.languages).map(language =>
                    <li key={language}>{language}</li>)}
            </ul>
            <img
                src={country.flags.png}
                style={{border: "1px solid black"}}
            />
            <Weather weather={weather} />
        </div>
    )
}

export default Country