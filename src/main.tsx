import React from 'react'
import './index.css'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes, Link, Navigate } from 'react-router-dom'

import { Dashboard } from './componenti/Dashboard'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  </BrowserRouter>,
)
