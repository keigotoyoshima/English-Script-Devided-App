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
      src:"",
      video_id:"",
      transcription:[]
    };

  }
  getYoutube() {
    fetch("/api/get-youtube")
      .then((response) => response.json()).then(
        (data) => {
          console.log(data);
          this.setState({
            transcription: data
          });
          
        })
      .catch((error) => {
        console.log(error);
      });
  }
  componentDidMount(){
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
      if (param[0] == "v"){
        this.setState();
        this.setState({ video_id: param[1] }, () => {
          this.getAttribute();
          
        });  
      }
    }
    
  }

  render() {
    return (
      <Grid container spacing={0}>
        <Grid item xs={2}>
          {/* <Item>xs=8</Item> */}
        </Grid>
        <Grid item xs={8}>
          <div className="row">

              <form onSubmit={this.onSubmit}>

                <Container className="mt-4">
                  <Row>
                    <Col xs={9}>
                    <CssTextField id="outlined-basic" style={{ width: '100%' }} label="URL" variant="outlined" size='small'  value={this.state.inputValue} onChange={e => this.updateInputValue(e)}/>
                    </Col>
                    <Col xs={1}>
                      <Button className="react-button" variant="outlined" type="submit" margin="normal">
                        Confirm
                      </Button>
                    </Col>
                  </Row>
                </Container>

              </form>

            <div className='row'>
             {/* <iframe width="560" height="315" src="https://www.youtube.com/embed/DINxNbBOEoI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> */}
              <iframe id='src' width="560" height="315" src="https://www.youtube.com/embed/uirRaVjRsf4" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </div>
          </div>
            
            <Row>
              <Col>
                <div className="script-zone">
                  <Paper style={{ maxHeight: 500, overflow: 'auto' }}>
                    <List sx={{
                      width: '100%',
                      maxWidth: 500,
                      bgcolor: 'background.paper',
                      position: 'relative',
                      overflow: 'auto',
                      maxHeight: 300,
                      '& ul': { padding: 0 },
                    }}
                      subheader={<li />}>
                      {this.state.transcription.map((item, index) => (
                        <li key={`section-${index}`}>
                          <ul>
                            <ListItem key={`item-${index}`}>
                              <ListItemText primary={`text: ${item.text}`} />
                            </ListItem>
                          </ul>
                        </li>
                      ))}
                    </List>
                  </Paper>
                </div>
              </Col>
              <Col>
                <div className="vocabulary-zone">
                  this is vocabulary - zone.
                </div>
              </Col>
            </Row>

          
        </Grid>
        <Grid item xs={2}>
          {/* <Item>xs=8</Item> */}
        </Grid>
      </Grid>


    );
  }
}