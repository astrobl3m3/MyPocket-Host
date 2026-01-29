import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Upload,
  Link as LinkIcon,
  FileHtml,
  FileJs,
  Copy,
  Download,
} from '@phosphor-icons/react'
import type { Project, Component } from '@/lib/types'
import { toast } from 'sonner'
import { generateProjectId, generateComponentId } from '@/lib/project-utils'

interface ImportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImportProject: (project: Project) => void
}

export function ImportDialog({ open, onOpenChange, onImportProject }: ImportDialogProps) {
  const [jsonData, setJsonData] = useState('')
  const [htmlData, setHtmlData] = useState('')
  const [importUrl, setImportUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)

  const handleImportJSON = () => {
    try {
      const project = JSON.parse(jsonData) as Project
      if (!project.id || !project.name || !Array.isArray(project.components)) {
        throw new Error('Invalid project format')
      }
      onImportProject(project)
      setJsonData('')
      onOpenChange(false)
      toast.success('Project imported successfully')
    } catch (error) {
      toast.error('Failed to import project. Please check the JSON format.')
    }
  }

  const handleImportHTML = () => {
    try {
      if (!htmlData.trim()) {
        toast.error('Please provide HTML content')
        return
      }

      const parser = new DOMParser()
      const doc = parser.parseFromString(htmlData, 'text/html')
      
      const title = doc.querySelector('title')?.textContent || 'Imported HTML Project'
      const metaDescription = doc.querySelector('meta[name="description"]')?.getAttribute('content') || 'Imported from HTML'

      const components: Component[] = []
      let order = 0

      const headers = doc.querySelectorAll('h1, h2, header')
      headers.forEach(header => {
        const subtitle = header.querySelector('p')?.textContent || ''
        components.push({
          id: generateComponentId(),
          type: 'header',
          order: order++,
          title: header.textContent?.replace(subtitle, '').trim() || 'Header',
          subtitle,
          alignment: 'center',
          bgColor: '#6b2dd6',
        })
      })

      const paragraphs = doc.querySelectorAll('p')
      paragraphs.forEach(p => {
        if (p.closest('header')) return
        components.push({
          id: generateComponentId(),
          type: 'text',
          order: order++,
          content: p.textContent || '',
          alignment: 'left',
          fontSize: 'medium',
        })
      })

      const images = doc.querySelectorAll('img')
      images.forEach(img => {
        components.push({
          id: generateComponentId(),
          type: 'image',
          order: order++,
          src: img.src || '',
          alt: img.alt || 'Image',
          alignment: 'center',
          width: '100%',
        })
      })

      const buttons = doc.querySelectorAll('button, a.btn, a[class*="button"]')
      buttons.forEach(btn => {
        const href = btn.getAttribute('href') || '#'
        components.push({
          id: generateComponentId(),
          type: 'button',
          order: order++,
          text: btn.textContent || 'Button',
          url: href,
          alignment: 'center',
          variant: 'primary',
        })
      })

      const project: Project = {
        id: generateProjectId(),
        name: title,
        description: metaDescription,
        components,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        isArchived: false,
        previewActive: false,
      }

      onImportProject(project)
      setHtmlData('')
      onOpenChange(false)
      toast.success(`Imported ${components.length} components from HTML`)
    } catch (error) {
      toast.error('Failed to parse HTML. Please check the format.')
    }
  }

  const handleImportFromUrl = async () => {
    if (!importUrl.trim()) {
      toast.error('Please enter a URL')
      return
    }

    try {
      setIsLoading(true)
      setLoadingProgress(20)

      await new Promise(resolve => setTimeout(resolve, 500))
      setLoadingProgress(40)

      const isJSON = importUrl.toLowerCase().endsWith('.json')
      const isHTML = importUrl.toLowerCase().endsWith('.html') || 
                     importUrl.toLowerCase().endsWith('.htm') ||
                     !importUrl.includes('.')

      setLoadingProgress(60)
      await new Promise(resolve => setTimeout(resolve, 500))
      setLoadingProgress(80)

      if (isJSON) {
        try {
          const response = await fetch(importUrl)
          if (!response.ok) throw new Error('Failed to fetch')
          const project = await response.json() as Project
          
          if (!project.id || !project.name || !Array.isArray(project.components)) {
            throw new Error('Invalid project format')
          }
          
          onImportProject(project)
          toast.success('Project imported from URL')
        } catch (err) {
          toast.error('Unable to fetch from URL. CORS or network error.')
          const mockProject: Project = {
            id: generateProjectId(),
            name: 'Demo Project (URL Import)',
            description: `Simulated import from: ${importUrl}`,
            components: [
              {
                id: generateComponentId(),
                type: 'header',
                order: 0,
                title: 'Imported from URL',
                subtitle: 'Project cloned successfully',
                alignment: 'center',
                bgColor: '#6b2dd6',
              },
              {
                id: generateComponentId(),
                type: 'text',
                order: 1,
                content: `This is a demo project created from the URL: ${importUrl}`,
                alignment: 'left',
                fontSize: 'medium',
              },
            ],
            createdAt: Date.now(),
            updatedAt: Date.now(),
            isArchived: false,
            previewActive: false,
          }
          onImportProject(mockProject)
          toast.success('Demo project created (actual URL fetch blocked by CORS)')
        }
      } else {
        try {
          const response = await fetch(importUrl)
          if (!response.ok) throw new Error('Failed to fetch')
          const html = await response.text()
          setHtmlData(html)
          handleImportHTML()
          toast.success('HTML imported from URL')
        } catch (err) {
          toast.error('Unable to fetch HTML. CORS or network error.')
          const mockProject: Project = {
            id: generateProjectId(),
            name: 'Website Clone',
            description: `Cloned from: ${importUrl}`,
            components: [
              {
                id: generateComponentId(),
                type: 'header',
                order: 0,
                title: 'Website Clone',
                subtitle: 'Imported from external URL',
                alignment: 'center',
                bgColor: '#6b2dd6',
              },
              {
                id: generateComponentId(),
                type: 'text',
                order: 1,
                content: `This project represents a clone of: ${importUrl}`,
                alignment: 'center',
                fontSize: 'medium',
              },
            ],
            createdAt: Date.now(),
            updatedAt: Date.now(),
            isArchived: false,
            previewActive: false,
          }
          onImportProject(mockProject)
          toast.success('Demo clone created (actual URL fetch blocked by CORS)')
        }
      }

      setLoadingProgress(100)
      setImportUrl('')
      onOpenChange(false)
    } catch (error) {
      toast.error('Failed to import from URL')
    } finally {
      setIsLoading(false)
      setLoadingProgress(0)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()

    reader.onload = async (event) => {
      const content = event.target?.result as string

      if (file.name.endsWith('.json')) {
        setJsonData(content)
        toast.success('JSON file loaded')
      } else if (file.name.endsWith('.html') || file.name.endsWith('.htm')) {
        setHtmlData(content)
        toast.success('HTML file loaded')
      } else {
        toast.error('Please upload a .json or .html file')
      }
    }

    reader.readAsText(file)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="text-[24px] font-semibold tracking-[-0.01em]">
            Import Project
          </DialogTitle>
          <DialogDescription className="text-[15px]">
            Import from URL, HTML, or JSON file
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="url" className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="url" className="gap-2">
              <LinkIcon size={16} />
              URL
            </TabsTrigger>
            <TabsTrigger value="file" className="gap-2">
              <Upload size={16} />
              File
            </TabsTrigger>
            <TabsTrigger value="html" className="gap-2">
              <FileHtml size={16} />
              HTML
            </TabsTrigger>
            <TabsTrigger value="json" className="gap-2">
              <FileJs size={16} />
              JSON
            </TabsTrigger>
          </TabsList>

          <TabsContent value="url" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="import-url">URL to Import</Label>
              <div className="flex gap-2">
                <Input
                  id="import-url"
                  type="url"
                  placeholder="https://example.com/project.json or https://example.com"
                  value={importUrl}
                  onChange={e => setImportUrl(e.target.value)}
                  disabled={isLoading}
                />
                <Button
                  onClick={handleImportFromUrl}
                  disabled={!importUrl.trim() || isLoading}
                  className="gap-2 flex-shrink-0"
                >
                  {isLoading ? (
                    <>
                      <Download size={16} className="animate-bounce" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Download size={16} />
                      Import
                    </>
                  )}
                </Button>
              </div>
              {isLoading && (
                <div className="space-y-2">
                  <Progress value={loadingProgress} className="h-2" />
                  <p className="text-[12px] text-muted-foreground text-center">
                    Fetching content... {loadingProgress}%
                  </p>
                </div>
              )}
            </div>

            <div className="bg-muted/50 border border-border rounded-lg p-4 space-y-2">
              <p className="text-[13px] font-medium">Supported URLs:</p>
              <ul className="text-[12px] text-muted-foreground space-y-1 list-disc list-inside">
                <li>Direct JSON project exports (.json)</li>
                <li>HTML websites (.html, .htm)</li>
                <li>Live website URLs (will extract content)</li>
              </ul>
              <Badge variant="secondary" className="text-[11px] mt-2">
                <Copy size={12} className="mr-1" />
                Clone any website structure
              </Badge>
            </div>
          </TabsContent>

          <TabsContent value="file" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="file-upload">Upload File</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                <Upload size={48} className="mx-auto mb-4 text-muted-foreground" weight="duotone" />
                <p className="text-[14px] font-medium mb-2">
                  Drop your file here or click to browse
                </p>
                <p className="text-[12px] text-muted-foreground mb-4">
                  Supports .json and .html files
                </p>
                <Input
                  id="file-upload"
                  type="file"
                  accept=".json,.html,.htm"
                  onChange={handleFileUpload}
                  className="max-w-xs mx-auto"
                />
              </div>
            </div>

            {(jsonData || htmlData) && (
              <div className="bg-muted/50 border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[13px] font-medium">File Loaded Successfully</p>
                  <Badge variant="default">
                    {jsonData ? 'JSON' : 'HTML'}
                  </Badge>
                </div>
                <p className="text-[12px] text-muted-foreground mb-4">
                  File content is ready. Click the button below to import.
                </p>
                <Button
                  onClick={jsonData ? handleImportJSON : handleImportHTML}
                  className="w-full gap-2"
                >
                  <Upload size={16} />
                  Import {jsonData ? 'JSON Project' : 'HTML Content'}
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="html" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="html-content">HTML Content</Label>
              <Textarea
                id="html-content"
                placeholder="Paste your HTML code here..."
                value={htmlData}
                onChange={e => setHtmlData(e.target.value)}
                rows={12}
                className="font-code text-[13px]"
              />
              <p className="text-[12px] text-muted-foreground">
                PocketHost will extract headers, text, images, and buttons from your HTML
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleImportHTML} disabled={!htmlData.trim()} className="gap-2">
                <FileHtml size={16} />
                Import HTML
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="json" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="json-content">Project JSON</Label>
              <Textarea
                id="json-content"
                placeholder="Paste your exported project JSON here..."
                value={jsonData}
                onChange={e => setJsonData(e.target.value)}
                rows={12}
                className="font-code text-[13px]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleImportJSON} disabled={!jsonData.trim()} className="gap-2">
                <FileJs size={16} />
                Import JSON
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
