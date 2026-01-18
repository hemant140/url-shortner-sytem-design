"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import {
  Calculator,
  HardDrive,
  Wifi,
  Database,
  Clock
} from "lucide-react"

export function EstimationsSection() {
  const [dailyUrls, setDailyUrls] = useState(1) // in millions
  const [readWriteRatio, setReadWriteRatio] = useState(100)
  const [retentionYears, setRetentionYears] = useState(5)

  // Calculations
  const dailyReads = dailyUrls * readWriteRatio
  const qps = Math.round((dailyUrls * 1000000) / 86400)
  const readQps = qps * readWriteRatio
  const totalUrlsInRetention = dailyUrls * 365 * retentionYears

  // Storage calculations
  const avgUrlSize = 500 // bytes (short_code + original_url + metadata)
  const storageGB = Math.round((totalUrlsInRetention * 1000000 * avgUrlSize) / (1024 * 1024 * 1024))
  const cacheGB = Math.round((dailyUrls * 30 * 1000000 * avgUrlSize) / (1024 * 1024 * 1024)) // 30 days hot cache

  // Bandwidth
  const avgResponseSize = 300 // bytes
  const dailyBandwidthGB = Math.round((dailyReads * 1000000 * avgResponseSize) / (1024 * 1024 * 1024))

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <Badge variant="outline" className="text-primary border-primary">
          Back-of-Envelope
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl text-balance">
          Capacity Estimations
        </h1>
        <p className="text-muted-foreground max-w-2xl text-pretty leading-relaxed">
          Calculate storage, bandwidth, and infrastructure requirements based on traffic assumptions.
        </p>
      </div>

      {/* Interactive Calculator */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            Capacity Calculator
          </CardTitle>
          <CardDescription>Adjust parameters to see real-time estimations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Sliders */}
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Daily URL Creates</label>
                <Badge variant="secondary" className="font-mono">{dailyUrls}M</Badge>
              </div>
              <Slider
                value={[dailyUrls]}
                onValueChange={(v) => setDailyUrls(v[0])}
                min={0.1}
                max={10}
                step={0.1}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Number of new short URLs created per day
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Read:Write Ratio</label>
                <Badge variant="secondary" className="font-mono">{readWriteRatio}:1</Badge>
              </div>
              <Slider
                value={[readWriteRatio]}
                onValueChange={(v) => setReadWriteRatio(v[0])}
                min={10}
                max={1000}
                step={10}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Redirects per URL creation (typically 100-200:1)
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Data Retention</label>
                <Badge variant="secondary" className="font-mono">{retentionYears} years</Badge>
              </div>
              <Slider
                value={[retentionYears]}
                onValueChange={(v) => setRetentionYears(v[0])}
                min={1}
                max={10}
                step={1}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                How long URLs are stored before cleanup
              </p>
            </div>
          </div>

          {/* Results */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-border bg-secondary/30 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Write QPS</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{qps.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">queries per second</p>
            </div>

            <div className="rounded-xl border border-border bg-secondary/30 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Wifi className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Read QPS</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{readQps.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">redirects per second</p>
            </div>

            <div className="rounded-xl border border-border bg-secondary/30 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Database className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Total Storage</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{storageGB.toLocaleString()} GB</p>
              <p className="text-xs text-muted-foreground">~{Math.round(storageGB / 1024)} TB</p>
            </div>

            <div className="rounded-xl border border-border bg-secondary/30 p-4">
              <div className="flex items-center gap-2 mb-2">
                <HardDrive className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Cache Size</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{cacheGB.toLocaleString()} GB</p>
              <p className="text-xs text-muted-foreground">30-day hot cache</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Calculations */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Traffic Estimation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-secondary/50 p-4 font-mono text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Daily URL creates:</span>
                <span className="text-foreground">{dailyUrls}M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Daily redirects:</span>
                <span className="text-foreground">{dailyReads}M</span>
              </div>
              <div className="border-t border-border pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Write QPS:</span>
                  <span className="text-primary">{qps.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Read QPS:</span>
                  <span className="text-primary">{readQps.toLocaleString()}</span>
                </div>
              </div>
              <div className="border-t border-border pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Peak (2x):</span>
                  <span className="text-chart-3">{(readQps * 2).toLocaleString()} QPS</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Storage Estimation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-secondary/50 p-4 font-mono text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg URL record:</span>
                <span className="text-foreground">~500 bytes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total URLs ({retentionYears}y):</span>
                <span className="text-foreground">{totalUrlsInRetention.toFixed(1)}B</span>
              </div>
              <div className="border-t border-border pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Database storage:</span>
                  <span className="text-primary">{storageGB.toLocaleString()} GB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">With replication (3x):</span>
                  <span className="text-chart-3">{(storageGB * 3).toLocaleString()} GB</span>
                </div>
              </div>
              <div className="border-t border-border pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Redis cache (30d):</span>
                  <span className="text-chart-2">{cacheGB} GB</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bandwidth */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Bandwidth Estimation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-secondary/50 p-4">
              <p className="text-xs text-muted-foreground mb-1">Incoming (Writes)</p>
              <p className="text-xl font-bold text-foreground font-mono">
                {Math.round((dailyUrls * 1000000 * 200) / (1024 * 1024 * 1024))} GB/day
              </p>
              <p className="text-xs text-muted-foreground">~200 bytes per request</p>
            </div>
            <div className="rounded-lg bg-secondary/50 p-4">
              <p className="text-xs text-muted-foreground mb-1">Outgoing (Reads)</p>
              <p className="text-xl font-bold text-foreground font-mono">
                {dailyBandwidthGB.toLocaleString()} GB/day
              </p>
              <p className="text-xs text-muted-foreground">~300 bytes per redirect</p>
            </div>
            <div className="rounded-lg bg-secondary/50 p-4">
              <p className="text-xs text-muted-foreground mb-1">Peak Bandwidth</p>
              <p className="text-xl font-bold text-foreground font-mono">
                {Math.round((dailyBandwidthGB * 2 * 8) / 86400)} Gbps
              </p>
              <p className="text-xs text-muted-foreground">2x average for peak</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Formulas */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Key Formulas for Interviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { formula: "QPS = Daily Requests / 86,400", description: "Convert daily to per-second" },
              { formula: "Storage = URLs × Avg Size × Retention", description: "Total storage needed" },
              { formula: "Servers = Peak QPS / Capacity per Server", description: "Number of servers needed" },
              { formula: "Cache Size = Hot Data % × Total Data", description: "RAM for caching" },
              { formula: "Bandwidth = QPS × Response Size", description: "Network capacity needed" },
              { formula: "Short Code Length = log₆₂(Total URLs)", description: "Minimum code length" }
            ].map((item) => (
              <div key={item.formula} className="rounded-lg bg-secondary/30 p-4">
                <code className="text-sm font-mono text-primary">{item.formula}</code>
                <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
