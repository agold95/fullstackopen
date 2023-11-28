const Weather = ({ weather }) => {
    return (
        <>
            {!weather ? (<p>...No weather data...</p>) : (
                <div>
                    <h2>Weather in {weather.name}</h2>
                    <p>Temperature: {weather.main.temp} celsius</p>
                    <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} />
                    <p>{weather.weather[0].description}</p>
                    <p>Wind: {weather.wind.speed} m/s</p>
                </div>
            )}
        </>
    )
}

export default Weather