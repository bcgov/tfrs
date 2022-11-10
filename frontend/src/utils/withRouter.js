import React, {Component} from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

export const withRouter = (Component) => {
  const Wrapper = (props) => {
    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();
    
    return (
      <Component
        navigate={navigate}
        location={location}
        params={params}
        {...props}
      />
    );
  };
  
  return Wrapper;
};