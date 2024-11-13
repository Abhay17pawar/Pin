import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';

function MainRouter() {
  return (
    <Router  
      future={{
        v7_startTransition: true, 
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        <Route path="/" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/Home" element={<App />} />
      </Routes>
    </Router>
  );
}

export default MainRouter;
