import { SyntheticEvent, useState, useContext } from "react";
import { Diagnosis, EntryWithoutId, HealthCheckRating } from "../../types";
import DiagnosesContext from "../../context/diagnosesContext";
import {
    OutlinedInput,
    SelectChangeEvent,
    TextField,
    Grid,
    Button,
    InputLabel,
    Select,
    MenuItem
} from "@mui/material";

interface Props {
  onCancel: () => void;
  onSubmit: (values: EntryWithoutId) => void;
}

interface HealthCheckRatingOption {
    value: number;
    label: string;
}

const healthCheckRatingOptions: HealthCheckRatingOption[] =
    Object.values(HealthCheckRating).filter((value) => typeof value === 'number')
        .map((v) => ({
            value: v as number,
            label: HealthCheckRating[v as number]
        }));

const AddEntryForm = ({ onCancel, onSubmit }: Props) => {
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [specialist, setSpecialist] = useState('');
    const [diagnosisCodes, setDiagnosisCodes] = useState<Array<Diagnosis['code']>>([]);
    const [healthCheckRating, setHealthCheckRating] = useState(HealthCheckRating.Healthy);
    const [dischargeDate, setDischargeDate] = useState('');
    const [dischargeCriteria, setDischargeCriteria] = useState('');
    const [employerName, setEmployerName] = useState('');
    const [sickLeaveStart, setSickLeaveStart] = useState('');
    const [sickLeaveEnd, setSickLeaveEnd] = useState('');
    const [entryOptions, setEntryOptions] = useState('');

    const diagnoses = useContext(DiagnosesContext);

    const onHealthCheckRatingChange = (event: SelectChangeEvent<string>) => {
        event.preventDefault();
        const value = Number(event.target.value);
        const healthCheckRating = Object.values(HealthCheckRating);

        if (value && healthCheckRating.includes(value)) {
            setHealthCheckRating(value);
        }
    };

    const onDiagnosisCodesChange = (event: SelectChangeEvent<string[]>) => {
        event.preventDefault();
        const value = event.target.value;
        typeof value === 'string' ? setDiagnosisCodes(value.split(', ')) : setDiagnosisCodes(value);
    };

    const addEntry = (event: SyntheticEvent) => {
        event.preventDefault();
        const baseEntry = {
            description,
            date,
            specialist,
            diagnosisCodes
        };

        switch (entryOptions) {
            case "HealthCheck":
                onSubmit({
                    type: "HealthCheck",
                    ...baseEntry,
                    healthCheckRating
                });
                break;
            case "Hospital":
                onSubmit({
                    type: "Hospital",
                    ...baseEntry,
                    discharge: {
                        date: dischargeDate,
                        criteria: dischargeCriteria
                    }
                });
                break;
            case "OccupationalHealthcare":
                onSubmit({
                    type: "OccupationalHealthcare",
                    ...baseEntry,
                    employerName: employerName,
                    sickLeave: sickLeaveStart && sickLeaveEnd ? {
                        startDate: sickLeaveStart,
                        endDate: sickLeaveEnd
                    } : undefined
                });
            }
        };

    return (
        <div>
            <h1>New HealthCheck Entry</h1>
            <form onSubmit={addEntry}>
                <InputLabel>Entry Options</InputLabel>
                <Select
                    label="Option"
                    fullWidth
                    value={entryOptions}
                    onChange={({ target }) => setEntryOptions(target.value)}
                >
                    <MenuItem key="HealthCheck" value="HealthCheck">Health Check</MenuItem>
                    <MenuItem key="Hospital" value="Hospital">Hospital</MenuItem>
                    <MenuItem key="OccupationalHealthcare" value="OccupationalHealthcare">Occupational Healthcare</MenuItem>
                </Select>
                <InputLabel>Description</InputLabel>
                <TextField
                    label="description"
                    value={description}
                    onChange={({ target }) => setDescription(target.value)}
                />
                <InputLabel>Date</InputLabel>
                <TextField
                    type="date"
                    value={date}
                    onChange={({ target }) => setDate(target.value)}
                />
                <InputLabel>Specialist</InputLabel>
                <TextField
                    label="specialist"
                    value={specialist}
                    onChange={({ target }) => setSpecialist(target.value)}
                />
                <InputLabel>Diagnosis Code</InputLabel>
                <Select
                    label="Diagnosis codes"
                    multiple
                    value={diagnosisCodes}
                    onChange={onDiagnosisCodesChange}
                    input={<OutlinedInput label="Multiple Select" />}
                >
                    {diagnoses.map((d) => (
                        <MenuItem key={d.code} value={d.code}>{d.code}</MenuItem>
                    ))}
                </Select>
                {entryOptions === "HealthCheck" && 
                    <>
                        <InputLabel>HealthCheckRating</InputLabel>
                        <Select
                            label="HealthCheckRating"
                            value={healthCheckRating.toString()}
                            onChange={onHealthCheckRatingChange}
                        >
                            {healthCheckRatingOptions.map(o => 
                                <MenuItem key={o.label} value={o.value}>{o.label}</MenuItem>
                                )}
                        </Select>
                    </>
                }
                {entryOptions === "Hospital" && 
                    <>
                        <InputLabel>Discharge Date</InputLabel>
                        <TextField 
                            type="date"
                            value={dischargeDate}
                            onChange={({ target }) => setDischargeDate(target.value)} 
                        />
                        <InputLabel>Discharge Criteria</InputLabel>
                        <TextField 
                            label="discharge criteria"
                            value={dischargeCriteria}
                            onChange={({ target }) => setDischargeCriteria(target.value)}
                        />
                    </>
                }
                {entryOptions === "OccupationalHealthcare" && 
                    <>
                        <InputLabel>Employer Name</InputLabel>
                        <TextField 
                            label='employer name'
                            value={employerName}
                            onChange={({ target }) => setEmployerName(target.value)}
                        />
                        <InputLabel>Sick Leave:</InputLabel>
                        <InputLabel>Start Date</InputLabel>
                        <TextField 
                            type="date"
                            value={sickLeaveStart}
                            onChange={({ target }) => setSickLeaveStart(target.value)}
                        />
                        <InputLabel>End Date</InputLabel>
                        <TextField 
                            type="date"
                            value={sickLeaveEnd}
                            onChange={({ target }) => setSickLeaveEnd(target.value)}
                        />
                    </>
                }
                <Grid>
                    <Grid item>
                        <Button
                            color="secondary"
                            style={{ float: "left" }}
                            variant="contained"
                            type="button"
                            onClick={onCancel}
                        >
                            cancel
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button
                            style={{ float: "right" }}
                            variant="contained"
                            type="submit"
                        >
                            Add
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </div>
    );
};

export default AddEntryForm;