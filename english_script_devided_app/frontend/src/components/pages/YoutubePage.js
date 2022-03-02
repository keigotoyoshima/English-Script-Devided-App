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
    };

  }
  componentDidMount(){
    console.log("componentDidMount()"); 
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
          console.log(this.state.video_id, 'this.state.video_id1');
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
                      <Button variant="outlined" type="submit" margin="normal">
                        Confirm
                      </Button>
                    </Col>
                  </Row>
                </Container>

              </form>

            <div className='row'>
             {/* <iframe width="560" height="315" src="https://www.youtube.com/embed/DINxNbBOEoI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> */}
              <iframe id='src' width="560" height="315" src={this.state.src} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </div>
            <Box component="form" sx={{ '& > :not(style)': { m: 1, width: '25ch' }, }} noValidate autoComplete="off">
              <div className="script">
                this is scrption zone
              </div>
            </Box>
          </div>
        </Grid>
        <Grid item xs={2}>
          {/* <Item>xs=8</Item> */}
        </Grid>
      </Grid>


    );
  }
}