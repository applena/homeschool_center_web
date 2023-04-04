import React from 'react';
import './header.scss';
import HSCLogo from '../assets/logo.png';
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";

function Header(props) {

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
      <div id="buttons">
        <button><Link to="/login">Login</Link></button>
        <button><Link to="/signup">Sign Up</Link></button>
      </div>

    </div>
  )
}

export default Header;