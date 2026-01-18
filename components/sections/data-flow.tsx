"use client"

import React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import {
  ArrowDown,
  ArrowRight,
  CheckCircle2,
  Globe,
  Server,
  Layers,
  Database,
  BarChart3,
  User,
  Link2,
  Search
} from "lucide-react"

interface FlowStep {
  id: number
  title: string
  description: string
  icon: React.ElementType
  details: string[]
  latency: string
}

const createUrlFlow: FlowStep[] = [
  {
    id: 1,
    title: "Client Request",
    description: "User submits long URL",
    icon: User,
    details: ["Validate URL format", "Check authentication", "Apply rate limiting"],
    latency: "~5ms"
  },
  {
    id: 2,
    title: "Load Balancer",
    description: "Route to healthy server",
    icon: Globe,
    details: ["Health check validation", "Least connections routing", "SSL termination"],
    latency: "~1ms"
  },
  {
    id: 3,
    title: "API Server",
    description: "Process URL creation",
    icon: Server,
    details: ["Validate input", "Check for duplicates", "Generate short code"],
    latency: "~10ms"
  },
  {
    id: 4,
    title: "Database Write",
    description: "Persist URL mapping",
    icon: Database,
    details: ["Insert URL record", "Create indexes", "Handle conflicts"],
    latency: "~15ms"
  },
  {
    id: 5,
    title: "Cache Update",
    description: "Warm cache with new URL",
    icon: Layers,
    details: ["Write to Redis", "Set TTL", "Notify replicas"],
    latency: "~2ms"
  },
  {
    id: 6,
    title: "Response",
    description: "Return short URL to client",
    icon: Link2,
    details: ["Format response", "Include metadata", "Set headers"],
    latency: "~1ms"
  }
]

const redirectFlow: FlowStep[] = [
  {
    id: 1,
    title: "User Click",
    description: "User accesses short URL",
    icon: User,
    details: ["Parse short code", "Extract from path", "Validate format"],
    latency: "~1ms"
  },
  {
    id: 2,
    title: "CDN/Edge",
    description: "Check edge cache",
    icon: Globe,
    details: ["Edge location lookup", "Geographic routing", "Cache check"],
    latency: "~2ms"
  },
  {
    id: 3,
    title: "Cache Lookup",
    description: "Check Redis cache",
    icon: Layers,
    details: ["O(1) hash lookup", "Check expiration", "Return if found"],
    latency: "~1ms"
  },
  {
    id: 4,
    title: "DB Fallback",
    description: "Query database on miss",
    icon: Database,
    details: ["Index lookup", "Validate active", "Check expiry"],
    latency: "~5ms"
  },
  {
    id: 5,
    title: "Analytics",
    description: "Record click async",
    icon: BarChart3,
    details: ["Queue analytics event", "Extract metadata", "Fire and forget"],
    latency: "~0ms (async)"
  },
  {
    id: 6,
    title: "Redirect",
    description: "302 redirect to original",
    icon: ArrowRight,
    details: ["Set Location header", "Return 302 status", "Include cache headers"],
    latency: "~1ms"
  }
]

export function DataFlow() {
  const [activeStep, setActiveStep] = useState<number | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const runAnimation = (flow: FlowStep[]) => {
    setIsAnimating(true)
    setActiveStep(0)
    let step = 0
    const interval = setInterval(() => {
      step++
      if (step >= flow.length) {
        clearInterval(interval)
        setIsAnimating(false)
        setTimeout(() => setActiveStep(null), 1000)
      } else {
        setActiveStep(step)
      }
    }, 600)
  }

  const renderFlow = (flow: FlowStep[]) => (
    <div className="space-y-4">
      <button
        onClick={() => runAnimation(flow)}
        disabled={isAnimating}
        className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
      >
        <Search className="h-4 w-4" />
        Trace Request Flow
      </button>

      <div className="grid gap-3">
        {flow.map((step, index) => {
          const Icon = step.icon
          const isActive = activeStep === index
          const isPast = activeStep !== null && index < activeStep

          return (
            <div key={step.id} className="relative">
              {index < flow.length - 1 && (
                <div className={cn(
                  "absolute left-6 top-16 h-8 w-0.5 transition-colors duration-300",
                  isPast ? "bg-primary" : "bg-border"
                )} />
              )}
              <div
                className={cn(
                  "flex items-start gap-4 rounded-xl border-2 p-4 transition-all duration-300",
                  isActive ? "border-primary bg-primary/10 scale-[1.02]" : 
                  isPast ? "border-primary/50 bg-primary/5" : "border-border bg-card"
                )}
              >
                <div className={cn(
                  "rounded-lg p-3 transition-colors duration-300",
                  isActive ? "bg-primary" : isPast ? "bg-primary/50" : "bg-secondary"
                )}>
                  <Icon className={cn(
                    "h-6 w-6",
                    isActive || isPast ? "text-primary-foreground" : "text-foreground"
                  )} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-foreground">{step.title}</h3>
                    <Badge variant="outline" className="font-mono text-xs">
                      {step.latency}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {step.details.map((detail) => (
                      <span
                        key={detail}
                        className={cn(
                          "text-xs px-2 py-1 rounded transition-colors",
                          isActive ? "bg-primary/20 text-primary" : "bg-secondary/50 text-muted-foreground"
                        )}
                      >
                        {detail}
                      </span>
                    ))}
                  </div>
                </div>
                {isActive && (
                  <div className="animate-pulse">
                    <div className="h-3 w-3 rounded-full bg-primary" />
                  </div>
                )}
                {isPast && (
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Total Latency */}
      <div className="rounded-lg bg-secondary/50 p-4 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Total Expected Latency</span>
        <Badge variant="default" className="font-mono">
          {flow === createUrlFlow ? "~35ms" : "~10ms (cache hit)"}
        </Badge>
      </div>
    </div>
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <Badge variant="outline" className="text-primary border-primary">
          Data Flow
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl text-balance">
          Request Flow & Sequence
        </h1>
        <p className="text-muted-foreground max-w-2xl text-pretty leading-relaxed">
          Detailed breakdown of data flow for URL creation and redirect operations with latency analysis.
        </p>
      </div>

      {/* Flow Diagrams */}
      <Tabs defaultValue="create" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Create Short URL</TabsTrigger>
          <TabsTrigger value="redirect">Redirect Flow</TabsTrigger>
        </TabsList>
        <TabsContent value="create">
          {renderFlow(createUrlFlow)}
        </TabsContent>
        <TabsContent value="redirect">
          {renderFlow(redirectFlow)}
        </TabsContent>
      </Tabs>

      {/* Sequence Diagram */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Sequence Diagram (Text)</CardTitle>
          <CardDescription>Copy this for system design interviews</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-secondary/50 p-4 overflow-x-auto">
            <pre className="text-xs font-mono text-foreground whitespace-pre">
{`┌──────┐     ┌────────┐     ┌──────┐     ┌───────┐     ┌────────┐
│Client│     │   LB   │     │  API │     │ Cache │     │   DB   │
└──┬───┘     └───┬────┘     └──┬───┘     └───┬───┘     └───┬────┘
   │             │             │             │             │
   │  POST /shorten            │             │             │
   │────────────>│             │             │             │
   │             │  route      │             │             │
   │             │────────────>│             │             │
   │             │             │  GET cache  │             │
   │             │             │────────────>│             │
   │             │             │  miss       │             │
   │             │             │<────────────│             │
   │             │             │        SELECT original_url│
   │             │             │────────────────────────────>
   │             │             │             │   result    │
   │             │             │<────────────────────────────
   │             │             │  SET cache  │             │
   │             │             │────────────>│             │
   │             │  302 + URL  │             │             │
   │<───────────────────────────             │             │
   │             │             │             │             │`}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Key Design Decisions */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground text-lg">Why 302 vs 301?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <Badge variant="outline">302</Badge>
              <div>
                <p className="text-sm text-foreground font-medium">Temporary Redirect</p>
                <p className="text-xs text-muted-foreground">
                  Browser re-requests each time. Better for analytics tracking and URL updates.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="secondary">301</Badge>
              <div>
                <p className="text-sm text-foreground font-medium">Permanent Redirect</p>
                <p className="text-xs text-muted-foreground">
                  Browser caches. Faster but you lose analytics and cannot change destination.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground text-lg">Async Analytics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Analytics are processed asynchronously to not block redirects:
            </p>
            <ul className="space-y-2">
              {[
                "Message queue (Kafka/SQS) for durability",
                "Batch writes every 1-5 seconds",
                "Pre-aggregate in Redis before DB",
                "Separate analytics database/cluster"
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
