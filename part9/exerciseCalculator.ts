interface CalculateValues {
    periodLength: number;
    trainingDays: number;
    success: boolean;
    rating: number;
    ratingDescription: string;
    target: number;
    average: number;
}

const parseArray = (args: string[]): number[] => {
  const userData = args.filter((arg, i) => i > 1);
    return userData.map((arg) => {
        if (isNaN(Number(arg))) {
            throw new Error('Exercise amount must be a number.')
        }
        return Number(arg);
    });
}

const calculateExercise = (exercise: number[]): CalculateValues => {
    const periodLength = exercise.length - 1;
    const trainingDays = exercise.reduce((a, b) => (b > 0 ? a + 1 : a), 0) - 1;
    const totalTrainingHours = exercise.reduce((a, b) => a + b, 0) - exercise[0];
    const average = totalTrainingHours / periodLength;
    const target = exercise[0];
    const success = average >= target;
    let rating: number;
    let ratingDescription: string;
    let successRate = average / target;

    if (successRate < 0.75) {
        rating = 1;
        ratingDescription = "You didn't reach the target, try again next week.";
    } else if (successRate < 1) {
        rating = 2;
        ratingDescription = "Not too bad. Could be better!";
    } else {
        rating = 3;
        ratingDescription = "You achieved your set target!";
    }

    return {
        periodLength,
        trainingDays,
        success,
        rating,
        ratingDescription,
        target,
        average
    };
}

try {
    const data = parseArray(process.argv);
    console.log(calculateExercise(data));
} catch (error: unknown) {
    let errorMessage = 'Something bad happened.';
    if (error instanceof Error) {
        errorMessage += ' Error: ' + error.message
    }
    console.log(errorMessage);
}