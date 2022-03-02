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





const styles = {
  input1: {
    height: 50
  },
  input2: {
    height: 200,
    fontSize: "3em"
  }
};

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
    };

  }


  getYoutube() {
    fetch("/api/get-youtube")
      .then((response) => response.json()).then(
        (data) => {
          console.log(data);
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
    // var d = document.getElementById("d1");
    setTimeout(() => {
      this.getYoutube();
      // window.open("https://www.youtube.com/watch?v=O6P86uwfdR0&t=119s", "window_name", "width=250,height=350,scrollbars=yes,resizable=yes,status=yes");

      // const p = document.getElementById('src').contentWindow.document.getElementsByClassName("ytp-progress-bar")[0];
      // console.log(p, 'p');
      // const d = document.getElementsByClassName("ytp-progress-bar")[0];
      // console.log(d, 'd');
      const b = document.getElementsByClassName("react-button")[0];
      console.log(b, 'b');
    }, 1000)

    // d.setAttribute("aria-valuenow", "400");
  }
  getAttribute() {
    console.log(this.state.video_id);
    let src = base_url + this.state.video_id;
    console.log(src);
    this.setState({ src: src });
  }

  updateInputValue(evt) {
    const val = evt.target.value;
    this.setState({
      inputValue: val
    });
    console.log("update");
    // const  d = document.getElementsByClassName("ytp-progress-bar")[0];
    // console.log(d, 'd');
    // const b = document.getElementsByClassName("react-button")[0];
    // console.log(b, 'b');
    // var d = document.getElementsByClassName("ytp-progress-bar");
    // console.log(d,'d');
    // d.setAttribute("aria-valuenow", "400");
  }
  /* なぜか通常のfunctionで定義するとコールバック関数が実行されるときにthisが渡されない．単純にonFormSubmit関数が実行される． アローfunctionに変えてあげるとthisが自動的に渡される*/
  onSubmit = (e) => {
    console.log('Click');
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
      <Container>
        <Row>
          <Container className="mt-4">
            <form onSubmit={this.onSubmit}>
              <Row>
                <Col xs={10}>
                  <CssTextField style={{ margin: "auto auto" }} id="outlined-basic" style={{ width: '100%' }} label="URL" variant="outlined" size='small' value={this.state.inputValue} onChange={e => this.updateInputValue(e)} />
                </Col>
                <Col xs={2}>
                  <Button style={{ margin: "auto auto", padding: "auto auto"}} className="react-button" variant="outlined" type="submit" margin="normal">
                    Confirm
                  </Button>
                </Col>
              </Row>
            </form>
          </Container>
          <Container className="mt-4">
            <Row>
              <Col>
                <Row>
                  <Col><Container><iframe id='src' style={{ margin: "auto auto" }} width="560" height="450" src="https://www.youtube.com/embed/O6P86uwfdR0" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe></Container></Col>
                  <Col>
                    <Container className="vocabulary-zone mt-3">
                      <Paper style={{ maxHeight: 1000, maxWidth: 560, overflow: 'auto' }} elevation={8}>
                        <List sx={{
                          width: '100%',
                          maxWidth: 560,
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
                                  <ListItemText primary={`${item}`} />
                                </ListItem>
                              </ul>
                            </li>
                          ))}
                        </List>
                      </Paper>
                    </Container>
                  </Col>
                </Row>
              </Col>
              <Col>
                <Container className="script-zone">
                  <Paper style={{ maxHeight: 1000, overflow: 'auto' }}>
                    <List sx={{
                      width: '100%',
                      maxWidth: 500,
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
                </Container>
              </Col>
            </Row>
          </Container>
        </Row>
      </Container>





    );
  }
}