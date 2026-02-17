/**
 * In questo file viene gestita la pagina per aggiungere nuovi macchinari al sistema.
 * Si occupa di raccogliere i dati inseriti dall'utente (nome, tipo, marca del PLC),
 * di controllarli e di inviarli al database per il salvataggio.
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import type { Machine, Line } from '../Types/Type'
import { getLines } from '../utils/api'

/**
 * Viene definito come deve apparire il modulo (form) all'inizio:
 * Tutti i campi sono vuoti o impostati a zero.
 */
const macchinaIniziale: Machine = {
  id: '',
  lineId: '',
  name: '',
  type: '',
  plc: {
    vendor: '',
    model: '',
  },
  order: 0,
  telemetries: [],
}

// Lista delle categorie di macchine disponibili nel sistema
const categorie = ['CNC', 'PACKER', 'PRESS', 'QC', 'ROBOT']

export function ManageMachines() {
  const [macchina, setMacchina] = useState<Machine>(macchinaIniziale)
  const [linee, setLinee] = useState<Line[]>([])

  /**
   * Al caricamento della pagina, vengono scaricate le linee esistenti.
   * Serve per permettere all'utente di scegliere a quale linea assegnare la nuova macchina.
   */
  useEffect(() => {
    getLines().then((dati) => setLinee(dati))
  }, [])

  /**
   * Viene gestito l'inserimento dei dati nei campi del modulo.
   * Se si cambia il tipo di macchina, il sistema suggerisce automaticamente l'inizio dell'ID.
   */
  const gestisciCambio = (e: any) => {
    const { name, value } = e.target

    if (name === 'type') {
      // Se scelgo "CNC", l'ID inizierà automaticamente con "cnc-"
      const suggerimentoId = value ? `${value.toLowerCase()}-` : ''
      setMacchina({ ...macchina, type: value, id: suggerimentoId })
    } else if (name === 'vendor' || name === 'model') {
      // Si aggiornano i dati specifici del computer interno (PLC)
      setMacchina({
        ...macchina,
        plc: { ...macchina.plc, [name]: value },
      })
    } else {
      // Si aggiornano tutti gli altri campi (nome, ID, ecc.)
      setMacchina({ ...macchina, [name]: value })
    }
  }

  /**
   * Viene gestito l'invio del modulo quando si preme il tasto "Registra".
   * 1. Si controlla che nessun campo sia rimasto vuoto.
   * 2. Si puliscono i testi (rimozione spazi inutili e lettere maiuscole).
   * 3. Si inviano i dati definitivi al server.
   */
  async function salvaMacchina(e: any) {
    e.preventDefault()

    if (
      macchina.id.trim() === '' ||
      macchina.name.trim() === '' ||
      macchina.plc.vendor.trim() === '' ||
      macchina.plc.model.trim() === ''
    ) {
      alert('Per favore, compila tutti i campi!')
      return
    }

    const datiPuliti = {
      ...macchina,
      id: macchina.id.trim().toUpperCase(),
      name: macchina.name.trim(),
      plc: {
        vendor: macchina.plc.vendor.trim(),
        model: macchina.plc.model.trim(),
      },
    }

    try {
      const risposta = await fetch('http://localhost:3000/machines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datiPuliti),
      })

      if (risposta.ok) {
        alert('Macchinario registrato con successo!')
        setMacchina(macchinaIniziale) // Si svuota il modulo per un nuovo inserimento
      }
    } catch (error) {
      alert('Errore: impossibile comunicare con il server.')
    }
  }

  return (
    <div className="min-h-screen bg-slate-800 w-full font-mono flex flex-col items-center justify-center p-4">
      <form
        onSubmit={salvaMacchina}
        className="flex flex-col items-center justify-center w-full max-w-md"
      >
        <h1 className="text-3xl font-bold text-amber-500 mb-6 uppercase">Nuovo Macchinario</h1>

        {/* Menu a tendina per scegliere il tipo di macchina */}
        <select
          name="type"
          value={macchina.type}
          onChange={gestisciCambio}
          required
          className="mb-4 px-4 py-2 rounded-lg bg-slate-700 text-slate-200 w-full outline-none"
        >
          <option value="" disabled>
            Seleziona Tipo
          </option>
          {categorie.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        {/* Campi di testo per ID e Nome */}
        <input
          name="id"
          type="text"
          value={macchina.id}
          placeholder="ID (es. CNC-01)"
          onChange={gestisciCambio}
          className="mb-4 px-4 py-2 rounded-lg bg-slate-700 text-slate-200 w-full"
        />

        <input
          name="name"
          type="text"
          value={macchina.name}
          placeholder="Nome macchina"
          onChange={gestisciCambio}
          className="mb-4 px-4 py-2 rounded-lg bg-slate-700 text-slate-200 w-full"
        />

        {/* Dettagli tecnici del PLC */}
        <input
          name="vendor"
          value={macchina.plc.vendor}
          placeholder="Marca PLC (es. Siemens)"
          onChange={gestisciCambio}
          className="mb-4 px-4 py-2 rounded-lg bg-slate-700 text-slate-200 w-full"
        />

        <input
          name="model"
          type="text"
          value={macchina.plc.model}
          placeholder="Modello PLC"
          onChange={gestisciCambio}
          className="mb-4 px-4 py-2 rounded-lg bg-slate-700 text-slate-200 w-full"
        />

        {/* Menu a tendina per collegare la macchina a una linea */}
        <select
          required
          name="lineId"
          value={macchina.lineId}
          onChange={gestisciCambio}
          className="mb-6 px-4 py-2 rounded-lg bg-slate-700 text-slate-200 w-full"
        >
          <option value="" disabled>
            Associa a una Linea
          </option>
          {linee.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="px-4 py-2 bg-amber-500 text-slate-900 font-bold rounded-lg hover:bg-amber-400 w-full"
        >
          Registra macchinario
        </button>
      </form>

      <Link to="/dashboard/machines" className="absolute top-4 left-4 text-amber-500">
        ← Torna alla lista
      </Link>
    </div>
  )
}
