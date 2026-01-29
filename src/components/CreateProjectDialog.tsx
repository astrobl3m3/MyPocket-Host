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
import { Plus, Upload } from '@phosphor-icons/react'
import type { Project } from '@/lib/types'
import { toast } from 'sonner'

interface CreateProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateProject: (name: string, description: string) => void
  onImportProject: (project: Project) => void
}

export function CreateProjectDialog({
  open,
  onOpenChange,
  onCreateProject,
  onImportProject,
}: CreateProjectDialogProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [importData, setImportData] = useState('')

  const handleCreate = () => {
    if (!name.trim()) {
      toast.error('Please enter a project name')
      return
    }
    onCreateProject(name, description)
    setName('')
    setDescription('')
    onOpenChange(false)
  }

  const handleImport = () => {
    try {
      const project = JSON.parse(importData) as Project
      if (!project.id || !project.name || !Array.isArray(project.components)) {
        throw new Error('Invalid project format')
      }
      onImportProject(project)
      setImportData('')
      onOpenChange(false)
      toast.success('Project imported successfully')
    } catch (error) {
      toast.error('Failed to import project. Please check the JSON format.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-[24px] font-semibold tracking-[-0.01em]">
            Create New Project
          </DialogTitle>
          <DialogDescription className="text-[15px]">
            Start from scratch or import an existing project
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="new" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="new" className="gap-2">
              <Plus size={16} />
              New Project
            </TabsTrigger>
            <TabsTrigger value="import" className="gap-2">
              <Upload size={16} />
              Import Project
            </TabsTrigger>
          </TabsList>

          <TabsContent value="new" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name *</Label>
              <Input
                id="name"
                placeholder="My Awesome Website"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="A brief description of your project..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate}>Create Project</Button>
            </div>
          </TabsContent>

          <TabsContent value="import" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="importData">Project JSON</Label>
              <Textarea
                id="importData"
                placeholder="Paste your exported project JSON here..."
                value={importData}
                onChange={e => setImportData(e.target.value)}
                rows={12}
                className="font-code text-[14px]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleImport}>Import Project</Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
