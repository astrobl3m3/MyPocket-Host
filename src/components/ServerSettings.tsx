import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
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
  ShieldCheck,
  ChartBar,
  HardDrives,
  Clock,
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
  const [serverStatus, setServerStatus] = useState<'online' | 'offline' | 'checking'>(
    settings.enabled ? 'online' : 'offline'
  )

  useEffect(() => {
    setLocalSettings(settings)
    setServerStatus(settings.enabled ? 'online' : 'offline')
  }, [settings])

  useEffect(() => {
    setLocalSettings(prevSettings => {
      const needsSSL = !prevSettings.ssl
      const needsMetrics = !prevSettings.metrics
      
      if (!needsSSL && !needsMetrics) {
        return prevSettings
      }
      
      return {
        ...prevSettings,
        ...(needsSSL && {
          ssl: {
            enabled: false,
            autoGenerate: true,
          },
        }),
        ...(needsMetrics && {
          metrics: {
            totalRequests: 0,
            bandwidthUsed: 0,
            requestsHistory: [],
          },
        }),
      }
    })
  }, [])

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
  }

  const handleToggleServer = () => {
    const newEnabled = !localSettings.enabled
    
    if (newEnabled) {
      setLocalSettings({ ...localSettings, enabled: true })
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
    const protocol = localSettings.ssl?.enabled ? 'https' : 'http'
    const newUrl = newPublished ? `${protocol}://${localSettings.accessPointName}.local:${localSettings.port}` : undefined
    
    const newMetrics = localSettings.metrics || {
      totalRequests: 0,
      bandwidthUsed: 0,
      requestsHistory: [],
    }

    if (newPublished) {
      newMetrics.lastAccessed = Date.now()
    }
    
    setLocalSettings({
      ...localSettings,
      isPublished: newPublished,
      publishedUrl: newUrl,
      lastPublished: newPublished ? Date.now() : localSettings.lastPublished,
      metrics: newMetrics,
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
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const methods = ['GET', 'POST', 'PUT', 'DELETE']
                        const paths = ['/', '/index.html', '/about', '/contact', '/api/data']
                        
                        const newRequest = {
                          timestamp: Date.now(),
                          bytesTransferred: Math.floor(Math.random() * 50000) + 5000,
                          path: paths[Math.floor(Math.random() * paths.length)],
                          method: methods[Math.floor(Math.random() * methods.length)],
                        }

                        const currentMetrics = localSettings.metrics || {
                          totalRequests: 0,
                          bandwidthUsed: 0,
                          requestsHistory: [],
                        }

                        const updatedHistory = [...currentMetrics.requestsHistory, newRequest]
                        
                        setLocalSettings({
                          ...localSettings,
                          metrics: {
                            totalRequests: currentMetrics.totalRequests + 1,
                            bandwidthUsed: currentMetrics.bandwidthUsed + newRequest.bytesTransferred,
                            lastAccessed: Date.now(),
                            requestsHistory: updatedHistory.slice(-10),
                          },
                        })
                        
                        toast.success('Simulated request recorded')
                      }}
                      className="w-full text-[11px]"
                    >
                      Simulate Request (Demo)
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <ShieldCheck size={20} weight="bold" className="text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-[16px]">SSL/HTTPS Configuration</CardTitle>
                  <CardDescription className="text-[13px]">
                    Secure your connection with SSL certificates
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <LockKey size={20} weight="bold" className="text-foreground" />
                  <div>
                    <p className="text-[14px] font-medium">Enable SSL/HTTPS</p>
                    <p className="text-[12px] text-muted-foreground">
                      Use encrypted connections
                    </p>
                  </div>
                </div>
                <Switch 
                  checked={localSettings.ssl?.enabled || false}
                  onCheckedChange={(checked) => {
                    const protocol = checked ? 'https' : 'http'
                    const newUrl = localSettings.isPublished 
                      ? `${protocol}://${localSettings.accessPointName}.local:${localSettings.port}`
                      : undefined
                    
                    setLocalSettings({
                      ...localSettings,
                      publishedUrl: newUrl,
                      ssl: {
                        ...localSettings.ssl,
                        enabled: checked,
                        autoGenerate: localSettings.ssl?.autoGenerate ?? true,
                      },
                    })
                  }}
                  disabled={!localSettings.enabled}
                />
              </div>

              {localSettings.ssl?.enabled && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-md">
                      <div className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-blue-600" />
                        <span className="text-[12px] font-medium text-blue-700 dark:text-blue-400">
                          Auto-generate Self-Signed Certificate
                        </span>
                      </div>
                      <Switch
                        checked={localSettings.ssl?.autoGenerate ?? true}
                        onCheckedChange={(checked) => {
                          setLocalSettings({
                            ...localSettings,
                            ssl: {
                              ...localSettings.ssl,
                              enabled: true,
                              autoGenerate: checked,
                            },
                          })
                        }}
                      />
                    </div>

                    {!localSettings.ssl?.autoGenerate && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="cert-path">Certificate Path (.crt)</Label>
                          <Input
                            id="cert-path"
                            value={localSettings.ssl?.certPath || ''}
                            onChange={(e) => {
                              setLocalSettings({
                                ...localSettings,
                                ssl: {
                                  ...localSettings.ssl,
                                  enabled: true,
                                  certPath: e.target.value,
                                },
                              })
                            }}
                            placeholder="/path/to/certificate.crt"
                            className="font-code text-[13px]"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="key-path">Private Key Path (.key)</Label>
                          <Input
                            id="key-path"
                            value={localSettings.ssl?.keyPath || ''}
                            onChange={(e) => {
                              setLocalSettings({
                                ...localSettings,
                                ssl: {
                                  ...localSettings.ssl,
                                  enabled: true,
                                  keyPath: e.target.value,
                                },
                              })
                            }}
                            placeholder="/path/to/privatekey.key"
                            className="font-code text-[13px]"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {localSettings.isPublished && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10">
                    <ChartBar size={20} weight="bold" className="text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-[16px]">Usage Metrics</CardTitle>
                    <CardDescription className="text-[13px]">
                      Monitor traffic and bandwidth usage
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Globe size={16} className="text-muted-foreground" />
                      <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">
                        Total Requests
                      </span>
                    </div>
                    <p className="text-[24px] font-bold">
                      {localSettings.metrics?.totalRequests || 0}
                    </p>
                  </div>

                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <HardDrives size={16} className="text-muted-foreground" />
                      <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">
                        Bandwidth
                      </span>
                    </div>
                    <p className="text-[24px] font-bold">
                      {formatBytes(localSettings.metrics?.bandwidthUsed || 0)}
                    </p>
                  </div>
                </div>

                {localSettings.metrics?.lastAccessed && (
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <Clock size={16} className="text-muted-foreground" />
                    <div>
                      <p className="text-[12px] text-muted-foreground">Last Accessed</p>
                      <p className="text-[13px] font-medium">
                        {new Date(localSettings.metrics.lastAccessed).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="text-muted-foreground">Bandwidth Usage</span>
                    <span className="font-medium">
                      {((localSettings.metrics?.bandwidthUsed || 0) / (1024 * 1024 * 100) * 100).toFixed(1)}% of 100MB
                    </span>
                  </div>
                  <Progress 
                    value={Math.min(((localSettings.metrics?.bandwidthUsed || 0) / (1024 * 1024 * 100) * 100), 100)} 
                    className="h-2"
                  />
                </div>

                {localSettings.metrics?.requestsHistory && localSettings.metrics.requestsHistory.length > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <Label className="text-[13px]">Recent Activity</Label>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {localSettings.metrics.requestsHistory.slice(-5).reverse().map((log, idx) => (
                          <div key={idx} className="flex items-center justify-between text-[11px] p-2 bg-muted/30 rounded">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-[10px] font-code">
                                {log.method}
                              </Badge>
                              <span className="font-code text-muted-foreground truncate max-w-[150px]">
                                {log.path}
                              </span>
                            </div>
                            <span className="text-muted-foreground">
                              {formatBytes(log.bytesTransferred)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

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
