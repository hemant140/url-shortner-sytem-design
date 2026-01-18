"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Lightbulb,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Target
} from "lucide-react"

export function InterviewTips() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <Badge variant="outline" className="text-primary border-primary">
          Interview Tips
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl text-balance">
          System Design Interview Guide
        </h1>
        <p className="text-muted-foreground max-w-2xl text-pretty leading-relaxed">
          Key talking points, common questions, and strategies for acing the URL shortener system design interview.
        </p>
      </div>

      {/* Timeline */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            45-Minute Interview Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { time: "0-5 min", phase: "Requirements Clarification", color: "bg-chart-2", tasks: ["Ask about scale", "Clarify features", "Confirm constraints"] },
              { time: "5-10 min", phase: "Estimations", color: "bg-chart-3", tasks: ["Calculate QPS", "Estimate storage", "Bandwidth needs"] },
              { time: "10-25 min", phase: "High-Level Design", color: "bg-primary", tasks: ["Draw architecture", "Explain components", "Discuss data flow"] },
              { time: "25-40 min", phase: "Deep Dive", color: "bg-chart-4", tasks: ["Database schema", "Caching strategy", "Scalability patterns"] },
              { time: "40-45 min", phase: "Wrap Up", color: "bg-chart-5", tasks: ["Trade-offs", "Future improvements", "Q&A"] }
            ].map((item, index) => (
              <div key={item.time} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-4 h-4 rounded-full ${item.color}`} />
                  {index < 4 && <div className="w-0.5 h-12 bg-border" />}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="outline" className="font-mono">{item.time}</Badge>
                    <h3 className="font-semibold text-foreground">{item.phase}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.tasks.map((task) => (
                      <span key={task} className="text-xs bg-secondary/50 text-muted-foreground px-2 py-1 rounded">
                        {task}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Common Questions */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Common Interview Questions
          </CardTitle>
          <CardDescription>Prepare answers for these frequently asked questions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            {
              q: "How do you generate unique short codes?",
              a: "Base62 encoding of auto-increment ID, MD5 hash truncation, or distributed ID generator like Snowflake. Discuss trade-offs of each."
            },
            {
              q: "How do you handle hash collisions?",
              a: "Append random suffix, retry with different hash, or use bloom filter to check existence before DB query."
            },
            {
              q: "How do you scale to billions of URLs?",
              a: "Database sharding by short_code hash, read replicas, Redis cluster for caching, CDN for global distribution."
            },
            {
              q: "How do you ensure high availability?",
              a: "Multiple availability zones, database replication, automatic failover, circuit breakers, graceful degradation."
            },
            {
              q: "How do you handle hot URLs (viral links)?",
              a: "Multi-tier caching (edge, regional, origin), rate limiting, load shedding, and pre-warming cache for known events."
            },
            {
              q: "How do you track analytics without affecting latency?",
              a: "Async processing via message queue (Kafka), batch writes, separate analytics database, eventual consistency."
            }
          ].map((item) => (
            <div key={item.q} className="rounded-lg border border-border bg-secondary/20 p-4">
              <h4 className="font-medium text-foreground mb-2">{item.q}</h4>
              <p className="text-sm text-muted-foreground">{item.a}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Do's and Don'ts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Do's
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              "Start with clarifying questions",
              "Write down estimations step-by-step",
              "Draw diagrams while explaining",
              "Discuss trade-offs for each decision",
              "Consider failure scenarios",
              "Mention monitoring and alerting",
              "Ask for feedback during the interview"
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-sm text-muted-foreground">{item}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-chart-3" />
              Don'ts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              "Jump into solution without requirements",
              "Over-engineer for small scale",
              "Ignore the interviewer's hints",
              "Focus only on happy path",
              "Skip capacity estimation",
              "Use unfamiliar technologies",
              "Forget about security considerations"
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-chart-3" />
                <span className="text-sm text-muted-foreground">{item}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Key Talking Points */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Key Talking Points for 4+ YoE
          </CardTitle>
          <CardDescription>Demonstrate senior-level thinking with these topics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                topic: "Operational Excellence",
                points: ["Monitoring & alerting", "Runbooks for incidents", "SLOs and error budgets", "Capacity planning"]
              },
              {
                topic: "Security",
                points: ["Rate limiting strategies", "Malware URL detection", "HTTPS everywhere", "API authentication"]
              },
              {
                topic: "Cost Optimization",
                points: ["Reserved instances", "Tiered storage (hot/cold)", "Cache eviction policies", "Right-sizing infrastructure"]
              },
              {
                topic: "Future Considerations",
                points: ["Custom domains", "Link analytics dashboard", "A/B testing features", "Enterprise features"]
              }
            ].map((item) => (
              <div key={item.topic} className="rounded-lg border border-border bg-secondary/20 p-4">
                <h4 className="font-medium text-foreground mb-3">{item.topic}</h4>
                <ul className="space-y-1">
                  {item.points.map((point) => (
                    <li key={point} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Reference */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            Quick Reference Numbers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            {[
              { label: "1 day", value: "86,400 sec" },
              { label: "1 month", value: "2.5M sec" },
              { label: "1 year", value: "31.5M sec" },
              { label: "1 KB", value: "1,024 bytes" },
              { label: "1 MB", value: "1M bytes" },
              { label: "1 GB", value: "1B bytes" },
              { label: "1 TB", value: "1T bytes" },
              { label: "Base62 (7 chars)", value: "3.5T URLs" }
            ].map((item) => (
              <div key={item.label} className="rounded-lg bg-secondary/30 p-3 text-center">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-sm font-mono font-medium text-foreground">{item.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
