import React from 'react';
import './header.scss';
import HSCLogo from '../assets/logo.png';
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import { googleLogout } from '@react-oauth/google';
import { useSelector, useDispatch } from 'react-redux';
import { signIn } from '../redux/signInStatus';

function Header(props) {
  const isSignedIn = useSelector((state) => state.signInStatus.value);
  const dispatch = useDispatch();

  return (
    <div id="header">
      <img alt="homeschool center name" src={HSCLogo} />
      <nav>
        <ul>
          <li>
            <Link to="/features">Features</Link>
          </li>
          <li>
            <Link to="/resources">Resources</Link>
          </li>
          <li>
            <Link to="/plans">Plans</Link>
          </li>
        </ul>
      </nav>
      {!isSignedIn ?
        <div id="buttons">
          <button><Link to="/login">Login</Link></button>
          <button><Link to="/signup">Sign Up</Link></button>
        </div>
        :
        <div>
          <button onClick={() => {
            console.log('tryin to logout');
            googleLogout();
            dispatch(signIn(false));
          }}>logout</button>
        </div>
      }

    </div>
  )
}

export default Header;