import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import About from './pages/about';
import Services from './pages/services';
import Catalogue from './pages/catalogue';
import SignUp from './pages/signup';
import Report from './pages/report';
import Dem from './pages/dem';
import Login from './pages/login';
import Upload from './pages/upload';
import Download from './pages/download';
import Satellite from './pages/satellite';

function App() {
  return (
    <Router>
    <Navbar />
    <Routes>

    <Route path='/tcap/inundation' element={<About/>} />
      <Route exact path='/tcap/home' element={<SignUp/>} />
      <Route path='/tcap/shoreline' element={<Services/>} />
      <Route path='/tcap/risk' element={<Report/>} />
      <Route path='/tcap/reports' element={<Catalogue/>} />
      <Route path='/tcap/DEM' element={<Dem/>} />
      <Route path='/tcap/login' element={<Login/>} />
      <Route path='/tcap/upload' element={<Upload/>} />
      <Route path='/tcap/download' element={<Download/>} />
      <Route path='/tcap/satellite' element={<Satellite/>} />
      <Route path="/tcap" element={<Navigate replace to="/tcap/home" />} />
      <Route path="/" element={<Navigate replace to="/tcap/home" />} />
    </Routes>
  </Router>
  );
}

export default App;
