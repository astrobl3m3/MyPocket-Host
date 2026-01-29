import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import type { Project } from '@/lib/types'
import { Dashboard } from '@/components/Dashboard'
import { ProjectBuilder } from '@/components/ProjectBuilder'
import { CreateProjectDialog } from '@/components/CreateProjectDialog'
import { createDefaultProject, duplicateProject, generateHTML } from '@/lib/project-utils'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'

function App() {
  const [projects, setProjects] = useKV<Project[]>('projects', [])
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const projectList = projects || []
  const currentProject = projectList.find(p => p.id === currentProjectId)

  const handleCreateProject = (name: string, description: string) => {
    const newProject = createDefaultProject(name, description)
    setProjects(current => [...(current || []), newProject])
    setCurrentProjectId(newProject.id)
    toast.success('Project created successfully')
  }

  const handleImportProject = (project: Project) => {
    setProjects(current => [...(current || []), project])
    toast.success('Project imported successfully')
  }

  const handleEditProject = (project: Project) => {
    setCurrentProjectId(project.id)
  }

  const handleSaveProject = (updatedProject: Project) => {
    setProjects(current =>
      (current || []).map(p => (p.id === updatedProject.id ? updatedProject : p))
    )
  }

  const handleDuplicateProject = (project: Project) => {
    const duplicated = duplicateProject(project)
    setProjects(current => [...(current || []), duplicated])
    toast.success('Project duplicated successfully')
  }

  const handleDeleteProject = (projectId: string) => {
    setProjects(current => (current || []).filter(p => p.id !== projectId))
    toast.success('Project deleted')
  }

  const handleArchiveProject = (projectId: string) => {
    setProjects(current =>
      (current || []).map(p =>
        p.id === projectId ? { ...p, isArchived: !p.isArchived } : p
      )
    )
    toast.success('Project archived')
  }

  const handlePreviewProject = (project: Project) => {
    const html = generateHTML(project)
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank')
  }

  const handleBackToDashboard = () => {
    setCurrentProjectId(null)
  }

  if (currentProject) {
    return (
      <ProjectBuilder
        project={currentProject}
        onSave={handleSaveProject}
        onBack={handleBackToDashboard}
      />
    )
  }

  return (
    <>
      <Dashboard
        projects={projectList}
        onCreateProject={() => setIsCreateDialogOpen(true)}
        onEditProject={handleEditProject}
        onDuplicateProject={handleDuplicateProject}
        onDeleteProject={handleDeleteProject}
        onArchiveProject={handleArchiveProject}
        onPreviewProject={handlePreviewProject}
      />
      <CreateProjectDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateProject={handleCreateProject}
        onImportProject={handleImportProject}
      />
      <Toaster position="bottom-right" />
    </>
  )
}

export default App