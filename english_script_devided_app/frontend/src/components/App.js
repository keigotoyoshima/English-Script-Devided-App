import React,{Component, components} from "react";
import { render } from "react-dom";
import HomePage from "./pages/HomePage";
import { createMuiTheme } from '@material-ui/styles';

export default class App extends Component{
  constructor(props){
    super(props);
  }

  render(){
    return (
       <HomePage></HomePage>
    );
  }
}

// const appDiv = document.getElementById("app");
// render(<App name="home"/>, appDiv);