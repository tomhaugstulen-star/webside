import { EditorShell } from './components/editor/EditorShell'
import { EditorProjectProvider } from './state/EditorProjectProvider'
import './App.css'

function App() {
  return (
    <EditorProjectProvider>
      <EditorShell />
    </EditorProjectProvider>
  )
}

export default App
