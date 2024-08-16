import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Protect = ({children}) => {
  const [token,setToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if(localStorage.getItem('token')){
      setToken(localStorage.getItem('token'));
    }else{
      navigate('/login');
      setToken(null);
    }
  },[token]);

  return (
    <div>
      (token ? <>{children}</> : <></>)
    </div>
  )
}

export default Protect