import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import type { Line } from '../Types/Type'
import { getLines } from '../utils/api'

const types = ['CNC', 'PACKER', 'PRESS', 'QC', 'ROBOT']

export async function deleteMachine(id: string) {
  const conferma = confirm(
    "Sei sicuro di voler eliminare questo macchinario? L'azione e' irreversibile",
  )
  if (conferma) {
    try {
      const response = await fetch(`http://localhost:3000/machines/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        alert('Linea eliminata con successo!')
      }
    } catch (error) {
      alert("Errore nell'eliminazione della linea")
    }
  }
}

export function ManageMachines() {
  const [machine, setMachine] = useState({
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
  })

  const [lines, setLines] = useState<Line[]>([])

  const { id } = useParams()
  const editMode = Boolean(id)

  // Al caricamento recupera le linee per avere i dati aggiornati dal database
  useEffect(() => {
    // Quando il componente viene montato, chiama la funzione getLines presente in API.ts, per recuperare le linee di produzione dal database, per poi aggiornare lo stato del componente
    const caricaDatiMachine = async () => {
      const response = await fetch(`http://localhost:3000/machines/${id}`)
      const datiMachine = await response.json()
      console.log('Dato ricevuto:', datiMachine.order)
      setMachine(datiMachine)
    }
    if (editMode) {
      caricaDatiMachine()
    }
    getLines().then((lines) => setLines(lines))
  }, [id, editMode])

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
    // Gestione PLC
    else if (name === 'vendor' || name === 'model') {
      setMachine({
        ...machine,
        plc: {
          ...machine.plc,
          [name]: value,
        },
      })
    }
    // Gestione ORDER (Nuova logica per numeri)
    else if (name === 'order') {
      // Trasformiamo in numero, gestendo il caso stringa vuota con 0
      const numericValue = value === '' ? 0 : parseInt(value, 10)

      setMachine({
        ...machine,
        order: isNaN(numericValue) ? 0 : numericValue,
      })
    }
    // Tutti gli altri campi
    else {
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

    if (editMode) {
      try {
        const response = await fetch(`http://localhost:3000/machines/${id}`, {
          method: 'PUT',
          headers: { 'content-Type': 'application/json' },
          body: JSON.stringify(dataToSave),
        })

        if (response.ok) {
          alert('Macchinario modificato con successo!')
        } else {
          alert('Errore nella modifica del macchinario')
        }
      } catch (error) {
        console.log('Dettaglio errore:', error)
        alert('Errore di rete: il server è irraggiungibile o la connessione è stata interrotta')
      }
    } else {
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
  }

  return (
    <div className="min-h-screen bg-slate-800 w-full font-mono flex flex-col items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-center min-h-screen bg-slate-800 w-full font-mono p-4"
      >
        <h1 className="text-3xl font-bold text-amber-500 mb-6 uppercase tracking-tighter">
          {editMode ? 'Modifica Macchinario' : 'Nuovo Macchinario'}
        </h1>

        {/* SELECT TIPO */}
        <select
          name="type"
          value={machine.type}
          disabled={editMode}
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
          disabled={editMode}
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

        <input
          type="text"
          name="order"
          value={machine.order}
          placeholder="Codice Ordine"
          onChange={handleChange}
          className="mb-6 px-4 py-2 rounded-lg bg-slate-700 text-slate-200 border border-transparent focus:outline-none focus:ring-2 focus:ring-amber-500 w-64 cursor-pointer"
        ></input>

        {/* BOTTONE */}
        <button
          type="submit"
          className="px-4 py-2 bg-amber-500 text-slate-900 font-bold rounded-lg hover:bg-amber-400 transition-colors uppercase w-64"
        >
          {editMode ? 'Salva Modifiche' : 'Aggiungi macchinario'}
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
