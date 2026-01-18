"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Endpoint {
  method: "GET" | "POST" | "PUT" | "DELETE"
  path: string
  description: string
  request?: {
    headers?: Record<string, string>
    body?: object
    params?: Record<string, string>
  }
  response: {
    status: number
    body: object
  }
  rateLimitPerMinute: number
}

const endpoints: Endpoint[] = [
  {
    method: "POST",
    path: "/api/v1/shorten",
    description: "Create a new shortened URL",
    request: {
      headers: { "Authorization": "Bearer <api_key>", "Content-Type": "application/json" },
      body: {
        original_url: "https://example.com/very/long/url/path",
        custom_alias: "my-link",
        expires_in: "30d"
      }
    },
    response: {
      status: 201,
      body: {
        short_url: "https://short.ly/abc123",
        short_code: "abc123",
        original_url: "https://example.com/very/long/url/path",
        expires_at: "2024-02-15T00:00:00Z",
        created_at: "2024-01-15T12:00:00Z"
      }
    },
    rateLimitPerMinute: 100
  },
  {
    method: "GET",
    path: "/:shortCode",
    description: "Redirect to original URL (302 Found)",
    request: {
      params: { shortCode: "abc123" }
    },
    response: {
      status: 302,
      body: {
        headers: { "Location": "https://example.com/very/long/url/path" }
      }
    },
    rateLimitPerMinute: 10000
  },
  {
    method: "GET",
    path: "/api/v1/urls/:shortCode",
    description: "Get URL details and metadata",
    request: {
      headers: { "Authorization": "Bearer <api_key>" },
      params: { shortCode: "abc123" }
    },
    response: {
      status: 200,
      body: {
        short_code: "abc123",
        original_url: "https://example.com/very/long/url/path",
        click_count: 1542,
        created_at: "2024-01-15T12:00:00Z",
        expires_at: "2024-02-15T00:00:00Z",
        is_active: true
      }
    },
    rateLimitPerMinute: 500
  },
  {
    method: "GET",
    path: "/api/v1/urls/:shortCode/analytics",
    description: "Get detailed analytics for a URL",
    request: {
      headers: { "Authorization": "Bearer <api_key>" },
      params: { shortCode: "abc123" }
    },
    response: {
      status: 200,
      body: {
        total_clicks: 1542,
        unique_visitors: 1203,
        by_country: { "US": 450, "UK": 320, "DE": 180 },
        by_device: { "mobile": 890, "desktop": 602, "tablet": 50 },
        by_referrer: { "twitter.com": 520, "direct": 430 },
        clicks_by_day: [{ "date": "2024-01-15", "clicks": 234 }]
      }
    },
    rateLimitPerMinute: 100
  },
  {
    method: "DELETE",
    path: "/api/v1/urls/:shortCode",
    description: "Deactivate a shortened URL",
    request: {
      headers: { "Authorization": "Bearer <api_key>" },
      params: { shortCode: "abc123" }
    },
    response: {
      status: 200,
      body: {
        message: "URL deactivated successfully",
        short_code: "abc123"
      }
    },
    rateLimitPerMinute: 50
  }
]

const methodColors: Record<string, string> = {
  GET: "bg-chart-2 text-background",
  POST: "bg-primary text-primary-foreground",
  PUT: "bg-chart-3 text-background",
  DELETE: "bg-destructive text-destructive-foreground"
}

export function APIDesign() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint>(endpoints[0])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <Badge variant="outline" className="text-primary border-primary">
          API Design
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl text-balance">
          RESTful API Endpoints
        </h1>
        <p className="text-muted-foreground max-w-2xl text-pretty leading-relaxed">
          Well-designed REST API with proper HTTP methods, status codes, and rate limiting for URL shortening operations.
        </p>
      </div>

      {/* Endpoints List */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Endpoints</h3>
          {endpoints.map((endpoint, index) => (
            <button
              key={index}
              onClick={() => setSelectedEndpoint(endpoint)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg border-2 p-4 text-left transition-all",
                selectedEndpoint === endpoint
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card hover:border-primary/50"
              )}
            >
              <Badge className={cn("font-mono text-xs", methodColors[endpoint.method])}>
                {endpoint.method}
              </Badge>
              <div className="flex-1 min-w-0">
                <code className="text-sm font-mono text-foreground truncate block">
                  {endpoint.path}
                </code>
                <p className="text-xs text-muted-foreground truncate">
                  {endpoint.description}
                </p>
              </div>
              <Badge variant="outline" className="text-xs shrink-0">
                {endpoint.rateLimitPerMinute}/min
              </Badge>
            </button>
          ))}
        </div>

        {/* Endpoint Details */}
        <Card className="bg-card border-border h-fit sticky top-6">
          <CardHeader className="border-b border-border">
            <div className="flex items-center gap-3">
              <Badge className={cn("font-mono", methodColors[selectedEndpoint.method])}>
                {selectedEndpoint.method}
              </Badge>
              <code className="text-lg font-mono text-foreground">{selectedEndpoint.path}</code>
            </div>
            <CardDescription>{selectedEndpoint.description}</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {/* Request */}
            {selectedEndpoint.request && (
              <div className="border-b border-border p-4">
                <h4 className="text-sm font-medium text-foreground mb-3">Request</h4>
                {selectedEndpoint.request.headers && (
                  <div className="mb-3">
                    <p className="text-xs text-muted-foreground mb-1">Headers</p>
                    <div className="rounded-lg bg-secondary/50 p-3 overflow-x-auto">
                      <pre className="text-xs font-mono text-foreground">
                        {JSON.stringify(selectedEndpoint.request.headers, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
                {selectedEndpoint.request.body && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Body</p>
                    <div className="rounded-lg bg-secondary/50 p-3 overflow-x-auto">
                      <pre className="text-xs font-mono text-foreground">
                        {JSON.stringify(selectedEndpoint.request.body, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Response */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-foreground">Response</h4>
                <Badge variant="outline" className="font-mono">
                  {selectedEndpoint.response.status}
                </Badge>
              </div>
              <div className="rounded-lg bg-secondary/50 p-3 overflow-x-auto">
                <pre className="text-xs font-mono text-foreground">
                  {JSON.stringify(selectedEndpoint.response.body, null, 2)}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Error Handling */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Error Response Format</CardTitle>
          <CardDescription>Standardized error responses for better debugging</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-lg bg-secondary/50 p-4 overflow-x-auto">
              <p className="text-xs text-muted-foreground mb-2">400 Bad Request</p>
              <pre className="text-xs font-mono text-foreground">
{`{
  "error": {
    "code": "INVALID_URL",
    "message": "The provided URL is malformed",
    "details": {
      "field": "original_url",
      "value": "not-a-valid-url"
    }
  },
  "request_id": "req_abc123"
}`}
              </pre>
            </div>
            <div className="rounded-lg bg-secondary/50 p-4 overflow-x-auto">
              <p className="text-xs text-muted-foreground mb-2">429 Rate Limited</p>
              <pre className="text-xs font-mono text-foreground">
{`{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests",
    "retry_after": 60
  },
  "headers": {
    "X-RateLimit-Limit": "100",
    "X-RateLimit-Remaining": "0",
    "X-RateLimit-Reset": "1705320000"
  }
}`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* HTTP Status Codes */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { code: "200", label: "OK", description: "Successful request" },
          { code: "201", label: "Created", description: "URL created successfully" },
          { code: "302", label: "Found", description: "Redirect to original URL" },
          { code: "400", label: "Bad Request", description: "Invalid input data" },
          { code: "401", label: "Unauthorized", description: "Invalid API key" },
          { code: "404", label: "Not Found", description: "URL not found" },
          { code: "429", label: "Too Many Requests", description: "Rate limit exceeded" },
          { code: "500", label: "Server Error", description: "Internal error" }
        ].map((status) => (
          <Card key={status.code} className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <code className={cn(
                  "text-lg font-mono font-bold",
                  status.code.startsWith("2") && "text-primary",
                  status.code.startsWith("3") && "text-chart-2",
                  status.code.startsWith("4") && "text-chart-3",
                  status.code.startsWith("5") && "text-destructive"
                )}>
                  {status.code}
                </code>
                <div>
                  <p className="text-sm font-medium text-foreground">{status.label}</p>
                  <p className="text-xs text-muted-foreground">{status.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
