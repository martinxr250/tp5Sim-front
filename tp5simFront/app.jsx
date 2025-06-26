"use client"

import { useState } from "react"
import { SimulationControls } from "./components/simulation-controls"
import { SimulationTable } from "./components/simulation-table"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function App() {
  const [simulationData, setSimulationData] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentRange, setCurrentRange] = useState({ start: 0, end: 300 })
  const [totalEvents, setTotalEvents] = useState(0)

  const handleSimulationComplete = (data) => {
    setSimulationData(data)
    setTotalEvents(data.length)
    setCurrentRange({ start: 0, end: Math.min(300, data.length) })
  }

  const handleRangeChange = (newStart) => {
    const newEnd = Math.min(newStart + 300, totalEvents)
    setCurrentRange({ start: newStart, end: newEnd })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 lg:p-6">
      <div className="w-full max-w-none space-y-4 lg:space-y-6">
        <Card className="mx-auto max-w-4xl">
          <CardHeader>
            <CardTitle className="text-2xl sm:text-3xl font-bold text-center">
              Trabajo Práctico N°5 - Grupo 13
            </CardTitle>
            <CardDescription className="text-center text-base sm:text-lg">
              Sistema de Colas en Playa de Estacionamiento
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="mx-auto max-w-6xl">
          <SimulationControls
            onSimulationComplete={handleSimulationComplete}
            loading={loading}
            setLoading={setLoading}
          />
        </div>

        {simulationData.length > 0 && (
          <div className="w-full">
            <SimulationTable
              data={simulationData}
              currentRange={currentRange}
              totalEvents={totalEvents}
              onRangeChange={handleRangeChange}
            />
          </div>
        )}
      </div>
    </div>
  )
}
