import patients from '../../data/patients';

import { v1 as uuid } from 'uuid';

import { NonSensitivePatientEntry, PatientEntry, NewPatientEntry } from '../types';

const id = uuid()

const getPatients = (): PatientEntry[] => {
    return patients;
}

const getNonSensitivePatientEntry = (): NonSensitivePatientEntry[] => {
    return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
        id,
        name,
        dateOfBirth,
        gender,
        occupation
    }));
};

const addPatient = (entry: NewPatientEntry): PatientEntry => {
    const newPatientEntry = {
        id: id,
        ...entry
    };

    patients.push(newPatientEntry);
    return newPatientEntry;
}

export default {
  getPatients,
  getNonSensitivePatientEntry,
  addPatient
}