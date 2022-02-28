import React,{Component, components} from "react";
import { render } from "react-dom";
import Navbar from "./Navber/Navbar";

export default class AppNavbar extends Component{
  constructor(props){
    super(props);
  }

  render(){
    return (
      <Navbar/>
    );
  }
}

const appDiv = document.getElementById("navbar");
render(<AppNavbar name="navbar"/>, appDiv);