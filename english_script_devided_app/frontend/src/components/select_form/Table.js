import React from 'react'
import { Grid, Button, Typography, Divider } from "@material-ui/core";


export default class Table extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render(){
    return (
      <Grid container spacing={1}>
      <Grid  item xs={6} >
        <h5>{this.props.type}</h5>
      </Grid>
      <Grid  item xs={6} >
        <div className="table__right">
        <h5>{this.props.content}</h5>
        </div>
      </Grid>
    </Grid>
    );
  } 
}

