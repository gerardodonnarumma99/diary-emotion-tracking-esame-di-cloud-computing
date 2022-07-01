import { Button, CircularProgress, Grid, TextField, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { getSpeechText } from '../../request/speechTextRequest';
import { loaderAtom, snackbarAtom } from '../../state/atom';
import RecorderComponent from '../RecorderComponent/RecorderComponent';

const useStyle = makeStyles({
    textAreaField: {
        width: "100%"
    },
    buttonInsertPage: {
        float: "right"
    }
})

const DiaryInput = ({ initialValue = "", titleLabel = "", titleButtonSave = "", handleSavePage }) => {
    const classes = useStyle();
    const [text, setText] = useState("");
    const [loadingAudio, setLoadingAudio] = useState(false);
    const [snackbar, setSnackbar] = useRecoilState(snackbarAtom);
    const [loader, setLoader] = useRecoilState(loaderAtom);

    useEffect(() => setText(initialValue), [initialValue]);

    const saveText = () => {
        if(!text || text.trim().length < 3) {
            setSnackbar({
                isOpen: true,
                message: "Please enter at least three characters!",
                severity: "error"
            })
            return;
        }

        handleSavePage(text);
        setText("");
    }

    const handleChangeText = (event) => {
        setText(event.target.value)
    }

    const handleSaveAudio = async (audioData) => {
        if(!audioData) {
            return;
        }

        const audioFile = new File([audioData.blob], "registration_text_diary_page")
        
        try {
            setLoader(true);
            const textAudio = await getSpeechText(audioFile);

            if(textAudio && textAudio?.data?.DisplayText) {
                setText((lastText) => `${lastText} ${textAudio.data.DisplayText}`);
            }
        } catch(e) {
            console.log(e);
        } finally {
            setLoader(false);
        }
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={2} >
                <Typography>Record Audio:</Typography>
            </Grid>
            <Grid item xs={10} style={{ marginTop: "-10px", marginLeft: "-25px" }} >
                <RecorderComponent handleSaveAudio={handleSaveAudio} handleSetDisabled={(loading) => setLoadingAudio(loading)}/>
            </Grid>
            <Grid item xs={12}>
                <TextField
                    id="text_area_diary_page"
                    label={titleLabel}
                    multiline
                    rows={8}
                    className={classes.textAreaField}
                    value={text}
                    onChange={handleChangeText}
                    disabled={loadingAudio}
                    InputProps={{
                        startAdornment: loadingAudio ? (<CircularProgress color="primary" />) : null
                    }}
                />
            </Grid>
            <Grid item xs={12}>
                <Button 
                    variant="contained" 
                    className={classes.buttonInsertPage}
                    onClick={saveText} 
                    style={{ color: "white" }}>
                    {titleButtonSave}
                </Button>
            </Grid>
        </Grid>
    )
}

DiaryInput.propTypes = {
    initialValue: PropTypes.string,
    titleLabel: PropTypes.string,
    titleButtonSave: PropTypes.string,
    handleSavePage: PropTypes.func.isRequired
};
  

export default DiaryInput;