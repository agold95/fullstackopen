interface BMIInput {
    weight: number;
    height: number;
}

const parseArguments = (args: string[]): BMIInput => {
    if (args.length < 4) throw new Error('Not enough arguments');
    if (args.length > 4) throw new Error('Too many arguments');

    if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
        return {
            weight: Number(args[2]),
            height: Number(args[3])
        };
    } else {
        throw new Error('Provided values were not numbers!');
    }
};

const calculateBmi = (weight: number, height: number) => {
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
    } else {
        return;
    }
};

try {
    const { weight, height } = parseArguments(process.argv);
    console.log(calculateBmi(weight, height));
} catch (error: unknown) {
    let errorMessage = 'Something bad happened.';
    if (error instanceof Error) {
        errorMessage += ' Error: ' + error.message;
    }
    console.log(errorMessage);
}

export default calculateBmi;