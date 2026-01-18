"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  Layers,
  Database,
  Server,
  Clock,
  Zap,
  RefreshCw,
  ArrowRight
} from "lucide-react"

interface CacheStrategy {
  id: string
  name: string
  description: string
  flow: string[]
  pros: string[]
  cons: string[]
  useCase: string
}

const strategies: CacheStrategy[] = [
  {
    id: "cache-aside",
    name: "Cache-Aside (Lazy Loading)",
    description: "Application checks cache first, loads from DB on miss",
    flow: [
      "1. App checks Redis for short_code",
      "2. If HIT: return cached URL",
      "3. If MISS: query database",
      "4. Store result in cache",
      "5. Return URL to client"
    ],
    pros: ["Simple implementation", "Only requested data cached", "Resilient to cache failure"],
    cons: ["Cache miss penalty", "Possible stale data", "Cache stampede risk"],
    useCase: "Best for read-heavy workloads with infrequent updates"
  },
  {
    id: "write-through",
    name: "Write-Through",
    description: "Write to cache and database synchronously",
    flow: [
      "1. App writes to cache first",
      "2. Cache writes to database",
      "3. Both writes are synchronous",
      "4. Return success only when both complete",
      "5. Reads always from cache"
    ],
    pros: ["Data consistency", "No stale data", "Simple read path"],
    cons: ["Write latency", "Cache capacity issues", "Unused data cached"],
    useCase: "When data consistency is critical"
  },
  {
    id: "write-behind",
    name: "Write-Behind (Write-Back)",
    description: "Write to cache immediately, async write to database",
    flow: [
      "1. App writes to cache",
      "2. Return success immediately",
      "3. Async queue DB writes",
      "4. Batch writes for efficiency",
      "5. Handle failures with retry"
    ],
    pros: ["Low write latency", "Batch writes", "High throughput"],
    cons: ["Data loss risk", "Complex implementation", "Eventual consistency"],
    useCase: "High-throughput analytics and click counting"
  }
]

export function CachingStrategy() {
  const [selectedStrategy, setSelectedStrategy] = useState<CacheStrategy>(strategies[0])
  const [simulationStep, setSimulationStep] = useState(0)

  const runSimulation = () => {
    setSimulationStep(0)
    const interval = setInterval(() => {
      setSimulationStep((prev) => {
        if (prev >= selectedStrategy.flow.length - 1) {
          clearInterval(interval)
          return prev
        }
        return prev + 1
      })
    }, 800)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <Badge variant="outline" className="text-primary border-primary">
          Caching
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl text-balance">
          Caching Strategy
        </h1>
        <p className="text-muted-foreground max-w-2xl text-pretty leading-relaxed">
          Implement efficient caching patterns to achieve sub-10ms redirect latency and reduce database load by 90%+.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: "Cache Hit Ratio", value: "95%+", icon: Zap },
          { label: "Avg Latency", value: "<5ms", icon: Clock },
          { label: "Cache Size", value: "~50GB", icon: Layers },
          { label: "TTL", value: "24 hours", icon: RefreshCw }
        ].map((metric) => (
          <Card key={metric.label} className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <metric.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                  <p className="text-xs text-muted-foreground">{metric.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Strategy Selection */}
      <div className="grid gap-4 md:grid-cols-3">
        {strategies.map((strategy) => (
          <button
            key={strategy.id}
            onClick={() => {
              setSelectedStrategy(strategy)
              setSimulationStep(0)
            }}
            className={cn(
              "rounded-xl border-2 p-4 text-left transition-all",
              selectedStrategy.id === strategy.id
                ? "border-primary bg-primary/10"
                : "border-border bg-card hover:border-primary/50"
            )}
          >
            <h3 className="font-semibold text-foreground mb-1">{strategy.name}</h3>
            <p className="text-sm text-muted-foreground">{strategy.description}</p>
          </button>
        ))}
      </div>

      {/* Interactive Flow Visualization */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-foreground">{selectedStrategy.name}</CardTitle>
              <CardDescription>Click to simulate the caching flow</CardDescription>
            </div>
            <button
              onClick={runSimulation}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <RefreshCw className="h-4 w-4" />
              Run Simulation
            </button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Visual Diagram */}
          <div className="flex items-center justify-center gap-8 py-8 flex-wrap">
            <div className={cn(
              "flex flex-col items-center gap-2 transition-all duration-300",
              simulationStep >= 0 && "scale-110"
            )}>
              <div className={cn(
                "w-20 h-20 rounded-xl flex items-center justify-center transition-colors duration-300",
                simulationStep === 0 ? "bg-primary" : "bg-secondary"
              )}>
                <Server className={cn(
                  "h-10 w-10",
                  simulationStep === 0 ? "text-primary-foreground" : "text-foreground"
                )} />
              </div>
              <span className="text-sm font-medium text-foreground">App Server</span>
            </div>

            <ArrowRight className={cn(
              "h-8 w-8 transition-colors duration-300",
              simulationStep === 1 ? "text-primary" : "text-muted-foreground"
            )} />

            <div className={cn(
              "flex flex-col items-center gap-2 transition-all duration-300",
              [1, 2, 4].includes(simulationStep) && "scale-110"
            )}>
              <div className={cn(
                "w-20 h-20 rounded-xl flex items-center justify-center transition-colors duration-300",
                [1, 2, 4].includes(simulationStep) ? "bg-chart-1" : "bg-secondary"
              )}>
                <Layers className={cn(
                  "h-10 w-10",
                  [1, 2, 4].includes(simulationStep) ? "text-background" : "text-foreground"
                )} />
              </div>
              <span className="text-sm font-medium text-foreground">Redis Cache</span>
              <Badge variant={simulationStep >= 2 ? "default" : "secondary"} className="text-xs">
                {simulationStep >= 4 ? "HIT" : simulationStep >= 2 ? "MISS" : "Checking..."}
              </Badge>
            </div>

            <ArrowRight className={cn(
              "h-8 w-8 transition-colors duration-300",
              simulationStep === 3 ? "text-primary" : "text-muted-foreground"
            )} />

            <div className={cn(
              "flex flex-col items-center gap-2 transition-all duration-300",
              simulationStep === 3 && "scale-110"
            )}>
              <div className={cn(
                "w-20 h-20 rounded-xl flex items-center justify-center transition-colors duration-300",
                simulationStep === 3 ? "bg-chart-5" : "bg-secondary"
              )}>
                <Database className={cn(
                  "h-10 w-10",
                  simulationStep === 3 ? "text-background" : "text-foreground"
                )} />
              </div>
              <span className="text-sm font-medium text-foreground">Database</span>
            </div>
          </div>

          {/* Flow Steps */}
          <div className="space-y-2 mt-6">
            {selectedStrategy.flow.map((step, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-3 transition-all duration-300",
                  index <= simulationStep
                    ? "bg-primary/10 border border-primary/30"
                    : "bg-secondary/30"
                )}
              >
                <div className={cn(
                  "h-6 w-6 rounded-full flex items-center justify-center text-xs font-medium transition-colors",
                  index <= simulationStep
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground"
                )}>
                  {index + 1}
                </div>
                <span className={cn(
                  "text-sm",
                  index <= simulationStep ? "text-foreground" : "text-muted-foreground"
                )}>
                  {step}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pros/Cons */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground text-lg">Advantages</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {selectedStrategy.pros.map((pro) => (
              <div key={pro} className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-sm text-muted-foreground">{pro}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground text-lg">Trade-offs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {selectedStrategy.cons.map((con) => (
              <div key={con} className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-chart-3" />
                <span className="text-sm text-muted-foreground">{con}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Redis Commands */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Redis Implementation</CardTitle>
          <CardDescription>Common Redis commands for URL shortening</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-secondary/50 p-4 overflow-x-auto">
            <pre className="text-sm font-mono text-foreground">
{`# Store URL mapping (with TTL)
SET url:abc123 "https://example.com/long-url" EX 86400

# Get URL (O(1) lookup)
GET url:abc123

# Increment click count atomically
INCR clicks:abc123

# Rate limiting with sliding window
MULTI
ZADD ratelimit:user123 {timestamp} {request_id}
ZREMRANGEBYSCORE ratelimit:user123 0 {timestamp - window}
ZCARD ratelimit:user123
EXEC

# Cache with hash for metadata
HSET url:abc123 original "https://..." created "2024-01-15" clicks 0
HINCRBY url:abc123 clicks 1`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
