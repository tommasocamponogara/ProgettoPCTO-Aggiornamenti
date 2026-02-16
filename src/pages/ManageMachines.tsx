import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import type { Machine } from '../Types/Type'
import type { Line } from '../Types/Type'
import { getLines } from '../utils/api'
const initialMachine: Machine = {
  id: '',
  lineId: '',
  name: '',
  type: '',
  plc: {
    vendor: '',
    model: '',
  },
  order: 0,
  telemetries: [], // Inizialmente vuoto
}
const types = ['CNC', 'PACKER', 'PRESS', 'QC', 'ROBOT']
export function ManageMachines() {
  const [machine, setMachine] = useState<Machine>(initialMachine)
  const [lines, setLines] = useState<Line[]>([])

  // Al caricamento recupera le linee per avere i dati aggiornati dal database
  useEffect(() => {
    // Quando il componente viene montato, chiama la funzione getLines presente in API.ts, per recuperare le linee di produzione dal database, per poi aggiornare lo stato del componente
    getLines().then((lines) => setLines(lines))
  }, [lines])

  const handleChange = (e: any) => {
    const { name, value } = e.target

    if (name === 'type') {
      const newId = value ? `${value.toLowerCase()}-` : ''
      setMachine({
        ...machine,
        type: value,
        id: newId,
      })
    }
    // AGGIUNTA: Gestione specifica per i campi del PLC
    else if (name === 'vendor' || name === 'model') {
      setMachine({
        ...machine,
        plc: {
          ...machine.plc,
          [name]: value,
        },
      })
    } else {
      setMachine({
        ...machine,
        [name]: value,
      })
    }
  }

  async function handleSubmit(e: any) {
    //todo
    e.preventDefault()

    if (
      machine.id.trim() === '' ||
      machine.name.trim() === '' ||
      machine.plc.vendor.trim() === '' ||
      machine.plc.model.trim() === ''
    ) {
      alert('Compila tutti i campi correttamente!')
      return // Si ferma qui e non prova a fare la fetch
    }
    const cleanID = machine.id.trim().charAt(0).toUpperCase() + machine.id.slice(1).trim()
    const cleanName = machine.name.trim().charAt(0).toUpperCase() + machine.name.trim().slice(1)
    const cleanPlcVendor =
      machine.plc.vendor.trim().charAt(0).toUpperCase() + machine.plc.vendor.trim().slice(1)
    const cleanPlcModel =
      machine.plc.model.trim().charAt(0).toUpperCase() + machine.plc.model.trim().slice(1)

    // 2. Creiamo l'oggetto finale da spedire
    const dataToSave = {
      ...machine,
      id: cleanID,
      name: cleanName,
      plc: {
        vendor: cleanPlcVendor,
        model: cleanPlcModel,
      },
    }

    try {
      const response = await fetch('http://localhost:3000/machines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave),
      })

      if (response.ok) {
        alert('Macchinario aggiunto correttamente!')
      }
    } catch (error) {
      alert('Errore')
    }
  }

  return (
    <div className="min-h-screen bg-slate-800 w-full font-mono flex flex-col items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-center min-h-screen bg-slate-800 w-full font-mono p-4"
      >
        <h1 className="text-3xl font-bold text-amber-500 mb-6 uppercase tracking-tighter">
          Nuovo Macchinario
        </h1>

        {/* SELECT TIPO */}
        <select
          name="type"
          value={machine.type}
          onChange={handleChange}
          required
          className="mb-4 px-4 py-2 rounded-lg bg-slate-700 text-slate-200 border border-transparent focus:outline-none focus:ring-2 focus:ring-amber-500 w-64 cursor-pointer"
        >
          <option value="" disabled>
            Seleziona Tipo
          </option>
          {types.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        {/* INPUT ID */}
        <input
          name="id"
          type="text"
          value={machine.id}
          placeholder="ID Macchina"
          onChange={handleChange}
          className="mb-4 px-4 py-2 rounded-lg bg-slate-700 text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 w-64"
        />

        {/* INPUT NOME */}
        <input
          name="name"
          type="text"
          value={machine.name}
          placeholder="Nome Macchina"
          onChange={handleChange}
          className="mb-4 px-4 py-2 rounded-lg bg-slate-700 text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 w-64"
        />

        {/* TEXTAREA VENDOR */}
        <textarea
          name="vendor"
          value={machine.plc.vendor}
          placeholder="Vendor"
          onChange={handleChange}
          className="mb-4 px-4 py-2 rounded-lg bg-slate-700 text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 w-64 h-32 resize-none"
        />

        {/* INPUT MODEL */}
        <input
          name="model"
          type="text"
          value={machine.plc.model}
          placeholder="Model"
          onChange={handleChange}
          className="mb-4 px-4 py-2 rounded-lg bg-slate-700 text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 w-64"
        />

        {/* SELECT LINEA */}
        <select
          required
          name="lineId"
          value={machine.lineId}
          onChange={handleChange}
          className="mb-6 px-4 py-2 rounded-lg bg-slate-700 text-slate-200 border border-transparent focus:outline-none focus:ring-2 focus:ring-amber-500 w-64 cursor-pointer"
        >
          <option value="" disabled>
            Seleziona Linea
          </option>
          {lines.map((line) => (
            <option key={line.id} value={line.id}>
              {line.id}
            </option>
          ))}
        </select>

        {/* BOTTONE */}
        <button
          type="submit"
          className="px-4 py-2 bg-amber-500 text-slate-900 font-bold rounded-lg hover:bg-amber-400 transition-colors uppercase w-64"
        >
          Aggiungi macchinario
        </button>
      </form>
      <Link
        to="/dashboard/machines"
        className="absolute top-4 left-4 text-amber-500 hover:text-amber-400 transition-colors"
      >
        Torna alla lista macchinari
      </Link>
    </div>
  )
}
