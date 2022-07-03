
import React from "react";
import { Paper } from "@material-ui/core";
import Header from "../definitions/header";
import Definitions from "../definitions/definitions";
import CircularProgress from '@mui/material/CircularProgress';
import Modal from '@mui/material/Modal';
import { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import dictionaryApi from "../frontend_api/DictionaryApi"


const style = {
  position: 'absolute',
  top: '45%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50%',
  height: '60%',
  bgcolor: '#202020',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const ModalDic = ({ openModalDic, setOpenModalDic, startText, word, addError,saveWordAndTime}) => {
  const [meaning_list, setMeaning_list] = useState([])
  const [isLoadingMeanings, setIsloadingMeanings] = useState(false)
  const [headerError, setheaderError] = useState(false)
  const handleClose = () => {
    setOpenModalDic(false);
  }

  useEffect(() => {
    if (word != "") {
      setIsloadingMeanings(true);
      callDictionaryApi(word);
    }
    console.log(word, 'word in ModalDic useEffect');
  }, [word]);

  const callDictionaryApi = async (word) => {
    console.log("callDictionaryApi is called");
    let data = await dictionaryApi("en", word);
    console.log(data, 'data');
    setIsloadingMeanings(false);
    if (data) {
      setheaderError(false);
      setMeaning_list(data);

    } else {
      // falseが返ってきた場合
      setheaderError(true);

    }
  }

  return (
    <div>
      <Modal
        open={openModalDic}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
      >
        <Box sx={style}>
          <Paper elevation={5} style={{ height: "100%", overflow: "scroll", backgroundColor: "#202020" }} >
            <Header
              style={{ height: "20%", backgroundColor: "#202020" }}
              word={word}
              headerError={headerError}
            />
            {isLoadingMeanings && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80%' }}>
                <CircularProgress />
              </div>
            )}
            {!isLoadingMeanings && word != "" &&
              <Definitions style={{ height: "80%" }}
                meaning_list={meaning_list}
                word={word}
                startText={startText}
                saveWordAndTime={saveWordAndTime}
                addError={addError}
                handleClose={handleClose}
              />
            }
          </Paper>
        </Box>
      </Modal>
    </div>
  );
}

export default ModalDic;