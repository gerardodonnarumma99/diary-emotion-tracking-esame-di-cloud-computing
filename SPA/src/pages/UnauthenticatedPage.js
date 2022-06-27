import { Card, CardContent, Grid, Typography } from "@mui/material";
import betterControlImg from "../assets/better_control.svg";
import healthAwarenessImg from "../assets/health_awareness.svg";
import progressiveLifestyleImg from "../assets/progressive_lifestyle.svg";

const UnauthenticatedPage = () => {
    return (
        <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={3} >
            <Grid item xs={12} md={4} >
                <Card sx={{ maxWidth: 275 }}>
                    <CardContent>
                        <Grid
                            container
                            direction="column"
                            justifyContent="center"
                            alignItems="center" >
                                <Grid item>
                                    <img
                                        src={`${healthAwarenessImg}`}
                                        loading="lazy"
                                        width={70} />
                                </Grid>
                                <Grid item>
                                    <Typography 
                                        sx={{ color: "#507c5c", marginTop: 5 }}
                                        variant="h4" >
                                            Health Awareness
                                    </Typography>
                                </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12} md={4} >
                <Card sx={{ maxWidth: 275 }}>
                    <CardContent>
                        <Grid
                            container
                            direction="column"
                            justifyContent="center"
                            alignItems="center" >
                                <Grid item>
                                    <img
                                        src={`${betterControlImg}`}
                                        loading="lazy"
                                        width={70} />
                                </Grid>
                                <Grid item>
                                    <Typography 
                                        sx={{ color: "#ffc61c", marginTop: 5 }}
                                        variant="h4" 
                                        inline >
                                            Better Control Over Life
                                    </Typography>
                                </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12} md={4} >
                <Card sx={{ maxWidth: 275 }}>
                    <CardContent>
                        <Grid
                            container
                            direction="column"
                            justifyContent="center"
                            alignItems="center" >
                                <Grid item>
                                    <img
                                        src={`${progressiveLifestyleImg}`}
                                        loading="lazy"
                                        width={70} />
                                </Grid>
                                <Grid item>
                                    <Typography 
                                        sx={{ color: "#2d527c", marginTop: 5 }}
                                        variant="h4" >
                                            Progressive Lifestyle
                                    </Typography>
                                </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12} >
                <Typography 
                    sx={{ textAlign: "center" }}
                    variant="h5">
                        Accedi alla piattaforma e inizia a scrivere le tue pagine di diario!
                </Typography>
            </Grid>
        </Grid>
    )
}

export default UnauthenticatedPage;