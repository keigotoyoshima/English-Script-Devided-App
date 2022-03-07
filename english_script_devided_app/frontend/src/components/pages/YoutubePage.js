import React, { Component } from "react";
import { Grid, Button, ButtonGroup, Typography } from "@material-ui/core";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import CssTextField from "../theme/MuiThemeTextField";
import { Row, Col, Container } from "react-bootstrap";
import { Paper, List } from "@material-ui/core";
import { ListItemText, ListItem } from "@material-ui/core";
import { Checkbox } from "@material-ui/core";
import dictionaryApi from "../frontend_api/DictionaryApi"
import { useState } from "react";
import Header from "../definitions/header";
import Footer from "../definitions/footer";
import Definitions from "../definitions/definitions";
import CircularProgress from '@mui/material/CircularProgress';
import { filledInputClasses } from "@mui/material";
import { HashLink } from 'react-router-hash-link';
import axios from "axios";
import { createTask, getAllWordsTask, getSingleWordTask } from "../frontend_api/DjangoApi";
import { ListItemButton } from "@mui/material";
import AnchorLink from 'react-anchor-link-smooth-scroll'



const base_url = "https://www.youtube.com/embed/"

let initial_transcription = [];
let initial_refs = {};

export default class YoutubePage extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
      inputURL: '',
      src: "",
      video_id: "",
      transcription: initial_transcription,
      vocabulary_list: [],
      movie_list: ["movie-1", "movie-2", "movie-3"],
      word: "",
      meanings: [],
      time:"",
      isLoadingMeanings: false,
      isLoadingTranscript: false,
      isLoadingVideo: false,
      headerError:false,
      addError:false,
      refs: initial_refs,
    };
  }
  componentDidMount(){
    // ローリングでstateを変えるのでここに配置
    this.getYoutubeTranscript();
    this.getAllSavedWord();
  }

  setWord = (word) => {
    this.setIsLoading("isLoadingMeanings", true);
    this.setState({
      word: word
    });
    this.callDictionaryApi();
  }
  setMeanings = (meanings) => {
    this.setState({
      meanings: meanings
    });
  }
  setIsLoading = (name,flag) => {
    if (name == "isLoadingMeanings"){
      this.setState({
        isLoadingMeanings: flag
      });
    } else if (name == "isLoadingTranscript"){
      this.setState({
        isLoadingTranscript: flag
      });
    } else if (name == "isLoadingVideo"){
      this.setState({
        isLoadingVideo: flag
      });
    }
  }
  setError = (flag) => {
    this.setState({
      headerError: flag
    })
  }
  setTime = (time) => {
    this.setState({
      time: time
    });
  }

  saveWordAndTime = async(time) =>{
    if(time == ""){
      this.setState({addError:true})
    }else{
      this.setState({ addError: false })
      let index_key = -1;
      // 後で効率化
      this.state.transcription.forEach((item, index) => {
        if (item.start == time) {
          index_key = index;
        }
      })
      // 該当箇所がなかった場合
      if (index_key == -1){
        this.setState({ addError: true })
      } else{
        await createTask({ word: this.state.word, key: index_key });
        this.getAllSavedWord();
      }
    }
  }

  async callDictionaryApi() {
    let data = await dictionaryApi("en", this.state.word);
    this.setIsLoading("isLoadingMeanings",false);
    if(data){
      this.setError(false);
      this.setMeanings(data)
    }else{
      // falseが返ってきた場合
      this.setError(true);
    }
  }

  async getAllSavedWord(){
    // json形式で取得
    let all_words = await getAllWordsTask();
    this.setState({
      vocabulary_list:all_words.data
    })
  }

  // URL系
  async getYoutubeTranscript() {
    this.setIsLoading("isLoadingTranscript", true);
    let transcriptin = []
    await fetch("/api/get-youtube-transcript")
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
          transcriptin = data
        })
      .catch((error) => {
        console.log(error);
      }
    );


    this.makeRefList(transcriptin);
  }

  // 動画関係
  getYoutubeVideo() {
    let src = base_url + this.state.video_id;
    this.setState({ src: src });
  }

  // URLinput
  updateInputValue(evt) {
    const val = evt.target.value;
    this.setState({
      inputURL: val
    });
  }
  onSubmit = (e) => {
    e.preventDefault();
    this.setIsLoading("isLoadingVideo", true);
    const url = new URL(this.state.inputURL);
    const params = new URLSearchParams(url.search);
    for (let param of params) {
      if (param[0] == "v") {
        this.setState();
        this.setState({ video_id: param[1] }, () => {
          this.getYoutubeVideo();
          this.setIsLoading("isLoadingVideo", filledInputClasses);
        }); 
      }
    }
  }

  // スクロール関係
  makeRefList(list){
    let refs =  list.reduce((acc, value, currentIndex) => {
      acc[currentIndex] = React.createRef();
      return acc;
    }, {});
    this.setState({
      transcription: list,
      refs: refs
    })
    this.setIsLoading("isLoadingTranscript", false);
  }

  handleClickToScroll(id){  
    this.state.refs[id].current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }



  render() {
    return (
      <Row>
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
              {this.state.vocabulary_list.map((item, index) => (
                <li key={item.id}>
                  <ul>  
                    <ListItem key={`item-${item.list_key}`}>
                      <Checkbox></Checkbox>
                      {/* ここにオンクリック */}
                      <ListItemButton >
                        <ListItemText className="wordlist" id={`text-${item.list_key}`} primary={`${item.word}`} primaryTypographyProps={{ fontSize: '25px' }} onClick={()=>this.handleClickToScroll(item.list_key)} />
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
                <form onSubmit={this.onSubmit}>
                  <Row>
                    <Col xs={11}>
                      <Container className="pl-4">
                        <CssTextField  style={{ margin: "auto auto" }} id="outlined-basic" style={{ width: '100%' }} label="URL" variant="outlined" size='small' value={this.state.inputURL} onChange={e => this.updateInputValue(e)} />
                      </Container>
                    </Col>
                    <Col xs={1}>

                      <Button style={{ margin: "auto auto", width:"100%"}} className="react-button" variant="outlined" type="submit" margin="normal">
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
                        {this.state.isLoadingVideo?
                        <CircularProgress />
                        :
                          <iframe id='src' style={{ margin: "auto auto" }} width="560" height="400" src="https://www.youtube.com/embed/O6P86uwfdR0" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe> 
                        }
                        
                        </Container></Col>
                      <Col>
                        <Container className="vocabulary-zone mt-2">
                          <Paper style={{ height: 430, maxheight: 1000, overflow: 'auto' }} elevation={8}>
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
                                setWord={this.setWord}
                                headerError={this.state.headerError}
                              />

                              {this.state.isLoadingMeanings && (
                                <Container style={{ display: 'flex', justifyContent: 'center', alignItems:'center', height:'100%' }}>
                                  <CircularProgress />
                                </Container>
                              )}
                              {!this.state.isLoadingMeanings && (
                                <Definitions
                                  meanings={this.state.meanings}
                                  word={this.state.word}
                                  setTime={this.setTime}
                                  addWordAndTime={this.saveWordAndTime}
                                  addError={this.state.addError}
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
                      {this.state.isLoadingTranscript?
                        <Container style={{ display: "flex", justifyContent: 'center',alignItems:'center' ,height:"100%"}}>
                          <CircularProgress/>
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
                          {this.state.transcription.map((item, index) => (
                            // ref追加  
                            <li key={index} ref={this.state.refs[index]}>
                              <ul>
                                <ListItem key={`item-${index}`}>
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
              {this.state.movie_list.map((item, index) => (
                <li key={`section-${index}`}>
                  <ul>
                    <ListItem key={`item-${index}`}>
                      <ListItemText primary={`${item}`} />
                    </ListItem>
                  </ul>
                </li>
              ))}
            </List>
          </Container>
        </Col>
      </Row>





    );
  }
}