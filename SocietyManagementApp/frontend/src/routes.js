import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Sidebar from './components/Sidebar';
import Directory from './components/Directory';
import Services from './components/Services';
import Helpwall from './components/Helpwall';
import VisitorFeaturePage from './pages/VisitorFeaturePage'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/LandingPage" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/Home" element={<Home />} />
      <Route path="/Sidebar" element={<Sidebar />} />
      <Route path="/Directory" element={<Directory />} />
      <Route path="/Services" element={<Services />} />
      <Route path="/Helpwall" element={<Helpwall />} />
      
      <Route path="/visitor" element={<VisitorFeaturePage />} />
    </Routes>
  );
};

export default AppRoutes;

