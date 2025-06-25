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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">
              Trabajo Práctico N°5 - PELADO SUBIME LA NOTA
            </CardTitle>
            <CardDescription className="text-center text-lg">
              Sistema que te rompe la Cola EN la Playa de Estacionamiento
            </CardDescription>
          </CardHeader>
        </Card>

        <SimulationControls onSimulationComplete={handleSimulationComplete} loading={loading} setLoading={setLoading} />

        {simulationData.length > 0 && (
          <SimulationTable
            data={simulationData}
            currentRange={currentRange}
            totalEvents={totalEvents}
            onRangeChange={handleRangeChange}
          />
        )}
      </div>
    </div>
  )
}
