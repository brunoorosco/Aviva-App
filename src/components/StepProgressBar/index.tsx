"use client"

import React from "react"
import { CheckCircle2, Circle } from "lucide-react"

interface Step {
  label: string
  ok: boolean
}

interface StepProgressBarProps {
  steps: Step[]
}

export default function StepProgressBar({ steps }: StepProgressBarProps) {
  return (
    <div className="mx-auto max-w-7xl w-full flex flex-col items-center">
      <div className="relative flex items-center w-full justify-between">
        {/* Linha de fundo */}
        <div className="absolute top-1/2 left-0 right-0 h-5 bg-gray-300 -translate-y-1/2" />

        {steps.map((step, index) => (
          <div key={index} className="relative flex flex-col w-20 items-center">
            {/* Ícone do passo */}
            <div className="z-10 bg-white rounded-full p-1">
              {step.ok ? (
                <CheckCircle2 className="text-green-500 w-10 h-10" />
              ) : (
                <Circle className="text-gray-400 w-10 h-10" />
              )}
            </div>

            {/* Texto girado */}
            <span className="ml-2 mt-2 text- text-gray-600 transform  origin-top-left whitespace-nowrap">
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
