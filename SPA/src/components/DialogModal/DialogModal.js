import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from 'prop-types';

const DialogModal = ({ isOpen = false, title = "", message = "", operations = [] }) => {

    

  return (
    <Dialog
        open={isOpen}
    >
        <DialogTitle>
            {title}
        </DialogTitle>
        <DialogContent>
            <DialogContentText>
            {message}
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            {operations.length > 0 ? operations.map(({ title, color, handle }) => (
                <Button variant="contained" color={color || "primary"} onClick={handle}>{title}</Button>
            )) : null}
        </DialogActions>
    </Dialog>
  );
}

DialogModal.propTypes = {
    isOpen: PropTypes.boolean,
    title: PropTypes.string,
    message: PropTypes.string,
    operations: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.string.isRequired,
        color: PropTypes.string,
        handle: PropTypes.func.isRequired
    }))
};

export default DialogModal;