const Header = ({ course }) => <h1>{course}</h1>

const Total = ({ parts }) => {
  const total = parts.reduce((acc, totalVal) => acc + totalVal)
  
  return (
    <p><b>Total exercises: {total}</b></p>
  )
}

const Part = ({ part }) => 
  <p>
    {part.name} {part.exercises}
  </p>

const Content = ({ parts, id }) => {
  return (
    <div>
      {parts.map((part) => {
        return (
          <Part key={part.id} part={part} />
        )
      })}
    </div>
  )
}

const Course = ({ course } ) => {
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts.map(x => x['exercises'])} />
    </div>
  )
}

export default Course