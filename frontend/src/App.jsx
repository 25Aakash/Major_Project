import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Learning from './pages/Learning';
import Settings from './pages/Settings';
import { UserProvider } from './context/UserContext';
import { AccessibilityProvider } from './context/AccessibilityContext';

function App() {
  return (
    <Router>
      <UserProvider>
        <AccessibilityProvider>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/learning" element={<Learning />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </main>
          </div>
        </AccessibilityProvider>
      </UserProvider>
    </Router>
  );
}

export default App;
