import { useCallback } from 'react'
import { useEditorProject } from './useEditorProject'

export function useElementSelection() {
  const { state, activePage, dispatch } = useEditorProject()
  const selectedElement =
    activePage.elements.find((element) => element.id === state.selectedElementId) ?? null

  const selectElement = useCallback(
    (elementId: string) => {
      dispatch({ type: 'set-selected-element', elementId })
    },
    [dispatch],
  )

  const clearSelection = useCallback(() => {
    dispatch({ type: 'set-selected-element', elementId: null })
  }, [dispatch])

  return {
    selectedElementId: state.selectedElementId,
    selectedElement,
    selectElement,
    clearSelection,
  }
}
