import { useState } from 'react'

const Button = ({ text, handleClick }) => {
  return (
    <button onClick={handleClick}>{ text }</button>
  )
}

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const Statistics = ({ good, neutral, bad }) => {
  const allVotes = good + neutral + bad
  const averageVotes = () => `${((good - bad) / allVotes)}`
  const positiveVotes = () => `${(good / allVotes * 100)}%`

  if (allVotes === 0) {
    return (
      <div>
        No feedback given
      </div>
    )
  } else {
      return (
        <table>
          <tbody>
            <StatisticLine text='good' value={good} />
            <StatisticLine text='neutral' value={neutral} />
            <StatisticLine text='bad' value={bad} />
            <StatisticLine text='all' value={allVotes} />
            <StatisticLine text='average' value={averageVotes()} />
            <StatisticLine text='positive' value={positiveVotes()} />
          </tbody>
      </table>
    )
  }
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const goodVote = () => setGood(good + 1)
  const neutralVote = () => setNeutral(neutral + 1)
  const badVote = () => setBad(bad + 1)

  return (
    <div>
      <h1>Give Feedback</h1>
      <div>
        <Button text='good' handleClick={goodVote} />
        <Button text='neutral' handleClick={neutralVote} />
        <Button text='bad' handleClick={badVote} />
      </div>
      <h2>Statistics</h2>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App
