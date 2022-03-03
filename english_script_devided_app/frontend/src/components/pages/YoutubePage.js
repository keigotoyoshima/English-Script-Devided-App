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

const base_url = "https://www.youtube.com/embed/"

export default class YoutubePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      src: "",
      video_id: "",
      transcription: [],
      vocabulary_list: ["a", "b", "c"],
      movie_list: ["movie-1", "movie-2", "movie-3"],
      word: "",
      meanings: [],
      language: "en",
    };
  }
  setWord = (word) => {
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
  setLanguage = (language) => {
    this.setState({
      language: language
    });
  }

  async callDictionaryApi() {
    let data = await dictionaryApi(this.state.language, this.state.word);
    this.setMeanings(data)
  }

  getYoutube() {
    fetch("/api/get-youtube")
      .then((response) => response.json()).then(
        (data) => {
          // startを00:00に上書き
          data.forEach((item) => {
            let given_seconds = item.start;
            let hours = Math.floor(given_seconds / 3600);
            let minutes = Math.floor((given_seconds - (hours * 3600)) / 60);
            let seconds = given_seconds - (hours * 3600) - (minutes * 60);
            seconds = Math.floor(seconds);

            // 今のところhoursは入れない
            // item.start = hours.toString().padStart(2, '0') + ':' +
            //   minutes.toString().padStart(2, '0') + ':' +
            //   seconds.toString().padStart(2, '0');
            item.start = minutes.toString().padStart(2, '0') + ':' +
              seconds.toString().padStart(2, '0');
          })
          this.setState({
            transcription: data
          });

        })
      .catch((error) => {
        console.log(error);
      });
  }
  componentDidMount() {
    console.log("componentDidMount()");
    setTimeout(() => {
      this.getYoutube();
    }, 1000)
  }
  getAttribute() {
    let src = base_url + this.state.video_id;
    this.setState({ src: src });
  }

  updateInputValue(evt) {
    const val = evt.target.value;
    this.setState({
      inputValue: val
    });
  }
  /* なぜか通常のfunctionで定義するとコールバック関数が実行されるときにthisが渡されない．単純にonFormSubmit関数が実行される． アローfunctionに変えてあげるとthisが自動的に渡される*/
  onSubmit = (e) => {
    e.preventDefault();
    const url = new URL(this.state.inputValue);
    const params = new URLSearchParams(url.search);
    for (let param of params) {
      if (param[0] == "v") {
        this.setState();
        this.setState({ video_id: param[1] }, () => {
          this.getAttribute();

        });
      }
    }

  }

  render() {
    return (
      <Row>
        <Col xs={2}>
          <Container className="check-box-list">
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
              {this.state.vocabulary_list.map((item, index) => (
                <li key={`section-${index}`}>
                  <ul>
                    <ListItem key={`item-${index}`}>
                      <label><Checkbox />{`${item}`}</label>
                      {/* <ListItemText primary={`${item}`} /> */}
                    </ListItem>
                  </ul>
                </li>
              ))}
            </List>
          </Container>
        </Col>
        <Col xs={8}>
          <Container>
            <Row>
              <Container className="mt-3">
                <form onSubmit={this.onSubmit}>
                  <Row>
                    <Col xs={11}>
                      <Container className="pl-4">
                        <CssTextField  style={{ margin: "auto auto" }} id="outlined-basic" style={{ width: '100%' }} label="URL" variant="outlined" size='small' value={this.state.inputValue} onChange={e => this.updateInputValue(e)} />
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
                      <Col><Container><iframe id='src' style={{ margin: "auto auto" }} width="560" height="400" src="https://www.youtube.com/embed/O6P86uwfdR0" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe></Container></Col>
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
                                word={this.state.word}
                                setLanguage={this.setLanguage}
                                language={this.state.language}
                                setMeanings={this.setMeanings}
                              />
                              {this.state.meanings && (
                                <Definitions
                                  meanings={this.state.meanings}
                                  word={this.state.word}
                                  language={this.state.language}
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
                          <li key={`section-${index}`}>
                            <ul>
                              <ListItem key={`item-${index}`}>
                                <ListItemText primary={`${item.start} : ${item.text}`} />
                              </ListItem>
                            </ul>
                          </li>
                        ))}
                      </List>
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