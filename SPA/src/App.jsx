import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useRecoilState } from "recoil";
import { loginRequest } from "./authConfig";
import ResponsiveAppBar from "./components/AppBar/ResponsiveAppBar";
import { callMsGraph } from "./graph";
import DiaryPage from "./pages/DiaryPage";
import DiarySinglePage from "./pages/DiarySinglePage";
import EmotionTrackingPage from "./pages/EmotionTrackingPage";
import Home from "./pages/Home";
import { getAllDiaryPage } from "./request/diaryRequest";
import { getUserById, saveUser } from "./request/userRequest";
import { diaryPagesAtom, loaderAtom, usersAtom } from './state/atom';
import "./styles/App.css";

export default function App() {
    const isAuthenticated = useIsAuthenticated();
    const { instance, accounts } = useMsal();
    const [userData, setUserData] = useRecoilState(usersAtom);
    const [diaryPages, setDiaryPages] = useRecoilState(diaryPagesAtom);
    const [loader, setLoader] = useRecoilState(loaderAtom);

    useEffect(() => {
        if(isAuthenticated) {
            getProfilDataAndSaveUser()
        }
    }, [isAuthenticated])

    useEffect(() => {
        getDiaryPages()
    }, [userData])

    const getProfilDataAndSaveUser = async () => {
        setLoader(true);

        try {
            const response = await instance.acquireTokenSilent({
                ...loginRequest,
                account: accounts[0]
            })
    
            const userMsGraph = await callMsGraph(response.accessToken);
            const userData = await getUserById(userMsGraph.id);
            
            if(!userData) {
                const userDataSaved = await saveUser(userMsGraph);
                setUserData(userDataSaved);
            }
    
            setUserData(userData);
        } catch(e) {
            console.log(e);
            handleSignOut("redirect");
        } finally {
            setLoader(false);
        }
    }

    const handleSignOut = (logoutType) => {
        if(!instance || !instance.logoutPopup || !instance.logoutRedirect) return;

        if (logoutType === "popup") {
            instance.logoutPopup({
                postLogoutRedirectUri: "/",
                mainWindowRedirectUri: "/"
            });
        } else if (logoutType === "redirect") {
            instance.logoutRedirect({
                postLogoutRedirectUri: "/",
            });
        }
      }

    const getDiaryPages = async () => {
        try {
            const pages = await getAllDiaryPage(userData.id);
            setDiaryPages(pages);
        } catch(e) {
            console.log(e);
        }
    }
    
    return (
        <BrowserRouter>
            <Routes>   
                <Route path="/*" element= {<ResponsiveAppBar />}/>
            </Routes>
            <Routes>
                <Route exact path="/" element={<Home />} />
            </Routes>
            <Routes>
                <Route exact path="/diary" element={<DiaryPage />} />
            </Routes>
            <Routes>
                <Route path="/diary/:id" element={<DiarySinglePage />} />
            </Routes>
            <Routes>
                <Route path="/emotion-tracking" element={<EmotionTrackingPage />} />
            </Routes>
        </BrowserRouter>
    );
}
