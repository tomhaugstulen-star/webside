import { useState } from 'react'
import { clearLocalProject } from './localProjectStorage'

type PersistenceRecoveryScreenProps = {
  message: string
}

export function PersistenceRecoveryScreen({
  message,
}: PersistenceRecoveryScreenProps) {
  const [busy, setBusy] = useState(false)
  const [resetError, setResetError] = useState<string | null>(null)

  const resetStorage = async () => {
    const confirmed = window.confirm(
      'Nullstill lokal prosjektlagring? Lagrede prosjektdata og bilder slettes.',
    )

    if (!confirmed) {
      return
    }

    setBusy(true)
    setResetError(null)

    try {
      await clearLocalProject()
      window.location.reload()
    } catch {
      setBusy(false)
      setResetError('Lokal prosjektlagring kunne ikke nullstilles.')
    }
  }

  return (
    <main className="persistence-screen">
      <section className="persistence-screen__card" role="alert">
        <h1>Prosjektet kunne ikke åpnes</h1>
        <p>{message}</p>
        <p>
          Lagrede data er ikke overskrevet. Nullstill bare dersom du vil starte
          med et nytt lokalt prosjekt.
        </p>
        <button type="button" disabled={busy} onClick={() => void resetStorage()}>
          {busy ? 'Nullstiller…' : 'Nullstill lokal lagring'}
        </button>
        {resetError && <p className="persistence-screen__error">{resetError}</p>}
      </section>
    </main>
  )
}
