import express from 'express';
const app = express();

import calculateBmi from './bmiCalculator';
import calculateExercise from './exerciseCalculator';

app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
    if (!req.query.height || !req.query.weight) {
        res.status(400).json({ error: "missing parameters" });
    }

    if (isNaN(Number(req.query.height)) || isNaN(Number(req.query.weight))) {
        res.status(400).json({ error: "malformatted parameters" });
    }

    const weight = Number(req.query.weight);
    const height = Number(req.query.height);
    const bmi = calculateBmi(weight, height);

    res.status(200).json({ weight, height, bmi });
});

type ExerciseModel = {
    daily_exercises: number[];
    target: number
}

app.post('/exercises', (req, res) => {
    const { daily_exercises, target } = req.body as ExerciseModel

    if (!daily_exercises || !target) {
        res.status(400).json({ error: "missing parameters"})
    }

    if (daily_exercises && target && Array.isArray(daily_exercises) && !isNaN(Number(target))) {
        res.status(200).json(calculateExercise([target, ...daily_exercises]));
    }
    res.status(400).json({ error: "malformatted parameters" });
});

const PORT = 3002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});