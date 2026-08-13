export type PageProjectAction =
  | {
      type: 'add-page'
      pageId: string
      name: string
      slug: string
      updatedAt: string
    }
  | {
      type: 'set-page-name'
      pageId: string
      name: string
      updatedAt: string
    }
  | {
      type: 'set-page-slug'
      pageId: string
      slug: string
      updatedAt: string
    }
  | {
      type: 'move-page'
      pageId: string
      direction: 'up' | 'down'
      updatedAt: string
    }
  | {
      type: 'delete-page'
      pageId: string
      updatedAt: string
    }
