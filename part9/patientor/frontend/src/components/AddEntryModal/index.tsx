import AddEntryForm from "./AddEntryForm";
import { EntryWithoutId } from "../../types";

import { Alert, Dialog, DialogTitle, DialogContent, Divider } from "@mui/material";

interface Props {
  modalOpen: boolean;
  onClose: () => void;
  onSubmit: (values: EntryWithoutId) => void;
  error?: string;
}

const AddEntryModal = ({ modalOpen, onClose, onSubmit, error }: Props) => (
  <Dialog fullWidth={true} open={modalOpen} onClose={() => onClose()}>
    <DialogTitle>Add a new entry</DialogTitle>
    <Divider />
    <DialogContent>
      {error && <Alert severity="error">{error}</Alert>}
      <AddEntryForm onSubmit={onSubmit} onCancel={onClose}/>
    </DialogContent>
  </Dialog>
);

export default AddEntryModal;