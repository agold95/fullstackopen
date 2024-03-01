import { NewPatientEntry, Gender } from "../types";

const toNewPatientEntry = (object: unknown): NewPatientEntry => {
    if (!object || typeof object !== 'object') {
        throw new Error('Incorrect or missing data');
    }

    if (
        'name' in object &&
        'dateOfBirth' in object &&
        'ssn' in object &&
        'gender' in object &&
        'occupation' in object
    ) {
        const newEntry: NewPatientEntry = {
            name: parseName(object.name),
            dateOfBirth: parseDOB(object.dateOfBirth),
            ssn: parseSSN(object.ssn),
            gender: parseGender(object.gender),
            occupation: parseOccupation(object.occupation),
            entries: []
        };

        return newEntry;
    }

    throw new Error('Incorrect data: some fields are missing');
};

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isDOB = (dob: string): boolean => {
  return Boolean(Date.parse(dob));
};

const isGender = (param: string): param is Gender => {
    return Object.values(Gender).map(g => g.toString()).includes(param);
};

const parseName = (name: unknown): string => {
    if (!name || !isString(name)) {
        throw new Error('Incorrect or missing name');
    }
    return name;
};

const parseDOB = (dob: unknown): string => {
  if (!dob || !isString(dob) || !isDOB(dob)) {
      throw new Error('Incorrect or missing date: ' + dob);
  }
  return dob;
};

const parseSSN = (ssn: unknown): string => {
  if (!ssn || !isString(ssn)) {
    throw new Error("Incorrect or missing SSN");
  }
  return ssn;
};

const parseGender = (gender: unknown): Gender => {
  if (!isString(gender) || !isGender(gender)) {
    throw new Error("Incorrect or missing gender");
  }

  return gender;
};

const parseOccupation = (occupation: unknown): string => {
  if (!occupation || !isString(occupation)) {
    throw new Error("Incorrect or missing occupation");
  }

  return occupation;
};

export default toNewPatientEntry;