import './index.css'
import { createRoot } from 'react-dom/client'
import { Routes, Route, Navigate, HashRouter } from 'react-router-dom'

// Si importano tutte le pagine create negli altri file
import Dashboard from './pages/Dashboard'
import Lines from './pages/Lines'
import Machines from './pages/Machines'
import Alarms from './pages/Alarms'
import { LineDescription } from './pages/LineDescription'
import { MachineDescription } from './pages/MachineDescription'
import { ManageLines } from './pages/ManageLines'
import { ManageMachines } from './pages/ManageMachines'

/**
 * Viene creata l'applicazione e collegata alla pagina HTML reale.
 * Si usa "HashRouter" per far sì che i collegamenti funzionino bene ovunque.
 */
createRoot(document.getElementById('root')!).render(
  <HashRouter>
    <Routes>
      {/* Se l'utente apre il sito senza scrivere nulla, viene mandato subito alla Dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" />} />

      {/* --- PAGINE PRINCIPALI DI MONITORAGGIO --- */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard/lines" element={<Lines />} />
      <Route path="/dashboard/alarms" element={<Alarms />} />
      <Route path="/dashboard/machines" element={<Machines />} />

      {/* --- PAGINE DI DETTAGLIO (USANO ID SPECIFICI) --- */}
      {/* Si apre la pagina di una singola linea usando il suo codice (es: /lines/L-01) */}
      <Route path="/dashboard/lines/:lineId" element={<LineDescription />} />

      {/* Si apre la pagina di una singola macchina usando il suo codice */}
      <Route path="dashboard/machines/:machineId" element={<MachineDescription />} />
      <Route path="/dashboard/lines/:lineId/:machineId" element={<MachineDescription />} />

      {/* --- PAGINE PER AGGIUNGERE O MODIFICARE I DATI --- */}
      {/* Pagina per creare o gestire le linee di produzione */}
      <Route path="/dashboard/lines/ManageLines/:id?" element={<ManageLines />} />

      {/* Pagina per aggiungere o modificare nuovi macchinari al sistema */}
      <Route path="/dashboard/machines/ManageMachines/:id?" element={<ManageMachines />} />
    </Routes>
  </HashRouter>,
)
