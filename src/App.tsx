import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './Components/LandingPage';
import Login from './Components/Login';
import EmployerSignUp from './Components/EmployerSignup';
import JobSeekerSignup from './Components/JobSeekerSignup';
import About from './Components/About';
import PageTitle from './Components/PageTitle';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <PageTitle title="Landing Page" />
              <LandingPage />
            </>
          }
        />
        <Route
          path="/login"
          element={
            <>
              <PageTitle title="Login Page" />
              <Login />
            </>
          }
        />
        <Route
          path="/employer-signup"
          element={
            <>
              <PageTitle title="Employer SIgn Up Page" />
              <EmployerSignUp />
            </>
          }
        />
        <Route
          path="/job-seeker-signup"
          element={
            <>
              <PageTitle title="Job Seeker Signup Page" />
              <JobSeekerSignup />
            </>
          }
        />
        <Route
          path="/about"
          element={
            <>
              <PageTitle title="About Page" />
              <About />
            </>
          }
        />
        {/* <Route
          path="/medrin"
          element={
            <>
              <PageTitle title="Landing Page" />
              <LandingPage />
            </>
          }
        /> */}
      </Routes>
    </Router>
  );
};

export default App;
