import { useEffect, useState } from 'react'
import { getMachines } from '../utils/api'

export function Notification() {
  // --- SEZIONE 1: Stati base ---
  const [showToast, setShowToast] = useState(false)
  const [messaggio, setMessaggio] = useState('')

  // --- SEZIONE 2: Funzione di supporto ---
  function getStatoAttuale(macchina: any) {
    const stato = macchina.telemetries?.[0]?.state || 'OFFLINE'
    return String(stato).toUpperCase()
  }

  useEffect(() => {
    // --- SEZIONE 3: Memoria locale del componente ---
    let timerToast: ReturnType<typeof setTimeout> | null = null
    const statoPrecMacchinario: Record<string, string> = {}
    const codaToast: string[] = []
    let toastAttivo = false
    let richiestaInCorso = false

    function mostraProssimoToast() {
      if (toastAttivo) return
      if (codaToast.length === 0) return

      toastAttivo = true
      const testo = codaToast.shift() || ''
      setMessaggio(testo)
      setShowToast(true)

      if (timerToast) {
        clearTimeout(timerToast)
      }

      timerToast = setTimeout(() => {
        setShowToast(false)
        toastAttivo = false
        mostraProssimoToast()
      }, 4000)
    }

    function accodaToast(testo: string) {
      codaToast.push(testo)
      mostraProssimoToast()
    }

    // --- SEZIONE 4: Polling macchinari ---
    async function aggiornaMacchinari() {
      if (richiestaInCorso) return
      richiestaInCorso = true

      try {
        const machines = await getMachines()

        // Mostra toast quando una macchina passa da non-FAULT a FAULT
        for (let i = 0; i < machines.length; i++) {
          const macchina = machines[i]
          const idMacchina = String(macchina.id)
          const statoAttuale = getStatoAttuale(macchina)
          const statoPrecedente = statoPrecMacchinario[idMacchina] || 'OFFLINE'

          if (statoAttuale === 'FAULT' && statoPrecedente !== 'FAULT') {
            accodaToast(`Allarme: ${macchina.name} (${macchina.id}) in FAULT`)
          }

          statoPrecMacchinario[idMacchina] = statoAttuale
        }
      } catch (err) {
        // Se il backend non risponde per un giro, al successivo riprova
      } finally {
        richiestaInCorso = false
      }
    }

    // Primo avvio
    aggiornaMacchinari()

    // Controllo continuo ogni secondo
    const intervalId = setInterval(aggiornaMacchinari, 1000)

    // Pulizia
    return () => {
      clearInterval(intervalId)
      if (timerToast) clearTimeout(timerToast)
    }
  }, [])

  return (
    <>
      {showToast && (
        <div className="fixed top-28 right-4 z-50 bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg border border-red-300">
          {messaggio}
        </div>
      )}
    </>
  )
}
