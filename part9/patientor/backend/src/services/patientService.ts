import patients from '../../data/patients';

import { v1 as uuid } from 'uuid';

import { NonSensitivePatient, Patient, NewPatientEntry, Entry, EntryWithoutId } from '../types';

const getPatients = (): Patient[] => {
    return patients;
}

const getPatientById = (id: string): Patient | undefined => {
    return patients.find(patient => patient.id === id);
}

const getNonSensitivePatient= (): NonSensitivePatient[] => {
    return patients.map(({ id, name, dateOfBirth, gender, occupation, entries }) => ({
        id,
        name,
        dateOfBirth,
        gender,
        occupation,
        entries
    }));
};

const addPatient = (entry: NewPatientEntry): Patient => {
    const id = uuid()
    const newPatientEntry = {
        id,
        ...entry
    };

    patients.push(newPatientEntry);
    return newPatientEntry;
}

const addEntry = (patient: Patient, entry: EntryWithoutId): Entry => {
    const id = uuid()
    const newEntry = {
        id,
        ...entry
    }

    patient.entries.push(newEntry);
    return newEntry;
}

export default {
  getPatients,
  getNonSensitivePatient,
  addPatient,
  getPatientById,
  addEntry
}