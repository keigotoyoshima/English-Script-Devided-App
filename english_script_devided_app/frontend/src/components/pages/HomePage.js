import React, {Component} from "react";
import MoviePage from "./MoviePage";
import DramaPage from "./DramaPage";
import Movie from "../Movie";
import YoutubePage from  "./YoutubePage";
import SignUpPage from "./SignUpPage";
import SignInPage from "./SignInPage";




import { Grid, Button, ButtonGroup, Typography, ThemeProvider } from "@material-ui/core";
import {
  BrowserRouter as Router,
  PrivateRoute,
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
      user: userCredential.user
    };
    this.clearRoomCode = this.clearRoomCode.bind(this);
  }

  renderHomePage() {
    return (
      <div className="center welcome" >
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
            {/* <Button variant="outlined"color="default" to="/moviepage" component={Link}>
                Movie
            </Button>
            <Button variant="outlined" color="default" to="/drama" component={Link}>
              Drama
            </Button> */}

            {/* 認証ページに変更 */}
            <Button variant="outlined" color="default" to="/sign-in" component={Link}>
              Sign In 
            </Button>
            <Button variant="outlined" color="default" to="/sign-up" component={Link}>
              Sign Up
            </Button>
          </ButtonGroup>
        </Grid>
      </Grid>
      </div>

      

    
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
         <PrivateRoute

            exact
            path="/"
            render={user.invalid ? () => {
              return this.renderHomePage();
            } :() => {
              return this.renderHomePage();
            }}
          />
          {/* <Route path="/moviepage" component={MoviePage} />
          <Route path="/movie/:id" component={Movie} />
          <Route path="/drama" component={DramaPage} /> */}
          {/* <PrivateRoute exact path="/" component={YoutubePage} /> */}
          {/* <Route path="/sign-in" component={SignInPage} />
          <Route path="/sign-up" component={SignUpPage} /> */}
        </Switch>
      </Router>
    );
  }
}