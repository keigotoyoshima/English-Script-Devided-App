
import React, { Component } from "react";
import { Grid, Button, Typography, colors } from "@material-ui/core";
import SelectForm from "./helper/SelectForm";
import { getThemeProps } from "@material-ui/styles";


export default class Movie extends Component {
  constructor(props){
    super(props);
    this.state = {
      script : 'Please select minites which you want to watch. After doing it, English Script will appear.' 
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(script){
    this.setState({
      script: script,
    });
  }



  render(){
    return (
      <div className='scriptPage'>
        <Grid container direction="row" justifyContent="center" alignItems="flex-start"
      >
       <Grid item xs={2}></Grid>
        <Grid item xs={4}>
          <h5>{this.state.script}</h5>
        </Grid>
        <Grid item xs={1}></Grid>
        <Grid item xs={3} align="center">
        <SelectForm callback={this.handleSubmit}></SelectForm>
        </Grid>
        <Grid item xs={2}></Grid>
      </Grid>
      </div>
    
    );
  }
}