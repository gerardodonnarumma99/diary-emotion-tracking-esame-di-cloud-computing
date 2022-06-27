import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useRecoilState } from 'recoil';
import { loaderAtom } from '../../state/atom';

export default function FullScreenLoader() {
  const [loader, setLoeader] = useRecoilState(loaderAtom);

  return (
    <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loader}
    >
        <CircularProgress color="inherit" />
    </Backdrop>
  );
}