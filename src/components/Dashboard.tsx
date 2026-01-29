import { useState } from 'react'
import type { Project } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { duplicateProject, exportProjectAsJSON, downloadFile } from '@/lib/project-utils'

interface DashboardProps {
  projects: Project[]
  onCreateProject: () => void
  onEditProject: (project: Project) => void
  onDuplicateProject: (project: Project) => void
  onDeleteProject: (projectId: string) => void
  onArchiveProject: (projectId: string) => void
  onPreviewProject: (project: Project) => void
}

export function Dashboard({
  projects,
  onCreateProject,
  onEditProject,
  onDuplicateProject,
  onDeleteProject,
  onArchiveProject,
  onPreviewProject,
}: DashboardProps) {
  const [activeTab, setActiveTab] = useState('all')

  const activeProjects = projects.filter(p => !p.isArchived)
  const archivedProjects = projects.filter(p => p.isArchived)

  const handleExportProject = (project: Project) => {
    const json = exportProjectAsJSON(project)
    downloadFile(json, `${project.name}.json`, 'application/json')
    toast.success('Project exported successfully')
  }

  const displayProjects = activeTab === 'all' ? activeProjects : archivedProjects

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
          <Button onClick={onCreateProject} size="lg" className="gap-2">
            <Plus size={20} weight="bold" />
            New Project
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="all" className="gap-2">
              <FolderOpen size={16} />
              All Projects ({activeProjects.length})
            </TabsTrigger>
            <TabsTrigger value="archived" className="gap-2">
              <Archive size={16} />
              Archived ({archivedProjects.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {displayProjects.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Package size={64} className="text-muted-foreground mb-4" weight="duotone" />
                  <h3 className="text-[18px] font-medium mb-2">
                    {activeTab === 'all' ? 'No projects yet' : 'No archived projects'}
                  </h3>
                  <p className="text-[13px] text-muted-foreground mb-4">
                    {activeTab === 'all'
                      ? 'Create your first project to get started'
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayProjects.map(project => (
                  <Card
                    key={project.id}
                    className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02] relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    <CardHeader className="relative">
                      <div className="flex items-start justify-between">
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
                      <div className="flex items-center gap-2 mt-3">
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
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
