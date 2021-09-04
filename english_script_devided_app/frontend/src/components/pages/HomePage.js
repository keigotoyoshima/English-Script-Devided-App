import React, {Component} from "react";
import MoviePage from "./MoviePage";
import DramaPage from "./DramaPage";
import Movie from "../Movie";


import { Grid, Button, ButtonGroup, Typography, ThemeProvider } from "@material-ui/core";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";

export default class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomCode: null,
    };
    this.clearRoomCode = this.clearRoomCode.bind(this);
  }

  renderHomePage() {

    
    return (


      <Grid container
      direction="column"
      justifyContent="center"
      alignItems="center"
      spacing={3}
      >
        <Grid item xs={12}>
          <Typography 
          variant="h2" compact="h3">
            Choose type
          </Typography>
        </Grid>
        <Grid item xs={12} >
          <ButtonGroup disableElevation color="primary"> 
          <Button variant="outlined"color="default" to="/moviepage" component={Link}>
              Movie
            </Button>
            <Button variant="outlined" color="default" to="/drama" component={Link}>
              Drama
            </Button>
          </ButtonGroup>
        </Grid>
      </Grid>

    
    );
  }

  clearRoomCode() {
    this.setState({
      roomCode: null,
    });
  }

  render() {
    return (
      <Router>
        <Switch>
         <Route
            exact
            path="/"
            render={() => {
              return this.renderHomePage();
            }}
          />
          <Route path="/moviepage" component={MoviePage} />
          <Route path="/movie" component={Movie} />

          <Route path="/drama" component={DramaPage} />
        </Switch>
      </Router>
    );
  }
}