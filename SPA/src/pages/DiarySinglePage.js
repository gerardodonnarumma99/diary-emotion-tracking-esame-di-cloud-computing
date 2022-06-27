import { Container, Grid, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { ReactComponent as HappyIcon } from "../assets/happy.svg";
import { ReactComponent as NormalIcon } from "../assets/normal.svg";
import { ReactComponent as SadIcon } from "../assets/sad.svg";
import { ReactComponent as SuperHappyIcon } from "../assets/super_happy.svg";
import { ReactComponent as VerySadIcon } from "../assets/very_sad.svg";
import DiaryInput from "../components/DiaryComponent/DiaryInput";
import { getDiaryById, updateDiaryPage } from "../request/diaryRequest";
import { loaderAtom, themeAtom, usersAtom } from "../state/atom";
import { themeHappy, themeNegative, themeNeutral, themeSuperHappy } from "../theme/constant";

const DiarySinglePage = () => {
    const { id } = useParams();
    const [loader, setLoader] = useRecoilState(loaderAtom);
    const [themeState, setThemeState] = useRecoilState(themeAtom);
    const [page, setPage] = useState({})
    const [user, setUser] = useRecoilState(usersAtom);
    const confidenceScoreString = `Score Sentiment: ${page?.confidence_score?.positive || 0} (positive) ${page?.confidence_score?.neutral || 0} (neutral) ${page?.confidence_score?.negative || 0} (negative)`;

    useEffect(() => getPage(),[id]);

    const getPage = async () => {
        setLoader(true);

        try {
            const pageData = await getDiaryById(id);
            setPage(pageData[0])
        } catch(e) {
            console.log(e);
        } finally {
            setLoader(false);
        }
    }

    const handleUpdatePage = async (newText) => {
        setLoader(true);

        try {
            const newPageData = await updateDiaryPage(page.id, newText, user.id);
            setPage(newPageData);
        } catch(e) {
            console.log(e);
        } finally {
            setLoader(false);
        }
    }

    const getIcon = () => {
        if(page?.sentiment?.toLowerCase() === "positive") {
            if(page?.confidence_score?.positive > 0.7) {
                setThemeState(themeSuperHappy);

                return (<SuperHappyIcon />);
            }

            setThemeState(themeHappy);
            return (<HappyIcon/>)
        } else if(page?.sentiment?.toLowerCase() === "negative") {
            setThemeState(themeNegative);

            if(page?.confidence_score?.negative > 0.7) {
                return (<SadIcon />);
            }

            return (<VerySadIcon />);
        } else if(page?.sentiment?.toLowerCase() === "neutral") {
            setThemeState(themeNeutral);
            return (<NormalIcon />);
        }
    }

    return (
        <Container maxWidth="md" sx={{ marginTop: 5, marginBottom: 5 }}>
            {!page && !loader ? (
                <Grid 
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    spacing={2} 
                    style={{ marginBottom: 15 }} >
                    <Grid item xs={12}>
                        <Typography>Non è stato possibile recuperare i dati della pagina di diario!</Typography>
                    </Grid>
                </Grid>
            ) : (
                <Paper elevation={2} style={{ padding: 15 }}>
                    <Grid container spacing={2} style={{ marginBottom: 15 }}>
                        <Grid item md={2} xs={12}>
                            <Typography>Sentiment: {getIcon()}</Typography>
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <Typography>{confidenceScoreString}</Typography>
                        </Grid>
                    </Grid>
                    <DiaryInput
                        initialValue={page?.text}
                        titleLabel="Diary Page" 
                        titleButtonSave="Update Page" 
                        handleSavePage={handleUpdatePage} />
                </Paper>
            )}
        </Container>
    )
}

export default DiarySinglePage;