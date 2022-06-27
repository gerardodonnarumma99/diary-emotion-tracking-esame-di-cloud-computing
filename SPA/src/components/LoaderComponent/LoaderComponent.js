import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useRecoilValue } from 'recoil';
import { loaderAtom } from "../../state/atom";

const LoaderComponent = ({ styleBox, styleIcon }) => {
    const loader = useRecoilValue(loaderAtom)

    const getLoader = () => {
        if(loader) {
            return (
                <Box style={styleBox}>
                    <CircularProgress style={styleIcon}/>
                </Box>
            )
        }

        return null
    }

    return(getLoader())
}

export default LoaderComponent;