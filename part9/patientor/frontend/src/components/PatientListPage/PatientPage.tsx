import { Patient, Diagnosis, Entry, HealthCheckRating, EntryWithoutId } from '../../types';

import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';

import WorkIcon from '@mui/icons-material/Work';
import { useState } from 'react';

import { Button } from '@mui/material';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Box from '@mui/material/Box';

import patientService from '../../services/patients';
import axios from 'axios';
import AddEntryModal from '../AddEntryModal';

interface Props {
    patient: Patient | null | undefined;
    diagnoses: Diagnosis[];
}

const HealthRating = (health: HealthCheckRating) => {
    switch (health) {
        case 0:
            return <FavoriteIcon sx={{ color: 'green' }} />;
        case 1:
            return <FavoriteIcon sx={{ color: 'yellow' }} />;
        case 2:
            return <FavoriteIcon sx={{ color: 'orange' }} />;
        case 3:
            return <FavoriteIcon sx={{ color: 'red' }} />;
    }
};

const assertNever = (value: never): never => {
    throw new Error(
      `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
};
  
const EntryDetails = ({ entry }: { entry: Entry }) => {
    switch (entry.type) {
        case "HealthCheck":
            return <div>{HealthRating(entry.healthCheckRating)}</div>;
        case "Hospital":
            return (
                <div>
                    <p>Discharge date: {entry.discharge.date}</p>
                    <ul>
                        <li>criteria: <i>{entry.discharge.criteria}</i></li>
                    </ul>
                </div>
            );
        case "OccupationalHealthcare":
            return (
                <div>
                    {entry.sickLeave
                        ? <p>Sick Leave: {entry.sickLeave.startDate} - {entry.sickLeave.endDate}</p>
                        : null
                    }
                </div>
            );
        default:
            return assertNever(entry);
    }
};

const PatientPage = ({ patient, diagnoses }: Props) => {
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [error, setError] = useState<string>();
    const [currentPatient, setCurrentPatient] = useState<Patient | null | undefined>(patient);

    const openModal = (): void => setModalOpen(true);
    const closeModal = (): void => {
        setModalOpen(false);
        setError(undefined);
    };

    const submitNewEntry = async (values: EntryWithoutId) => {
        try {
            if (currentPatient) {
                const entry = await patientService.addEntry(currentPatient.id, values);
                const updatedPatient = { ...currentPatient, entries: [...currentPatient.entries, entry] };
                setCurrentPatient(updatedPatient);
                setModalOpen(false);
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                if (error?.response?.data && typeof error?.response?.data === 'string') {
                    const message = error.response.data.replace('Something went wrong. Error: ', '');
                    console.log(message);
                    setError(message);
                } else {
                    setError('Something went wrong');
                }
            } else {
                console.log('unknown error', error);
                setError('unknown error');
            }
        }
    };

    return (
        <div>
            <h1>
                {currentPatient?.name}
                {currentPatient?.gender === 'male' && <MaleIcon />}
                {currentPatient?.gender === 'female' && <FemaleIcon />}
            </h1>
            <p>ssn: {currentPatient?.ssn}</p>
            <p>occupation: {currentPatient?.occupation}</p>
            <AddEntryModal
                onSubmit={submitNewEntry}
                error={error}
                onClose={closeModal}
                modalOpen={modalOpen}
            />
            <Button variant='contained' onClick={() => openModal()}>Add new entry</Button>
            <h4>Entries</h4>
            {currentPatient?.entries.map(e => 
                <div key={e.id}>
                    <Box sx={{ border: '2px solid black', borderRadius: 3, padding: 2, margin: 1 }}>
                        <p>
                            {e.date}
                            {e.type === 'OccupationalHealthcare'
                                ? e.employerName
                                    ? <b><WorkIcon /> {e.employerName}</b>
                                    : <WorkIcon />
                                : <MedicalServicesIcon />
                                }
                        </p>
                        <p><i>{e.description}</i></p>
                        <ul>
                            {e.diagnosisCodes?.map(d => {
                                const diagnosis = diagnoses.find(diagnose => diagnose.code === d)?.name;
                                return <li key={d}>{d} {diagnosis ? diagnosis : null}</li>;
                            })}
                        </ul>
                        <EntryDetails entry={e} />
                        <p>diagnosed by {e.specialist}</p>
                    </Box>
                </div>
            )}
        </div>
    );
};

export default PatientPage;


