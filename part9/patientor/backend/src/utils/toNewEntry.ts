import {
    Diagnosis,
    Discharge,
    EntryWithoutId,
    HealthCheckRating,
    NewBaseEntry,
    SickLeave
} from "../types";

const isNumber = (text: unknown): text is number => {
    return typeof text === 'number' || text instanceof Number;
}

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isHealthCheckRating = (param: number): param is HealthCheckRating => {
    return Object.values(HealthCheckRating).includes(param);
};

const parseSpecialist = (specialist: unknown): string => {
    if (!specialist || !isString(specialist)) {
        throw new Error('Incorrect or missing specialist');
    }
    return specialist;
}

const parseDiagnosisCodes = (object: unknown): Array<Diagnosis['code']> => {
    if (!object || typeof object !== 'object' || !('diagnosisCodes' in object)) {
        return [] as Array<Diagnosis['code']>;
    }
    return object.diagnosisCodes as Array<Diagnosis['code']>
}

const parseHealthCheckRating = (healthcheckRating: unknown): HealthCheckRating => {
    if (!healthcheckRating || !isNumber(healthcheckRating) || !isHealthCheckRating(healthcheckRating)) {
        throw new Error('Incorrect or missing healthCheckRating: ' + healthcheckRating);
    }
    return healthcheckRating;
}

const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
      throw new Error('Incorrect or missing date: ' + date);
  }
  return date;
};

const parseDescription = (desciption: unknown): string => {
    if (!desciption || !isString(desciption)) {
        throw new Error('Incorrect or missing description');
    }
    return desciption;
};

const parseEmployerName = (employerName: unknown): string => {
    if (!employerName || !isString(employerName)) {
        throw new Error('Incorrect or missing description');
    }
    return employerName;
}

const parseSickLeave = (object: unknown): SickLeave => {
    if (!object || typeof object !== 'object') {
        throw new Error('Incorrect or missing sick leave');
    }

    if ('startDate' in object && 'endDate' in object) {
        const sickLeave: SickLeave = {
            startDate: parseDate(object.startDate),
            endDate: parseDate(object.endDate)
        };
        return sickLeave;
        }
    throw new Error('one or more fields are missing;')
}

const parseCriteria = (criteria: unknown): string => {
    if (!criteria || !isString(criteria)) {
        throw new Error('Incorrect or missing criteria');
    }
    return criteria;
}

const parseDischarge = (object: unknown): Discharge => {
    if (!object || typeof object !== 'object') {
        throw new Error('Incorrect or missing discharge data');
    }
    
    if ('date' in object && 'criteria' in object) {
        const discharge: Discharge = {
            date: parseDate(object.date),
            criteria: parseCriteria(object.criteria)
        }
        return discharge;
    }
    throw new Error('one or more missing discharge data');
}

const toNewEntry = (object: unknown): EntryWithoutId => {
    if (!object || typeof object !== 'object') {
        throw new Error('Incorrect or missing data');
    }

    if ('description' in object && 'date' in object && 'specialist' in object) {
        const newBaseEntry: NewBaseEntry = 'diagnosisCodes' in object
            ? 
            {
                description: parseDescription(object.description),
                date: parseDate(object.date),
                specialist: parseSpecialist(object.specialist),
                diagnosisCodes: parseDiagnosisCodes(object.diagnosisCodes)
            }
            :
            {
                description: parseDescription(object.description),
                date: parseDate(object.date),
                specialist: parseSpecialist(object.specialist),
            }
        
        if ('type' in object) {
            switch (object.type) {
                case 'HealthCheck':
                    if ('healthCheckRating' in object) {
                        const healthCheckEntry: EntryWithoutId = {
                            ...newBaseEntry,
                            type: 'HealthCheck',
                            healthCheckRating: parseHealthCheckRating(object.healthCheckRating)
                        };
                        return healthCheckEntry;
                    }
                    throw new Error('missing health check rating');
                case 'OccupationalHealthcare':
                    if ('employerName' in object) {
                        let occupationalHealthcareEntry: EntryWithoutId;

                        'sickLeave' in object ?
                            occupationalHealthcareEntry = {
                                ...newBaseEntry,
                                type: 'OccupationalHealthcare',
                                employerName: parseEmployerName(object.employerName),
                                sickLeave: parseSickLeave(object.sickLeave)
                            }
                            :
                            occupationalHealthcareEntry = {
                                ...newBaseEntry,
                                type: 'OccupationalHealthcare',
                                employerName: parseEmployerName(object.employerName)
                            };
                        return occupationalHealthcareEntry;
                    }
                    throw new Error('missing employer name');
                case 'Hospital':
                    if ('discharge' in object) {
                        const hospitalEntry: EntryWithoutId = {
                            ...newBaseEntry,
                            type: 'Hospital',
                            discharge: parseDischarge(object.discharge)
                        };
                        return hospitalEntry;
                    }
                    throw new Error('missing discharge date');
            }
        }
    }
    throw new Error('one or more fields are missing');
}

export default toNewEntry;