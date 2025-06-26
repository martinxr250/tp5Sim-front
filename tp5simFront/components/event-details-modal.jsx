"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Car, Clock, MapPin, Users, TrendingUp, DollarSign, Calculator } from "lucide-react"

export function EventDetailsModal({ event, isOpen, onClose }) {
  if (!event) return null

  const formatValue = (value) => {
    if (value === null || value === undefined) return "N/A"
    if (typeof value === "number") return value.toFixed(6)
    if (typeof value === "boolean") return value ? "Sí" : "No"
    return value.toString()
  }

  const getEstadoText = (esLibre) => {
    return esLibre ? "Libre" : "Ocupado"
  }

  const sectoresLibres = event.sectorDTOS?.filter((s) => s.esLibre).length || 0
  const totalSectores = event.sectorDTOS?.length || 0

  const getEventBadgeColor = (evento) => {
  if (!evento) return "bg-gray-100 text-gray-800 border-gray-200"
  if (evento.startsWith("LLEGADA_AUTO")) return "bg-blue-100 text-blue-800 border-blue-200"
  if (evento.startsWith("SALIDA_AUTO")) return "bg-green-100 text-green-800 border-green-200"
  if (evento.startsWith("FIN_COBRO")) return "bg-purple-100 text-purple-800 border-purple-200"
  return "bg-gray-100 text-gray-800 border-gray-200"
}




 const getAutoTypeBadge = (tipo) => {
  if (!tipo) return "bg-gray-100 text-gray-800"

  if (tipo === "GRANDE") {
    return "bg-red-100 text-red-800 border-red-200"
  } else if (tipo === "PEQUENIO") {
    return "bg-yellow-100 text-yellow-800 border-yellow-200"
  } else if (tipo === "UTILITARIO") {
    return "bg-green-100 text-green-800 border-green-200"
  } else {
    return "bg-gray-100 text-gray-800"
  }
}


const calcularMontoPagar = (auto) => {
  if (!auto || (auto.horaFinEstacionamiento - auto.horaInicioEstacionamiento) == null) return "N/A";

  // Tarifas por hora según el tipo de auto
  const tarifas = {
    PEQUENIO: 300,
    GRANDE: 500,
    UTILITARIO: 1000,
  };

  const tipo = auto.tipoAuto?.toUpperCase();
  const tarifaPorHora = tarifas[tipo];

  if (!tarifaPorHora) return "Tipo de auto no válido";

  // Convertimos minutos a horas
  const horas = (auto.horaFinEstacionamiento - auto.horaInicioEstacionamiento) / 60;

  // Calculamos el monto total
  const montoTotal = tarifaPorHora * horas;

  // Devolvemos el monto con dos decimales
  return montoTotal.toFixed(2);
};




  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <Car className="w-6 h-6 text-blue-600" />
            Detalles Completos del Evento
            <Badge variant="outline" className="text-lg px-3 py-1">
              Iteración #{event.nroIteracion}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información Principal del Estado */}
          <Card className="shadow-sm">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Estado del Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-semibold w-1/4">Evento</TableCell>
                    <TableCell>
                      <Badge className={getEventBadgeColor(event.evento)} variant="outline">
                        {event.evento}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold">Reloj</TableCell>
                    <TableCell className="font-mono">{formatValue(event.reloj)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Estado Playa</TableCell>
                    <TableCell>
                      <Badge variant={event.esLibre ? "default" : "destructive"}>{getEstadoText(event.esLibre)}</Badge>
                    </TableCell>
                    <TableCell className="font-semibold">Estado Ventanilla Cobro</TableCell>
                    <TableCell>
                      <Badge variant={event.estaLibre ? "default" : "destructive"}>
                        {getEstadoText(event.estaLibre)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Tipo Auto</TableCell>
                    <TableCell>
                      {event.tipoAuto ? (
                        <Badge className={getAutoTypeBadge(event.tipoAuto)} variant="outline">
                          {event.tipoAuto}
                        </Badge>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                    <TableCell className="font-semibold">Tiempo Estacionamiento</TableCell>
                    <TableCell className="font-mono">{formatValue(event.tiempoEstacionamiento)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Autos en Cola Cobro</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{event.autosEnCola}</Badge>
                    </TableCell>
                    <TableCell className="font-semibold">Autos No Atendidos</TableCell>
                    <TableCell>
                      <Badge variant="outline">{event.contadorAutosNoAtendidos}</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Valores Especiales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Runge-Kutta */}
            <Card className="shadow-sm">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  Demora Cobro (Runge-Kutta)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {event.valorRungeKutta !== null && event.valorRungeKutta !== undefined ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-mono font-bold text-purple-700 mb-2">
                        {formatValue(event.valorRungeKutta)}
                      </div>
                      <Badge className="bg-purple-100 text-purple-800">Método Runge-Kutta Aplicado</Badge>
                    </div>
                    {event.matriz && event.matriz.length > 0 && (
                      <div className="border-t pt-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-purple-700">Matriz Disponible</span>
                          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                            {event.matriz.length} pasos
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-600">
                          Ver sección "Matriz del Método Runge-Kutta" para detalles completos
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    <div className="text-2xl mb-2">-</div>
                    <Badge variant="outline">No Aplicado</Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Acumuladores */}
            <Card className="shadow-sm">
              <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-yellow-600" />
                  Acumuladores
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-semibold">Ganancia</TableCell>
                      <TableCell className="font-mono">
                        {event.acumuladorGanancia !== null && event.acumuladorGanancia !== undefined
                          ? `$${formatValue(event.acumuladorGanancia)}`
                          : "N/A"}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-semibold">Tiempo Estacionamiento Ocupacion 100%</TableCell>
                      <TableCell className="font-mono">{formatValue(event.acumuladorTiempoEstacionamiento)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Matriz Runge-Kutta */}
          {event.matriz && event.matriz.length > 0 && (
            <Card className="shadow-sm">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-orange-600" />
                  Matriz del Método Runge-Kutta
                  <Badge variant="outline" className="ml-2">
                    {event.matriz.length} iteraciones
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="mb-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <p className="text-sm text-orange-800">
                    <strong>Método Numérico:</strong> Esta matriz muestra los pasos del método Runge-Kutta aplicado para
                    calcular la demora en el cobro del sistema.
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-orange-50/50">
                        <TableHead className="font-semibold text-center">Paso</TableHead>
                        <TableHead className="font-semibold text-center">t</TableHead>
                        <TableHead className="font-semibold text-center">y(t)</TableHead>
                        <TableHead className="font-semibold text-center">k1</TableHead>
                        <TableHead className="font-semibold text-center">k2</TableHead>
                        <TableHead className="font-semibold text-center">k3</TableHead>
                        <TableHead className="font-semibold text-center">k4</TableHead>
                        <TableHead className="font-semibold text-center">t+h</TableHead>
                        <TableHead className="font-semibold text-center">y(t+h)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {event.matriz.map((fila, index) => (
                        <TableRow key={index} className={index % 2 === 0 ? "bg-orange-25" : ""}>
                          <TableCell className="text-center font-mono font-semibold text-orange-700">
                            {fila[0]}
                          </TableCell>
                          <TableCell className="text-center font-mono text-sm">
                            {typeof fila[1] === "number" ? fila[1].toFixed(6) : fila[1]}
                          </TableCell>
                          <TableCell className="text-center font-mono text-sm">
                            {typeof fila[2] === "number" ? fila[2].toFixed(6) : fila[2]}
                          </TableCell>
                          <TableCell className="text-center font-mono text-sm">
                            {typeof fila[3] === "number" ? fila[3].toFixed(6) : fila[3]}
                          </TableCell>
                          <TableCell className="text-center font-mono text-sm">
                            {typeof fila[4] === "number" ? fila[4].toFixed(6) : fila[4]}
                          </TableCell>
                          <TableCell className="text-center font-mono text-sm">
                            {typeof fila[5] === "number" ? fila[5].toFixed(6) : fila[5]}
                          </TableCell>
                          <TableCell className="text-center font-mono text-sm">
                            {typeof fila[6] === "number" ? fila[6].toFixed(6) : fila[6]}
                          </TableCell>
                          <TableCell className="text-center font-mono text-sm">
                            {typeof fila[7] === "number" ? fila[7].toFixed(6) : fila[7]}
                          </TableCell>
                          <TableCell className="text-center font-mono text-sm font-semibold text-orange-700">
                            {typeof fila[8] === "number" ? fila[8].toFixed(6) : fila[8]}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="font-semibold text-blue-800">Valor Inicial</div>
                    <div className="font-mono text-blue-700">
                      y₀ = {typeof event.matriz[0]?.[2] === "number" ? event.matriz[0][2].toFixed(6) : "N/A"}
                    </div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="font-semibold text-green-800">Valor Final</div>
                    <div className="font-mono text-green-700">
                      y_final ={" "}
                      {typeof event.matriz[event.matriz.length - 1]?.[8] === "number"
                        ? event.matriz[event.matriz.length - 1][8].toFixed(6)
                        : "N/A"}
                    </div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="font-semibold text-purple-800">Pasos Totales</div>
                    <div className="font-mono text-purple-700">{event.matriz.length}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Estado de Sectores */}
          <Card className="shadow-sm">
            <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50">
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="w-5 h-5 text-cyan-600" />
                Estado de Sectores de Estacionamiento
                <Badge variant="outline" className="ml-2">
                  {sectoresLibres}/{totalSectores} libres
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
                {event.sectorDTOS?.map((sector) => (
                  <div
                    key={sector.id}
                    className={`p-3 rounded-lg text-center text-sm font-semibold border-2 transition-all ${
                      sector.esLibre
                        ? "bg-green-50 text-green-800 border-green-200 hover:bg-green-100"
                        : "bg-red-50 text-red-800 border-red-200 hover:bg-red-100"
                    }`}
                  >
                    <div className="font-bold">S{sector.id}</div>
                    <div className="text-xs mt-1">{sector.esLibre ? "Libre" : "Ocupado"}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Autos en el Sistema */}
          <Card className="shadow-sm">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                Autos en el Sistema
                <Badge variant="outline" className="ml-2">
                  {event.autoDTOS?.length || 0} autos
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {event.autoDTOS && event.autoDTOS.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID Auto</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Sector</TableHead>
                      <TableHead>Hora Fin Estacionamiento</TableHead>
                      <TableHead>Monto a Pagar</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {event.autoDTOS.map((auto) => (
                      <TableRow key={auto.id}>
                        <TableCell className="font-mono font-semibold">#{auto.id}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700">
                            {auto.estadoAuto}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getAutoTypeBadge(auto.tipoAuto)} variant="outline">
                            {auto.tipoAuto}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary">Sector {auto.idSector}</Badge>
                        </TableCell>
                        <TableCell className="font-mono">{formatValue(auto.horaFinEstacionamiento)}</TableCell>
                        <TableCell className="font-mono font-semibold text-green-700">
                          ${calcularMontoPagar(auto, event.tiempoEstacionamiento)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Car className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No hay autos en el sistema en este momento</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
