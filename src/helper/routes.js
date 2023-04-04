import React from "react";
import { Route, Router } from "react-router-dom";

//pages
import Features from "../components/Features";
import Login from "../components/Login";
import SignUp from "../components/SignUp";
import Plans from "../components/Plans";
import Resources from "../components/Resources";


function Routes() {
  return (
    <Router>
      <Route
        exact
        path="/"
        component={Features}
      />
      <Route
        path="/login"
        component={Login}
      />
      <Route
        path="/signup"
        component={SignUp}
      />
      <Route
        path="/plans"
        component={Plans}
      />
      <Route
        path="/resources"
        component={Resources}
      />
    </Router>
  );
}

export default Routes;