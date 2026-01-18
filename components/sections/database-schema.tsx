"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import {
  Database,
  Key,
  Link2,
  Clock,
  Hash,
  ArrowRight,
  CheckCircle2,
  XCircle
} from "lucide-react"

interface Column {
  name: string
  type: string
  constraints: string[]
  description: string
  isPrimary?: boolean
  isIndexed?: boolean
}

interface Table {
  name: string
  description: string
  columns: Column[]
}

const tables: Table[] = [
  {
    name: "urls",
    description: "Core table storing URL mappings",
    columns: [
      { name: "id", type: "BIGINT", constraints: ["PRIMARY KEY", "AUTO_INCREMENT"], description: "Unique identifier", isPrimary: true },
      { name: "short_code", type: "VARCHAR(10)", constraints: ["UNIQUE", "NOT NULL"], description: "The shortened URL code (Base62)", isIndexed: true },
      { name: "original_url", type: "TEXT", constraints: ["NOT NULL"], description: "Original long URL" },
      { name: "user_id", type: "BIGINT", constraints: ["FOREIGN KEY", "NULL"], description: "Owner of the URL (optional)", isIndexed: true },
      { name: "created_at", type: "TIMESTAMP", constraints: ["DEFAULT NOW()"], description: "Creation timestamp" },
      { name: "expires_at", type: "TIMESTAMP", constraints: ["NULL"], description: "Optional expiration time", isIndexed: true },
      { name: "is_active", type: "BOOLEAN", constraints: ["DEFAULT TRUE"], description: "Soft delete flag" },
      { name: "click_count", type: "BIGINT", constraints: ["DEFAULT 0"], description: "Total click counter" }
    ]
  },
  {
    name: "users",
    description: "User accounts for URL management",
    columns: [
      { name: "id", type: "BIGINT", constraints: ["PRIMARY KEY", "AUTO_INCREMENT"], description: "Unique user ID", isPrimary: true },
      { name: "email", type: "VARCHAR(255)", constraints: ["UNIQUE", "NOT NULL"], description: "User email", isIndexed: true },
      { name: "password_hash", type: "VARCHAR(255)", constraints: ["NOT NULL"], description: "Bcrypt hashed password" },
      { name: "api_key", type: "VARCHAR(64)", constraints: ["UNIQUE"], description: "API access key", isIndexed: true },
      { name: "tier", type: "ENUM", constraints: ["DEFAULT 'free'"], description: "Subscription tier" },
      { name: "created_at", type: "TIMESTAMP", constraints: ["DEFAULT NOW()"], description: "Account creation time" },
      { name: "rate_limit", type: "INT", constraints: ["DEFAULT 100"], description: "Requests per minute limit" }
    ]
  },
  {
    name: "analytics",
    description: "Click tracking and analytics data",
    columns: [
      { name: "id", type: "BIGINT", constraints: ["PRIMARY KEY", "AUTO_INCREMENT"], description: "Event ID", isPrimary: true },
      { name: "url_id", type: "BIGINT", constraints: ["FOREIGN KEY", "NOT NULL"], description: "Reference to URL", isIndexed: true },
      { name: "clicked_at", type: "TIMESTAMP", constraints: ["DEFAULT NOW()"], description: "Click timestamp", isIndexed: true },
      { name: "ip_address", type: "VARCHAR(45)", constraints: [], description: "Client IP (IPv4/IPv6)" },
      { name: "user_agent", type: "TEXT", constraints: [], description: "Browser user agent" },
      { name: "referrer", type: "TEXT", constraints: ["NULL"], description: "HTTP referrer" },
      { name: "country", type: "VARCHAR(2)", constraints: [], description: "GeoIP country code" },
      { name: "device_type", type: "ENUM", constraints: [], description: "mobile/desktop/tablet" }
    ]
  }
]

const shortCodeAlgorithms = [
  {
    name: "Base62 Encoding",
    description: "Convert auto-increment ID to Base62",
    pros: ["Simple implementation", "Guaranteed unique", "Sequential IDs"],
    cons: ["Predictable URLs", "Single point of failure"],
    code: `function toBase62(num: number): string {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  while (num > 0) {
    result = chars[num % 62] + result;
    num = Math.floor(num / 62);
  }
  return result || '0';
}`
  },
  {
    name: "MD5 Hash + Truncate",
    description: "Hash URL and take first 7 characters",
    pros: ["Same URL = same short code", "No DB lookup needed"],
    cons: ["Collision handling needed", "Complex collision resolution"],
    code: `function generateShortCode(url: string): string {
  const hash = crypto
    .createHash('md5')
    .update(url)
    .digest('base64');
  // Take first 7 chars, replace +/ with safe chars
  return hash.substring(0, 7)
    .replace(/\\+/g, 'A')
    .replace(/\\//g, 'B');
}`
  },
  {
    name: "Distributed Counter",
    description: "Use Zookeeper/Redis for unique IDs",
    pros: ["No single point of failure", "Horizontally scalable"],
    cons: ["Additional infrastructure", "Network latency"],
    code: `async function getNextId(): Promise<number> {
  // Redis INCR is atomic
  const id = await redis.incr('url_counter');
  
  // Or use Snowflake ID for distributed
  // timestamp + workerID + sequence
  return id;
}`
  }
]

export function DatabaseSchema() {
  const [selectedTable, setSelectedTable] = useState<Table>(tables[0])
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(0)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <Badge variant="outline" className="text-primary border-primary">
          Database Design
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl text-balance">
          Database Schema & Data Models
        </h1>
        <p className="text-muted-foreground max-w-2xl text-pretty leading-relaxed">
          Optimized database schema design for high-performance URL shortening with analytics tracking and user management.
        </p>
      </div>

      {/* Table Selection */}
      <div className="flex flex-wrap gap-3">
        {tables.map((table) => (
          <button
            key={table.name}
            onClick={() => setSelectedTable(table)}
            className={cn(
              "flex items-center gap-2 rounded-lg border-2 px-4 py-2 text-sm font-medium transition-all",
              selectedTable.name === table.name
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground hover:border-primary/50"
            )}
          >
            <Database className="h-4 w-4" />
            {table.name}
          </button>
        ))}
      </div>

      {/* Schema Visualization */}
      <Card className="bg-card border-border overflow-hidden">
        <CardHeader className="border-b border-border bg-secondary/30">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-foreground font-mono">{selectedTable.name}</CardTitle>
              <CardDescription>{selectedTable.description}</CardDescription>
            </div>
            <Badge variant="secondary">{selectedTable.columns.length} columns</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/20">
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Column</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Constraints</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {selectedTable.columns.map((column) => (
                  <tr key={column.name} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {column.isPrimary && <Key className="h-4 w-4 text-chart-5" />}
                        {column.isIndexed && !column.isPrimary && <Hash className="h-4 w-4 text-chart-2" />}
                        <code className="text-sm font-mono text-foreground">{column.name}</code>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-sm font-mono text-primary">{column.type}</code>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {column.constraints.map((constraint) => (
                          <Badge key={constraint} variant="outline" className="text-xs font-mono">
                            {constraint}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {column.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Short Code Generation */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Link2 className="h-5 w-5 text-primary" />
            Short Code Generation Algorithms
          </CardTitle>
          <CardDescription>
            Different approaches to generate unique short codes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={String(selectedAlgorithm)} onValueChange={(v) => setSelectedAlgorithm(Number(v))}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              {shortCodeAlgorithms.map((algo, i) => (
                <TabsTrigger key={i} value={String(i)} className="text-xs md:text-sm">
                  {algo.name}
                </TabsTrigger>
              ))}
            </TabsList>
            {shortCodeAlgorithms.map((algo, i) => (
              <TabsContent key={i} value={String(i)} className="space-y-4">
                <p className="text-muted-foreground">{algo.description}</p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <h4 className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      Pros
                    </h4>
                    <ul className="space-y-1">
                      {algo.pros.map((pro) => (
                        <li key={pro} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <XCircle className="h-4 w-4 text-destructive" />
                      Cons
                    </h4>
                    <ul className="space-y-1">
                      {algo.cons.map((con) => (
                        <li key={con} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="h-1.5 w-1.5 rounded-full bg-destructive" />
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="rounded-lg bg-secondary/50 p-4 overflow-x-auto">
                  <pre className="text-sm font-mono text-foreground whitespace-pre-wrap">{algo.code}</pre>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Database Selection */}
      <div className="grid gap-6 lg:grid-cols-3">
        {[
          {
            name: "PostgreSQL",
            type: "SQL",
            useCase: "ACID compliance, complex queries",
            scaling: "Read replicas, Citus for sharding",
            latency: "~5-10ms"
          },
          {
            name: "Cassandra",
            type: "NoSQL",
            useCase: "Write-heavy workloads, high availability",
            scaling: "Native horizontal scaling",
            latency: "~1-5ms"
          },
          {
            name: "DynamoDB",
            type: "NoSQL",
            useCase: "Serverless, auto-scaling",
            scaling: "Automatic partitioning",
            latency: "~1-5ms"
          }
        ].map((db) => (
          <Card key={db.name} className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-foreground text-lg">{db.name}</CardTitle>
                <Badge variant="outline">{db.type}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Best For</p>
                <p className="text-sm text-foreground">{db.useCase}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Scaling</p>
                <p className="text-sm text-foreground">{db.scaling}</p>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-sm text-foreground">{db.latency}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
