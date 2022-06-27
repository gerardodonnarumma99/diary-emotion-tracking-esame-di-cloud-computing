import AdapterDateFns from '@mui/lab/AdapterDateFns';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { Container, Grid, Paper, TextField, Typography } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import ChipEmotion from "../components/ChartsComponent/ChipEmotion";
import PieChartEmotionTracking from "../components/ChartsComponent/PieChartEmotionTracking";
import { getDiaryPageByDate } from "../request/diaryRequest";
import { usersAtom } from "../state/atom";

const EmotionTrackingPage = () => {
    const [valueDate, setValueDate] = useState(moment());
    const [countEmotion, setCountEmotion] = useState({
        countNegative: 0,
        countNeutral: 0,
        countPositive: 0
    });
    const [averageScore, setAverageScore] = useState({
        positive: 0,
        neutral: 0,
        negative: 0
    })
    const user = useRecoilValue(usersAtom);

    

    useEffect(() => { getDiaryPageData() }, [user]);

    useEffect(() => getDiaryPageData(), [valueDate]);

    const getDiaryPageData = async () => {
        try {
            if(!user || !user.id) {
                return;
            }
            
            const diaryPageDate = await getDiaryPageByDate(valueDate, user.id);

            if(diaryPageDate && Array.isArray(diaryPageDate)) {
                let countNegative = 0, countNeutral = 0, countPositive = 0;
                let sommaPositiveScore = 0, sommaNeutraleScore = 0, sommaNegativeScore = 0;

                diaryPageDate.map((page) => {
                    //Calculate number sentiment
                    if(page && page?.sentiment && page.sentiment === "negative") {
                        countNegative++;
                    } else if(page && page?.sentiment && page.sentiment === "neutral") {
                        countNeutral++;
                    } else if(page && page?.sentiment && page.sentiment === "positive") {
                        countPositive++;
                    }

                    //Calculate average score
                    if(page && page?.confidence_score) {
                        sommaPositiveScore+=page.confidence_score.positive;
                        sommaNeutraleScore+=page.confidence_score.neutral;
                        sommaNegativeScore+=page.confidence_score.negative;
                        
                    }
                })

                setCountEmotion({
                    countNegative: countNegative,
                    countNeutral: countNeutral,
                    countPositive: countPositive
                })

                setAverageScore({
                    positive: sommaPositiveScore/diaryPageDate.length,
                    neutral: sommaNeutraleScore/diaryPageDate.length,
                    negative: sommaNegativeScore/diaryPageDate.length
                })
            }
        } catch(e) {
            console.log(e);
        }
    }

    const handleChangeDate = (newValue) => {
        setValueDate(newValue);
    };

    return (
        <Container maxWidth="md" sx={{ marginTop: 5, marginBottom: 5 }}>
            <Grid container direction="row" spacing={2}>
                <Grid item xs={12} md={12}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DesktopDatePicker
                            label="Date"
                            inputFormat="dd/MM/yyyy"
                            value={valueDate}
                            onChange={handleChangeDate}
                            disableFuture
                            renderInput={(params) => <TextField {...params} style={{ float: "right" }} />}
                        />
                    </LocalizationProvider>
                </Grid>
                <Grid item xs={12} >
                    <Paper elevation={2} style={{ padding: 15, height: 350 }}>
                        <PieChartEmotionTracking 
                            countNegative={countEmotion.countNegative}
                            countNeutral={countEmotion.countNeutral}
                            countPositive={countEmotion.countPositive} />
                    </Paper>
                </Grid>
                <Grid item xs={12} md={12}>
                    <Paper elevation={2} style={{ padding: 10, textAlign: "center" }}>
                        <Typography style={{ marginBottom: 15 }}>Average Total Score</Typography>
                        <ChipEmotion 
                            positive={isNaN(averageScore.positive) ? 0 : averageScore.positive} 
                            neutral={isNaN(averageScore.neutral) ? 0 : averageScore.neutral} 
                            negative={isNaN(averageScore.negative) ? 0 : averageScore.negative} />
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    )
}

export default EmotionTrackingPage;