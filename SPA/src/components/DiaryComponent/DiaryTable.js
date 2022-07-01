import DeleteIcon from '@mui/icons-material/Delete';
import LinkIcon from '@mui/icons-material/Link';
import { IconButton, Tooltip, Typography } from '@mui/material';
import moment from 'moment';
import MUIDataTable from "mui-datatables";
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilState } from "recoil";
import { deleteDiaryPage, getAllDiaryPage } from '../../request/diaryRequest';
import { diaryPagesAtom, loaderAtom, usersAtom } from "../../state/atom";
import DialogModal from '../DialogModal/DialogModal';
import { ReactComponent as HappyIcon } from "../../assets/happy.svg";
import { ReactComponent as NormalIcon } from "../../assets/normal.svg";
import { ReactComponent as SadIcon } from "../../assets/sad.svg";

const options = {
  filterType: "dropdown",
  resizableColumns: false,
  selectableRows: false
};

const DiaryTable = () => {
  const [user, setUser] = useRecoilState(usersAtom);
  const [diaryPages, setDiaryPages] = useRecoilState(diaryPagesAtom);
  const [loader, setLoader] = useRecoilState(loaderAtom);
  const [openModal, setOpenModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    operations: []
  })

  const columns = [
    {
     name: "id",
     label: "ID",
     options: {
      display: false
     }
    },
    {
     name: "",
     label: " ",
     options: {
      filter: true,
      sort: false,
      customBodyRender: (value, tableMeta, updateValue) => (
        <>
          <IconButton onClick={() => handleButtonDeletePage(tableMeta.rowData[0])}>
            <DeleteIcon />
          </IconButton>
          <Link to={`${tableMeta.rowData[0]}`}>
            <IconButton>
              <LinkIcon />
            </IconButton>
          </Link>
        </>
      )
     }
    },
    {
      name: "text",
      label: "Text",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          if(!value) {
            return "";
          }

          if(value && value.length > 23) {
            const text = `${value.substring(0, 22)}...`;
            return (
              <Tooltip title={value}>
                <Typography>{text}</Typography>
              </Tooltip>
            )
          }

          return value;
        }
      }
    },
    {
     name: "creation_date",
     label: "Creation Date",
     options: {
      filter: true,
      sort: true,
      sortDirection: 'desc',
      customBodyRender: (value, tableMeta, updateValue) => {
        if(value && moment(value).isValid()) {
          return moment(value).format("DD/MM/YYYY HH:mm:ss");
        }
        
        return "";
      }
     }
    },
    {
     name: "sentiment",
     label: "Sentiment",
     options: {
      filter: true,
      sort: false, 
      customBodyRender: (value, tableMeta, updateValue) => {
        if(value) {
          if(value.toLowerCase() === 'positive') {
            return (<HappyIcon/>);
          } else if(value.toLowerCase() === 'negative') {
            return (<SadIcon />);
          } else if(value.toLowerCase() === 'neutral') {
            return (<NormalIcon />);
          }
        }

        return "";
      }
     }
    },
  ];

  const handleButtonDeletePage = async (id = null) => {
    if(!id) {
      return;
    }

    setOpenModal({
      isOpen: true,
      title: "Confirm",
      message: "Are you sure you want to delete the diary page?",
      operations: [
        {
          title: "Cancel",
          handle: () => setOpenModal({
            isOpen: false,
            title: "",
            message: "",
            operations: []
          })
        },
        {
          title: "Confirm",
          color: "error",
          handle: () => handleConfirmDeletePage(id)
        }
      ]
    })
  }

  const handleConfirmDeletePage = async (id = null) => {
    if(!id) {
      return;
    }

    try {
      setLoader(true);

      await deleteDiaryPage(id);
      const diaryPages = await getAllDiaryPage(user.id);
      setDiaryPages(diaryPages);
      
    } catch(e) {
      console.log(e)
    } finally {
      setLoader(false);

      setOpenModal({
        isOpen: false,
        title: "",
        message: "",
        operations: []
      })
    }
  }

  return (
    <>
      {openModal?.isOpen && (
        <DialogModal 
          isOpen={openModal.isOpen} 
          title={openModal.title} 
          message={openModal.message}
          operations={openModal.operations} />
      )}
      <MUIDataTable
        title={"Diary Pages"}
        data={diaryPages}
        columns={columns}
        options={options}
      />
    </>
  )
}

export default DiaryTable;