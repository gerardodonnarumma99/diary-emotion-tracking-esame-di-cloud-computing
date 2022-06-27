import { Container, Grid, Paper } from '@mui/material';
import { gsap } from "gsap";
import { useLayoutEffect, useState } from "react";
import { useRecoilState } from "recoil";
import DiaryInput from "../components/DiaryComponent/DiaryInput";
import DiaryTable from "../components/DiaryComponent/DiaryTable";
import { getAllDiaryPage, saveDiaryPage } from "../request/diaryRequest";
import { diaryPagesAtom, loaderAtom, snackbarAtom, usersAtom } from "../state/atom";

const DiaryPage = () => {
    const [user, setUser] = useRecoilState(usersAtom);
    const [diary, setDiary] = useRecoilState(diaryPagesAtom);
    const [snackbar, setSnackbar] = useRecoilState(snackbarAtom);
    const [loader, setLoader] = useRecoilState(loaderAtom);
    const [elDiaryInput, setElDiaryInput] = useState([]);
    const [elDiaryTable, setElDiaryTable] = useState([]);

    useLayoutEffect(() => {
        if (!elDiaryInput || !elDiaryTable) return;
        gsap.from(elDiaryInput, {
            duration: 3, opacity: 0, scale: 0.5
        });
        gsap.from(elDiaryTable, {
            duration: 3, opacity: 0, scale: 0.5
        });
    }, [elDiaryInput, elDiaryTable]);

    const handleSavePageDiary = async (text) => {
        const page = {
            text: text,
            userId: user.id
        }

        try {
            setLoader(true);

            await saveDiaryPage(text, user.id);
            const diaryPages = await getAllDiaryPage(user.id);

            setDiary(diaryPages);
            setSnackbar({
                isOpen: true,
                message: "Page added successfully!",
                severity: "success"
            })
        } catch(e) {
            setSnackbar({
                isOpen: true,
                message: e?.message || "",
                severity: "error"
            })
        } finally {
            setLoader(false);
        }
    }

    return (
        <Container maxWidth="md" sx={{ marginTop: 5, marginBottom: 5 }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Paper ref={setElDiaryInput} elevation={2} style={{ padding: 15 }}>
                        <DiaryInput 
                            titleLabel="Diary Page" 
                            titleButtonSave="Insert Page" 
                            handleSavePage={handleSavePageDiary} />
                    </Paper>
                </Grid>
                <Grid ref={setElDiaryTable} item xs={12} >
                    <DiaryTable />
                </Grid>
            </Grid>
        </Container>
    )
};

export default DiaryPage;