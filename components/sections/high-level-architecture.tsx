"use client"

import React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  Users,
  Globe,
  Server,
  Database,
  Layers,
  HardDrive,
  ArrowRight,
  Zap,
  Shield,
  Clock
} from "lucide-react"

interface ComponentInfo {
  id: string
  title: string
  description: string
  details: string[]
  technologies: string[]
  icon: React.ElementType
  color: string
}

const components: ComponentInfo[] = [
  {
    id: "client",
    title: "Client Layer",
    description: "Users interact through web/mobile apps",
    details: [
      "Web browsers & mobile apps",
      "REST API consumption",
      "Rate limiting at client",
      "Input validation"
    ],
    technologies: ["React", "React Native", "Axios"],
    icon: Users,
    color: "bg-chart-2"
  },
  {
    id: "dns",
    title: "DNS & CDN",
    description: "Global traffic distribution",
    details: [
      "GeoDNS for routing",
      "CDN for static assets",
      "SSL termination",
      "DDoS protection"
    ],
    technologies: ["Cloudflare", "Route53", "Akamai"],
    icon: Globe,
    color: "bg-chart-3"
  },
  {
    id: "lb",
    title: "Load Balancer",
    description: "Traffic distribution across servers",
    details: [
      "Round-robin / Least connections",
      "Health checks",
      "SSL termination",
      "Session affinity"
    ],
    technologies: ["Nginx", "HAProxy", "AWS ALB"],
    icon: Server,
    color: "bg-primary"
  },
  {
    id: "api",
    title: "API Servers",
    description: "Application logic layer",
    details: [
      "Stateless design",
      "Horizontal scaling",
      "Request validation",
      "URL encoding/decoding"
    ],
    technologies: ["Node.js", "Go", "Python"],
    icon: Zap,
    color: "bg-chart-4"
  },
  {
    id: "cache",
    title: "Cache Layer",
    description: "In-memory data store",
    details: [
      "Hot URL caching",
      "Rate limit counters",
      "Session storage",
      "Write-through/aside"
    ],
    technologies: ["Redis", "Memcached"],
    icon: Layers,
    color: "bg-chart-1"
  },
  {
    id: "db",
    title: "Database Layer",
    description: "Persistent data storage",
    details: [
      "URL mappings",
      "User data",
      "Analytics",
      "Sharding support"
    ],
    technologies: ["PostgreSQL", "Cassandra", "DynamoDB"],
    icon: Database,
    color: "bg-chart-5"
  }
]

export function HighLevelArchitecture() {
  const [selectedComponent, setSelectedComponent] = useState<ComponentInfo | null>(null)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-primary border-primary">
            System Design
          </Badge>
          <Badge variant="secondary">4+ YoE Level</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl text-balance">
          URL Shortener Architecture
        </h1>
        <p className="text-muted-foreground max-w-2xl text-pretty leading-relaxed">
          A comprehensive system design for a scalable URL shortening service capable of handling 
          billions of requests with high availability and low latency.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: "Daily Active Users", value: "100M+", icon: Users },
          { label: "URLs Created/Day", value: "1M+", icon: Zap },
          { label: "Read Latency", value: "<10ms", icon: Clock },
          { label: "Availability", value: "99.99%", icon: Shield }
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

      {/* Architecture Diagram */}
      <Card className="bg-card border-border overflow-hidden">
        <CardHeader>
          <CardTitle className="text-foreground">High-Level Architecture</CardTitle>
          <CardDescription>Click on any component to see details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Architecture Flow */}
            <div className="flex flex-col items-center gap-4 py-6 lg:flex-row lg:justify-between lg:gap-2">
              {components.map((component, index) => {
                const Icon = component.icon
                const isSelected = selectedComponent?.id === component.id
                return (
                  <div key={component.id} className="flex items-center gap-2 lg:gap-4">
                    <button
                      onClick={() => setSelectedComponent(isSelected ? null : component)}
                      className={cn(
                        "group relative flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all hover:scale-105 w-28",
                        isSelected
                          ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                          : "border-border bg-secondary/30 hover:border-primary/50"
                      )}
                    >
                      <div className={cn("rounded-lg p-3", component.color)}>
                        <Icon className="h-6 w-6 text-background" />
                      </div>
                      <span className="text-xs font-medium text-center text-foreground">
                        {component.title}
                      </span>
                      {isSelected && (
                        <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary animate-pulse" />
                      )}
                    </button>
                    {index < components.length - 1 && (
                      <ArrowRight className="hidden h-5 w-5 text-muted-foreground lg:block" />
                    )}
                  </div>
                )
              })}
            </div>

            {/* Selected Component Details */}
            {selectedComponent && (
              <div className="mt-6 rounded-xl border border-primary/30 bg-primary/5 p-6 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="flex items-start gap-4">
                  <div className={cn("rounded-lg p-3", selectedComponent.color)}>
                    <selectedComponent.icon className="h-6 w-6 text-background" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {selectedComponent.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedComponent.description}
                      </p>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h4 className="mb-2 text-sm font-medium text-foreground">Key Responsibilities</h4>
                        <ul className="space-y-1">
                          {selectedComponent.details.map((detail) => (
                            <li key={detail} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="mb-2 text-sm font-medium text-foreground">Technologies</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedComponent.technologies.map((tech) => (
                            <Badge key={tech} variant="secondary" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Functional Requirements */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Functional Requirements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              "Generate unique short URL for any long URL",
              "Redirect to original URL when short URL accessed",
              "Custom alias support (optional)",
              "URL expiration time configuration",
              "Analytics: click count, location, timestamp",
              "User authentication for URL management"
            ].map((req, i) => (
              <div key={req} className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                  {i + 1}
                </div>
                <span className="text-sm text-muted-foreground">{req}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Non-Functional Requirements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              "High availability (99.99% uptime SLA)",
              "Low latency (<10ms for redirects)",
              "Scalable to billions of URLs",
              "Secure: prevent malicious URL creation",
              "Data consistency and durability",
              "Cost-effective storage and compute"
            ].map((req, i) => (
              <div key={req} className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                  {i + 1}
                </div>
                <span className="text-sm text-muted-foreground">{req}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
