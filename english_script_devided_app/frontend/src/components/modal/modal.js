import React from "react";
import { useState } from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useDjangoApiContext } from "../frontend_api/DjangoApi";
import { useUserContext } from "../userContext/userContext";
import { Row, Col } from "react-bootstrap";
import CssTextField from "../theme/MuiThemeTextField";
import { TextField } from "@mui/material";
const style = {
  position: 'absolute',
  top: '30%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  height: 200,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const ChildModal = ({ handleWholeClose, v, getAllSavedMovies }) => {
  const [open, setOpen] = React.useState(false);
  const { deleteMovieTask } = useDjangoApiContext()


  const handleDelete = async () => {
    await deleteMovieTask(v)
    handleClose()
    handleWholeClose()
    getAllSavedMovies()
  }

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div style={{ width: "20%", padding: "0" }}>
      <Button style={{ width: "100%", elevation: "0", fontSize: "0.6rem", minWidth: "50px", boxShadow: "none", backgroundColor: "#FF0000" }} size="small" variant="contained" elevation={0} onClick={() => handleOpen()}>Delete</Button>
      <Modal
        hideBackdrop
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style, width: "auto", height: "auto" }}>

          <h2 id="child-modal-title" style={{height:"50%"}}>Are you sure ?</h2>
          <Row style={{ justifyContent: "space-evenly", height: "50%"}}>
            <Button style={{ width: "auto", elevation: "0", fontSize: "0.6rem", minWidth: "50px", boxShadow: "none", backgroundColor: "#FF0000", height:"30%" }} size="small" variant="contained" elevation={0} onClick={() => handleDelete()}>
              Yes
            </Button>
            <Button style={{ width: "auto", elevation: "0", fontSize: "0.6rem", minWidth: "50px", boxShadow: "none", backgroundColor: "gray", height: "30%" }} size="small" variant="contained" elevation={0} onClick={() => handleClose()}>
              No
            </Button>
          </Row>

        </Box>
      </Modal>
    </div>
  );
}


const ModalEdit = ({ title, v, getAllSavedMovies }) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { putMovieTask } = useDjangoApiContext()
  const [editValue, setEditValue] = useState("")

  const updateInputValue = (evt) => {
    const val = evt.target.value;
    setEditValue(val);
  }

  const putMovie = async () => {
    await putMovieTask({ title: editValue, v: v });
    getAllSavedMovies();
    handleClose();
  }

  

  return (
    <div>
      <Button style={{ width: "3%", elevation: "0", fontSize: "0.6rem", minWidth: "50px", boxShadow: "none", backgroundColor: "gray" }} size="small" variant="contained" elevation={0} onClick={() => handleOpen()}>
        Edit
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
      >
        <Box sx={style}>
          <Row style={{ alignItems: "center", height: "50%" }}>
            <CssTextField style={{ color:"#FAFAFA"}} defaultValue={title} id="outlined-basic" variant="outlined" size='small' onChange={e => updateInputValue(e)} 
              inputProps={{ style: {color: "#FAFAFA" } }} InputLabelProps={{ style: { color: "#888888"} }}
            />
          </Row>
          <Row style={{ justifyContent: "space-evenly", alignItems: "center", height: "50%", }}>
            <Button style={{ width: "20%", elevation: "0", fontSize: "0.6rem", minWidth: "50px", boxShadow: "none", backgroundColor: "#00CCFF" }} size="small" variant="contained" elevation={0} onClick={() => putMovie()}>
              Save
            </Button>
            <Button style={{ width: "20%", elevation: "0", fontSize: "0.6rem", minWidth: "50px", boxShadow: "none", backgroundColor: "gray" }} size="small" variant="contained" elevation={0} onClick={() => handleClose()}>
              Cancel
            </Button>
            <ChildModal handleWholeClose={() => handleClose()} v={v} getAllSavedMovies={getAllSavedMovies} />
          </Row>

        </Box>
      </Modal>
    </div>
  );
}

export default ModalEdit;