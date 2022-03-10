import React, { Component } from "react";
import { Grid, Button, ButtonGroup, Typography } from "@material-ui/core";
import CssTextField from "../theme/MuiThemeTextField";
import { Row, Col, Container } from "react-bootstrap";
import { Paper, List } from "@material-ui/core";
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

const base_url = "https://www.youtube.com/embed/"


const YoutubePage = () => {
  const [inputURL, setInputURL] = useState("")
  const [src, setSrc] = useState("")
  const [video_id, setVideo_id] = useState("")
  const [transcription_list, setTranscription_list] = useState([])
  const [vocabulary_list, setVocabulary_list] = useState([])
  const [movie_list, setMovie_list] = useState([])
  const [word, setWord] = useState("")
  const [meaning_list, setMeaning_list] = useState([])
  const [time, setTime] = useState("")
  const [isLoadingMeanings, setIsloadingMeanings] = useState(false)
  const [isLoadingTranscript, setIsloadingTranscript] = useState(false)
  const [isLoadingVideo,setIsLoadingVideo] = useState(false)
  const [headerError, setheaderError] = useState(false)
  const [addError, setAddError] = useState(false)
  const [refs, setRefs] = useState({})

  const { postUserTask, getAllMoviesTask, postMovieTask, getAllWordsTask, postWordTask} = useDjangoApiContext()

  const { user } = useUserContext()

  useEffect(()=>{
    console.log("useEffect1!!")
    // アカウント別のmovieをリロード時に取得
    getAllSavedMovies();
  }, []);

  useEffect(() => {
    console.log("useEffect2!!")
    setInputURL("")
  }, [video_id]);



  const setWordWithCalling =  (text)=>{
    setWord(text);
    callDictionaryApi(text);
  }

  const methodAtSameTime = (v) => {
    setVideo_id(v)
    getAllSavedWords(v)
    getYoutubeVideo(v)
    getYoutubeTranscript(v)
  }

  // useEffect(() => {
  //   callDictionaryApi()
  // }, [word]);
  
  const saveWordAndTime = async (time) => {
    if (time == "") {
      setAddError(true)
    } else {
      setAddError(false)
      let list_id = -1;
      // 後で効率化
      transcription_list.forEach((item, index) => {
        if (item.start == time) {
          list_id = index;
        }
      })
      // 該当箇所がなかった場合
      if (list_id == -1) {
        setAddError(true)
      } else {
        await postWordTask({ word: word, list_id: list_id, v:video_id});
        getAllSavedWords(video_id);
      }
    }
  }
  const callDictionaryApi = async (word) => {
    let data = await dictionaryApi("en", word)
    setIsloadingMeanings(false)
    if (data) {
      setheaderError(false)
      setMeaning_list(data)
      
    } else {
      // falseが返ってきた場合
      setheaderError(true);

    }
  }

  const getAllSavedWords = async(v) => {
    const all_words = await getAllWordsTask(v);
    setVocabulary_list(all_words.data)
  }

  // URL系
  const getYoutubeTranscript = async (v) => {
    setIsloadingTranscript(true)
    await fetch(`/api/get-youtube-transcript?v=${v}`)
      .then((response) => response.json()).then(
        (data) => {
          // startを00:00に上書き
          data.forEach((item) => {
            let given_seconds = item.start;
            let hours = Math.floor(given_seconds / 3600);
            let minutes = Math.floor((given_seconds - (hours * 3600)) / 60);
            let seconds = given_seconds - (hours * 3600) - (minutes * 60);
            seconds = Math.floor(seconds);
            item.start = minutes.toString().padStart(2, '0') + ':' +
              seconds.toString().padStart(2, '0');
          })
          makeRefList(data);
        })
      .catch((error) => {
        makeRefList([{ "start": "Sorry,", "text": " no transcript for this video." },]);
      }
      );
  }

  // スクロール関係
  const makeRefList = (list) => {
    let refs = list.reduce((acc, value, currentIndex) => {
      acc[currentIndex] = React.createRef();
      return acc;
    }, {});
    setTranscription_list(list)
    setRefs(refs)
    setIsloadingTranscript(false)
  }

  const handleClickToScroll = (id) => {
    refs[id].current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  const handleClickToSelectMovie = (v) => {
    methodAtSameTime(v)
  }

  // 動画関係
  const getYoutubeVideo = (v) => {
    let src = base_url + v;
    setSrc(src)
  }

  // URLinput
  const updateInputValue = (evt) => {
    const val = evt.target.value;
    setInputURL(val)
  }

  const postMovie = async (title, v) => {
    
    await postMovieTask({displayName:user.displayName, title: title, v: v });
    getAllSavedMovies();
  }

  const getAllSavedMovies = async() => {
    // json形式で取得
    const all_movie = await getAllMoviesTask();
    setMovie_list(all_movie.data)
  }

  const onSubmit =  (e) => {
    e.preventDefault();
    setIsLoadingVideo(true)
    const url = new URL(inputURL);
    const params = new URLSearchParams(url.search);
    for (let param of params) {
      if (param[0] == "v") {
        methodAtSameTime(param[1])
        // setVideo_id(param[1])
        // getYoutubeVideo(param[1])
        // getYoutubeTranscript(param[1])
        // getAllSavedWords(param[1]);
        postMovie(param[1], param[1])
        setIsLoadingVideo(false)
      }
    }
  }




  return (
    <Row>
      <AppNavBar></AppNavBar>
      <Col xs={2}>

        <List sx={{
          width: '100%',
          height: 20,
          maxwidth: 50,
          bgcolor: 'background.paper',
          position: 'relative',
          overflow: 'auto',
          maxHeight: '100%',
          '& ul': { padding: 0 },
        }}
          subheader={<li />}>
          {vocabulary_list.map((item, index) => (
            <li key={item.id}>
              <ul>
                <ListItem key={`item-${item.list_id}`}>
                  <Checkbox></Checkbox>
                  {/* ここにオンクリック */}
                  <ListItemButton >
                    <ListItemText className="wordlist" id={`text-${item.list_id}`} primary={`${item.word}`} primaryTypographyProps={{ fontSize: '25px' }} onClick={() => handleClickToScroll(item.list_id)} />
                  </ListItemButton>
                </ListItem>

              </ul>
            </li>
          ))}
        </List>

      </Col>
      <Col xs={8}>
        <Container>
          <Row>
            <Container className="mt-3">
              <form onSubmit={onSubmit}>
                <Row>
                  <Col xs={11}>
                    <Container className="pl-4">
                      <CssTextField style={{ margin: "auto auto" }} id="outlined-basic" style={{ width: '100%' }} label="URL" variant="outlined" size='small' value={inputURL} onChange={e => updateInputValue(e)} />
                    </Container>
                  </Col>
                  <Col xs={1}>

                    <Button style={{ margin: "auto auto", width: "100%" }} className="react-button" variant="outlined" type="submit" margin="normal">
                      Confirm
                    </Button>

                  </Col>
                </Row>
              </form>
            </Container>
            <Container className="mt-2">
              <Row>
                <Col>
                  <Row>
                    <Col><Container>
                      {isLoadingVideo ?
                        <Paper style={{ height: 400, width: 560, overflow: 'auto' }} elevation={5}>  <Container style={{ display: "flex", justifyContent: 'center', alignItems: 'center', height: "100%" }}>
                          <CircularProgress />
                        </Container></Paper>

                        :

                        src == "" ? <Paper style={{ height: 400, width: 560, overflow: 'auto' }} elevation={5}></Paper> : <iframe id='src' style={{ margin: "auto auto" }} width="560" height="400" src={src} title="YouTube video player" frameBorder="10" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>



                      }

                    </Container></Col>
                    <Col>
                      <Container className="vocabulary-zone mt-2">
                        <Paper style={{ height: 430, maxheight: 1000, overflow: 'auto' }} elevation={5}>
                          <Container
                            maxwidth="md"
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              height: "500",
                              justifyContent: "space-evenly",
                            }}
                          >
                            <Header
                              setWord={setWord}
                              setWordWithCalling={setWordWithCalling}
                              headerError={headerError}
                            />

                            {isLoadingMeanings && (
                              <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                <CircularProgress />
                              </Container>
                            )}
                            {!isLoadingMeanings && (
                              <Definitions
                                meaning_list={meaning_list}
                                word={word}
                                setTime={setTime}
                                addWordAndTime={saveWordAndTime}
                                addError={addError}
                              />
                            )}
                          </Container>
                        </Paper>
                      </Container>
                    </Col>
                  </Row>
                </Col>
                <Col>

                  <Paper style={{ height: 845, maxHeight: 1000, overflow: 'auto' }}>
                    {isLoadingTranscript ?
                      <Container style={{ display: "flex", justifyContent: 'center', alignItems: 'center', height: "100%" }}>
                        <CircularProgress />
                      </Container>
                      :
                      <List sx={{
                        width: '100%',
                        maxwidth: 500,
                        bgcolor: 'background.paper',
                        position: 'relative',
                        overflow: 'auto',
                        maxHeight: '100%',
                        '& ul': { padding: 0 },
                      }}
                        subheader={<li />}>
                        {transcription_list.map((item, index) => (
                          // ref追加  
                          <li key={index} ref={refs[index]}>
                            <ul>
                              <ListItem key={`item-${index}`} >
                                <ListItemText primary={`${item.start} : ${item.text}`} />
                              </ListItem>
                            </ul>
                          </li>
                        ))}
                      </List>
                    }

                  </Paper>

                </Col>
              </Row>
            </Container>
          </Row>
        </Container>
      </Col>
      <Col xs={2} >
        <Container className="list-of-movie">
          <List sx={{
            width: '100%',
            maxwidth: 50,
            bgcolor: 'background.paper',
            position: 'relative',
            overflow: 'auto',
            maxHeight: '100%',
            '& ul': { padding: 0 },
          }}
            subheader={<li />}>
            {movie_list.map((item, index) => (
              <li key={`section-${index}`}>
                <ul>
                  <ListItemButton >
                    <ListItemText className="movielist" id={`text-${index}`} primary={`${item.title}`} onClick={() => handleClickToSelectMovie(item.v)} />
                  </ListItemButton>
                </ul>
              </li>
            ))}
          </List>
        </Container>
      </Col>
    </Row>
  );
}

export default YoutubePage;