import React, { Component } from "react";
import { Grid, Button, ButtonGroup, Typography } from "@material-ui/core";
import { Row, Col, Container } from "react-bootstrap";
import { Paper, List, Divider } from "@material-ui/core";
import { ListItemText, ListItem } from "@material-ui/core";
import { Checkbox } from "@material-ui/core";
import dictionaryApi from "../frontend_api/DictionaryApi"
import Header from "../definitions/header";
import Footer from "../definitions/footer";
import Definitions from "../definitions/definitions";
import CircularProgress from '@mui/material/CircularProgress';
import { ListItemButton } from "@mui/material";
import AppNavBar from "../navber/Navbar";
import { useUserContext } from "../userContext/userContext"
import { useState, useEffect } from "react";
import { useDjangoApiContext } from "../frontend_api/DjangoApi";
import { useYoutubeIframeApiContext } from "../frontend_api/YoutubeIframeApi";
import ModalEdit from "../modal/ModalEdit";
import axios from "axios";
import Drawer from '@material-ui/core/Drawer';
import { Box } from "@mui/material";
const base_url = "https://www.youtube.com/embed/"
import { makeStyles } from "@material-ui/core";
import ModalDic from "../modal/ModalDic";
import ModalDelete from "../modal/ModalDelete";
import Modal from '@mui/material/Modal';
import CssTextField from "../theme/MuiThemeTextField";

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


const YoutubePage = () => {
  const [inputURL, setInputURL] = useState("")
  const [labelURL, setLabelURL] = useState("URL")
  const [video_id, setVideo_id] = useState("")
  const [transcription_list, setTranscription_list] = useState([])
  const [display_transcription, setDisplay_transcription] = useState(true)
  const [twoDimensionalArray, setTwoDimensionalArray] = useState([[]])
  const [refs, setRefs] = useState({})
  const [vocabulary_list, setVocabulary_list] = useState([])
  const [movie_list, setMovie_list] = useState([])
  const [word, setWord] = useState("")
  const [list_id, setList_id] = useState("")
  const [meaning_list, setMeaning_list] = useState([])
  const [isLoadingMeanings, setIsloadingMeanings] = useState(false)
  const [isLoadingTranscript, setIsloadingTranscript] = useState(false)
  const [isLoadingVideo, setIsLoadingVideo] = useState(false)
  const [headerError, setheaderError] = useState(false)
  const [addError, setAddError] = useState(false)

  const [activeIndex, setActiveIndex] = useState(-1)

  const { getAllMoviesTask: getMoviesTask, postMovieTask, getAllWordsTask: getWordsTask, postWordTask } = useDjangoApiContext()

  const { onYouTubeIframeAPIReady, onPlayerStateChange, seekVideo, loadVideo, pauseVideo, currentTime } = useYoutubeIframeApiContext()

  const { user, displayName } = useUserContext()

  // json(title, v) ???????????????
  const [movie_list_unregisterd, setMovie_list_unregisterd] = useState([]);
  // json(list_id, word) ???????????????
  const [word_list_unregisterd, setWord_list_unregisterd] = useState([]);
  // ???????????????movie???id??????????????????????????????index?????????
  const [mapping, setMapping] = useState({});

  const [openMovieSideBar, setOpenMovieSideBar] = useState(false);

  const [openModalDic, setOpenModalDic] = useState(false);

  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [modalEditTitle, setModalEditTitle] = useState("");
  const [modalEditVideoId, setModalEditVideoId] = useState("");



  
  // user????????????user????????????render???????????????????????????useEffect??????????????????render???????????????????????????????????????????????????, ???????????????

  useEffect(() => {
    // setTimeout???????????????????????????window.YT==true???????????????IFrame Player API ??????????????????????????????????????????????????????????????????(main.js?????????iframe_api??????????????????????????????)
    if (!window.YT) { // If not, load the script asynchronously
      setTimeout(() => {
        onYouTubeIframeAPIReady();
      }, 1000);
    } else {
      // If script is already there, load the video directly
      onYouTubeIframeAPIReady();
    }
    // ?????????????????????movie???????????????????????????
    getSavedMovies();
  }, []);

  useEffect(() => {
    setMovie_list([]);
    setVocabulary_list([]);
    getSavedMovies();
  }, [displayName]);

  
  // video_id?????????????????????????????????????????????callYoutubeDataApi??????????????????URLSet??????????????????????????????????????????????????????
  useEffect(() => {
    setInputURL("")
    setLabelURL("URL")
    setWord("")
    setList_id("")
    setTwoDimensionalArray([[]])
    setTranscription_list([])
    if (video_id != "") {
      loadVideo(video_id);
      getYoutubeTranscript(video_id);
      getSavedWords(video_id);
    }
  }, [video_id]);



  useEffect(() => {
    // currnetTime = ????????????????????????
    if (currentTime != -1 && transcription_list.length != 0) {
      let index = binarySearch(transcription_list, currentTime);
      
      // index???-1???????????????????????????
      if (index < 0) index = 0;
      
      handleScrollTranscript(index);
    }
  }, [currentTime]);
  
  const binarySearch = (arr, currentTime) => {
    let target = currentTime
    let ok = -1;
    let ng = arr.length;
    while (Math.abs(ng - ok) > 1) {
      let mid = Math.floor((ok + ng) / 2);
      if (arr[mid].start > target) {
        ng = mid;
      } else {
        ok = mid;
      }
    }

    return ok
  }


  const callYoutubeDataApi = async (v) => {
    const api_endpoint = `https://vw0sqj3qmc.execute-api.us-east-1.amazonaws.com/stage_api?v=${v}`;
    axios.get(api_endpoint)
      .then((response) => {
        if (response.data.body.error) {
          console.log("error: ", response.data.body.message);
        } else {
          let title = response.data.body.title;
          postMovie(title, v);
        }
      })
      .catch((error) => {
        console.log("error: ", error);
      })
  }

  // URL???
  const getYoutubeTranscript = async (v) => {
    setIsloadingTranscript(true)
    await fetch(`/api/get-youtube-transcript?v=${v}`)
      .then((response) => response.json()).then(
        (data) => {
          // start???00:00????????????
          data.forEach((item) => {
            let given_seconds = item.start;
            let hours = Math.floor(given_seconds / 3600);
            let minutes = Math.floor((given_seconds - (hours * 3600)) / 60);
            let seconds = given_seconds - (hours * 3600) - (minutes * 60);
            seconds = Math.floor(seconds);
            item.startText = minutes.toString().padStart(2, '0') + ':' +
              seconds.toString().padStart(2, '0');
          })
          makeRefList(data);
          makeTwoDimensionalArray(data);
          // makeMarginToTranscription1(v,data);
        })
      .catch((error) => {
        setTwoDimensionalArray([[]])
        setTranscription_list([])
        console.log(error, 'error in getYoutubeTranscript');
        setLabelURL("No transcript for this video.")
        setIsloadingTranscript(false);
        // makeRefList([{ "startText": "", "start": "Sorry,", "text": " No transcript for this video." },]);
      }
      );
  }

  // ?????????????????????
  const makeRefList = (array) => {
    let refs = array.reduce((acc, value, currentIndex) => {
      acc[currentIndex] = React.createRef();
      return acc;
    }, {});
    setTranscription_list(array)
    setRefs(refs)
    setIsloadingTranscript(false)
  }

  // transcription?????????????????????
  const makeTwoDimensionalArray = (array) => {
    let twoDimensionalArray = []
    array.forEach((item) => {
      let newText = item.text.split(" ");
      twoDimensionalArray.push(newText);
    })
    setTwoDimensionalArray(twoDimensionalArray);
    // makeMarginToTranscription2(twoDimensionalArray)
  }

  const handleScrollTranscript = (id) => {
    // ??????????????????????????????????????????????????????????????????????????????
    // ??????????????????????????????????????????
    let start;
    if (id > 2) {
      start = Number(id) - 2;
    } else {
      start = 0;
    }

    refs[start].current.scrollIntoView({
      behavior: 'auto',
      block: 'start',
    });
    // ??????????????????????????????
    setActiveIndex(id);
  }



  // Word and Movie -----
  const heapPostWord = () => {
    let data = { word: word, list_id: list_id, v: video_id };
    let index = mapping[video_id];
    word_list_unregisterd[index].push(data);
    let list = word_list_unregisterd[index];
    setVocabulary_list(list); 
  }

  const saveWordAndTime = async () => {
    if (list_id == "") {
      setAddError(true)
    } else {
      setAddError(false)
      if (displayName=="Unregistered"){
        heapPostWord();
      }else{
        await postWordTask(video_id, { word: word, list_id: list_id, v: video_id });
      }
      getSavedWords(video_id);
    }
  }

  const putHeapSavedMovie = (editValue, v) => {
    let index = mapping[v];
    let data = { title: editValue, v: v };
    movie_list_unregisterd[index] = data;
    let list = movie_list_unregisterd.slice();
    setMovie_list(list);
  }

  const deleteHeapSavedMovie = (v) => {
    let index = mapping[v];
    movie_list_unregisterd[index].title = "pass";
    let list = movie_list_unregisterd.slice();
    setMovie_list(list);
  }

  const getHeapSavedWords = (v) => {
    let list = [];
    if(v in mapping){
      let index = mapping[v];
      list = word_list_unregisterd[index];
    }
    setVocabulary_list(list); 
  }

  const getSavedWords = async (v) => {
    let all_words = [];
    if (displayName=="Unregistered"){
      getHeapSavedWords(v);
    }else{
      const res = await getWordsTask(v);
      all_words = res.data;
      setVocabulary_list(all_words);
    }
  }

  // ???????????????
  const heapPostMovie = (title, v) => {
    let data = { title: title, v: v };
    if (v in mapping) {
      // ??????????????????????????????????????????
      // delete???????????????????????????????????????????????????
      let index = mapping[v];
      movie_list_unregisterd[index].title = title;
      let list = movie_list_unregisterd.slice();
      setMovie_list(list);
    } else {
      // javascript???????????????????????????????????????????????????useState?????????state??????????????????????????????????????????????????????????????????slice?????????????????????useState??????.
      movie_list_unregisterd.push(data);
      let list = movie_list_unregisterd.slice();
      setMovie_list(list);
      // word_list_unregisterd????????????????????????
      word_list_unregisterd.push([]);
      // movie_list_unregisterd???word_list_unregisterd????????????movie???index???mapping?????????
      mapping[v] = movie_list_unregisterd.length - 1;
    }
  }

  const postMovie = async (title, v) => {
    if (displayName == "Unregistered") {
      heapPostMovie(title, v);
    } else {
      await postMovieTask({ title: title, v: v });
    }
    getSavedMovies();
  }

  // ??????????????? 
  const getHeapSavedMovies = () => {
    // console.log("getUnSavedMovies");
  }

  const getSavedMovies = async () => {
    if (displayName == "Unregistered") {
      getHeapSavedMovies();
    } else {
      // json???????????????
      const all_movies = await getMoviesTask();
      if (all_movies.data != "") {
        setMovie_list(all_movies.data);
      } else {
        // ?????????????????????????????????
        setMovie_list([]);
      }
    }
  }

  // hanedl click or sumit -----
  const changeCurrentTime = (id) => {
    seekVideo(transcription_list[id].start)
  }
  const handleClickToMoveMovie = (startTime) => {
    seekVideo(startTime);
  }

  const handleClickToSearch = (word, list_id) => {
    pauseVideo();
    setOpenModalDic(true);
    setWord(word);
    setList_id(list_id);
  }

  const handleClickToSelectMovie = (v) => {
    setVideo_id(v)
  }

  const handleClickToDisplay = () => {
    setDisplay_transcription(prev => !prev);
  }

 
  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoadingVideo(true);
    const url = new URL(inputURL);
    const params = new URLSearchParams(url.search);
    for (let param of params) {
      if (param[0] == "v") {
        setVideo_id(param[1]);
        await callYoutubeDataApi(param[1]);
        setIsLoadingVideo(false);
      }
    }
    setInputURL("");
    setLabelURL("URL");
  }

  const handleCloseRightSideBar = () => setOpenMovieSideBar(false);
  const handleOpenRightSideBar = () => setOpenMovieSideBar(true);

  const handleCloseModalEdit = () => setModalEditOpen(false);
  const handleOpenModalEdit = () => setModalEditOpen(true);
  

  const { putMovieTask } = useDjangoApiContext()
  const [editValue, setEditValue] = useState("")

  const updateInputValue = (evt) => {
    const val = evt.target.value;
    setEditValue(val);
  }

  const putMovie = async () => {
    console.log("putMvoie is called");
    if (displayName == "Unregistered") {
      putHeapSavedMovie(editValue, modalEditVideoId);
    } else {
      await putMovieTask({ title: editValue, v: modalEditVideoId });
    }
    getSavedMovies();
    handleCloseModalEdit();
  }
  
  // style -----
  const useStyles = makeStyles({
    paper: {
      background: "#202020"
    }
  });

  const classes = useStyles();


  return (
    <div style={{ height: "100%" }}>
      <AppNavBar style={{ height: "6%" }} inputURL={inputURL} labelURL={labelURL} onSubmit={onSubmit} setInputURL={setInputURL} handleOpenRightSideBar={handleOpenRightSideBar}></AppNavBar>
        <Row style={{ height: "94%"}}>
          <Col xs={1} style={{ height: "100%" }}>
            <List sx={{
              width: '100%',
              bgcolor: 'background.paper',
              position: 'relative',
              overflow: 'auto',
              maxHeight: '100%',
              '& ul': { padding: 0 },
            }}
              subheader={<li />}>
              {vocabulary_list.map((item, index) => (
                <li key={item.id} >
                  <ListItem key={`item-${item.list_id}`}>
                    <Checkbox style={{ color: "#FAFAFA", padding:"0px" }} ></Checkbox>
                    {/* ??????????????????????????? */}
                    <ListItemButton>
                      <ListItemText style={{ width: "100%", color: "#FAFAFA" }} className="wordlist" id={`text-${item.list_id}`} primary={`${item.word}`} primaryTypographyProps={{ fontSize: '25px' }} onClick={() => changeCurrentTime(item.list_id)} />
                    </ListItemButton>
                  </ListItem>
                </li>
              ))}
            </List>
          </Col>
          <Col xs={11} style={{ height: "100%", display:"flex", alignItems: "center", justifyContent:"center" }}>

              <Row style={{ height: "98%", width:"98%" }}>
                <Col xs={7} style={{ height: "100%" }}>
                  <Paper elevation={5} style={{ height: "100%", width: "100%", backgroundColor:"black" }}>
                    <div id="player"></div>
                  </Paper>
                  {transcription_list.length != 0 && list_id != "" &&
                    <ModalDic openModalDic={openModalDic} setOpenModalDic={setOpenModalDic} startText={transcription_list[list_id].startText} word={word} addError={addError} saveWordAndTime={saveWordAndTime}></ModalDic>
                  }
                  <Modal
                    open={modalEditOpen}
                    onClose={handleCloseModalEdit}
                  >
                    <Box sx={style}>
                      <Row style={{ alignItems: "center", height: "50%" }}>
                    <CssTextField style={{ color: "#202020" }} defaultValue={modalEditTitle} id="outlined-basic" variant="outlined" size='small' onChange={e => updateInputValue(e)} inputProps={{ style: { color: "#FAFAFA" } }} InputLabelProps={{ style: { color: "#888888" } }}
                        />
                      </Row>
                      <Row style={{ justifyContent: "space-evenly", alignItems: "center", height: "50%", }}>
                        <Button style={{ width: "20%", elevation: "0", fontSize: "0.6rem", minWidth: "50px", boxShadow: "none", backgroundColor: "#00CCFF" }} size="small" variant="contained" elevation={0} onClick={() => putMovie()}>
                          Save
                        </Button>
                        <Button style={{ width: "20%", elevation: "0", fontSize: "0.6rem", minWidth: "50px", boxShadow: "none", backgroundColor: "gray" }} size="small" variant="contained" elevation={0} onClick={() => handleCloseModalEdit()}>Cancel</Button>
                        <ModalDelete handleWholeClose={() => handleCloseModalEdit()} v={modalEditVideoId} getSavedMovies={getSavedMovies} deleteHeapSavedMovie={deleteHeapSavedMovie} />
                      </Row>

                    </Box>
                  </Modal>

                </Col>
                <Col xs={5} style={{ height: "100%" }}>
                  <Paper style={{ height: "100%", overflow: "scroll", backgroundColor: "#202020"}}>
                  <Button style={{ color: "#888888" }} variant="text" onClick={() => {
                    handleClickToDisplay()
                  }}>Transcript</Button>
                    {isLoadingTranscript ?
                      <Container style={{display:"flex", justifyContent: 'center', alignItems: 'center', height: "100%" }}>
                        <CircularProgress />
                      </Container>
                      :
                      <div style={{ height: "100%" }}>
                      
                        <List sx={{
                          overflow: 'scroll',
                          height: '100%',
                        }}>
                          {display_transcription ? <div>
                            {twoDimensionalArray.map((item, index) => {
                              let className = activeIndex==index ? "active":"deactive";
                              return (
                                <li className={className} key={index} ref={refs[index]} style={{ padding: "5px 50px"}} onClick={() => { handleClickToMoveMovie(transcription_list[index].start) }}>
                                  {/* index??????????????????????????????undefined??????????????? */}
                                  <span className="span_start_text" style={{ color: "#3ea6ff", fontWeight: "100", backgroundColor: "#263850"}}>{transcription_list.length == 0 ? "" : transcription_list[index].startText}</span>
                                  {item.map((item2, index2) => {
                                    return (
                                      <span className="span_transcription" key={index2} style={{ color:"#FAFAFA", fontWeight:"100"}} onClick={() => { handleClickToSearch(item2, index) }} >{item2}</span>
                                    )
                                  })}
                                </li>
                              )
                            })}
                          </div> :
                            <div></div>
                          }
                        </List>
                      </div>
                    }
                  </Paper>
                </Col>
              </Row>


          </Col>
        <Drawer anchor='right' open={openMovieSideBar} onClose={handleCloseRightSideBar} classes={{ paper: classes.paper }}>
            {movie_list.length == 0 ?
            <List sx={{
              height: '98%',
              width: '100%',
              maxwidth: 50,
              bgcolor: '#202020',
              position: 'relative',
              overflow: 'auto',
              maxHeight: '100%',
              '& ul': { padding: 0 },
            }}
              subheader={<li />}>
              <li key="no_movie" >
                <ListItemText style={{ width: "100%", color: "#FAFAFA" }} className="movielist"  primary="No movie that you learned in the past yet." />
              </li>
            </List> :
            <List sx={{
              height: '98%',
              width: '100%',
              maxwidth: 50,
              bgcolor: '#202020',
              position: 'relative',
              overflow: 'auto',
              maxHeight: '100%',
              '& ul': { padding: 0 },
            }}
              subheader={<li />}>
              {movie_list.map((item, index) => {
                return item.title == "pass" ?
                  <li key={`section-${index}`} ></li>
                  :
                  <li key={`section-${index}`} >
                    <ListItemButton style={{ width: "100%", backgroundColor: "#202020" }}>
                      <ModalEdit title={item.title} v={item.v} handleCloseRightSideBar={handleCloseRightSideBar} handleOpenModalEdit={handleOpenModalEdit} setModalEditTitle={setModalEditTitle} setModalEditVideoId={setModalEditVideoId} ></ModalEdit>
                      <div style={{ width: "5%" }}></div>
                      <ListItemText style={{ width: "95%", color: "#FAFAFA" }} className="movielist" id={`text-${index}`} primary={`${item.title}`} onClick={() => handleClickToSelectMovie(item.v)} />
                    </ListItemButton>
                    <Divider style={{ height: "0.5px", width: "100%", backgroundColor: "white", }} />
                  </li>
              })}
            </List>
            }
          </Drawer>
        </Row>
    </div>
  );
}

export default YoutubePage;