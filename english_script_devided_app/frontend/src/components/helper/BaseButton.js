import PropTypes from 'prop-types'
import React from "react";

const BaseButton =({color, text, onClick})=>{

  return(
    <button
    onClick={onClick}
    style={{ backgroundColor: color}}
    className='btn'
    >
    {text}
    </button>
  );
}

BaseButton.propTypes = {
  text:PropTypes.string,
  color:PropTypes.string,
  onClick:PropTypes.func,
}
BaseButton.defaultProps = {
  color:'steelblue',
  text:'this is default props text',
}

export default BaseButton;