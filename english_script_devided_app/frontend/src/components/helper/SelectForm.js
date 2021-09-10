import { useState } from 'react'
import React from 'react'
import { Grid, Button, Typography, Divider } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
  },
}));

const SelectForm = ({callback}) => {
  const classes = useStyles();
  function FormRow({title, created}) {
    console.log({title})  
    return ({title} === undefined) ? "yes":"No"  
  }


  
  const [id, setId] = useState('')

  const onSubmit = (e) => {
    e.preventDefault();
    if (!id) {
      alert('Please add a task')
      return
    }
    handleSubmit()
  }

  const handleSubmit = async ()=>{
    const response = await fetch(`/api/get-movie?id=${id}`)
    const data = await response.json()

    callback(data.title)
  }

  return (
    <div className="l-wrapper card-radius">
    <article className="card">
      <div className="formSelect">
        <div>
          <h3 className="card__title">Select</h3>
        </div>
        <div>
          <form  onSubmit={onSubmit}>
            <input
              type='id'
              placeholder='Select id'
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
          </form>
        </div>
      </div>
      <div className='divider'></div>

      <div className="card__body">
        <Grid container spacing={1}>
          <Grid container item xs={12} spacing={3}>
            <FormRow title='this is title'/>
          </Grid>
          <Grid container item xs={12} spacing={3}>
            <FormRow created='2021-09-05'/>
          </Grid>
        </Grid>
      </div>    
    </article>
  </div>

   
  );
}

export default SelectForm