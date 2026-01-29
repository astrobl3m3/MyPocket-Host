import type { Component } from '@/lib/types'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface ComponentRendererProps {
  component: Component
  isSelected: boolean
  onClick: () => void
}

export function ComponentRenderer({ component, isSelected, onClick }: ComponentRendererProps) {
  const baseClasses = `cursor-pointer transition-all duration-200 ${
    isSelected ? 'ring-4 ring-primary ring-offset-2' : 'hover:ring-2 hover:ring-primary/50'
  }`

  switch (component.type) {
    case 'header':
      return (
        <div
          onClick={onClick}
          className={baseClasses}
          style={{ backgroundColor: component.bgColor }}
        >
          <div className="py-16 px-8 text-white">
            <h1
              className={`text-[3rem] font-bold mb-2 text-${component.alignment}`}
              style={{ textAlign: component.alignment }}
            >
              {component.title}
            </h1>
            <p
              className={`text-[1.25rem] opacity-90 text-${component.alignment}`}
              style={{ textAlign: component.alignment }}
            >
              {component.subtitle}
            </p>
          </div>
        </div>
      )

    case 'text':
      return (
        <div onClick={onClick} className={`${baseClasses} p-8`}>
          <p
            className={`text-${component.fontSize} text-${component.alignment}`}
            style={{
              textAlign: component.alignment,
              fontSize:
                component.fontSize === 'small'
                  ? '0.875rem'
                  : component.fontSize === 'large'
                  ? '1.25rem'
                  : '1rem',
            }}
          >
            {component.content.split('\n').map((line, i) => (
              <span key={i}>
                {line}
                <br />
              </span>
            ))}
          </p>
        </div>
      )

    case 'image':
      return (
        <div
          onClick={onClick}
          className={`${baseClasses} p-8 flex`}
          style={{ justifyContent: component.alignment }}
        >
          <img
            src={component.src}
            alt={component.alt}
            style={{ width: component.width }}
            className="rounded-lg max-w-full h-auto"
          />
        </div>
      )

    case 'video':
      const isYouTube = component.src.includes('youtube.com') || component.src.includes('youtu.be')
      return (
        <div
          onClick={onClick}
          className={`${baseClasses} p-8 flex`}
          style={{ justifyContent: component.alignment }}
        >
          {isYouTube ? (
            <div className="aspect-video w-full max-w-2xl">
              <iframe
                width="100%"
                height="100%"
                src={component.src.replace('watch?v=', 'embed/')}
                className="rounded-lg"
                allowFullScreen
              />
            </div>
          ) : (
            <video controls className="rounded-lg max-w-2xl w-full">
              <source src={component.src} type="video/mp4" />
            </video>
          )}
        </div>
      )

    case 'button':
      return (
        <div
          onClick={onClick}
          className={`${baseClasses} p-8 flex`}
          style={{ justifyContent: component.alignment }}
        >
          <Button
            variant={component.variant === 'primary' ? 'default' : component.variant as any}
            size="lg"
          >
            {component.text}
          </Button>
        </div>
      )

    case 'card':
      return (
        <div onClick={onClick} className={`${baseClasses} p-8`}>
          <Card className="max-w-md mx-auto">
            {component.imageUrl && (
              <img
                src={component.imageUrl}
                alt={component.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
            )}
            <CardContent className="p-6">
              <h3 className="text-[1.5rem] font-semibold mb-2">{component.title}</h3>
              <p className="text-muted-foreground">{component.content}</p>
            </CardContent>
          </Card>
        </div>
      )

    case 'table':
      return (
        <div onClick={onClick} className={`${baseClasses} p-8`}>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-secondary">
                  {component.headers.map((header, i) => (
                    <th
                      key={i}
                      className="px-4 py-2 text-left font-semibold border-b border-border"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {component.rows.map((row, i) => (
                  <tr key={i} className="hover:bg-muted/50">
                    {row.map((cell, j) => (
                      <td key={j} className="px-4 py-2 border-b border-border">
                        {cell.value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )

    case 'form':
      return (
        <div onClick={onClick} className={`${baseClasses} p-8`}>
          <div className="max-w-md mx-auto">
            <h2 className="text-[1.5rem] font-semibold mb-4">{component.title}</h2>
            <form className="space-y-4">
              {component.fields.map(field => (
                <div key={field.id} className="space-y-2">
                  <label className="text-sm font-medium">
                    {field.label}
                    {field.required && ' *'}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea className="w-full px-3 py-2 border border-input rounded-md" rows={4} />
                  ) : (
                    <input
                      type={field.type}
                      className="w-full px-3 py-2 border border-input rounded-md"
                    />
                  )}
                </div>
              ))}
              <Button type="button">{component.submitText}</Button>
            </form>
          </div>
        </div>
      )

    case 'gallery':
      return (
        <div onClick={onClick} className={`${baseClasses} p-8`}>
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: `repeat(${component.columns}, 1fr)` }}
          >
            {component.images.map((img, i) => (
              <img key={i} src={img.src} alt={img.alt} className="w-full h-48 object-cover rounded-lg" />
            ))}
          </div>
        </div>
      )

    case 'customHtml':
      return (
        <div onClick={onClick} className={`${baseClasses} p-8`}>
          <div dangerouslySetInnerHTML={{ __html: component.html }} />
        </div>
      )

    case 'footer':
      return (
        <div onClick={onClick} className={`${baseClasses} bg-foreground text-background`}>
          <div className="py-8 px-8 text-center">
            <p className="mb-4">{component.content}</p>
            <div className="flex justify-center gap-6">
              {component.links.map((link, i) => (
                <a key={i} href={link.url} className="text-accent hover:underline">
                  {link.text}
                </a>
              ))}
            </div>
          </div>
        </div>
      )

    default:
      return null
  }
}
