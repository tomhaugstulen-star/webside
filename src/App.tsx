import { ImageAssetStoreProvider } from './assets/images/ImageAssetStoreProvider'
import { EditorShell } from './components/editor/EditorShell'
import { EditorPersistenceProvider } from './persistence/EditorPersistenceProvider'
import { EditorProjectProvider } from './state/EditorProjectProvider'
import './App.css'

function App() {
  return (
    <ImageAssetStoreProvider>
      <EditorProjectProvider>
        <EditorPersistenceProvider>
          <EditorShell />
        </EditorPersistenceProvider>
      </EditorProjectProvider>
    </ImageAssetStoreProvider>
  )
}

export default App
