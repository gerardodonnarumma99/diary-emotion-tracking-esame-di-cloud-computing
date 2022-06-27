import { Chip, Grid } from "@mui/material";
import { gsap } from "gsap";
import PropTypes from 'prop-types';
import { useLayoutEffect } from "react";
import { ReactComponent as HappyIcon } from "../../assets/happy.svg";
import { ReactComponent as NormalIcon } from "../../assets/normal.svg";
import { ReactComponent as SadIcon } from "../../assets/sad.svg";

const ChipEmotion = ({ positive, neutral, negative }) => {
    useLayoutEffect(() => {
        gsap.from("#chip_positive", {
            duration: 3,
            rotation: 360
        });

        gsap.from("#chip_neutral", {
            duration: 3,
            rotation: 360
        });

        gsap.from("#chip_negative", {
            duration: 3,
            rotation: 360
        });
    })

    return(
        <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={2} >
            <Grid item xs={12} md={2}>
                <Chip  
                    id="chip_positive"
                    variant="outlined" icon={<HappyIcon />} 
                    label={positive} />
            </Grid>
            <Grid item xs={12} md={2}>
                <Chip 
                    id="chip_neutral"
                    variant="outlined" 
                    icon={<NormalIcon />} 
                    label={neutral} />
            </Grid>
            <Grid item xs={12} md={2}>
                <Chip 
                    id="chip_negative"
                    variant="outlined" 
                    icon={<SadIcon />} 
                    label={negative} />
            </Grid>
        </Grid>
    )
}

ChipEmotion.propTypes = {
    positive: PropTypes.number,
    neutral: PropTypes.number,
    negative: PropTypes.number
};

export default ChipEmotion;