"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronLeft, ChevronRight, Eye, Car, Clock, MapPin, TrendingUp } from "lucide-react"
import { EventDetailsModal } from "./event-details-modal"

export function SimulationTable({ data, currentRange, totalEvents, onRangeChange }) {
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const currentData = data.slice(currentRange.start, currentRange.end)
  const canGoPrevious = currentRange.start > 0
  const canGoNext = currentRange.end < totalEvents

  const handlePrevious = () => {
    if (canGoPrevious) {
      const newStart = Math.max(0, currentRange.start - 300)
      onRangeChange(newStart)
    }
  }

  const handleNext = () => {
    if (canGoNext) {
      const newStart = currentRange.start + 300
      onRangeChange(newStart)
    }
  }

  const handleViewDetails = (event) => {
    setSelectedEvent(event)
    setShowModal(true)
  }

  const getEventBadgeColor = (evento) => {
    switch (evento) {
      case "LLEGADA_AUTO":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "SALIDA_AUTO":
        return "bg-green-100 text-green-800 border-green-200"
      case "FIN_COBRO":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getAutoTypeBadge = (tipo) => {
    if (!tipo) return null
    return tipo === "GRANDE"
      ? "bg-red-100 text-red-800 border-red-200"
      : "bg-yellow-100 text-yellow-800 border-yellow-200"
  }

  const formatNumber = (num) => {
    if (num === null || num === undefined) return "-"
    return typeof num === "number" ? num.toFixed(3) : num
  }

  return (
    <>
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Car className="w-6 h-6 text-blue-600" />
              Eventos de Simulación
              <Badge variant="outline" className="ml-2">
                {totalEvents} eventos totales
              </Badge>
            </CardTitle>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full border">
                Mostrando {currentRange.start + 1} - {currentRange.end} de {totalEvents}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevious}
                  disabled={!canGoPrevious}
                  className="shadow-sm"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Anterior
                </Button>
                <Button variant="outline" size="sm" onClick={handleNext} disabled={!canGoNext} className="shadow-sm">
                  Siguiente
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50">
                  <TableHead className="font-semibold text-gray-700 w-20">Iter.</TableHead>
                  <TableHead className="font-semibold text-gray-700">Evento</TableHead>
                  <TableHead className="font-semibold text-gray-700">Reloj</TableHead>
                  <TableHead className="font-semibold text-gray-700">Tipo Auto</TableHead>
                  <TableHead className="font-semibold text-gray-700">T. Est.</TableHead>
                  <TableHead className="font-semibold text-gray-700">Cola</TableHead>
                  <TableHead className="font-semibold text-gray-700">Sectores</TableHead>
                  <TableHead className="font-semibold text-gray-700">Runge-Kutta</TableHead>
                  <TableHead className="font-semibold text-gray-700">Ganancia</TableHead>
                  <TableHead className="font-semibold text-gray-700 w-24">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.map((event, index) => {
                  const sectoresLibres = event.sectorDTOS?.filter((s) => s.esLibre).length || 0
                  const totalSectores = event.sectorDTOS?.length || 0
                  const hasRungeKutta = event.valorRungeKutta !== null && event.valorRungeKutta !== undefined

                  return (
                    <TableRow key={index} className="hover:bg-blue-50/30 transition-colors border-b border-gray-100">
                      <TableCell className="font-mono font-medium text-blue-600">#{event.nroIteracion}</TableCell>

                      <TableCell>
                        <Badge className={getEventBadgeColor(event.evento)} variant="outline">
                          {event.evento}
                        </Badge>
                      </TableCell>

                      <TableCell className="font-mono text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-gray-400" />
                          {formatNumber(event.reloj)}
                        </div>
                      </TableCell>

                      <TableCell>
                        {event.tipoAuto && (
                          <Badge className={getAutoTypeBadge(event.tipoAuto)} variant="outline">
                            {event.tipoAuto}
                          </Badge>
                        )}
                      </TableCell>

                      <TableCell className="font-mono text-sm">{event.tiempoEstacionamiento || "-"}</TableCell>

                      <TableCell className="text-center">
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          {event.autosEnCola}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <span className="text-sm font-medium">
                            {sectoresLibres}/{totalSectores}
                          </span>
                          <div
                            className="w-2 h-2 rounded-full ml-1"
                            style={{ backgroundColor: sectoresLibres > totalSectores / 2 ? "#10b981" : "#ef4444" }}
                          />
                        </div>
                      </TableCell>

                      <TableCell>
                        {hasRungeKutta ? (
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3 text-purple-500" />
                            <span className="font-mono text-sm text-purple-700">
                              {formatNumber(event.valorRungeKutta)}
                            </span>
                            {event.matriz && event.matriz.length > 0 && (
                              <Badge
                                variant="outline"
                                className="ml-1 text-xs bg-orange-50 text-orange-700 border-orange-200"
                              >
                                Matriz
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </TableCell>

                      <TableCell className="font-mono text-sm">
                        {event.acumuladorGanancia !== null && event.acumuladorGanancia !== undefined
                          ? `$${formatNumber(event.acumuladorGanancia)}`
                          : "-"}
                      </TableCell>

                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(event)}
                          className="shadow-sm hover:shadow-md transition-shadow"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Ver
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <EventDetailsModal event={selectedEvent} isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  )
}
