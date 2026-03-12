import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './layout/Navbar';
import Home from './Pages/Client/Home';
import './index.css';
import Login from './Pages/Admin/Login';
import Dashboard from './Pages/Admin/Dashboard';
import Form from './Pages/Client/Form';
import Jobs from './Pages/Admin/layout/Jobs';
import AddJob from './Pages/Admin/layout/AddJob';
import Monitor from './Pages/Admin/layout/Monitor';


const Layout = () => {
  const location = useLocation(); // This hook can only be used inside Router

  return (
    <>
      {/* Conditionally render Navbar based on the current path */}
      {
        !location.pathname.startsWith('/admin')
        && location.pathname !== '/form'
        && <Navbar />
      }
    </>
  );
};

function App() {
  return (
    <Router>
      <Layout /> {/* Render Layout component which contains the Navbar logic */}
      <Routes>
        {/* Client Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/form" element={<Form />} />

        {/* Admin Route */}
        <Route path="/admin" element={<Login />} />
        <Route element={<Dashboard />}>
          <Route path="/admin/dashboard" element={<Monitor />} />
          <Route path="/admin/jobs" element={<Jobs />} />
          <Route path="/admin/add-job" element={<AddJob />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;