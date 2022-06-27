import { atom } from 'recoil';
import { themeDefault } from '../theme/constant';

const usersAtom = atom({
    key: 'usersState',
    default: null
});

const diaryPagesAtom = atom({
    key: 'diaryPagesState',
    default: []
});

const loaderAtom = atom({
    key: 'loaderState',
    default: false
});

const snackbarAtom = atom({
    key: "snackbarState",
    default: { 
        isOpen: false, 
        message: "", 
        severity: "" 
    }
})

const themeAtom = atom({
    key: "themeState",
    default: { 
        primary: themeDefault.primary,
        secondary: themeDefault.secondary 
    }
})

export { 
    usersAtom, 
    diaryPagesAtom, 
    loaderAtom, 
    snackbarAtom,
    themeAtom
};