import * as React from 'react';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useRecoilState } from "recoil"
import { snackbarAtom } from "../../state/atom"

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function SnackbarCustom() {
  const [snackbar, setSnackbar] = useRecoilState(snackbarAtom)

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbar({
        isOpen: false,
        message: "",
        severity: "success"
    })
  };

  return (
    snackbar && snackbar.isOpen ? (
        <Stack spacing={2} sx={{ width: '100%' }}>
        <Snackbar open={snackbar.isOpen} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
            </Alert>
        </Snackbar>
        </Stack>) : null
  );
}