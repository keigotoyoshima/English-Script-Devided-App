import React from 'react';

const List = (list) => {
  const refs = list.reduce((acc, value) => {
    acc[value.id] = React.createRef();
    return acc;
  }, {});

