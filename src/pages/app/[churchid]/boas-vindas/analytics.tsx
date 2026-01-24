"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import VisitorsAnalytics from "@/components/BoasVindas/visitantes";
import ChurchAnalytics from "@/components/BoasVindas/apelo";

export default function BoasVindasAnalytics() {
  const [activeTab, setActiveTab] = useState<"visitantes" | "apelo">("visitantes");

  return (
    <div className="min-h-screen bg-background">
      <main className="container px-2 py-2 mx-auto">
        <header className="border-b bg-card">
          <div className="px-2 py-2 mx-auto">
            {/* Top Section (back button + label + icon) */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/app">
                  <Button variant="ghost" size="icon">
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                </Link>

                <div>
                  <h1 className="text-2xl font-bold text-foreground">Análise</h1>
                </div>
              </div>

              <BarChart3 className="w-8 h-8 text-primary" />
            </div>
            <div className="flex items-end gap-1 mt-4">
              {/* TAB: Visitantes */}
              <button
                onClick={() => setActiveTab("visitantes")}
                className={cn(
                  "px-5 py-2 rounded-t-xl w-full text-sm font-medium border border-b-0 transition-all",
                  activeTab === "visitantes"
                    ? "bg-background shadow-sm text-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/70",
                )}
              >
                Visitantes
              </button>

              {/* TAB: Apelo */}
              <button
                onClick={() => setActiveTab("apelo")}
                className={cn(
                  "px-5 py-2 rounded-t-xl text-sm w-full font-medium border border-b-0 transition-all",
                  activeTab === "apelo"
                    ? "bg-background shadow-sm text-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/70",
                )}
              >
                Aceitou Jesus
              </button>

              {/* line */}
              <div className="flex-1 border-b"></div>
            </div>
          </div>
        </header>
        <div className="">
          {activeTab === "visitantes" && <VisitorsAnalytics />}

          {activeTab === "apelo" && <ChurchAnalytics/>}
                  </div>
      </main>
    </div>
  );
}
