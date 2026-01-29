import type { Component } from './types'
import { generateComponentId } from './project-utils'

export function createHeaderComponent(order: number): Component {
  return {
    id: generateComponentId(),
    type: 'header',
    order,
    title: 'Welcome to Your Page',
    subtitle: 'Build something amazing',
    alignment: 'center',
    bgColor: '#6b2dd6',
  }
}

export function createTextComponent(order: number): Component {
  return {
    id: generateComponentId(),
    type: 'text',
    order,
    content: 'Add your content here. This is a text block where you can write paragraphs, lists, and more.',
    alignment: 'left',
    fontSize: 'medium',
  }
}

export function createImageComponent(order: number): Component {
  return {
    id: generateComponentId(),
    type: 'image',
    order,
    src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
    alt: 'Placeholder image',
    alignment: 'center',
    width: '100%',
  }
}

export function createVideoComponent(order: number): Component {
  return {
    id: generateComponentId(),
    type: 'video',
    order,
    src: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    alignment: 'center',
    autoplay: false,
  }
}

export function createButtonComponent(order: number): Component {
  return {
    id: generateComponentId(),
    type: 'button',
    order,
    text: 'Click Me',
    url: '#',
    alignment: 'center',
    variant: 'primary',
  }
}

export function createCardComponent(order: number): Component {
  return {
    id: generateComponentId(),
    type: 'card',
    order,
    title: 'Card Title',
    content: 'Card description goes here. Add details about this card.',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
  }
}

export function createTableComponent(order: number): Component {
  return {
    id: generateComponentId(),
    type: 'table',
    order,
    headers: ['Column 1', 'Column 2', 'Column 3'],
    rows: [
      [{ value: 'Row 1 Col 1' }, { value: 'Row 1 Col 2' }, { value: 'Row 1 Col 3' }],
      [{ value: 'Row 2 Col 1' }, { value: 'Row 2 Col 2' }, { value: 'Row 2 Col 3' }],
    ],
  }
}

export function createFormComponent(order: number): Component {
  return {
    id: generateComponentId(),
    type: 'form',
    order,
    title: 'Contact Form',
    fields: [
      { id: 'name', label: 'Name', type: 'text', required: true },
      { id: 'email', label: 'Email', type: 'email', required: true },
      { id: 'message', label: 'Message', type: 'textarea', required: false },
    ],
    submitText: 'Submit',
  }
}

export function createGalleryComponent(order: number): Component {
  return {
    id: generateComponentId(),
    type: 'gallery',
    order,
    images: [
      { src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400', alt: 'Image 1' },
      { src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400', alt: 'Image 2' },
      { src: 'https://images.unsplash.com/photo-1522199755839-a2bacb67c546?w=400', alt: 'Image 3' },
    ],
    columns: 3,
  }
}

export function createCustomHtmlComponent(order: number): Component {
  return {
    id: generateComponentId(),
    type: 'customHtml',
    order,
    html: '<div style="padding: 2rem; background: #f5f5f5; text-align: center;"><h2>Custom HTML</h2><p>Add any HTML code here</p></div>',
  }
}

export function createFooterComponent(order: number): Component {
  return {
    id: generateComponentId(),
    type: 'footer',
    order,
    content: '© 2024 Your Company. All rights reserved.',
    links: [
      { text: 'Privacy', url: '#privacy' },
      { text: 'Terms', url: '#terms' },
      { text: 'Contact', url: '#contact' },
    ],
  }
}

export const componentFactories = {
  header: createHeaderComponent,
  text: createTextComponent,
  image: createImageComponent,
  video: createVideoComponent,
  button: createButtonComponent,
  card: createCardComponent,
  table: createTableComponent,
  form: createFormComponent,
  gallery: createGalleryComponent,
  customHtml: createCustomHtmlComponent,
  footer: createFooterComponent,
}

export const componentLabels: Record<string, string> = {
  header: 'Header',
  text: 'Text Block',
  image: 'Image',
  video: 'Video',
  button: 'Button',
  card: 'Card',
  table: 'Table',
  form: 'Form',
  gallery: 'Gallery',
  customHtml: 'Custom HTML',
  footer: 'Footer',
}
