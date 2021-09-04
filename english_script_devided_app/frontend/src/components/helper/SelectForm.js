import { useState } from 'react'
import React from 'react'
import { Grid, Button, Typography } from "@material-ui/core";

const SelectForm = ({  }) => {
  const [id, setId] = useState(0)
  const onSubmit = (e) => {
    e.preventDefault();
    if (!id) {
      alert('Please add a task')
      return
    }
    handleSubmit()
    setId('')
  }

  const handleSubmit = async ()=>{
    const response = await fetch(`/api/get-movie?id=${id}`)
    const data = await response.json()

    console.log("setState in handleSubmit(select form)")
    setId(data.title)
  }

  return (
    <Grid container spacing={1} >
      <Grid item xs={12}  >
      <form className='add-form' onSubmit={onSubmit}>
        <Grid item xs={12} >
          <label>Select id: </label>
            <input
              type='id'
              placeholder='Select id'
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
        </Grid>
        <Grid item xs={12}>
        <input type='submit' value='Confirm' className='btn btn-block' />
        </Grid>
        
     
      </form>
      </Grid>
    </Grid>
   
   
  );
}

export default SelectForm