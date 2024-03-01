import { useState, useEffect } from "react";
//import axios from "axios";
import { Route, Link, Routes, useMatch } from "react-router-dom";
import { Button, Divider, Container, Typography } from '@mui/material';

//import { apiBaseUrl } from "./constants";
import { Patient, Diagnosis } from "./types";

import diagnosesService from './services/diagnosis';
import patientService from "./services/patients";
import PatientListPage from "./components/PatientListPage";
import PatientPage from "./components/PatientListPage/PatientPage";
import DiagnosesContext from "./context/diagnosesContext";

const App = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);

  useEffect(() => {
   // void axios.get<void>(`${apiBaseUrl}/ping`);

    const fetchPatientList = async () => {
      const patients = await patientService.getAll();
      setPatients(patients);
    };
    void fetchPatientList();

    const fetchDiagnosesList = async () => {
      const diagnosesList = await diagnosesService.getAll();
      setDiagnoses(diagnosesList);
    };
    void fetchDiagnosesList();
  }, []);

  const match = useMatch('/patients/:id');
  const patient = match ? patients.find(p => p.id === match.params.id) : null;
  
  return (
    <div className="App">
        <Container>
          <Typography variant="h3" style={{ marginBottom: "0.5em" }}>
            Patientor
          </Typography>
          <Button component={Link} to="/" variant="contained" color="primary">
            Home
          </Button>
          <Divider hidden />
          <DiagnosesContext.Provider value={diagnoses}>
            <Routes>
              <Route path="/" element={<PatientListPage patients={patients} setPatients={setPatients} />} />
              <Route path="/patients/:id" element={<PatientPage patient={patient} diagnoses={diagnoses} />} />
            </Routes>
          </DiagnosesContext.Provider>
        </Container>
    </div>
  );
};

export default App;
