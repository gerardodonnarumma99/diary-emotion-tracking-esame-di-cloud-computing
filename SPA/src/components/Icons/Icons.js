import SentimentDissatisfiedTwoToneIcon from '@mui/icons-material/SentimentDissatisfiedTwoTone';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltTwoToneIcon from '@mui/icons-material/SentimentSatisfiedAltTwoTone';
import SentimentVeryDissatisfiedTwoToneIcon from '@mui/icons-material/SentimentVeryDissatisfiedTwoTone';
import SentimentVerySatisfiedTwoToneIcon from '@mui/icons-material/SentimentVerySatisfiedTwoTone';
import useStylesIcons from './useStylesIcons';

const SimpleHappyIcon = () => {
    const classes = useStylesIcons();
    return (<SentimentSatisfiedAltTwoToneIcon className={classes.happyIcons} />);
}

const SuperHappyIcon = () => {
    const classes = useStylesIcons();
    return (<SentimentVerySatisfiedTwoToneIcon className={classes.happyIcons} />);
}

const SimplySadIcon = () => {
    const classes = useStylesIcons();
    return (<SentimentDissatisfiedTwoToneIcon className={classes.sadIcons} />);
}

const VerySadIcon = () => {
    const classes = useStylesIcons();
    return (<SentimentVeryDissatisfiedTwoToneIcon className={classes.sadIcons} />);
}

const NormalSmileIcon = () => {
    const classes = useStylesIcons();
    return (<SentimentSatisfiedIcon className={classes.normalIcons} />);
}

export {
    SimpleHappyIcon,
    SuperHappyIcon,
    SimplySadIcon,
    VerySadIcon,
    NormalSmileIcon
};
