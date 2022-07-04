import React from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { useDjangoApiContext } from "../frontend_api/DjangoApi";
import { UserContext, useUserContext } from "../userContext/userContext";
import { Row, Col } from "react-bootstrap";
const style = {
  position: 'absolute',
  top: '30%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  height: 200,
  bgcolor: '#202020',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const ModalDelete = ({ handleWholeClose, v, getSavedMovies, deleteHeapSavedMovie }) => {
  const [open, setOpen] = React.useState(false);
  const { deleteMovieTask } = useDjangoApiContext()
  const { displayName } = useUserContext()


  const handleDelete = async () => {
    if (displayName == "Unregistered") {
      deleteHeapSavedMovie(v);
    } else {
      await deleteMovieTask(v);
    }
    handleClose();
    handleWholeClose();
    getSavedMovies();
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

          <h2 id="child-modal-title" style={{ height: "50%", color: "#FAFAFA" }}>Are you sure ?</h2>
          <Row style={{ justifyContent: "space-evenly", height: "50%" }}>
            <Button style={{ width: "auto", elevation: "0", fontSize: "0.6rem", minWidth: "50px", boxShadow: "none", backgroundColor: "#FF0000", height: "30%" }} size="small" variant="contained" elevation={0} onClick={() => handleDelete()}>
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

export default ModalDelete;