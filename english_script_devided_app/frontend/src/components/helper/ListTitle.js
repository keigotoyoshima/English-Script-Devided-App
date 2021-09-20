import React from 'react'
import { Link } from 'react-router-dom'
const ListTitle = ({listTitle})=>{
  return(
    <div className="listTitles">
      <Link to={`movie/${listTitle.id}`} style={{ textDecoration: 'none'}}>
      <h3 className='listTitle'>{listTitle.title}</h3>
      </Link>
      
    </div>
  )
}

export default ListTitle