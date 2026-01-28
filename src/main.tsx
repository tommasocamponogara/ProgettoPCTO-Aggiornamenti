import './index.css'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Lines from './pages/Lines'
import Machines from './pages/Machines'
import Alarms from './pages/Alarms'
import { LineDescription } from './pages/LineDescription'
import { MachineDescription } from './pages/MachineDescription'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard/linee" element={<Lines />} />
      <Route path="/dashboard/linee/:lineId" element={<LineDescription />} />
      <Route path="/dashboard/macchinari" element={<Machines />} />
      <Route path="/dashboard/linee/:lineId/:machineId" element={<MachineDescription />} />
      <Route path="/dashboard/allarmi" element={<Alarms />} />
    </Routes>
  </BrowserRouter>,
)
