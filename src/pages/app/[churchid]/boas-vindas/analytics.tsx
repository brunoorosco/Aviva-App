"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import VisitorsAnalytics from "@/components/BoasVindas/visitantes";

export default function BoasVindasAnalytics() {
  const [activeTab, setActiveTab] = useState<"visitantes" | "apelo">("visitantes");

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-4">
        <header className="border-b bg-card">
          <div className="px-4 py-4 mx-auto">
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
            <div className="mt-4 flex gap-1 items-end">
              {/* TAB: Visitantes */}
              <button
                onClick={() => setActiveTab("visitantes")}
                className={cn(
                  "px-5 py-2 rounded-t-xl w-full text-sm font-medium border border-b-0 transition-all",
                  activeTab === "visitantes"
                    ? "bg-background shadow-sm text-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/70"
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
                    : "bg-muted text-muted-foreground hover:bg-muted/70"
                )}
              >
                Aceitou Jesus
              </button>

              {/* line */}
              <div className="flex-1 border-b"></div>
            </div>
          </div>
        </header>
        <div className="mt-6">
          {activeTab === "visitantes" && <VisitorsAnalytics />}

          {activeTab === "apelo" && (
            <div>
              {/* Conteúdo da aba apelo */}
              <p className="text-muted-foreground">Em Construção</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
