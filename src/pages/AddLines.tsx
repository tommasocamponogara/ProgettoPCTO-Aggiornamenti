import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export function AddLines() {
  // 1. Un unico stato che contiene tutto l'oggetto della linea
  const [line, setLine] = useState({
    id: '',
    name: '',
    description: '',
    order: 0,
  })

  // 2. Funzione unica per aggiornare i campi
  function handleChange(e: any) {
    const { name, value } = e.target
    // Aggiorniamo solo il campo che è stato cambiato
    setLine({
      ...line,
      [name]: name === 'order' ? (value === '' ? 0 : parseInt(value)) : value,
    })
  }

  async function handleSubmit(e: any) {
    // 1. BLOCCA SUBITO il refresh della pagina
    e.preventDefault()

    // 2. Controllo validità (Trim toglie gli spazi vuoti)
    if (
      line.id.trim() === '' ||
      line.name.trim() === '' ||
      line.description.trim() === '' ||
      line.order <= 0
    ) {
      alert('Compila tutti i campi correttamente!')
      return // Si ferma qui e non prova a fare la fetch
    }

    

    try {
      const response = await fetch('http://localhost:4000/lines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(line),
      })

      const data = await response.json()

      if (response.ok) {
        alert('Linea aggiunta con successo!')
        setLine({ id: '', name: '', description: '', order: 0 })
      } else {
        alert('Errore: ' + (data.error || 'Riprova'))
      }
    } catch (error) {
      console.error('Dettaglio errore:', error)
      alert('Errore di rete: il server è irraggiungibile o la connessione è stata interrotta')
    }
  }

  return (
    <>
      <form
        className="flex flex-col items-center justify-center min-h-screen bg-slate-800 w-full font-mono"
        onSubmit={handleSubmit}
      >
        <h1 className="text-3xl font-bold text-amber-500 mb-6">Aggiungi Linea di Produzione</h1>

        <input
          name="id" // Deve corrispondere alla chiave nello state
          type="text"
          value={line.id}
          placeholder="ID Linea"
          className="mb-4 px-4 py-2 rounded-lg bg-slate-700 text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 w-64"
          onChange={handleChange}
        />

        <input
          name="name"
          type="text"
          value={line.name}
          placeholder="Nome Linea"
          className="mb-4 px-4 py-2 rounded-lg bg-slate-700 text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 w-64"
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Descrizione Linea"
          value={line.description}
          className="mb-4 px-4 py-2 rounded-lg bg-slate-700 text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 w-64 h-32 resize-none"
          onChange={handleChange}
        />

        <input
          name="order"
          type="number"
          value={line.order}
          placeholder="Numero Ordine"
          className="mb-4 px-4 py-2 rounded-lg bg-slate-700 text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 w-64"
          onChange={handleChange}
        />

        <button
          type="submit"
          className="px-4 py-2 bg-amber-500 text-slate-900 rounded-lg hover:bg-amber-400 transition-colors"
        >
          Aggiungi Linea
        </button>
      </form>
      <Link
        to="/dashboard/linee"
        className="absolute top-4 left-4 text-amber-500 hover:text-amber-400 transition-colors"
      >
        Torna alla lista linee
      </Link>
    </>
  )
}
