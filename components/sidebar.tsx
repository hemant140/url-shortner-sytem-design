"use client"

import { cn } from "@/lib/utils"
import { Section } from "@/app/page"
import {
  LayoutDashboard,
  Database,
  Globe,
  TrendingUp,
  Layers,
  GitBranch,
  Calculator,
  Lightbulb,
  Link2,
  Menu,
  X
} from "lucide-react"
import { useState } from "react"
import { Button } from "./ui/button"

interface SidebarProps {
  activeSection: Section
  setActiveSection: (section: Section) => void
}

const sections = [
  { id: "overview" as Section, label: "Architecture Overview", icon: LayoutDashboard },
  { id: "database" as Section, label: "Database Schema", icon: Database },
  { id: "api" as Section, label: "API Design", icon: Globe },
  { id: "scalability" as Section, label: "Scalability", icon: TrendingUp },
  { id: "caching" as Section, label: "Caching Strategy", icon: Layers },
  { id: "dataflow" as Section, label: "Data Flow", icon: GitBranch },
  { id: "estimations" as Section, label: "Estimations", icon: Calculator },
  { id: "tips" as Section, label: "Interview Tips", icon: Lightbulb },
]

export function Sidebar({ activeSection, setActiveSection }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-72 border-r border-border bg-card transition-transform duration-300 lg:static lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-border p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Link2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold text-foreground">URL Shortener</h1>
              <p className="text-xs text-muted-foreground">System Design</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {sections.map((section) => {
              const Icon = section.icon
              const isActive = activeSection === section.id
              return (
                <button
                  key={section.id}
                  onClick={() => {
                    setActiveSection(section.id)
                    setIsOpen(false)
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <Icon className={cn("h-4 w-4", isActive && "text-primary")} />
                  {section.label}
                </button>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-border p-4">
            <div className="rounded-lg bg-secondary/50 p-4">
              <p className="text-xs text-muted-foreground">
                Interactive system design showcase for senior engineers (4+ YoE)
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
