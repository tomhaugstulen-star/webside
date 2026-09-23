import { ImageAssetStoreProvider } from './assets/images/ImageAssetStoreProvider'
import { EditorShell } from './components/editor/EditorShell'
import { EditorPersistenceProvider } from './persistence/EditorPersistenceProvider'
import { EditorProjectProvider } from './state/EditorProjectProvider'
import { SectionTemplateLibraryProvider } from './templates/SectionTemplateLibraryProvider'
import './App.css'

function App() {
  return (
    <ImageAssetStoreProvider>
      <EditorProjectProvider>
        <EditorPersistenceProvider>
          <SectionTemplateLibraryProvider>
            <EditorShell />
          </SectionTemplateLibraryProvider>
        </EditorPersistenceProvider>
      </EditorProjectProvider>
    </ImageAssetStoreProvider>
  )
}

export default App
