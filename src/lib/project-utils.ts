import type { Project, Component } from './types'

export function generateProjectId(): string {
  return `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export function generateComponentId(): string {
  return `component_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export function createDefaultProject(name: string, description: string): Project {
  return {
    id: generateProjectId(),
    name,
    description,
    components: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    isArchived: false,
    previewActive: false,
  }
}

export function duplicateProject(project: Project): Project {
  const timestamp = new Date().toLocaleString()
  return {
    ...project,
    id: generateProjectId(),
    name: `${project.name} (Copy ${timestamp})`,
    components: project.components.map(comp => ({
      ...comp,
      id: generateComponentId(),
    })),
    createdAt: Date.now(),
    updatedAt: Date.now(),
    previewActive: false,
  }
}

export function exportProjectAsJSON(project: Project): string {
  return JSON.stringify(project, null, 2)
}

export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function generateHTML(project: Project): string {
  const componentsHTML = project.components
    .sort((a, b) => a.order - b.order)
    .map(renderComponent)
    .join('\n')

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${project.name}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            line-height: 1.6;
            color: #333;
        }
        .component {
            padding: 2rem;
            max-width: 1200px;
            margin: 0 auto;
        }
        .header {
            background: linear-gradient(135deg, #6b2dd6 0%, #3b82f6 100%);
            color: white;
            text-align: center;
            padding: 4rem 2rem;
        }
        .header h1 {
            font-size: 3rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
        }
        .header p {
            font-size: 1.25rem;
            opacity: 0.9;
        }
        .text-left { text-align: left; }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .text-small { font-size: 0.875rem; }
        .text-medium { font-size: 1rem; }
        .text-large { font-size: 1.25rem; }
        .image-container {
            display: flex;
            padding: 2rem;
        }
        .image-container.align-left { justify-content: flex-start; }
        .image-container.align-center { justify-content: center; }
        .image-container.align-right { justify-content: flex-end; }
        .image-container img {
            max-width: 100%;
            height: auto;
            border-radius: 0.5rem;
        }
        .video-container {
            display: flex;
            padding: 2rem;
        }
        .video-container.align-left { justify-content: flex-start; }
        .video-container.align-center { justify-content: center; }
        .video-container.align-right { justify-content: flex-end; }
        .video-container video, .video-container iframe {
            max-width: 100%;
            border-radius: 0.5rem;
        }
        .button-container {
            display: flex;
            padding: 2rem;
        }
        .button-container.align-left { justify-content: flex-start; }
        .button-container.align-center { justify-content: center; }
        .button-container.align-right { justify-content: flex-end; }
        .btn {
            padding: 0.75rem 2rem;
            border-radius: 0.5rem;
            text-decoration: none;
            font-weight: 600;
            display: inline-block;
            transition: transform 0.2s;
        }
        .btn:hover {
            transform: scale(1.05);
        }
        .btn-primary {
            background: #6b2dd6;
            color: white;
        }
        .btn-secondary {
            background: #e5e5e5;
            color: #333;
        }
        .btn-outline {
            background: transparent;
            border: 2px solid #6b2dd6;
            color: #6b2dd6;
        }
        .card {
            background: white;
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            margin: 1rem 0;
        }
        .card img {
            width: 100%;
            height: 200px;
            object-fit: cover;
        }
        .card-content {
            padding: 1.5rem;
        }
        .card h3 {
            font-size: 1.5rem;
            margin-bottom: 0.5rem;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 1rem 0;
        }
        th, td {
            padding: 0.75rem;
            text-align: left;
            border-bottom: 1px solid #e5e5e5;
        }
        th {
            background: #f5f5f5;
            font-weight: 600;
        }
        form {
            max-width: 600px;
            margin: 0 auto;
        }
        .form-group {
            margin-bottom: 1rem;
        }
        label {
            display: block;
            margin-bottom: 0.25rem;
            font-weight: 600;
        }
        input[type="text"],
        input[type="email"],
        textarea {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #e5e5e5;
            border-radius: 0.5rem;
            font-family: inherit;
        }
        textarea {
            min-height: 120px;
        }
        .gallery {
            display: grid;
            gap: 1rem;
            padding: 2rem;
        }
        .gallery img {
            width: 100%;
            height: 200px;
            object-fit: cover;
            border-radius: 0.5rem;
        }
        footer {
            background: #333;
            color: white;
            padding: 2rem;
            text-align: center;
        }
        footer a {
            color: #60d5f2;
            text-decoration: none;
            margin: 0 1rem;
        }
    </style>
</head>
<body>
${componentsHTML}
</body>
</html>`
}

function renderComponent(component: Component): string {
  switch (component.type) {
    case 'header':
      return `<div class="header" style="background-color: ${component.bgColor}">
        <h1 class="text-${component.alignment}">${component.title}</h1>
        <p class="text-${component.alignment}">${component.subtitle}</p>
      </div>`

    case 'text':
      return `<div class="component text-${component.alignment} text-${component.fontSize}">
        ${component.content.replace(/\n/g, '<br>')}
      </div>`

    case 'image':
      return `<div class="image-container align-${component.alignment}">
        <img src="${component.src}" alt="${component.alt}" style="width: ${component.width}" />
      </div>`

    case 'video':
      const isYouTube = component.src.includes('youtube.com') || component.src.includes('youtu.be')
      if (isYouTube) {
        const videoId = extractYouTubeId(component.src)
        return `<div class="video-container align-${component.alignment}">
          <iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
        </div>`
      }
      return `<div class="video-container align-${component.alignment}">
        <video controls ${component.autoplay ? 'autoplay' : ''}>
          <source src="${component.src}" type="video/mp4">
        </video>
      </div>`

    case 'button':
      return `<div class="button-container align-${component.alignment}">
        <a href="${component.url}" class="btn btn-${component.variant}">${component.text}</a>
      </div>`

    case 'card':
      return `<div class="component">
        <div class="card">
          ${component.imageUrl ? `<img src="${component.imageUrl}" alt="${component.title}" />` : ''}
          <div class="card-content">
            <h3>${component.title}</h3>
            <p>${component.content}</p>
          </div>
        </div>
      </div>`

    case 'table':
      return `<div class="component">
        <table>
          <thead>
            <tr>
              ${component.headers.map(h => `<th>${h}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${component.rows.map(row => `<tr>${row.map(cell => `<td>${cell.value}</td>`).join('')}</tr>`).join('')}
          </tbody>
        </table>
      </div>`

    case 'form':
      return `<div class="component">
        <form>
          <h2>${component.title}</h2>
          ${component.fields.map(field => `
            <div class="form-group">
              <label>${field.label}${field.required ? ' *' : ''}</label>
              ${field.type === 'textarea' 
                ? `<textarea ${field.required ? 'required' : ''}></textarea>`
                : `<input type="${field.type}" ${field.required ? 'required' : ''} />`
              }
            </div>
          `).join('')}
          <button type="submit" class="btn btn-primary">${component.submitText}</button>
        </form>
      </div>`

    case 'gallery':
      return `<div class="gallery" style="grid-template-columns: repeat(${component.columns}, 1fr)">
        ${component.images.map(img => `<img src="${img.src}" alt="${img.alt}" />`).join('')}
      </div>`

    case 'customHtml':
      return `<div class="component">${component.html}</div>`

    case 'footer':
      return `<footer>
        <p>${component.content}</p>
        <div>
          ${component.links.map(link => `<a href="${link.url}">${link.text}</a>`).join('')}
        </div>
      </footer>`

    default:
      return ''
  }
}

function extractYouTubeId(url: string): string {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
  const match = url.match(regExp)
  return (match && match[7].length === 11) ? match[7] : ''
}

export function parseCSV(csvText: string): string[][] {
  const rows: string[][] = []
  const lines = csvText.split('\n')
  
  for (const line of lines) {
    if (line.trim()) {
      const cells = line.split(',').map(cell => cell.trim())
      rows.push(cells)
    }
  }
  
  return rows
}

export function generateCSV(headers: string[], rows: string[][]): string {
  const csvLines = [headers.join(',')]
  
  for (const row of rows) {
    csvLines.push(row.join(','))
  }
  
  return csvLines.join('\n')
}

export function simulateMetricsUpdate(project: Project): Project {
  if (!project.serverSettings?.isPublished) {
    return project
  }

  const currentMetrics = project.serverSettings.metrics || {
    totalRequests: 0,
    bandwidthUsed: 0,
    requestsHistory: [],
  }

  const methods = ['GET', 'POST', 'PUT', 'DELETE']
  const paths = ['/', '/index.html', '/about', '/contact', '/api/data']
  
  const newRequest = {
    timestamp: Date.now(),
    bytesTransferred: Math.floor(Math.random() * 50000) + 5000,
    path: paths[Math.floor(Math.random() * paths.length)],
    method: methods[Math.floor(Math.random() * methods.length)],
  }

  const updatedHistory = [...currentMetrics.requestsHistory, newRequest]
  
  return {
    ...project,
    serverSettings: {
      ...project.serverSettings,
      metrics: {
        totalRequests: currentMetrics.totalRequests + 1,
        bandwidthUsed: currentMetrics.bandwidthUsed + newRequest.bytesTransferred,
        lastAccessed: Date.now(),
        requestsHistory: updatedHistory.slice(-10),
      },
    },
  }
}
