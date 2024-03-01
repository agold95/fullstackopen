import diagnoses from '../../data/diagnoses';

import { Diagnosis } from '../types';

const getDiagnosisEntries = (): Diagnosis[] => {
    return diagnoses;
}

export default {
    getDiagnosisEntries
}