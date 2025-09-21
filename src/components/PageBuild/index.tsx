"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Página de "Em Construção" (Coming Soon)
// - Usa Tailwind para layout/estilização
// - Usa componentes shadcn/ui (Button, Card, Input, Label)
// - Exporta um componente React padrão para pré-visualização

export default function ComingSoonPage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  function handleSubscribe(e:any) {
    e.preventDefault()
    // aqui normalmente você chamaria uma API. Estamos simulando sucesso.
    setSubmitted(true)
    setTimeout(() => setEmail(""), 1000)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-6">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left - Texto e formulário */}
        <section className="px-6 py-8">
          <motion.div
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-3 bg-emerald-100/60 text-emerald-800 rounded-full px-3 py-1 text-sm font-medium w-max">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m4 4h-1v-4a1 1 0 00-1-1H9" />
              </svg>
              Em construção
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
              Estamos preparando algo incrível.
            </h1>

            <p className="text-slate-600 max-w-xl">
              Voltamos em breve com uma nova experiência — mais rápida, moderna e focada em entregar valor.
              Inscreva-se para receber atualizações e acesso antecipado quando lançarmos.
            </p>

            <form onSubmit={handleSubscribe} className="mt-4 w-full max-w-lg">
              <Card className="p-4 shadow-sm">
                <CardContent className="grid gap-3 md:grid-cols-3 items-center">
                  <div className="md:col-span-2">
                    <Label htmlFor="email" className="sr-only">Seu email</Label>
                    <Input
                      id="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      type="email"
                      className="w-full"
                    />
                  </div>

                  <div className="flex items-center justify-end md:justify-center">
                    <Button type="submit" className="w-full md:w-auto">
                      {submitted ? "Obrigado!" : "Me avisem"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <p className="mt-2 text-xs text-slate-500">Prometemos não enviar spam — apenas novidades relevantes.</p>
            </form>

            <div className="mt-6 flex gap-4 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <strong className="w-20">Lançamento</strong>
                <span>Q1 • 2026</span>
              </div>
              <div className="flex items-center gap-2">
                <strong className="w-20">Contato</strong>
                <a href="mailto:oi@seudominio.com" className="underline">brunoorosco@gamil.com</a>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Right - Ilustração / cartão de progresso */}
        <aside className="px-6 py-8 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="w-full max-w-md"
          >
            <div className="bg-white border rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Progresso do projeto</h3>
                  <p className="text-sm text-slate-500">Estamos finalizando os últimos detalhes.</p>
                </div>
                <div className="text-xs text-slate-400">v0.9.2</div>
              </div>

              <div className="mt-6">
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: "72%" }} />
                </div>
                <div className="mt-3 flex justify-between text-xs text-slate-500">
                  <span>Design</span>
                  <span>72%</span>
                </div>

                <ul className="mt-5 space-y-3">
                  <li className="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-1 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <div className="text-sm font-medium text-slate-900">Design pronto</div>
                      <div className="text-xs text-slate-500">Layouts, tipografia e identidade visual.</div>
                    </div>
                  </li>

                  <li className="flex items-start gap-3 opacity-80">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-1 text-slate-300" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 2a8 8 0 108 8 8 8 0 00-8-8z" />
                    </svg>
                    <div>
                      <div className="text-sm font-medium text-slate-900">Integrações</div>
                      <div className="text-xs text-slate-500">Configuração de APIs e webhooks.</div>
                    </div>
                  </li>

                  <li className="flex items-start gap-3 opacity-60">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-1 text-slate-300" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 2a8 8 0 108 8 8 8 0 00-8-8z" />
                    </svg>
                    <div>
                      <div className="text-sm font-medium text-slate-900">Documentação</div>
                      <div className="text-xs text-slate-500">Guia rápido e API docs.</div>
                    </div>
                  </li>
                </ul>

                <div className="mt-6 flex gap-3">
                  <Button variant="ghost" className="flex-1">Ver roadmap</Button>
                  <Button className="flex-1">Entrar em contato</Button>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center text-xs text-slate-400">© {new Date().getFullYear()} Orostec — Todos os direitos reservados</div>
          </motion.div>
        </aside>
      </div>

      {/* Fundo decorativo */}
      <svg className="pointer-events-none fixed right-0 bottom-0 opacity-30 w-96 h-96" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="g1" x1="0" x2="1">
            <stop offset="0%" stopColor="#a7f3d0" />
            <stop offset="100%" stopColor="#c7d2fe" />
          </linearGradient>
        </defs>
        <circle cx="300" cy="300" r="200" fill="url(#g1)" />
      </svg>
    </main>
  )
}
