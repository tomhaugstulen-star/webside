import {
  createButtonAssetId,
  type ButtonAssetId,
} from '../../model/buttonAsset'
import darkRoundedButton from './dark-rounded.svg'
import outlineRoundedButton from './outline-rounded.svg'
import primaryRoundedButton from './primary-rounded.svg'
import secondaryRoundedButton from './secondary-rounded.svg'

export type ButtonAssetDefinition = {
  id: ButtonAssetId
  name: string
  src: string
  resizeMode: 'stretch'
  labelColor: string
}

export const buttonAssetCatalog = [
  {
    id: createButtonAssetId('button.primary-rounded.v1'),
    name: 'Primær avrundet',
    src: primaryRoundedButton,
    resizeMode: 'stretch',
    labelColor: '#FFFFFF',
  },
  {
    id: createButtonAssetId('button.secondary-rounded.v1'),
    name: 'Sekundær avrundet',
    src: secondaryRoundedButton,
    resizeMode: 'stretch',
    labelColor: '#5F342A',
  },
  {
    id: createButtonAssetId('button.outline-rounded.v1'),
    name: 'Outline avrundet',
    src: outlineRoundedButton,
    resizeMode: 'stretch',
    labelColor: '#8F432F',
  },
  {
    id: createButtonAssetId('button.dark-rounded.v1'),
    name: 'Mørk avrundet',
    src: darkRoundedButton,
    resizeMode: 'stretch',
    labelColor: '#FFFFFF',
  },
] as const satisfies readonly ButtonAssetDefinition[]

export function findButtonAsset(
  assetId: ButtonAssetId,
): ButtonAssetDefinition | null {
  return buttonAssetCatalog.find((asset) => asset.id === assetId) ?? null
}
