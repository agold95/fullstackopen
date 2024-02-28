import { useState, useEffect } from 'react'
import { getAllEntries, createEntry } from './diaryService';
import { DiaryEntry } from './types'
import axios from 'axios';

function App() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [date, setDate] = useState('');
  const [weather, setWeather] = useState('');
  const [visibility, setVisibility] = useState('');
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getAllEntries().then(data => {
      setEntries(data)
    })
  }, [])

  const diaryEntryCreation = (event: React.SyntheticEvent) => {
    event.preventDefault()
    const newEntry = {
      id: entries.length + 1,
      date,
      weather,
      visibility,
      comment
    }

    createEntry(newEntry).then(data => {
      setEntries(entries.concat(data))
    })
    .catch(error => {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          setError(error.response.data)
        }
      }
    })
    setTimeout(() => {
      setError('')
    }, 5000)

    setDate('');
    setWeather('');
    setVisibility('');
    setComment('');
  }

  return (
    <div>
      <h4 style={{ color: 'red' }}>{error}</h4>
      <form onSubmit={diaryEntryCreation}>
        <h2>Add new entry</h2>
        <div>
          date
          <input type='date' value={date} onChange={(event) => setDate(event.target.value)} />
        </div>
        <div>
          visibility
          <input type='radio' value='great' name='visibility' onChange={(event) => setVisibility(event.target.value)} />
          <label htmlFor='good'>great</label>
          <input type='radio' value='good' name='visibility' onChange={(event) => setVisibility(event.target.value)} />
          <label htmlFor='good'>good</label>
          <input type='radio' value='ok' name='visibility' onChange={(event) => setVisibility(event.target.value)} />
          <label htmlFor='ok'>ok</label>
          <input type='radio' value='poor' name='visibility' onChange={(event) => setVisibility(event.target.value)} />
          <label htmlFor='poor'>poor</label>
        </div>
        <div>
          weather
          <input type='radio' value='sunny' name='weather' onChange={(event) => setWeather(event.target.value)} />
          <label htmlFor='sunny'>sunny</label>
          <input type='radio' value='rainy' name='weather' onChange={(event) => setWeather(event.target.value)} />
          <label htmlFor='rainy'>rainy</label>
          <input type='radio' value='cloudy' name='weather' onChange={(event) => setWeather(event.target.value)} />
          <label htmlFor='cloudy'>cloudy</label>
          <input type='radio' value='stormy' name='weather' onChange={(event) => setWeather(event.target.value)} />
          <label htmlFor='stormy'>stormy</label>
          <input type='radio' value='windy' name='weather' onChange={(event) => setWeather(event.target.value)} />
          <label htmlFor='windy'>windy</label>
        </div>
        <div>
          comment
          <input value={comment} onChange={(event) => setComment(event.target.value)} />
        </div>
        <button type='submit'>add</button>
      </form>
      <h2>Diary Entries</h2>
      {entries.map(entry => (
        <div key={entry.id}>
          <h3>{entry.date}</h3>
          <p>
            visibility: {entry.visibility}
            <br />
            weather: {entry.weather}
          </p>
        </div>
      ))}
    </div>
  )
}

export default App
