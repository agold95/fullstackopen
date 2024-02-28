const App = () => {
  const courseName = "Half Stack application development";

  interface CoursePartBase {
    name: string;
    exerciseCount: number;
  }

  interface CoursePartDescription extends CoursePartBase {
    description: string;
  }

  interface CoursePartBasic extends CoursePartDescription {
    kind: "basic"
  }

  interface CoursePartGroup extends CoursePartBase {
    groupProjectCount: number;
    kind: "group"
  }

  interface CoursePartBackground extends CoursePartDescription {
    backgroundMaterial: string;
    kind: "background"
  }

  interface CoursePartRequirement extends CoursePartDescription {
    requirements: string[];
    kind: "special"
  }

  type CoursePart = CoursePartBasic | CoursePartGroup | CoursePartBackground | CoursePartRequirement;

  const courseParts: CoursePart[] = [
    {
      name: "Fundamentals",
      exerciseCount: 10,
      description: "This is an awesome course part",
      kind: "basic"
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
      groupProjectCount: 3,
      kind: "group"
    },
    {
      name: "Basics of type Narrowing",
      exerciseCount: 7,
      description: "How to go from unknown to string",
      kind: "basic"
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
      description: "Confusing description",
      backgroundMaterial: "https://type-level-typescript.com/template-literal-types",
      kind: "background"
    },
    {
      name: "TypeScript in frontend",
      exerciseCount: 10,
      description: "a hard part",
      kind: "basic",
    },
    {
      name: "Backend development",
      exerciseCount: 21,
      description: "Typing the backend",
      requirements: ["nodejs", "jest"],
      kind: "special"
    },
  ];

  const totalExercises = courseParts.reduce((sum, part) => sum + part.exerciseCount, 0);

  interface HeaderProps {
    name: string;
  }

  const Header = (props: HeaderProps) => {
    return <h1>{props.name}</h1>;
  };

  interface Courses {
    course: CoursePart[];
  }

  interface Part {
    coursePart: CoursePart;
  }

  const Part = (props: Part) => {
    switch (props.coursePart.kind) {
      case "basic":
        return (
          <div>
            <p><b>{props.coursePart.name} {props.coursePart.exerciseCount}</b></p>
            <p><em>{props.coursePart.description}</em></p>
          </div>
        )
      case "group":
        return (
          <div>
            <p><b>{props.coursePart.name} {props.coursePart.exerciseCount}</b></p>
            <p>project exercises {props.coursePart.groupProjectCount}</p>
          </div>
        )
      case "background":
        return (
          <div>
            <p><b>{props.coursePart.name} {props.coursePart.exerciseCount}</b></p>
            <p><em>{props.coursePart.description}</em></p>
            <p>submit to {props.coursePart.backgroundMaterial}</p>
          </div>
        )
      case "special":
        return (
          <div>
            <p><b>{props.coursePart.name} {props.coursePart.exerciseCount}</b></p>
            <p><em>{props.coursePart.description}</em></p>
            <p>required skills: {props.coursePart.requirements.join(', ')}</p>
          </div>
        )
      default:
        return assertNever(props.coursePart)
    }
  }

  const assertNever = (value: never): never => {
    throw new Error(
      `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
  };

  const Content = (props: Courses) => {
    return (
      <div>
        {props.course.map((course) => (
          <Part key={course.name} coursePart={course} />
        ))}
      </div>
    );
  };

  interface TotalProps {
    total: number;
  }

  const Total = (props: TotalProps) => {
    return <p>Number of exercises {props.total}</p>;
  };

  return (
    <div>
      <Header name={courseName} />
      <Content course={courseParts} />
      <br />
      <Total total={totalExercises} />
    </div>
  );
};

export default App;