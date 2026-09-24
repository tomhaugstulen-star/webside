import { useState } from 'react'
import { normalizePublicUrl } from '../../model/siteSettings'
import { useEditorProject } from '../../state/useEditorProject'

export function SiteSettingsPanel() {
  const { state, dispatch } = useEditorProject()
  const project = state.project
  const [message, setMessage] = useState('')
  const [name, setName] = useState(project.name)
  const [url, setUrl] = useState(project.siteSettings.publicUrl)
  const [language, setLanguage] = useState(project.siteSettings.language)
  const [pageId, setPageId] = useState(state.activePageId)
  const selected = project.pages.find((page) => page.id === pageId) ?? project.pages[0]
  const [title, setTitle] = useState(selected.seo.title)
  const [description, setDescription] = useState(selected.seo.description)

  const selectPage = (id: string) => {
    if (title !== selected.seo.title || description !== selected.seo.description) {
      setMessage('Lagre SEO-endringene før du bytter side.')
      return
    }
    const page = project.pages.find((item) => item.id === id)
    if (!page) return
    setPageId(id); setTitle(page.seo.title); setDescription(page.seo.description)
    setMessage('')
  }

  const save = () => {
    const normalizedUrl = normalizePublicUrl(url)
    if (!name.trim() || name.trim().length > 120 || normalizedUrl === null ||
      title.length > 120 || description.length > 320) {
      setMessage('Kontroller prosjektnavn, nettadresse og SEO-feltenes lengde.')
      return
    }
    const updatedAt = new Date().toISOString()
    dispatch({ type: 'set-site-metadata', name: name.trim(),
      settings: { language, publicUrl: normalizedUrl }, pageId: selected.id,
      seo: { title, description }, updatedAt })
    setUrl(normalizedUrl)
    setMessage('Prosjektinnstillinger lagret.')
  }

  return <section className="site-settings-panel">
    <h2>Prosjektinnstillinger</h2>
    <p>Nettstedet eksporteres som ZIP for manuell opplasting.</p>
    <label>Prosjektnavn<input value={name} maxLength={120} onChange={(event) => setName(event.target.value)} /></label>
    <label>Språk<select value={language} onChange={(event) => setLanguage(event.target.value)}>
      <option value="nb">Norsk bokmål</option><option value="en">English</option>
    </select></label>
    <label>Offentlig domene (valgfritt)<input type="url" placeholder="https://eksempel.no" value={url}
      onChange={(event) => setUrl(event.target.value)} /></label>
    <p>Brukes til kanoniske adresser og sitemap. Last opp ZIP-innholdet i domenets dokumentrot eller en undermappe.</p>
    <h3>SEO per side</h3>
    <label>Side<select value={selected.id} onChange={(event) => selectPage(event.target.value)}>
      {project.pages.map((page) => <option key={page.id} value={page.id}>{page.name}</option>)}
    </select></label>
    <label>Sidens tittel<input value={title} maxLength={120} onChange={(event) => setTitle(event.target.value)} /></label>
    <label>Beskrivelse<textarea value={description} maxLength={320} rows={4}
      onChange={(event) => setDescription(event.target.value)} /></label>
    <button type="button" onClick={save}>Lagre innstillinger</button>
    {message && <p role="status">{message}</p>}
  </section>
}
