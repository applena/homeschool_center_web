import { useState } from 'react';
import './app.scss';
import CollectStudentInfo from './components/CollectStudentInfo';
import Header from './components/Header';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Features from './components/Features';
import Plans from './components/Plans';
import Resources from './components/Resources';
import { Route, Routes } from "react-router-dom";

function App() {
  const [name, setName] = useState('');
  const [grade, setGrade] = useState(0);

  const [displayLogin, setDisplayLogin] = useState(false);
  const [displaySignUp, setDisplaySignUp] = useState(false);

  return (
    <div className="App">
      <Header
        setDisplayLogin={(value) => setDisplayLogin(value)}
        setDisplaySignUp={(value) => setDisplaySignUp(value)}
      />

      <Routes>
        <Route exact path="features" element={<Features />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>

      <CollectStudentInfo
        updateName={(value) => setName(value)}
        updateGrade={(value) => setGrade(value)}
      />
    </div>
  );
}

export default App;
