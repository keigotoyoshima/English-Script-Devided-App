
import React, { Component } from "react";
import { Grid, Button, Typography } from "@material-ui/core";
import BaseButton from "./helper/BaseButton";
import ListTitle from "./helper/ListTitle";
import { useState } from 'react'
import SelectForm from "./helper/SelectForm";


export default class Movie extends Component {
  constructor(props){
    super(props);
  }

  handleChange(e) { 
    this.setState({movieId: e.target.value});
  }

  render(){
    return (
      <Grid container direction="row" justifyContent="center" alignItems="flex-start">
        <Grid item xs={12} align="center">
        <SelectForm></SelectForm>
        </Grid>
      </Grid>

    );
  }
}