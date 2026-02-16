import './index.css'
import { createRoot } from 'react-dom/client'
import { Routes, Route, Navigate, HashRouter } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Lines from './pages/Lines'
import Machines from './pages/Machines'
import Alarms from './pages/Alarms'
import { LineDescription } from './pages/LineDescription'
import { MachineDescription } from './pages/MachineDescription'
import { ManageLines } from './pages/ManageLines'
import { ManageMachines } from './pages/ManageMachines'

createRoot(document.getElementById('root')!).render(
  <HashRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard/lines" element={<Lines />} />
      <Route path="/dashboard/lines/:lineId" element={<LineDescription />} />
      <Route path="dashboard/machines/:machineId" element={<MachineDescription />} />
      <Route path="/dashboard/machines" element={<Machines />} />
      <Route path="/dashboard/lines/:lineId/:machineId" element={<MachineDescription />} />
      <Route path="/dashboard/allarmi" element={<Alarms />} />
      <Route path="/dashboard/lines/ManageLines/:id?" element={<ManageLines />} />
      <Route path="/dashboard/machines/ManageMachines" element={<ManageMachines />} />
    </Routes>
  </HashRouter>,
)
