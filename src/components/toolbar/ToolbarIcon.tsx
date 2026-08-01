export type ToolbarIconName =
  | 'sun'
  | 'chevron'
  | 'desktop'
  | 'mobile'
  | 'undo'
  | 'redo'
  | 'eye'
  | 'save'
  | 'publish'
  | 'menu'

export function ToolbarIcon({ name }: { name: ToolbarIconName }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }

  switch (name) {
    case 'sun':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3.5" />
          <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M18.7 5.3l-1.4 1.4M6.7 17.3l-1.4 1.4" />
        </svg>
      )
    case 'chevron':
      return <svg {...common}><path d="m8 10 4 4 4-4" /></svg>
    case 'desktop':
      return <svg {...common}><rect x="3" y="4" width="18" height="13" rx="1.5" /><path d="M8 21h8M12 17v4" /></svg>
    case 'mobile':
      return <svg {...common}><rect x="7" y="2" width="10" height="20" rx="2" /><path d="M11 18h2" /></svg>
    case 'undo':
      return <svg {...common}><path d="M9 7 4 12l5 5" /><path d="M5 12h8a6 6 0 0 1 6 6" /></svg>
    case 'redo':
      return <svg {...common}><path d="m15 7 5 5-5 5" /><path d="M19 12h-8a6 6 0 0 0-6 6" /></svg>
    case 'eye':
      return <svg {...common}><path d="M2.5 12s3.5-5.5 9.5-5.5 9.5 5.5 9.5 5.5-3.5 5.5-9.5 5.5S2.5 12 2.5 12Z" /><circle cx="12" cy="12" r="2.5" /></svg>
    case 'save':
      return <svg {...common}><path d="M4 3h13l3 3v15H4Z" /><path d="M8 3v6h8V3M8 21v-7h8v7" /></svg>
    case 'publish':
      return <svg {...common}><path d="M12 16V3M7 8l5-5 5 5" /><path d="M5 14v6h14v-6" /></svg>
    case 'menu':
      return <svg {...common}><path d="M5 7h14M5 12h14M5 17h14" /></svg>
  }
}
