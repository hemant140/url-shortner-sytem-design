"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { HighLevelArchitecture } from "@/components/sections/high-level-architecture"
import { DatabaseSchema } from "@/components/sections/database-schema"
import { APIDesign } from "@/components/sections/api-design"
import { ScalabilityPatterns } from "@/components/sections/scalability-patterns"
import { CachingStrategy } from "@/components/sections/caching-strategy"
import { DataFlow } from "@/components/sections/data-flow"
import { EstimationsSection } from "@/components/sections/estimations"
import { InterviewTips } from "@/components/sections/interview-tips"

export type Section = 
  | "overview"
  | "database"
  | "api"
  | "scalability"
  | "caching"
  | "dataflow"
  | "estimations"
  | "tips"

export default function SystemDesignShowcase() {
  const [activeSection, setActiveSection] = useState<Section>("overview")

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return <HighLevelArchitecture />
      case "database":
        return <DatabaseSchema />
      case "api":
        return <APIDesign />
      case "scalability":
        return <ScalabilityPatterns />
      case "caching":
        return <CachingStrategy />
      case "dataflow":
        return <DataFlow />
      case "estimations":
        return <EstimationsSection />
      case "tips":
        return <InterviewTips />
      default:
        return <HighLevelArchitecture />
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-10">
          {renderSection()}
        </div>
      </main>
    </div>
  )
}
