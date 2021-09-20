import React, {Component} from "react";
import { Grid, Button, ButtonGroup, Typography } from "@material-ui/core";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";

export default class DramaPage extends Component {
  constructor(props) {
    super(props);
    
  }


  render() {
    return <h1>This is Drama page</h1>
  }
}