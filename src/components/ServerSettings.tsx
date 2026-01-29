import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'sonner'
import {
  WifiHigh,
  CheckCircle,
  XCircle,
  Globe,
  LockKey,
  Copy,
  Power,
  CloudArrowUp,
  CloudArrowDown,
  Circle,
} from '@phosphor-icons/react'
import type { ServerSettings as ServerSettingsType } from '@/lib/types'

interface ServerSettingsProps {
  settings: ServerSettingsType
  onUpdate: (settings: ServerSettingsType) => void
  onClose: () => void
}

export function ServerSettings({ settings, onUpdate, onClose }: ServerSettingsProps) {
  const [localSettings, setLocalSettings] = useState<ServerSettingsType>(settings)
  const [isChecking, setIsChecking] = useState(false)
  const [serverStatus, setServerStatus] = useState<'online' | 'offline' | 'checking'>('offline')

  const handleToggleServer = () => {
    const newEnabled = !localSettings.enabled
    setLocalSettings({ ...localSettings, enabled: newEnabled })
    
    if (newEnabled) {
      setServerStatus('online')
      toast.success('Server enabled')
    } else {
      setServerStatus('offline')
      setLocalSettings({ ...localSettings, enabled: false, isPublished: false })
      toast.info('Server disabled')
    }
  }

  const handleTogglePublish = () => {
    if (!localSettings.enabled) {
      toast.error('Please enable the server first')
      return
    }

    const newPublished = !localSettings.isPublished
    const newUrl = newPublished ? `http://${localSettings.accessPointName}.local:${localSettings.port}` : undefined
    
    setLocalSettings({
      ...localSettings,
      isPublished: newPublished,
      publishedUrl: newUrl,
      lastPublished: newPublished ? Date.now() : localSettings.lastPublished,
    })

    if (newPublished) {
      toast.success('Project published successfully!')
    } else {
      toast.info('Project unpublished')
    }
  }

  const handleCheckStatus = async () => {
    setIsChecking(true)
    setServerStatus('checking')
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    if (localSettings.enabled) {
      setServerStatus('online')
      toast.success('Server is online')
    } else {
      setServerStatus('offline')
      toast.info('Server is offline')
    }
    
    setIsChecking(false)
  }

  const handleCopyUrl = () => {
    if (localSettings.publishedUrl) {
      navigator.clipboard.writeText(localSettings.publishedUrl)
      toast.success('URL copied to clipboard')
    }
  }

  const handleSave = () => {
    onUpdate(localSettings)
    toast.success('Server settings saved')
    onClose()
  }

  const getStatusColor = () => {
    switch (serverStatus) {
      case 'online':
        return 'text-green-500'
      case 'offline':
        return 'text-muted-foreground'
      case 'checking':
        return 'text-yellow-500'
    }
  }

  const getStatusText = () => {
    switch (serverStatus) {
      case 'online':
        return 'Online'
      case 'offline':
        return 'Offline'
      case 'checking':
        return 'Checking...'
    }
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="p-6 border-b border-border flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-[20px] font-semibold">Server & Access Point</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
        <p className="text-[13px] text-muted-foreground">
          Configure local server and mobile access point publishing
        </p>
      </div>

      <ScrollArea className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6 pb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-primary/10`}>
                    <WifiHigh size={20} weight="bold" className="text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-[16px]">Server Status</CardTitle>
                    <CardDescription className="text-[13px]">
                      Local development server
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Circle
                    size={12}
                    weight="fill"
                    className={`${getStatusColor()} ${serverStatus === 'checking' ? 'animate-pulse' : ''}`}
                  />
                  <span className={`text-[13px] font-medium ${getStatusColor()}`}>
                    {getStatusText()}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Power size={20} weight="bold" className="text-foreground" />
                  <div>
                    <p className="text-[14px] font-medium">Enable Server</p>
                    <p className="text-[12px] text-muted-foreground">
                      Start the local development server
                    </p>
                  </div>
                </div>
                <Switch checked={localSettings.enabled} onCheckedChange={handleToggleServer} />
              </div>

              <Button
                variant="outline"
                onClick={handleCheckStatus}
                disabled={isChecking}
                className="w-full gap-2"
              >
                {isChecking ? (
                  <>
                    <Circle size={16} className="animate-spin" />
                    Checking Status...
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} />
                    Check Server Status
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/10">
                  <Globe size={20} weight="bold" className="text-accent" />
                </div>
                <div>
                  <CardTitle className="text-[16px]">Access Point Settings</CardTitle>
                  <CardDescription className="text-[13px]">
                    Configure mobile network access
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ap-name">Access Point Name</Label>
                <Input
                  id="ap-name"
                  value={localSettings.accessPointName}
                  onChange={e =>
                    setLocalSettings({ ...localSettings, accessPointName: e.target.value })
                  }
                  placeholder="my-project"
                  disabled={!localSettings.enabled}
                />
                <p className="text-[12px] text-muted-foreground">
                  Network name for mobile device access
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="port">Port Number</Label>
                <Input
                  id="port"
                  type="number"
                  value={localSettings.port}
                  onChange={e =>
                    setLocalSettings({ ...localSettings, port: parseInt(e.target.value) || 3000 })
                  }
                  placeholder="3000"
                  disabled={!localSettings.enabled}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Access Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={localSettings.password}
                  onChange={e =>
                    setLocalSettings({ ...localSettings, password: e.target.value })
                  }
                  placeholder="Enter secure password"
                  disabled={!localSettings.enabled}
                />
                <p className="text-[12px] text-muted-foreground">
                  Protect access to your project
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <CloudArrowUp size={20} weight="bold" className="text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-[16px]">Publish Project</CardTitle>
                  <CardDescription className="text-[13px]">
                    Make your project accessible on the network
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  {localSettings.isPublished ? (
                    <CheckCircle size={20} weight="fill" className="text-green-600" />
                  ) : (
                    <XCircle size={20} weight="fill" className="text-muted-foreground" />
                  )}
                  <div>
                    <p className="text-[14px] font-medium">
                      {localSettings.isPublished ? 'Published' : 'Not Published'}
                    </p>
                    <p className="text-[12px] text-muted-foreground">
                      {localSettings.isPublished
                        ? 'Project is live on the network'
                        : 'Publish to make accessible'}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={localSettings.isPublished}
                  onCheckedChange={handleTogglePublish}
                  disabled={!localSettings.enabled}
                />
              </div>

              {localSettings.isPublished && localSettings.publishedUrl && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-[13px]">Published URL</Label>
                      <Badge variant="default" className="gap-1">
                        <Circle size={8} weight="fill" className="text-green-400 animate-pulse" />
                        Live
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        value={localSettings.publishedUrl}
                        readOnly
                        className="font-code text-[13px]"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopyUrl}
                        className="gap-2 flex-shrink-0"
                      >
                        <Copy size={14} />
                        Copy
                      </Button>
                    </div>
                    {localSettings.lastPublished && (
                      <p className="text-[12px] text-muted-foreground">
                        Published {new Date(localSettings.lastPublished).toLocaleString()}
                      </p>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle className="text-[14px]">Connection Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-[13px]">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[11px] font-bold">
                  1
                </div>
                <div>
                  <p className="font-medium">Enable the server</p>
                  <p className="text-muted-foreground text-[12px]">
                    Toggle the server switch to start hosting
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[11px] font-bold">
                  2
                </div>
                <div>
                  <p className="font-medium">Configure access point</p>
                  <p className="text-muted-foreground text-[12px]">
                    Set your network name and password
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[11px] font-bold">
                  3
                </div>
                <div>
                  <p className="font-medium">Publish your project</p>
                  <p className="text-muted-foreground text-[12px]">
                    Toggle publish to make it accessible on the network
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[11px] font-bold">
                  4
                </div>
                <div>
                  <p className="font-medium">Connect from mobile devices</p>
                  <p className="text-muted-foreground text-[12px]">
                    Use the published URL to access from any device
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>

      <div className="p-6 border-t border-border bg-card flex-shrink-0">
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Settings</Button>
        </div>
      </div>
    </div>
  )
}
