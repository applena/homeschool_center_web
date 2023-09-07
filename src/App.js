
import './app.scss';

// pages
// import CollectStudentInfo from './components/CollectStudentInfo';
import Header from './components/Header';
import Features from './components/Features';
import Plans from './components/Plans';
import Resources from './components/Resources';
import PrivacyPolicy from './docs/privacyPolicy';
import TOS from './docs/TOS';

// libs
import { Route, Routes, BrowserRouter } from "react-router-dom";

import { useSelector } from 'react-redux';
import LandingPage from './components/LandingPage';

function App() {

  const isSignedIn = useSelector((state) => state.signInStatus.signedIn);

  return (
    <div className="App">
      <Header />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/features" element={<Features />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/tos" element={<TOS />} />
        </Routes>
      </BrowserRouter>


      <LandingPage
        isSignedIn={isSignedIn}
      />


    </div>
  );
}

export default App;
