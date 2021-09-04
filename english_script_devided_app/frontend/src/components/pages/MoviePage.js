import React, {Component} from "react";
import { Grid, Button, ButtonGroup, Typography } from "@material-ui/core";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import ListTitle from "../helper/ListTitle";


export default class MoviePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movieList: [],
    };
    this.getListMovie();
  }

  getListMovie() {
    fetch("/api/movie")
      .then((response) => response.json()).then(
        (data)=>{
          var list = data;
          this.setState({
            movieList:list
          });
        })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Typography 
          variant="h2" compact="h3">
            List of movies
          </Typography>
        </Grid>
        <Grid item xs={12} >
        {this.state.movieList.map(item => (
            <ListTitle key={item.id} listTitle={item}/>
          ))}
        </Grid>
      </Grid>
    );
  }
}