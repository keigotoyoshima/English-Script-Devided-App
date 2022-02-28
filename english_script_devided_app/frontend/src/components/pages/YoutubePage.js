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


const styles = {
  input1: {
    height: 50
  },
  input2: {
    height: 200,
    fontSize: "3em"
  }
};



export default class YoutubePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };

    // this.getListMovie();
  }
  getAttribute() {
    var d = document.getElementById("video");
    var v = "vhhgI4tSMwc";
    var src = `https://www.youtube.com/embed/${v}`;
    console.log("src: %s", src);
    d.setAttribute("src", src);
  }

  render() {
    return (
      <Grid container spacing={0}>
        <Grid item xs={2}>
          {/* <Item>xs=8</Item> */}
        </Grid>
        <Grid item xs={8}>
          <div className="row">
            <div className="row">
              <CssTextField id="outlined-basic" label="URL" variant="outlined" size='small' margin="normal"/>
            </div>
            <div className='row'>
              <iframe id="video" width="560" height="315" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
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