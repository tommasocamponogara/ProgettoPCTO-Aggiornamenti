import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'

export async function deleteLine(id: string) {
  const conferma = confirm("Sei sicuro di voler eliminare questa linea? L'azione e' irreversibile")
  if (conferma) {
    try {
      const response = await fetch(`http://localhost:3000/lines/${id}`, {
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

export function ManageLines() {
  // 1. Un unico stato che contiene tutto l'oggetto della linea
  const [line, setLine] = useState({
    id_line: '',
    name: '',
    description: '',
    order_nr: 0,
  })

  const { id } = useParams()
  const editMode = Boolean(id) // Vero se c'è l'ID, falso se è vuoto

  useEffect(() => {
    // 1. Creiamo la funzione per aspettare il database
    const caricaDati = async () => {
      const risposta = await fetch(`http://localhost:3000/lines/${id}`)
      const dati = await risposta.json()

      // 2. Mettiamo i dati nel form
      setLine(dati)
    }

    // 3. La facciamo partire solo se siamo in modalità modifica
    if (editMode) {
      caricaDati()
    }
  }, [id, editMode]) // 4. Riesegui solo se l'ID cambia

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
      line.id_line.trim() === '' ||
      line.name.trim() === '' ||
      line.description.trim() === '' ||
      line.order_nr <= 0
    ) {
      alert('Compila tutti i campi correttamente!')
      return // Si ferma qui e non prova a fare la fetch
    }
    const cleanID = line.id_line.trim().charAt(0).toUpperCase() + line.id_line.slice(1).trim()
    const cleanName = line.name.trim().charAt(0).toUpperCase() + line.name.trim().slice(1)
    const cleanDescription =
      line.description.trim().charAt(0).toUpperCase() + line.description.trim().slice(1)

    // 2. Creiamo l'oggetto finale da spedire
    const dataToSave = {
      ...line,
      id_line: cleanID,
      name: cleanName,
      description: cleanDescription,
    }
    if (!editMode) {
      try {
        const response = await fetch('http://localhost:3000/lines', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSave),
        })

        const data = await response.json()

        if (response.ok) {
          alert('Linea aggiunta con successo!')
          setLine({ id_line: '', name: '', description: '', order_nr: 0 })
        } else {
          alert('Errore: ' + (data.error || 'Riprova'))
        }
      } catch (error) {
        console.log('Dettaglio errore:', error)
        alert('Errore di rete: il server è irraggiungibile o la connessione è stata interrotta')
      }
    } else {
      try {
        const response = await fetch(`http://localhost:3000/lines/${id}`, {
          method: 'PUT',
          headers: { 'content-Type': 'application/json' },
          body: JSON.stringify(dataToSave),
        })

        if (response.ok) {
          alert('Linea modificata con successo')
        }
      } catch (error) {
        alert('errore')
      }
    }
  }

  return (
    <>
      <form
        className="flex flex-col items-center justify-center min-h-screen bg-slate-800 w-full font-mono"
        onSubmit={handleSubmit}
      >
        <h1 className="text-3xl font-bold text-amber-500 mb-6">
          {editMode ? 'MModifica Linea di Produzione  ' : 'Aggiungi Linea di Produzione'}{' '}
        </h1>

        <input
          name="id_line" // Deve corrispondere alla chiave nello state
          type="text"
          disabled={editMode}
          value={line.id_line}
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
          name="order_nr"
          type="number"
          value={line.order_nr}
          placeholder="Numero Ordine"
          className="mb-4 px-4 py-2 rounded-lg bg-slate-700 text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 w-64"
          onChange={handleChange}
        />

        <button
          type="submit"
          className="px-4 py-2 bg-amber-500 text-slate-900 rounded-lg hover:bg-amber-400 transition-colors"
        >
          {editMode ? 'Salva Modifiche' : 'Aggiungi Linea'}
        </button>
      </form>
      <Link
        to="/dashboard/lines"
        className="absolute top-4 left-4 text-amber-500 hover:text-amber-400 transition-colors"
      >
        Torna alla lista linee
      </Link>
    </>
  )
}
