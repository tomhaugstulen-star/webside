import { ImageAssetStoreProvider } from './assets/images/ImageAssetStoreProvider'
import { EditorShell } from './components/editor/EditorShell'
import { EditorProjectProvider } from './state/EditorProjectProvider'
import './App.css'

function App() {
  return (
    <ImageAssetStoreProvider>
      <EditorProjectProvider>
        <EditorShell />
      </EditorProjectProvider>
    </ImageAssetStoreProvider>
  )
}

export default App
