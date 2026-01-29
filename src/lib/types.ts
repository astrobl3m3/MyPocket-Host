export interface ServerSettings {
  enabled: boolean
  port: number
  accessPointName: string
  password: string
  isPublished: boolean
  publishedUrl?: string
  lastPublished?: number
  ssl?: {
    enabled: boolean
    certPath?: string
    keyPath?: string
    autoGenerate?: boolean
  }
  metrics?: ProjectMetrics
}

export interface ProjectMetrics {
  totalRequests: number
  bandwidthUsed: number
  lastAccessed?: number
  requestsHistory: RequestLog[]
}

export interface RequestLog {
  timestamp: number
  bytesTransferred: number
  path: string
  method: string
}

export interface Project {
  id: string
  name: string
  description: string
  components: Component[]
  createdAt: number
  updatedAt: number
  isArchived: boolean
  previewActive: boolean
  serverSettings?: ServerSettings
}

export type ComponentType = 
  | 'header'
  | 'text'
  | 'image'
  | 'video'
  | 'button'
  | 'card'
  | 'table'
  | 'form'
  | 'gallery'
  | 'customHtml'
  | 'footer'

export interface BaseComponent {
  id: string
  type: ComponentType
  order: number
}

export interface HeaderComponent extends BaseComponent {
  type: 'header'
  title: string
  subtitle: string
  alignment: 'left' | 'center' | 'right'
  bgColor: string
}

export interface TextComponent extends BaseComponent {
  type: 'text'
  content: string
  alignment: 'left' | 'center' | 'right'
  fontSize: 'small' | 'medium' | 'large'
}

export interface ImageComponent extends BaseComponent {
  type: 'image'
  src: string
  alt: string
  alignment: 'left' | 'center' | 'right'
  width: string
}

export interface VideoComponent extends BaseComponent {
  type: 'video'
  src: string
  alignment: 'left' | 'center' | 'right'
  autoplay: boolean
}

export interface ButtonComponent extends BaseComponent {
  type: 'button'
  text: string
  url: string
  alignment: 'left' | 'center' | 'right'
  variant: 'primary' | 'secondary' | 'outline'
}

export interface CardComponent extends BaseComponent {
  type: 'card'
  title: string
  content: string
  imageUrl: string
}

export interface TableCell {
  value: string
}

export interface TableComponent extends BaseComponent {
  type: 'table'
  headers: string[]
  rows: TableCell[][]
}

export interface FormField {
  id: string
  label: string
  type: 'text' | 'email' | 'textarea'
  required: boolean
}

export interface FormComponent extends BaseComponent {
  type: 'form'
  title: string
  fields: FormField[]
  submitText: string
}

export interface GalleryImage {
  src: string
  alt: string
}

export interface GalleryComponent extends BaseComponent {
  type: 'gallery'
  images: GalleryImage[]
  columns: number
}

export interface CustomHtmlComponent extends BaseComponent {
  type: 'customHtml'
  html: string
}

export interface FooterComponent extends BaseComponent {
  type: 'footer'
  content: string
  links: { text: string; url: string }[]
}

export type Component =
  | HeaderComponent
  | TextComponent
  | ImageComponent
  | VideoComponent
  | ButtonComponent
  | CardComponent
  | TableComponent
  | FormComponent
  | GalleryComponent
  | CustomHtmlComponent
  | FooterComponent

export interface CollaborativeSession {
  projectId: string
  users: CollaborativeUser[]
  lastUpdated: number
}

export interface CollaborativeUser {
  id: string
  login: string
  avatarUrl: string
  lastActive: number
}
