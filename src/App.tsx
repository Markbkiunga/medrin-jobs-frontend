import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './Components/LandingPage';
import About from './Components/About'

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/employer" element={<div>Employer Page</div>} />
        <Route path="/job-seeker" element={<div>Job Seeker Page</div>} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
};

export default App;