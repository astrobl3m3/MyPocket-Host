import { useState } from 'react'
import type { Project, ServerSettings as ServerSettingsType } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Plus,
  DotsThree,
  PencilSimple,
  Copy,
  Download,
  Trash,
  Archive,
  Eye,
  FolderOpen,
  Package,
  WifiHigh,
  Circle,
  CloudArrowUp,
  CloudArrowDown,
  Power,
  CheckSquare,
  Globe,
  Moon,
  Sun,
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { duplicateProject, exportProjectAsJSON, downloadFile } from '@/lib/project-utils'
import { ServerSettings } from './ServerSettings'
import { useTheme } from '@/hooks/use-theme'

interface DashboardProps {
  projects: Project[]
  onCreateProject: () => void
  onEditProject: (project: Project) => void
  onDuplicateProject: (project: Project) => void
  onDeleteProject: (projectId: string) => void
  onArchiveProject: (projectId: string) => void
  onPreviewProject: (project: Project) => void
  onImportProject: () => void
  onUpdateProject: (project: Project) => void
}

export function Dashboard({
  projects,
  onCreateProject,
  onEditProject,
  onDuplicateProject,
  onDeleteProject,
  onArchiveProject,
  onPreviewProject,
  onImportProject,
  onUpdateProject,
}: DashboardProps) {
  const [activeTab, setActiveTab] = useState('all')
  const [serverSettingsProject, setServerSettingsProject] = useState<Project | null>(null)
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set())
  const [bulkMenuOpen, setBulkMenuOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  const activeProjects = projects.filter(p => !p.isArchived)
  const archivedProjects = projects.filter(p => p.isArchived)
  const onlineProjects = activeProjects.filter(p => p.serverSettings?.enabled && p.serverSettings?.isPublished)
  const offlineProjects = activeProjects.filter(p => !p.serverSettings?.enabled || !p.serverSettings?.isPublished)

  const handleExportProject = (project: Project) => {
    const json = exportProjectAsJSON(project)
    downloadFile(json, `${project.name}.json`, 'application/json')
    toast.success('Project exported successfully')
  }

  const handleUpdateServerSettings = (settings: ServerSettingsType) => {
    if (serverSettingsProject) {
      const currentProject = projects.find(p => p.id === serverSettingsProject.id)
      if (currentProject) {
        onUpdateProject({
          ...currentProject,
          serverSettings: settings,
          updatedAt: Date.now(),
        })
      }
    }
  }

  const handleToggleSelection = (projectId: string) => {
    const newSelection = new Set(selectedProjects)
    if (newSelection.has(projectId)) {
      newSelection.delete(projectId)
    } else {
      newSelection.add(projectId)
    }
    setSelectedProjects(newSelection)
  }

  const handleSelectAll = () => {
    if (selectedProjects.size === displayProjects.length) {
      setSelectedProjects(new Set())
    } else {
      setSelectedProjects(new Set(displayProjects.map(p => p.id)))
    }
  }

  const handleBulkEnableServer = () => {
    let count = 0
    selectedProjects.forEach(projectId => {
      const project = projects.find(p => p.id === projectId)
      if (project) {
        onUpdateProject({
          ...project,
          serverSettings: {
            ...(project.serverSettings || {
              enabled: false,
              port: 3000,
              accessPointName: project.name.toLowerCase().replace(/\s+/g, '-'),
              password: '',
              isPublished: false,
            }),
            enabled: true,
          },
        })
        count++
      }
    })
    setSelectedProjects(new Set())
    toast.success(`${count} project${count !== 1 ? 's' : ''} server enabled`)
  }

  const handleBulkDisableServer = () => {
    let count = 0
    selectedProjects.forEach(projectId => {
      const project = projects.find(p => p.id === projectId)
      if (project && project.serverSettings) {
        onUpdateProject({
          ...project,
          serverSettings: {
            ...project.serverSettings,
            enabled: false,
            isPublished: false,
          },
        })
        count++
      }
    })
    setSelectedProjects(new Set())
    toast.success(`${count} project${count !== 1 ? 's' : ''} server disabled`)
  }

  const handleBulkPublish = () => {
    let count = 0
    selectedProjects.forEach(projectId => {
      const project = projects.find(p => p.id === projectId)
      if (project) {
        const settings = project.serverSettings || {
          enabled: false,
          port: 3000,
          accessPointName: project.name.toLowerCase().replace(/\s+/g, '-'),
          password: '',
          isPublished: false,
        }
        
        const protocol = settings.ssl?.enabled ? 'https' : 'http'
        const publishedUrl = `${protocol}://${settings.accessPointName}.local:${settings.port}`
        
        onUpdateProject({
          ...project,
          serverSettings: {
            ...settings,
            enabled: true,
            isPublished: true,
            publishedUrl,
            lastPublished: Date.now(),
            metrics: settings.metrics || {
              totalRequests: 0,
              bandwidthUsed: 0,
              requestsHistory: [],
              lastAccessed: Date.now(),
            },
          },
        })
        count++
      }
    })
    setSelectedProjects(new Set())
    if (count > 0) {
      toast.success(`${count} project${count !== 1 ? 's' : ''} published and online`)
    } else {
      toast.error('No projects selected')
    }
  }

  const handleBulkUnpublish = () => {
    let count = 0
    selectedProjects.forEach(projectId => {
      const project = projects.find(p => p.id === projectId)
      if (project && project.serverSettings?.isPublished) {
        onUpdateProject({
          ...project,
          serverSettings: {
            ...project.serverSettings,
            isPublished: false,
            publishedUrl: undefined,
          },
        })
        count++
      }
    })
    setSelectedProjects(new Set())
    toast.success(`${count} project${count !== 1 ? 's' : ''} unpublished`)
  }

  const displayProjects = activeTab === 'all' 
    ? activeProjects 
    : activeTab === 'online'
    ? onlineProjects
    : activeTab === 'offline'
    ? offlineProjects
    : archivedProjects

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-[32px] font-bold tracking-[-0.02em] leading-[1.2] mb-2">
              PocketHost
            </h1>
            <p className="text-[15px] text-muted-foreground leading-[1.5]">
              Your visual no-code web project platform
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              onClick={toggleTheme} 
              variant="outline" 
              size="icon"
              className="rounded-full"
            >
              {theme === 'dark' ? (
                <Sun size={20} weight="fill" />
              ) : (
                <Moon size={20} weight="fill" />
              )}
            </Button>
            <Button onClick={onImportProject} variant="outline" size="lg" className="gap-2">
              <Download size={20} />
              Import
            </Button>
            <Button onClick={onCreateProject} size="lg" className="gap-2">
              <Plus size={20} weight="bold" />
              New Project
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="all" className="gap-2">
              <FolderOpen size={16} />
              All Projects ({activeProjects.length})
            </TabsTrigger>
            <TabsTrigger value="online" className="gap-2">
              <Circle size={16} weight="fill" className="text-green-500" />
              Online ({onlineProjects.length})
            </TabsTrigger>
            <TabsTrigger value="offline" className="gap-2">
              <Circle size={16} weight="fill" className="text-muted-foreground" />
              Offline ({offlineProjects.length})
            </TabsTrigger>
            <TabsTrigger value="archived" className="gap-2">
              <Archive size={16} />
              Archived ({archivedProjects.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {selectedProjects.size > 0 && (
              <div className="mb-4 p-4 bg-accent/10 border border-accent/20 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckSquare size={20} weight="fill" className="text-accent" />
                  <span className="text-[14px] font-medium">
                    {selectedProjects.size} project{selectedProjects.size !== 1 ? 's' : ''} selected
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <DropdownMenu open={bulkMenuOpen} onOpenChange={setBulkMenuOpen}>
                    <DropdownMenuTrigger asChild>
                      <Button variant="default" size="sm" className="gap-2">
                        <Power size={16} />
                        Bulk Actions
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={handleBulkEnableServer}>
                        <Power size={16} className="mr-2" />
                        Enable Server
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleBulkDisableServer}>
                        <Power size={16} className="mr-2 opacity-50" />
                        Disable Server
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleBulkPublish}>
                        <CloudArrowUp size={16} className="mr-2" />
                        Publish
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleBulkUnpublish}>
                        <CloudArrowDown size={16} className="mr-2" />
                        Unpublish
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedProjects(new Set())}>
                    Clear
                  </Button>
                </div>
              </div>
            )}
            {displayProjects.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Package size={64} className="text-muted-foreground mb-4" weight="duotone" />
                  <h3 className="text-[18px] font-medium mb-2">
                    {activeTab === 'all' 
                      ? 'No projects yet' 
                      : activeTab === 'online'
                      ? 'No online projects'
                      : activeTab === 'offline'
                      ? 'No offline projects'
                      : 'No archived projects'}
                  </h3>
                  <p className="text-[13px] text-muted-foreground mb-4">
                    {activeTab === 'all'
                      ? 'Create your first project to get started'
                      : activeTab === 'online'
                      ? 'Enable and publish a server to see projects here'
                      : activeTab === 'offline'
                      ? 'All projects are currently online'
                      : 'Archived projects will appear here'}
                  </p>
                  {activeTab === 'all' && (
                    <Button onClick={onCreateProject} className="gap-2">
                      <Plus size={16} />
                      Create First Project
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <>
                {activeTab !== 'archived' && displayProjects.length > 0 && (
                  <div className="mb-4 flex items-center gap-2">
                    <Checkbox 
                      id="select-all"
                      checked={selectedProjects.size === displayProjects.length && displayProjects.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                    <label 
                      htmlFor="select-all" 
                      className="text-[13px] text-muted-foreground cursor-pointer"
                    >
                      Select all
                    </label>
                  </div>
                )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayProjects.map(project => (
                  <Card
                    key={project.id}
                    className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02] relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    <CardHeader className="relative">
                      <div className="flex items-start justify-between gap-2">
                        {activeTab !== 'archived' && (
                          <Checkbox
                            checked={selectedProjects.has(project.id)}
                            onCheckedChange={() => handleToggleSelection(project.id)}
                            onClick={(e) => e.stopPropagation()}
                            className="mt-1"
                          />
                        )}
                        <div className="flex-1">
                          <CardTitle className="text-[18px] font-medium leading-[1.4] mb-1">
                            {project.name}
                          </CardTitle>
                          <CardDescription className="text-[13px] leading-[1.4] line-clamp-2">
                            {project.description}
                          </CardDescription>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 -mr-2">
                              <DotsThree size={20} weight="bold" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onEditProject(project)}>
                              <PencilSimple size={16} className="mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onPreviewProject(project)}>
                              <Eye size={16} className="mr-2" />
                              Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setServerSettingsProject(project)}>
                              <WifiHigh size={16} className="mr-2" />
                              Server Settings
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onDuplicateProject(project)}>
                              <Copy size={16} className="mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleExportProject(project)}>
                              <Download size={16} className="mr-2" />
                              Export
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onArchiveProject(project.id)}>
                              <Archive size={16} className="mr-2" />
                              {project.isArchived ? 'Unarchive' : 'Archive'}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onDeleteProject(project.id)}
                              className="text-destructive"
                            >
                              <Trash size={16} className="mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="flex items-center gap-2 mt-3 flex-wrap">
                        {project.serverSettings?.enabled && project.serverSettings?.isPublished ? (
                          <Badge variant="default" className="text-xs gap-1.5 bg-green-600 hover:bg-green-700">
                            <Circle size={8} weight="fill" className="animate-pulse" />
                            Online
                          </Badge>
                        ) : project.serverSettings?.enabled && !project.serverSettings?.isPublished ? (
                          <Badge variant="secondary" className="text-xs gap-1.5">
                            <Circle size={8} weight="fill" className="text-yellow-500" />
                            Server On (Not Published)
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs gap-1.5">
                            <Circle size={8} weight="fill" className="text-muted-foreground" />
                            Offline
                          </Badge>
                        )}
                        {project.previewActive && (
                          <Badge variant="default" className="text-xs gap-1">
                            <div className="w-2 h-2 bg-accent rounded-full animate-pulse-glow" />
                            Preview Active
                          </Badge>
                        )}
                        <Badge variant="secondary" className="text-xs">
                          {project.components.length} components
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="relative">
                      {project.serverSettings?.isPublished && project.serverSettings?.publishedUrl && (
                        <>
                          <div className="mb-3 p-2 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-md">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <Globe size={12} className="text-green-600 dark:text-green-400" />
                                <span className="text-[11px] font-medium text-green-700 dark:text-green-400">
                                  Published URL
                                </span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  navigator.clipboard.writeText(project.serverSettings?.publishedUrl || '')
                                  toast.success('URL copied to clipboard')
                                }}
                                className="h-5 w-5 p-0"
                              >
                                <Copy size={10} className="text-green-600 dark:text-green-400" />
                              </Button>
                            </div>
                            <code className="text-[11px] text-green-800 dark:text-green-300 font-code break-all">
                              {project.serverSettings.publishedUrl}
                            </code>
                          </div>
                          
                          {project.serverSettings.metrics && (
                            <div className="mb-3 grid grid-cols-2 gap-2">
                              <div className="p-2 bg-muted/50 rounded-md">
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">
                                  Requests
                                </p>
                                <p className="text-[14px] font-bold">
                                  {project.serverSettings.metrics.totalRequests || 0}
                                </p>
                              </div>
                              <div className="p-2 bg-muted/50 rounded-md">
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">
                                  Bandwidth
                                </p>
                                <p className="text-[14px] font-bold">
                                  {((project.serverSettings.metrics.bandwidthUsed || 0) / 1024).toFixed(1)}KB
                                </p>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                      <div className="flex items-center justify-between text-[13px] text-muted-foreground">
                        <span>
                          Updated {new Date(project.updatedAt).toLocaleDateString()}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditProject(project)}
                          className="gap-1 h-8"
                        >
                          <PencilSimple size={14} />
                          Edit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={!!serverSettingsProject} onOpenChange={() => setServerSettingsProject(null)}>
        <DialogContent className="max-w-[600px] h-[90vh] p-0 gap-0 overflow-hidden flex flex-col">
          {serverSettingsProject && (() => {
            const currentProject = projects.find(p => p.id === serverSettingsProject.id) || serverSettingsProject
            return (
              <ServerSettings
                settings={currentProject.serverSettings || {
                  enabled: false,
                  port: 3000,
                  accessPointName: currentProject.name.toLowerCase().replace(/\s+/g, '-'),
                  password: '',
                  isPublished: false,
                }}
                onUpdate={handleUpdateServerSettings}
                onClose={() => setServerSettingsProject(null)}
              />
            )
          })()}
        </DialogContent>
      </Dialog>
    </div>
  )
}
