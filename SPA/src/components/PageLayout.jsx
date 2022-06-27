import { Container } from "@mui/material";
import ResponsiveAppBar from "./AppBar/ResponsiveAppBar";
import FullScreenLoader from "./FullScreenLoader/FullScreenLoader";
import SnackbarCustom from "./SnackbarCustom/SnackbarCustom";

export const PageLayout = (props) => {

    return (
        <ResponsiveAppBar>
            <Container>
                <FullScreenLoader />
                <SnackbarCustom />
                {props.children}
            </Container>
        </ResponsiveAppBar>
    );
};
