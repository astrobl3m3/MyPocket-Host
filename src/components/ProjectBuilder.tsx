import { useState, useEffect, useCallback } from 'react'
import type { Project, Component, ServerSettings as ServerSettingsType } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  FloppyDisk,
  Eye,
  Play,
  Stop,
  Plus,
  Cube,
  ArrowCounterClockwise,
  ArrowClockwise,
  Download,
  Keyboard,
  Users,
  WifiHigh,
  Circle,
} from '@phosphor-icons/react'
import { ComponentRenderer } from './ComponentRenderer'
import { ComponentEditor } from './ComponentEditor'
import { ServerSettings } from './ServerSettings'
import { componentFactories, componentLabels } from '@/lib/component-factory'
import { generateHTML, downloadFile } from '@/lib/project-utils'
import { toast } from 'sonner'

interface ProjectBuilderProps {
  project: Project
  onSave: (project: Project) => void
  onBack: () => void
}

export function ProjectBuilder({ project, onSave, onBack }: ProjectBuilderProps) {
  const [components, setComponents] = useState<Component[]>(project.components)
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null)
  const [previewActive, setPreviewActive] = useState(project.previewActive)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [history, setHistory] = useState<Component[][]>([project.components])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [copiedComponent, setCopiedComponent] = useState<Component | null>(null)
  const [showServerSettings, setShowServerSettings] = useState(false)
  const [serverSettings, setServerSettings] = useState<ServerSettingsType>(
    project.serverSettings || {
      enabled: false,
      port: 3000,
      accessPointName: project.name.toLowerCase().replace(/\s+/g, '-'),
      password: '',
      isPublished: false,
    }
  )

  const selectedComponent = components.find(c => c.id === selectedComponentId)

  const pushHistory = useCallback((newComponents: Component[]) => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newComponents)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
    setComponents(newComponents)
  }, [history, historyIndex])

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setComponents(history[historyIndex - 1])
      toast.success('Undo')
    }
  }, [history, historyIndex])

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setComponents(history[historyIndex + 1])
      toast.success('Redo')
    }
  }, [history, historyIndex])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault()
        redo()
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'c' && selectedComponent) {
        e.preventDefault()
        setCopiedComponent(selectedComponent)
        toast.success('Component copied')
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'v' && copiedComponent) {
        e.preventDefault()
        handleDuplicateComponent(copiedComponent)
      } else if (e.key === 'Delete' && selectedComponent) {
        e.preventDefault()
        handleDeleteComponent(selectedComponent.id)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [undo, redo, selectedComponent, copiedComponent])

  const handleSave = () => {
    const updatedProject: Project = {
      ...project,
      components,
      updatedAt: Date.now(),
      previewActive,
      serverSettings,
    }
    onSave(updatedProject)
    toast.success('Project saved successfully')
  }

  const handleUpdateServerSettings = (newSettings: ServerSettingsType) => {
    setServerSettings(newSettings)
  }

  const handleAddComponent = (type: keyof typeof componentFactories) => {
    const maxOrder = components.length > 0 ? Math.max(...components.map(c => c.order)) : -1
    const newComponent = componentFactories[type](maxOrder + 1)
    const newComponents = [...components, newComponent]
    pushHistory(newComponents)
    setSelectedComponentId(newComponent.id)
    toast.success(`${componentLabels[type]} added`)
  }

  const handleUpdateComponent = (updatedComponent: Component) => {
    const newComponents = components.map(c =>
      c.id === updatedComponent.id ? updatedComponent : c
    )
    pushHistory(newComponents)
  }

  const handleDeleteComponent = (id: string) => {
    const newComponents = components.filter(c => c.id !== id)
    pushHistory(newComponents)
    setSelectedComponentId(null)
    toast.success('Component deleted')
  }

  const handleDuplicateComponent = (comp: Component) => {
    const maxOrder = components.length > 0 ? Math.max(...components.map(c => c.order)) : -1
    const duplicated = {
      ...comp,
      id: `component_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      order: maxOrder + 1,
    }
    const newComponents = [...components, duplicated]
    pushHistory(newComponents)
    setSelectedComponentId(duplicated.id)
    toast.success('Component duplicated')
  }

  const handleMoveComponent = (id: string, direction: 'up' | 'down') => {
    const sorted = [...components].sort((a, b) => a.order - b.order)
    const index = sorted.findIndex(c => c.id === id)
    if (index === -1) return

    if (direction === 'up' && index > 0) {
      const temp = sorted[index].order
      sorted[index].order = sorted[index - 1].order
      sorted[index - 1].order = temp
    } else if (direction === 'down' && index < sorted.length - 1) {
      const temp = sorted[index].order
      sorted[index].order = sorted[index + 1].order
      sorted[index + 1].order = temp
    }

    pushHistory(sorted)
  }

  const handleTogglePreview = () => {
    if (previewActive) {
      setPreviewActive(false)
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
        setPreviewUrl(null)
      }
      toast.info('Preview deactivated')
    } else {
      const html = generateHTML({ ...project, components })
      const blob = new Blob([html], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      setPreviewUrl(url)
      setPreviewActive(true)
      toast.success('Preview activated')
    }
  }

  const handleOpenPreview = () => {
    if (previewUrl) {
      window.open(previewUrl, '_blank')
    } else {
      const html = generateHTML({ ...project, components })
      const blob = new Blob([html], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      setPreviewUrl(url)
      window.open(url, '_blank')
      setPreviewActive(true)
    }
  }

  const handleDownloadHTML = () => {
    const html = generateHTML({ ...project, components })
    downloadFile(html, `${project.name}.html`, 'text/html')
    toast.success('HTML downloaded')
  }

  const canMoveUp = selectedComponent
    ? components.filter(c => c.order < selectedComponent.order).length > 0
    : false
  const canMoveDown = selectedComponent
    ? components.filter(c => c.order > selectedComponent.order).length > 0
    : false

  return (
    <div className="h-screen flex flex-col bg-background">
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack} className="gap-2">
              <ArrowLeft size={16} />
              Back
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[18px] font-medium">{project.name}</h2>
                {serverSettings.isPublished && (
                  <Badge variant="default" className="gap-1">
                    <Circle size={8} weight="fill" className="text-green-400 animate-pulse" />
                    Published
                  </Badge>
                )}
              </div>
              <p className="text-[13px] text-muted-foreground">{components.length} components</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={undo}
              disabled={historyIndex === 0}
              className="gap-2"
            >
              <ArrowCounterClockwise size={16} />
              Undo
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={redo}
              disabled={historyIndex === history.length - 1}
              className="gap-2"
            >
              <ArrowClockwise size={16} />
              Redo
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Button
              variant={serverSettings.enabled ? 'default' : 'outline'}
              onClick={() => setShowServerSettings(true)}
              className="gap-2"
            >
              <WifiHigh size={16} weight={serverSettings.enabled ? 'fill' : 'regular'} />
              Server
            </Button>
            <Button variant="outline" onClick={handleDownloadHTML} className="gap-2">
              <Download size={16} />
              Download HTML
            </Button>
            <Button onClick={handleSave} className="gap-2">
              <FloppyDisk size={16} weight="fill" />
              Save
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className={`${showServerSettings ? 'w-[480px]' : 'w-80'} border-r border-border bg-card flex flex-col transition-all duration-300`}>
          {showServerSettings ? (
            <ServerSettings
              settings={serverSettings}
              onUpdate={handleUpdateServerSettings}
              onClose={() => setShowServerSettings(false)}
            />
          ) : (
            <Tabs defaultValue="components" className="flex-1 flex flex-col">
              <TabsList className="mx-4 mt-4">
                <TabsTrigger value="components" className="flex-1 gap-2">
                  <Cube size={16} />
                  Components
                </TabsTrigger>
                <TabsTrigger value="preview" className="flex-1 gap-2">
                  <Eye size={16} />
                  Preview
                </TabsTrigger>
              </TabsList>

            <TabsContent value="components" className="flex-1 mt-0 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-2">
                  <div className="mb-4">
                    <h3 className="text-[13px] font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                      Add Components
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.keys(componentFactories).map(type => (
                        <Button
                          key={type}
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddComponent(type as keyof typeof componentFactories)}
                          className="justify-start gap-2 h-auto py-2"
                        >
                          <Plus size={14} />
                          <span className="text-[13px]">{componentLabels[type]}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="mt-4">
                    <h3 className="text-[13px] font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                      Keyboard Shortcuts
                    </h3>
                    <div className="space-y-1 text-[13px]">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Undo</span>
                        <Badge variant="secondary" className="font-code text-[11px]">
                          Ctrl+Z
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Redo</span>
                        <Badge variant="secondary" className="font-code text-[11px]">
                          Ctrl+Y
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Copy</span>
                        <Badge variant="secondary" className="font-code text-[11px]">
                          Ctrl+C
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Paste</span>
                        <Badge variant="secondary" className="font-code text-[11px]">
                          Ctrl+V
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Delete</span>
                        <Badge variant="secondary" className="font-code text-[11px]">
                          Delete
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="preview" className="flex-1 mt-0">
              <div className="p-4 space-y-4">
                <div>
                  <h3 className="text-[15px] font-medium mb-2">Preview Settings</h3>
                  <p className="text-[13px] text-muted-foreground mb-4">
                    Generate and open your project in a new browser tab
                  </p>
                </div>

                <div className="space-y-2">
                  {previewActive && (
                    <div className="flex items-center gap-2 p-3 bg-accent/10 border border-accent/20 rounded-md">
                      <div className="w-2 h-2 bg-accent rounded-full animate-pulse-glow" />
                      <span className="text-[13px] font-medium">Preview Active</span>
                    </div>
                  )}

                  <Button
                    variant={previewActive ? 'destructive' : 'default'}
                    onClick={handleTogglePreview}
                    className="w-full gap-2"
                  >
                    {previewActive ? (
                      <>
                        <Stop size={16} weight="fill" />
                        Deactivate Preview
                      </>
                    ) : (
                      <>
                        <Play size={16} weight="fill" />
                        Activate Preview
                      </>
                    )}
                  </Button>

                  {previewActive && (
                    <Button
                      variant="outline"
                      onClick={handleOpenPreview}
                      className="w-full gap-2"
                    >
                      <Eye size={16} />
                      Open in New Tab
                    </Button>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
          )}
        </div>

        <div className="flex-1 flex overflow-hidden">
          <ScrollArea className="flex-1">
            <div className="min-h-full bg-secondary/30">
              {components.length === 0 ? (
                <div className="flex items-center justify-center h-full p-8">
                  <div className="text-center">
                    <Cube size={64} className="mx-auto mb-4 text-muted-foreground" weight="duotone" />
                    <h3 className="text-[18px] font-medium mb-2">No components yet</h3>
                    <p className="text-[13px] text-muted-foreground">
                      Add components from the sidebar to start building
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-0">
                  {[...components]
                    .sort((a, b) => a.order - b.order)
                    .map(component => (
                      <ComponentRenderer
                        key={component.id}
                        component={component}
                        isSelected={component.id === selectedComponentId}
                        onClick={() => setSelectedComponentId(component.id)}
                      />
                    ))}
                </div>
              )}
            </div>
          </ScrollArea>

          {selectedComponent && (
            <div className="w-80 border-l border-border bg-card">
              <ComponentEditor
                component={selectedComponent}
                onUpdate={handleUpdateComponent}
                onDelete={() => handleDeleteComponent(selectedComponent.id)}
                onMoveUp={() => handleMoveComponent(selectedComponent.id, 'up')}
                onMoveDown={() => handleMoveComponent(selectedComponent.id, 'down')}
                canMoveUp={canMoveUp}
                canMoveDown={canMoveDown}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
