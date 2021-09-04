import React from 'react'
import { Link } from 'react-router-dom'
const ListTitle = ({listTitle})=>{
  return(
    <div className="listTitle">
      <Link to='/movie'>
      <h3>{listTitle.title}</h3>
      </Link>
      
    </div>
  )
}

export default ListTitle