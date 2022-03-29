import React, { Component } from "react";
import { Grid, Button, ButtonGroup, Typography } from "@material-ui/core";
import CssTextField from "../theme/MuiThemeTextField";
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
import youtubeDataApi from "../frontend_api/YoutubeDataApi";
import { useYoutubeIframeApiContext } from "../frontend_api/YoutubeIframeApi";


const base_url = "https://www.youtube.com/embed/"


const YoutubePage = () => {
  const [inputURL, setInputURL] = useState("")
  const [labelURL, setLabelURL] = useState("URL")
  const [video_id, setVideo_id] = useState("")
  const [title, setTitle] = useState("")
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

  const { getAllMoviesTask, postMovieTask, getAllWordsTask, postWordTask } = useDjangoApiContext()

  const { onYouTubeIframeAPIReady, onPlayerStateChange, seekVideo, loadVideo, currentTime } = useYoutubeIframeApiContext()

  const { user } = useUserContext()


  useEffect(() => {
    onYouTubeIframeAPIReady();
    // アカウント別のmovieをリロード時に取得
    getAllSavedMovies();
  }, []);

  const callYoutubeDataApi = async (v) => {
    let data = await youtubeDataApi(v)
    let givenTitle = data.items[0].snippet.localized.title;
    setTitle(givenTitle)
    postMovie(givenTitle, v)
  }

  useEffect(() => {
    setInputURL("")
    setLabelURL("URL")
    setWord("")
    setList_id("")
    if (video_id != "") loadVideo(video_id)
  }, [video_id]);

  // useEffect(() => {
  //   // console.log(refs[0].current, 'refs[0].current in useEffect');
  //   console.log(Object.keys(refs).length, 'Object.keys(refs).length');
  //   console.log(transcription_list.length, 'transcription_list.length');
  //   console.log(refs, 'refs');
  //   if (Object.keys(refs).length > 0 && transcription_list.length > 0){
  //     console.log(refs[0], 'refs[0]');
  //     console.log(refs[3], 'refs[3]');
  //     console.log(refs[0].current, 'refs[0].current');
  //     console.log(refs[3].current, 'refs[3].current');
  //     console.log(refs[0]["current"], 'refs[0]["current"]');


  //   }
  //   if (Object.keys(refs).length > 0 && transcription_list.length > 0 && refs[0].current != null) {
  //     console.log("call onPlayerStateChange2")
  //     onPlayerStateChange2(transcription_list);
  //   }
  // }, [refs]);  

  useEffect(() => {
    if (word != "") {
      callDictionaryApi(word)
    }
  }, [word]);

  useEffect(() => {
    if (currentTime != 0 && transcription_list.length != 0) {
      let index = binarySearch(transcription_list,currentTime);
      handleClickToScroll(index);
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



  const methodAtSameTime = (v) => {
    setVideo_id(v)
    getAllSavedWords(v)
    getYoutubeTranscript(v)
  }


  const saveWordAndTime = async () => {
    if (list_id == "") {
      setAddError(true)
    } else {
      setAddError(false)
      await postWordTask(video_id, { word: word, list_id: list_id, v: video_id });
      getAllSavedWords(video_id);
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

  const getAllSavedWords = async (v) => {
    const all_words = await getAllWordsTask(v);
    // 文字列で条件分岐後で修正
    if (all_words.data == "Not found Movie in word_api_view"){
      setVocabulary_list([])
    } else if (all_words.data != "") {
      setVocabulary_list(all_words.data)
    } else {
      // なかった場合は，初期化
      setVocabulary_list([])
    }

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
            item.startText = minutes.toString().padStart(2, '0') + ':' +
            seconds.toString().padStart(2, '0');
          })
          makeMarginToTranscription1(v,data);
        })
      .catch((error) => {
        setLabelURL("No transcript for this video.")
        makeRefList([{ "start": "Sorry,", "text": " No transcript for this video." },]);
      }
      );
  }

  // const onPlayerStateChange2 = (array) => {
  //   if (array.length != 0) {
  //     // playerの状態が変わった瞬間にどこにスクロールするべきかを二分探索で求める
  //     let index = binarySearch(array);
  //     // スクロール発火
  //     handleClickToScroll(index);
  //     let currentTime = getCurrentTime()
  //     // 状態が変わるまで，もしくは，array最後まで１行スクロールを繰り返す
  //     let interval = array[index].start - currentTime;
  //     while (index < array.length) {
  //       setTimeout(handleClickToScroll(refs, index), interval)
  //       interval = array[index].duration;
  //       index += 1;
  //     }
  //   }
  // }

  // 余白追加
  const makeMarginToTranscription1 = (v,array) => {
    const margin_arr = [...Array(6)].map(() => new Object());
    margin_arr.map((item) => {
      item.text = ""
      item.start = array[0].start
      item.startText = ""
    });

    // array = margin_arr.concat(array);
    makeRefList(array);
    makeTwoDimensionalArray(array);
  }

  // スクロール関係
  const makeRefList = (array) => {
    let refs = array.reduce((acc, value, currentIndex) => {
      acc[currentIndex] = React.createRef();
      return acc;
    }, {});
    setTranscription_list(array)
    setRefs(refs)
    // onPlayerStateChange2(array)
    setIsloadingTranscript(false)
  }

  // transcriptionを二次元配列化
  const makeTwoDimensionalArray = (array) => {
    let twoDimensionalArray = []
    array.forEach((item) => {
      let newText = item.text.split(" ");
      twoDimensionalArray.push(newText);
    })
    setTwoDimensionalArray(twoDimensionalArray);
    // makeMarginToTranscription2(twoDimensionalArray)
  }

  const handleClickToScroll = (id) => {
    // あえて字幕の上に余白を作る（過ぎた字幕も見れるため）
    // id = Number(id) - 6;
    id = Number(id+1)

    refs[id].current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
    // seekVideo(transcription_list[id].start)
  }

  const handleClickToScrollForWord = (id) => {
    id = Number(id)

    refs[id].current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
    seekVideo(transcription_list[id].start)
  }
  const handleClickToMoveMovie = (startTime) => {
    seekVideo(startTime);
  }

  const handleClickToSearch = (word, list_id) => {
    setWord(word);
    setList_id(list_id);
  }

  const handleClickToSelectMovie = (v) => {
    methodAtSameTime(v)
  }

  const handleClickToDisplay = () => {
    // check

    setDisplay_transcription(prev => !prev);
  }

  // URLinput
  const updateInputValue = (evt) => {
    const val = evt.target.value;
    setInputURL(val)
  }

  const postMovie = async (title, v) => {

    await postMovieTask({ title: title, v: v });
    getAllSavedMovies();
  }

  const getAllSavedMovies = async () => {
    // json形式で取得
    const all_movies = await getAllMoviesTask();
    if (all_movies.data != "") {
      setMovie_list(all_movies.data)
    } else {
      // なかった場合は，初期化
      setMovie_list([])
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoadingVideo(true)
    const url = new URL(inputURL);
    const params = new URLSearchParams(url.search);
    for (let param of params) {
      if (param[0] == "v") {
        methodAtSameTime(param[1])
        await callYoutubeDataApi(param[1])
        setIsLoadingVideo(false)
      }
    }
  }

  return (
    <div style={{ height: "100%" }}>
      <AppNavBar style={{ height: "10%" }}></AppNavBar>
      <Row style={{ height: "90%" }}>
        <Col xs={2}>
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
              <li key={item.id}>
                <ul>
                  <ListItem key={`item-${item.list_id}`}>
                    <Checkbox></Checkbox>
                    {/* ここにオンクリック */}
                    <ListItemButton >
                      <ListItemText className="wordlist" id={`text-${item.list_id}`} primary={`${item.word}`} primaryTypographyProps={{ fontSize: '25px' }} onClick={() => handleClickToScrollForWord(item.list_id)} />
                    </ListItemButton>
                  </ListItem>
                </ul>
              </li>
            ))}
          </List>
        </Col>
        <Col xs={8} style={{ height: "100%" }}>

          <Container className="mt-3" style={{ height: "5%" }}>
            <form onSubmit={onSubmit}>
              <Row>
                <Col xs={11}>
                  <CssTextField style={{ margin: "auto auto" }} id="outlined-basic" style={{ width: '100%' }} label={labelURL} error={labelURL!="URL"}  variant="outlined" size='small' value={inputURL} onChange={e => updateInputValue(e)} />
                </Col>
                <Col xs={1}>
                  <Button style={{ margin: "auto auto", width: "100%" }} className="react-button" variant="outlined" type="submit" margin="normal">
                    Confirm
                  </Button>
                </Col>
              </Row>
            </form>
          </Container>
          <Container className="mt-2" style={{ height: "95%" }}>
            <Row style={{ height: "100%" }}>
              <Col xs={6} style={{ height:"100%" }}> 
                <Paper elevation={5} style={{ height: "50%" }}>
                  <div id="player"></div>
                </Paper>
                <Paper elevation={5} style={{ height: "48%", overflow: "scroll" }} className="mt-3" >
                    <Header
                      style={{height:"20%"}}
                      word={word}
                      headerError={headerError}
                    />
                    {isLoadingMeanings && (
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80%' }}>
                        <CircularProgress />
                      </div>
                    )}
                    {!isLoadingMeanings && transcription_list.length != 0 && word != "" &&
                      <Definitions style={{height:"80%"}}
                        meaning_list={meaning_list}
                        word={word}
                        startText={transcription_list[list_id].startText}
                        saveWordAndTime={saveWordAndTime}
                        addError={addError}
                      />
                    }
                </Paper>
              </Col>
              <Col xs={6} style={{ height: "100%" }}>
                <Paper style={{ height: "100%", overflow: "scroll" }}>
                  {isLoadingTranscript ?
                    <Container style={{ justifyContent: 'center', alignItems: 'center', height: "100%" }}>
                      <CircularProgress />
                    </Container>
                    :
                    <Container style={{ height: "100%" }}>
                      <Button variant="text" onClick={() => {
                        handleClickToDisplay()
                      }}>display</Button>
                      <List sx={{
                        bgcolor: 'background.paper',
                        overflow: 'scroll',
                        height: '100%',
                        '& ul': { padding: 0 },
                      }}
                        subheader={<li />}>
                        {display_transcription ? <div>
                          {twoDimensionalArray.map((item, index) => {
                            return (
                              <li className="transcription" key={index} ref={refs[index]} onClick={() => { handleClickToMoveMovie(transcription_list[index].start) }}>
                                {/* indexで指定しているため，undefinedになり得る */}
                                <span className="span_start_text">{transcription_list.length == 0 ? "" : transcription_list[index].startText}</span>
                                {item.map((item2, index2) => {
                                  return (
                                    <span className="span_transcription" key={index2} onClick={() => { handleClickToSearch(item2, index) }} >{item2}</span>
                                  )
                                })}
                              </li>
                            )
                          })}
                        </div> :
                          <div></div>
                        }
                      </List>
                    </Container>
                  }
                </Paper>
              </Col>
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
                    <Divider style={{ "height": "10" }} />
                  </ul>
                </li>
              ))}
            </List>
          </Container>
        </Col>
      </Row>
    </div>
  );
}

export default YoutubePage;