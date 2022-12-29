import React from 'react';

import './Card.css';

// card is component that accepts classname and merge it with it's own classes.
const Card = (props) => {
  return (
    <div className={`card ${props.className}`} style={props.style}>
      {props.children}
    </div>
  );
};

export default Card;
