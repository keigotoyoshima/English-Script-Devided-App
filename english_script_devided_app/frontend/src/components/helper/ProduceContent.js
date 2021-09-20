import React from 'react'

const ProduceContent = (x)=> {
  if (x > 50) {
    return 1
  } else if (x > 5) {
    return 2
  } else {
    return 3
  }
}

export default ProduceContent
