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
import ModalEdit from "../modal/modal";
import axios from "axios";

const base_url = "https://www.youtube.com/embed/"


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

  const { onYouTubeIframeAPIReady, onPlayerStateChange, seekVideo, loadVideo, currentTime } = useYoutubeIframeApiContext()

  const { user, displayName } = useUserContext()

  // json(title, v) 一次元配列
  const [movie_list_unregisterd, setMovie_list_unregisterd] = useState([]);
  // json(list_id, word) 二次元配列
  const [word_list_unregisterd, setWord_list_unregisterd] = useState([]);
  // 連想配列でmovieのidから上記二つの配列のindexを検索
  const [mapping, setMapping] = useState({});
  
  // userが非登録userであるかrender前に判定しておく．useEffectでの実行だとrenderが終わった後にしか実行されないため, 適さない．

  useEffect(() => {
    // setTimeoutで時差を作ると常にwindow.YT==trueになるのでIFrame Player API の読み込みの読み込みに時間かかっている模様．(main.jsの方がiframe_apiよりも読み込みが早い)
    if (!window.YT) { // If not, load the script asynchronously
      setTimeout(() => {
        onYouTubeIframeAPIReady();
      }, 1000);
    } else {
      // If script is already there, load the video directly
      onYouTubeIframeAPIReady();
    }
    // アカウント別のmovieをリロード時に取得
    getSavedMovies();
  }, []);

  useEffect(() => {
    setMovie_list([]);
    setVocabulary_list([]);
    getSavedMovies();
  }, [displayName]);

  
  // video_idが更新されたタイミングで呼ぶ．callYoutubeDataApiに関しては，URLSet時のみで良いため，ここでは呼ばない．
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
    if (word != "") {
      callDictionaryApi(word)
    }
  }, [word]);

  useEffect(() => {
    // currnetTime = 動画が今何秒か．
    if (currentTime != -1 && transcription_list.length != 0) {
      let index = binarySearch(transcription_list, currentTime);
      
      // indexに-1が入るパターンある
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

  // スクロール関係
  const makeRefList = (array) => {
    let refs = array.reduce((acc, value, currentIndex) => {
      acc[currentIndex] = React.createRef();
      return acc;
    }, {});
    setTranscription_list(array)
    setRefs(refs)
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

  const handleScrollTranscript = (id) => {
    // あえて字幕の上に余白を作る（過ぎた字幕も見れるため）
    // 最初の２行だけは動かさない．
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
    // 色かえもここで行う．
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

  const putHeapSavedMovie = (editValue, v) => {
    let index = mapping[v];
    let data = { title: editValue, v: v };
    movie_list_unregisterd[index] = data;
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

  // ヒープ領域
  const heapPostMovie = (title, v) => {
    let data = { title: title, v: v };
    if (v in mapping) {
      // 連想配列に既に登録済みの場合
      // 特に何もしない
    } else {
      // javascriptは配列を代入すると参照渡しになる．useStateしてもstateが変わってないため，意味をなさない．そこで，sliceで値渡しにしてuseStateする.
      movie_list_unregisterd.push(data);
      let list = movie_list_unregisterd.slice();
      setMovie_list(list);
      // word_list_unregisterdにから配列を挿入
      word_list_unregisterd.push([]);
      // movie_list_unregisterd，word_list_unregisterdに対するmovieのindexをmappingに格納
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

  // ヒープ領域 
  const getHeapSavedMovies = () => {
    // console.log("getUnSavedMovies");
  }

  const getSavedMovies = async () => {
    if (displayName == "Unregistered") {
      getHeapSavedMovies();
    } else {
      // json形式で取得
      const all_movies = await getMoviesTask();
      if (all_movies.data != "") {
        setMovie_list(all_movies.data);
      } else {
        // なかった場合は，初期化
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
  }

  return (
    <div style={{ height: "100%" }}>
        <AppNavBar style={{ height: "6%" }} inputURL={inputURL} labelURL={labelURL} onSubmit={onSubmit} setInputURL={setInputURL} ></AppNavBar>
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
                    <Checkbox style={{ width: "100%", color: "#FAFAFA" }} ></Checkbox>
                    {/* ここにオンクリック */}
                    <ListItemButton>
                      <ListItemText style={{ width: "100%", color: "#FAFAFA" }} className="wordlist" id={`text-${item.list_id}`} primary={`${item.word}`} primaryTypographyProps={{ fontSize: '25px' }} onClick={() => changeCurrentTime(item.list_id)} />
                    </ListItemButton>
                  </ListItem>
                </li>
              ))}
            </List>
          </Col>
          <Col xs={9} style={{ height: "100%", display:"flex", alignItems: "center", justifyContent:"center" }}>

              <Row style={{ height: "98%", width:"85%" }}>
                <Col xs={6} style={{ height: "100%" }}>
                  <Paper elevation={5} style={{ height: "50%", backgroundColor:"black" }}>
                    <div id="player"></div>
                  </Paper>
                  <Paper elevation={5} style={{ height: "48%", overflow: "scroll", backgroundColor: "#202020"}} className="mt-3" >
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
                    {!isLoadingMeanings && transcription_list.length != 0 && word != "" &&
                      <Definitions style={{ height: "80%" }}
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
                                  {/* indexで指定しているため，undefinedになり得る */}
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
          <Col xs={2} style={{height:"100%", display:"flex", alignItems:"center", justifyContent:"end"}}>
            <Row style={{height:"98%"}}>
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
                {movie_list.map((item, index) => (
                  <li key={`section-${index}`} >
                    <ListItemButton style={{ width: "100%", backgroundColor: "#202020" }}>
                      <ModalEdit title={item.title} v={item.v} getSavedMovies={getSavedMovies} putUnSavedMovie={putHeapSavedMovie}></ModalEdit>
                      <div style={{ width: "5%" }}></div>
                      <ListItemText style={{ width: "95%", color: "#FAFAFA" }} className="movielist" id={`text-${index}`} primary={`${item.title}`} onClick={() => handleClickToSelectMovie(item.v)} />
                    </ListItemButton>
                    <Divider style={{ height: "0.5px", width: "100%", backgroundColor: "white", }} />
                  </li>
                ))}
              </List>
            </Row>
          </Col>
        </Row>
    </div>
  );
}

export default YoutubePage;