import diagnoses from '../../data/diagnoses';

import { DiagnosisEntry } from '../types';

const getDiagnosisEntries = (): DiagnosisEntry[] => {
    return diagnoses;
}

export default {
    getDiagnosisEntries
}