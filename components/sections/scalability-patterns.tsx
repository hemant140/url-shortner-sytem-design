"use client"

import React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  Server,
  Database,
  HardDrive,
  Globe,
  Layers,
  ArrowUpRight,
  CheckCircle2
} from "lucide-react"

interface ScalingPattern {
  id: string
  title: string
  icon: React.ElementType
  description: string
  implementation: string[]
  considerations: string[]
  diagram: React.ReactNode
}

const patterns: ScalingPattern[] = [
  {
    id: "horizontal",
    title: "Horizontal Scaling",
    icon: Server,
    description: "Add more servers behind a load balancer to handle increased traffic",
    implementation: [
      "Stateless API servers (no session affinity)",
      "Auto-scaling groups based on CPU/memory",
      "Health checks for automatic failover",
      "Blue-green deployments for zero downtime"
    ],
    considerations: [
      "Session management via Redis",
      "Consistent hashing for cache",
      "Database connection pooling"
    ],
    diagram: (
      <div className="flex items-center justify-center gap-4 py-8">
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-lg bg-chart-2 flex items-center justify-center">
            <Globe className="h-8 w-8 text-background" />
          </div>
          <span className="text-xs text-muted-foreground">Load Balancer</span>
        </div>
        <ArrowUpRight className="h-6 w-6 text-muted-foreground" />
        <div className="grid grid-cols-2 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center">
              <Server className="h-5 w-5 text-primary-foreground" />
            </div>
          ))}
        </div>
      </div>
    )
  },
  {
    id: "sharding",
    title: "Database Sharding",
    icon: Database,
    description: "Distribute data across multiple database instances based on shard key",
    implementation: [
      "Shard by short_code hash (consistent)",
      "Range-based sharding for time-series",
      "Each shard holds subset of data",
      "Cross-shard queries minimized"
    ],
    considerations: [
      "Resharding complexity",
      "Hot shard detection",
      "Backup and recovery strategy"
    ],
    diagram: (
      <div className="flex items-center justify-center gap-6 py-8">
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-lg bg-primary flex items-center justify-center">
            <Layers className="h-8 w-8 text-primary-foreground" />
          </div>
          <span className="text-xs text-muted-foreground">Router</span>
        </div>
        <div className="flex flex-col gap-2">
          {["A-H", "I-P", "Q-Z"].map((range) => (
            <div key={range} className="flex items-center gap-2">
              <div className="w-12 h-10 rounded bg-chart-5 flex items-center justify-center">
                <Database className="h-4 w-4 text-background" />
              </div>
              <span className="text-xs text-muted-foreground font-mono">{range}</span>
            </div>
          ))}
        </div>
      </div>
    )
  },
  {
    id: "replication",
    title: "Database Replication",
    icon: HardDrive,
    description: "Master-slave replication for read scalability and high availability",
    implementation: [
      "Single master for writes",
      "Multiple read replicas",
      "Async replication (eventual consistency)",
      "Promote replica on master failure"
    ],
    considerations: [
      "Replication lag monitoring",
      "Read-after-write consistency",
      "Failover automation"
    ],
    diagram: (
      <div className="flex flex-col items-center gap-4 py-8">
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-lg bg-chart-3 flex items-center justify-center">
            <Database className="h-8 w-8 text-background" />
          </div>
          <span className="text-xs text-muted-foreground">Master (Write)</span>
        </div>
        <div className="flex gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-lg bg-chart-2 flex items-center justify-center">
                <Database className="h-5 w-5 text-background" />
              </div>
              <span className="text-xs text-muted-foreground">Replica {i}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }
]

export function ScalabilityPatterns() {
  const [selectedPattern, setSelectedPattern] = useState<ScalingPattern>(patterns[0])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <Badge variant="outline" className="text-primary border-primary">
          Scalability
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl text-balance">
          Scalability Patterns
        </h1>
        <p className="text-muted-foreground max-w-2xl text-pretty leading-relaxed">
          Design patterns and strategies to scale the URL shortener to handle billions of requests with high availability.
        </p>
      </div>

      {/* Pattern Selection */}
      <div className="grid gap-4 md:grid-cols-3">
        {patterns.map((pattern) => {
          const Icon = pattern.icon
          const isSelected = selectedPattern.id === pattern.id
          return (
            <button
              key={pattern.id}
              onClick={() => setSelectedPattern(pattern)}
              className={cn(
                "flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all",
                isSelected
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card hover:border-primary/50"
              )}
            >
              <div className={cn(
                "rounded-lg p-3",
                isSelected ? "bg-primary" : "bg-secondary"
              )}>
                <Icon className={cn(
                  "h-6 w-6",
                  isSelected ? "text-primary-foreground" : "text-foreground"
                )} />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{pattern.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {pattern.description}
                </p>
              </div>
            </button>
          )
        })}
      </div>

      {/* Pattern Details */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary p-3">
              <selectedPattern.icon className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-foreground">{selectedPattern.title}</CardTitle>
              <CardDescription>{selectedPattern.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 lg:grid-cols-2">
          {/* Diagram */}
          <div className="rounded-xl border border-border bg-secondary/30">
            {selectedPattern.diagram}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h4 className="mb-3 text-sm font-medium text-foreground uppercase tracking-wider">
                Implementation
              </h4>
              <ul className="space-y-2">
                {selectedPattern.implementation.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-medium text-foreground uppercase tracking-wider">
                Considerations
              </h4>
              <ul className="space-y-2">
                {selectedPattern.considerations.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="h-2 w-2 rounded-full bg-chart-3 shrink-0 mt-2" />
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scaling Milestones */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Scaling Milestones</CardTitle>
          <CardDescription>Progressive scaling strategy as traffic grows</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
            <div className="space-y-8">
              {[
                {
                  stage: "Stage 1",
                  traffic: "0-10K req/min",
                  architecture: "Single server with PostgreSQL",
                  actions: ["Add Redis caching", "Implement rate limiting", "Set up monitoring"]
                },
                {
                  stage: "Stage 2",
                  traffic: "10K-100K req/min",
                  architecture: "Multiple app servers + Read replicas",
                  actions: ["Add load balancer", "Database read replicas", "CDN for static assets"]
                },
                {
                  stage: "Stage 3",
                  traffic: "100K-1M req/min",
                  architecture: "Sharded database + Cache cluster",
                  actions: ["Database sharding", "Redis cluster", "Multi-region deployment"]
                },
                {
                  stage: "Stage 4",
                  traffic: "1M+ req/min",
                  architecture: "Global distribution + NoSQL",
                  actions: ["Global load balancing", "Cassandra/DynamoDB", "Edge computing"]
                }
              ].map((milestone, index) => (
                <div key={milestone.stage} className="relative pl-10">
                  <div className={cn(
                    "absolute left-2 w-5 h-5 rounded-full border-2 border-background",
                    index === 0 ? "bg-primary" : "bg-secondary"
                  )} />
                  <div className="rounded-lg border border-border bg-secondary/30 p-4">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <Badge variant="outline" className="text-primary border-primary">
                        {milestone.stage}
                      </Badge>
                      <Badge variant="secondary">{milestone.traffic}</Badge>
                    </div>
                    <p className="text-sm font-medium text-foreground mb-2">
                      {milestone.architecture}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {milestone.actions.map((action) => (
                        <span key={action} className="text-xs text-muted-foreground bg-secondary/50 px-2 py-1 rounded">
                          {action}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
