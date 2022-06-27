import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import IconButton from '@mui/material/IconButton';
import AudioReactRecorder, { RecordState } from 'audio-react-recorder';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import "./styleRecorder.css";

const RecorderComponent = ({ handleSaveAudio, handleSetDisabled }) => {
    const [record, setRecord] = useState(null);
    const [audioData, setAudioData] = useState(null);

    useEffect(() => {
        saveAudioFile()
    }, [audioData])

    const handleStart = () => {
        setRecord(RecordState.START);
        handleSetDisabled(true);
    }

    const handleStop = () => {
        setRecord(RecordState.STOP);
        handleSetDisabled(false);
    }

    const onStop = (audio) => {
        setAudioData(audio);
    }

    const resetAudioData = () => {
        setAudioData(null);
    }

    const saveAudioFile = () => {
        if(!audioData) {
            return;
        }

        handleSaveAudio(audioData);
        resetAudioData();
    }

    return (
        <>
            <AudioReactRecorder state={record} onStop={onStop} />
            <IconButton aria-label="play" onClick={handleStart} disabled={record === "start"}>
                <PlayArrowIcon />
            </IconButton>
            <IconButton aria-label="stop" onClick={handleStop} disabled={record === "stop" || !record}>
                <StopIcon />
            </IconButton>
        </>
    )
}

RecorderComponent.propTypes = {
    handleSaveAudio: PropTypes.func.isRequired
};

export default RecorderComponent;