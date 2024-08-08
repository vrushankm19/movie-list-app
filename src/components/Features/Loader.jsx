import React from 'react';
import './Loader.scss';

const Loader = () => {
  // This component renders a simple spinner to indicate a loading state.
  return (
    <div className='spinner-container'>
      <div className='spinner'></div>
    </div>
  );
};

export default Loader;
