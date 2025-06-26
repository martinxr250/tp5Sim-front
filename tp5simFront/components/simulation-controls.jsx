"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Play, AlertCircle } from "lucide-react"
import { simulationService } from "../services/simulation-service"
import { LoadingModal } from "./loading-modal"

export function SimulationControls({ onSimulationComplete, loading, setLoading }) {
  const [params, setParams] = useState({
    cantidadIteraciones: 100,
    parametroT: 100,
    saltoH: 0.1,
    filaDesde: 0,
    filaHasta: 300,
  })
  const [error, setError] = useState(null)
  const [showLoadingModal, setShowLoadingModal] = useState(false)

  const handleInputChange = (field, value) => {
    setParams((prev) => ({
      ...prev,
      [field]: field === "saltoH" ? Number.parseFloat(value) : Number.parseInt(value),
    }))
    // Limpiar error cuando el usuario modifica parámetros
    if (error) setError(null)
  }

  const validateParams = () => {
    const errors = []

    if (params.cantidadIteraciones < 0) errors.push("Cantidad de iteraciones debe ser mayor a 0")
    if (params.parametroT < 1) errors.push("Parámetro T debe ser mayor a 0")
    if (params.saltoH <= 0) errors.push("Salto H debe ser mayor a 0")
    if (params.filaDesde < 0) errors.push("Fila Desde debe ser mayor a 0")
    if (params.filaHasta < params.filaDesde) errors.push("Fila Hasta debe ser mayor o igual a Fila Desde")

    return errors
  }

  const handleSimulate = async () => {
    setError(null)

    // Validar parámetros
    const validationErrors = validateParams()
    if (validationErrors.length > 0) {
      setError(`Errores de validación: ${validationErrors.join(", ")}`)
      return
    }

    setLoading(true)
    setShowLoadingModal(true)

    try {
      console.log("Iniciando simulación con parámetros:", params)

      // Asegurar un tiempo mínimo de 5 segundos para el modal
      const simulationPromise = simulationService.runSimulation(params)
      const minTimePromise = new Promise((resolve) => setTimeout(resolve, 5000))

      const [data] = await Promise.all([simulationPromise, minTimePromise])

      if (!data || !Array.isArray(data)) {
        throw new Error("La respuesta del servidor no es válida")
      }

      console.log("Simulación completada exitosamente:", data.length, "eventos")

      // Pequeña pausa adicional para mostrar el 100%
      await new Promise((resolve) => setTimeout(resolve, 500))

      setShowLoadingModal(false)
      onSimulationComplete(data)
      setError(null)
    } catch (error) {
      console.error("Error en la simulación:", error)
      setShowLoadingModal(false)

      let errorMessage = "Error desconocido al ejecutar la simulación"

      if (error.message.includes("HTTP 400")) {
        errorMessage = "Error 400: Parámetros inválidos. Verifique que todos los valores sean correctos."
      } else if (error.message.includes("HTTP 404")) {
        errorMessage = "Error 404: Endpoint no encontrado. Verifique la URL del servidor."
      } else if (error.message.includes("HTTP 500")) {
        errorMessage = "Error 500: Error interno del servidor."
      } else if (error.message.includes("Failed to fetch")) {
        errorMessage =
          "Error de conexión: No se puede conectar al servidor. Verifique que el servidor esté ejecutándose."
      } else {
        errorMessage = error.message
      }

      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="w-5 h-5" />
            Parámetros de Simulación
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-4" variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="cantidadIteraciones">Cantidad de Iteraciones</Label>
              <Input
                id="cantidadIteraciones"
                type="number"
                value={params.cantidadIteraciones}
                onChange={(e) => handleInputChange("cantidadIteraciones", e.target.value)}
                min="1"
                max="10000"
                disabled={loading}
              />
              <p className="text-xs text-gray-500">Ejemplo: 5, 100, 1000</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="parametroT">Parámetro T</Label>
              <Input
                id="parametroT"
                type="number"
                value={params.parametroT}
                onChange={(e) => handleInputChange("parametroT", e.target.value)}
                min="1"
                disabled={loading}
              />
              <p className="text-xs text-gray-500">Ejemplo: 100, 200</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="saltoH">Salto H</Label>
              <Input
                id="saltoH"
                type="number"
                step="0.1"
                value={params.saltoH}
                onChange={(e) => handleInputChange("saltoH", e.target.value)}
                min="0.1"
                disabled={loading}
              />
              <p className="text-xs text-gray-500">Ejemplo: 0.1, 0.5, 1.0</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="filaDesde">Fila Desde</Label>
              <Input
                id="filaDesde"
                type="number"
                value={params.filaDesde}
                onChange={(e) => handleInputChange("filaDesde", e.target.value)}
                min="1"
                disabled={loading}
              />
              <p className="text-xs text-gray-500">Fila inicial</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="filaHasta">Fila Hasta</Label>
              <Input
                id="filaHasta"
                type="number"
                value={params.filaHasta}
                onChange={(e) => handleInputChange("filaHasta", e.target.value)}
                min="1"
                disabled={loading}
              />
              <p className="text-xs text-gray-500">Fila final</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={handleSimulate} disabled={loading} className="flex-1" size="lg">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Ejecutando Simulación...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Ejecutar Simulación
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                setParams({
                  cantidadIteraciones: 100,
                  parametroT: 100,
                  saltoH: 0.1,
                  filaDesde: 0,
                  filaHasta: 300,
                })
                setError(null)
              }}
              disabled={loading}
            >
              Restaurar Valores por Defecto
            </Button>
          </div>

        </CardContent>
      </Card>

      <LoadingModal isOpen={showLoadingModal} onClose={() => setShowLoadingModal(false)} simulationParams={params} />
    </>
  )
}
