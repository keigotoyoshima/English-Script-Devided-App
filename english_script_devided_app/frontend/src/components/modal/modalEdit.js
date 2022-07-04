import React from "react";
import { useState } from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useDjangoApiContext } from "../frontend_api/DjangoApi";
import { UserContext, useUserContext } from "../userContext/userContext";
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
  bgcolor: '#202020',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const ModalEdit = ({ title, v, handleCloseRightSideBar, handleOpenModalEdit, setModalEditVideoId, setModalEditTitle}) => {
  const handleOpen = () => {
    handleCloseRightSideBar(false); 
    handleOpenModalEdit(true);
    setModalEditVideoId(v);
    setModalEditTitle(title);
  }

  return (
    <div>
      <Button style={{ width: "3%", elevation: "0", fontSize: "0.6rem", minWidth: "50px", boxShadow: "none", backgroundColor: "gray" }} size="small" variant="contained" elevation={0} onClick={() => handleOpen()}>
        Edit
      </Button>
    </div>
  );
}

export default ModalEdit;