import { useState } from 'react'
import type { Component } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Trash, Plus, ArrowUp, ArrowDown, Upload, Download } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { parseCSV, generateCSV } from '@/lib/project-utils'

interface ComponentEditorProps {
  component: Component
  onUpdate: (component: Component) => void
  onDelete: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  canMoveUp: boolean
  canMoveDown: boolean
}

export function ComponentEditor({
  component,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: ComponentEditorProps) {
  const [csvInput, setCsvInput] = useState('')

  const updateField = (field: string, value: any) => {
    onUpdate({ ...component, [field]: value })
  }

  const handleCSVImport = () => {
    try {
      const rows = parseCSV(csvInput)
      if (rows.length < 2) {
        toast.error('CSV must have at least a header row and one data row')
        return
      }
      
      const headers = rows[0]
      const dataRows = rows.slice(1).map(row => 
        row.map(cell => ({ value: cell }))
      )
      
      if (component.type === 'table') {
        onUpdate({
          ...component,
          headers,
          rows: dataRows,
        })
        setCsvInput('')
        toast.success('CSV imported successfully')
      }
    } catch (error) {
      toast.error('Failed to parse CSV')
    }
  }

  const handleCSVExport = () => {
    if (component.type === 'table') {
      const csv = generateCSV(
        component.headers,
        component.rows.map(row => row.map(cell => cell.value))
      )
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'table-data.csv'
      link.click()
      URL.revokeObjectURL(url)
      toast.success('CSV exported successfully')
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border bg-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[18px] font-medium">Edit Component</h3>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMoveUp}
              disabled={!canMoveUp}
              className="h-8 w-8 p-0"
            >
              <ArrowUp size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onMoveDown}
              disabled={!canMoveDown}
              className="h-8 w-8 p-0"
            >
              <ArrowDown size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <Trash size={16} />
            </Button>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {component.type === 'header' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={component.title}
                  onChange={e => updateField('title', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Textarea
                  id="subtitle"
                  value={component.subtitle}
                  onChange={e => updateField('subtitle', e.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="alignment">Alignment</Label>
                <Select value={component.alignment} onValueChange={v => updateField('alignment', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bgColor">Background Color</Label>
                <Input
                  id="bgColor"
                  type="color"
                  value={component.bgColor}
                  onChange={e => updateField('bgColor', e.target.value)}
                />
              </div>
            </>
          )}

          {component.type === 'text' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={component.content}
                  onChange={e => updateField('content', e.target.value)}
                  rows={8}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="alignment">Alignment</Label>
                <Select value={component.alignment} onValueChange={v => updateField('alignment', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fontSize">Font Size</Label>
                <Select value={component.fontSize} onValueChange={v => updateField('fontSize', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {component.type === 'image' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="src">Image URL</Label>
                <Input
                  id="src"
                  value={component.src}
                  onChange={e => updateField('src', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="alt">Alt Text</Label>
                <Input
                  id="alt"
                  value={component.alt}
                  onChange={e => updateField('alt', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="width">Width</Label>
                <Input
                  id="width"
                  value={component.width}
                  onChange={e => updateField('width', e.target.value)}
                  placeholder="100%"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="alignment">Alignment</Label>
                <Select value={component.alignment} onValueChange={v => updateField('alignment', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {component.type === 'video' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="src">Video URL</Label>
                <Input
                  id="src"
                  value={component.src}
                  onChange={e => updateField('src', e.target.value)}
                  placeholder="YouTube URL or video file URL"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="alignment">Alignment</Label>
                <Select value={component.alignment} onValueChange={v => updateField('alignment', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="autoplay">Autoplay</Label>
                <Switch
                  id="autoplay"
                  checked={component.autoplay}
                  onCheckedChange={v => updateField('autoplay', v)}
                />
              </div>
            </>
          )}

          {component.type === 'button' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="text">Button Text</Label>
                <Input
                  id="text"
                  value={component.text}
                  onChange={e => updateField('text', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  value={component.url}
                  onChange={e => updateField('url', e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="variant">Style</Label>
                <Select value={component.variant} onValueChange={v => updateField('variant', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="primary">Primary</SelectItem>
                    <SelectItem value="secondary">Secondary</SelectItem>
                    <SelectItem value="outline">Outline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="alignment">Alignment</Label>
                <Select value={component.alignment} onValueChange={v => updateField('alignment', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {component.type === 'card' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={component.title}
                  onChange={e => updateField('title', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={component.content}
                  onChange={e => updateField('content', e.target.value)}
                  rows={5}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  value={component.imageUrl}
                  onChange={e => updateField('imageUrl', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </>
          )}

          {component.type === 'table' && (
            <>
              <div className="space-y-2">
                <Label>CSV Import/Export</Label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCSVExport}
                    className="gap-2 flex-1"
                  >
                    <Download size={16} />
                    Export CSV
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="csvInput">Paste CSV Data</Label>
                <Textarea
                  id="csvInput"
                  value={csvInput}
                  onChange={e => setCsvInput(e.target.value)}
                  rows={6}
                  placeholder="Column1,Column2,Column3&#10;Value1,Value2,Value3"
                  className="font-code text-[13px]"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCSVImport}
                  disabled={!csvInput.trim()}
                  className="gap-2 w-full"
                >
                  <Upload size={16} />
                  Import CSV
                </Button>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Table Preview</Label>
                <div className="text-[13px] text-muted-foreground">
                  {component.headers.length} columns × {component.rows.length} rows
                </div>
              </div>
            </>
          )}

          {component.type === 'form' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="title">Form Title</Label>
                <Input
                  id="title"
                  value={component.title}
                  onChange={e => updateField('title', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="submitText">Submit Button Text</Label>
                <Input
                  id="submitText"
                  value={component.submitText}
                  onChange={e => updateField('submitText', e.target.value)}
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Form Fields</Label>
                <div className="text-[13px] text-muted-foreground">
                  {component.fields.length} fields configured
                </div>
              </div>
            </>
          )}

          {component.type === 'gallery' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="columns">Columns</Label>
                <Select
                  value={component.columns.toString()}
                  onValueChange={v => updateField('columns', parseInt(v))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Column</SelectItem>
                    <SelectItem value="2">2 Columns</SelectItem>
                    <SelectItem value="3">3 Columns</SelectItem>
                    <SelectItem value="4">4 Columns</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Gallery Images</Label>
                <div className="text-[13px] text-muted-foreground">
                  {component.images.length} images
                </div>
              </div>
            </>
          )}

          {component.type === 'customHtml' && (
            <div className="space-y-2">
              <Label htmlFor="html">Custom HTML</Label>
              <Textarea
                id="html"
                value={component.html}
                onChange={e => updateField('html', e.target.value)}
                rows={12}
                className="font-code text-[13px]"
              />
            </div>
          )}

          {component.type === 'footer' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="content">Footer Content</Label>
                <Textarea
                  id="content"
                  value={component.content}
                  onChange={e => updateField('content', e.target.value)}
                  rows={3}
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Footer Links</Label>
                <div className="text-[13px] text-muted-foreground">
                  {component.links.length} links configured
                </div>
              </div>
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
