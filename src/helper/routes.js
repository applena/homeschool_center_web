import React from "react";
import { Route, Router } from "react-router-dom";

//pages
import Features from "../components/Features";
import Plans from "../components/Plans";
import Resources from "../components/Resources";
import LandingPage from "../components/LandingPage";


function Routes() {
  return (
    <Router>
      <Route
        exact
        path="/"
        component={LandingPage}
      />
      <Route
        path="/plans"
        component={Plans}
      />
      <Route
        path="/features"
        component={Features}
      />
      <Route
        path="/resources"
        component={Resources}
      />
    </Router>
  );
}

export default Routes;