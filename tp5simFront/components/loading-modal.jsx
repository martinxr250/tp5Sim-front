"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Car, Clock, TrendingUp } from "lucide-react"

export function LoadingModal({ isOpen, onClose, simulationParams }) {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [timeElapsed, setTimeElapsed] = useState(0)

  const steps = [
    { icon: Car, text: "Inicializando simulación...", duration: 1000 },
    { icon: TrendingUp, text: "Generando números aleatorios...", duration: 1500 },
    { icon: Clock, text: "Calculando eventos de llegada...", duration: 1000 },
    { icon: Car, text: "Procesando cola de estacionamiento...", duration: 1500 },
    { icon: TrendingUp, text: "Aplicando método Runge-Kutta...", duration: 1000 },
  ]

  useEffect(() => {
    if (!isOpen) {
      setProgress(0)
      setCurrentStep(0)
      setTimeElapsed(0)
      return
    }

    // Timer para el tiempo transcurrido
    const timeInterval = setInterval(() => {
      setTimeElapsed((prev) => prev + 100)
    }, 100)

    // Progreso de los pasos
    let stepTimeout
    let progressInterval

    const runSteps = () => {
      let totalTime = 0
      let currentStepIndex = 0

      const executeStep = () => {
        if (currentStepIndex >= steps.length) {
          // Completar al 100% y mantener el último paso
          setProgress(100)
          return
        }

        setCurrentStep(currentStepIndex)
        const step = steps[currentStepIndex]
        const stepDuration = step.duration

        // Progreso gradual durante el paso
        let stepProgress = 0
        const stepProgressInterval = setInterval(() => {
          stepProgress += 2
          const overallProgress = currentStepIndex * 20 + (stepProgress * 20) / 100
          setProgress(Math.min(overallProgress, 95)) // No llegar al 100% hasta el final
        }, stepDuration / 50)

        stepTimeout = setTimeout(() => {
          clearInterval(stepProgressInterval)
          currentStepIndex++
          totalTime += stepDuration
          executeStep()
        }, stepDuration)
      }

      executeStep()
    }

    runSteps()

    return () => {
      clearInterval(timeInterval)
      clearTimeout(stepTimeout)
      if (progressInterval) clearInterval(progressInterval)
    }
  }, [isOpen])

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000)
    const milliseconds = Math.floor((ms % 1000) / 100)
    return `${seconds}.${milliseconds}s`
  }

  const getCurrentStepInfo = () => {
    if (currentStep < steps.length) {
      return steps[currentStep]
    }
    return steps[steps.length - 1]
  }

  const stepInfo = getCurrentStepInfo()
  const StepIcon = stepInfo.icon

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" hideCloseButton>
        <div className="flex flex-col items-center space-y-6 py-6">
          {/* Spinner Principal */}
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <StepIcon className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          {/* Título */}
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold text-gray-900">Ejecutando Simulación</h3>
            <p className="text-sm text-gray-600">
              Procesando {simulationParams?.cantidadIteraciones || "N/A"} iteraciones...
            </p>
          </div>

          {/* Progreso */}
          <div className="w-full space-y-3">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progreso</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="w-full h-2" />
          </div>

          {/* Paso Actual */}
          <Card className="w-full">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{stepInfo.text}</p>
                  <p className="text-xs text-gray-500">Tiempo transcurrido: {formatTime(timeElapsed)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Parámetros de la Simulación */}
          {simulationParams && (
            <Card className="w-full">
              <CardContent className="p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Parámetros de Simulación</h4>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <div>
                    Iteraciones: <span className="font-mono">{simulationParams.cantidadIteraciones}</span>
                  </div>
                  <div>
                    Parámetro T: <span className="font-mono">{simulationParams.parametroT}</span>
                  </div>
                  <div>
                    Salto H: <span className="font-mono">{simulationParams.saltoH}</span>
                  </div>
                  <div>
                    Rango:{" "}
                    <span className="font-mono">
                      {simulationParams.filaDesde}-{simulationParams.filaHasta}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Mensaje de tiempo extendido */}
          {timeElapsed > 8000 && (
            <div className="w-full p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-yellow-600" />
                <p className="text-sm text-yellow-800">
                  La simulación está tomando más tiempo del esperado. Esto es normal para simulaciones complejas.
                </p>
              </div>
            </div>
          )}

          {/* Mensaje de tiempo muy extendido */}
          {timeElapsed > 15000 && (
            <div className="w-full p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-orange-600" />
                <p className="text-sm text-orange-800">
                  Procesando simulación avanzada. Por favor, espere mientras se completan los cálculos.
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
