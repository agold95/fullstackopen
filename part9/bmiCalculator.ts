interface BMIInput {
    value1: number;
    value2: number;
}

const parseArguments = (args: string[]): BMIInput => {
  if (args.length < 4) throw new Error('Not enough arguments');
  if (args.length > 4) throw new Error('Too many arguments');

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      value1: Number(args[2]),
      value2: Number(args[3])
    }
  } else {
    throw new Error('Provided values were not numbers!');
  }
}

const calculateBmi = (height: number, weight: number) => {
    const bmi = weight / Math.pow(height / 100, 2);

    if (bmi < 16) {
        return 'Severely underweight';
    } else if (bmi < 17) {
        return 'Moderately underweight';
    } else if (bmi < 18.5) {
        return 'Mildly underweight';
    } else if (bmi < 25) {
        return 'Normal (healthy weight)';
    } else if (bmi < 30) {
        return 'Overweight';
    } else if (bmi < 35) {
        return 'Mildly obese';
    } else if (bmi < 40) {
        return 'Moderately obese';
    } else if (bmi >= 40) {
        return 'Severely obese';
    }
}

try {
    const { value1, value2 } = parseArguments(process.argv);
    console.log(calculateBmi(value1, value2));
} catch (error: unknown) {
    let errorMessage = 'Something bad happened.';
    if (error instanceof Error) {
        errorMessage += ' Error: ' + error.message;
    }
    console.log(errorMessage);
}