const API_BASE_URL = "http://localhost:8080";

export const simulationService = {
  async runSimulation({ cantidadIteraciones, parametroT, saltoH, filaDesde, filaHasta }) {
    try {
      // Asegurar que los parámetros tengan el formato correcto
      const params = {
        cantidadIteraciones: Number.parseInt(cantidadIteraciones),
        parametroT: Number.parseInt(parametroT), // Según el controller es Long, no Float
        saltoH: Number.parseFloat(saltoH),
        filaDesde: Number.parseInt(filaDesde),
        filaHasta: Number.parseInt(filaHasta),
      }

      // Construir URL con parámetros validados
      const url = `${API_BASE_URL}/simular/${params.cantidadIteraciones}/${params.parametroT}/${params.saltoH}/${params.filaDesde}/${params.filaHasta}/`

      console.log("Calling API with URL:", url)
      console.log("Parameters:", params)

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
          // Agregar headers adicionales para ngrok
          "Access-Control-Allow-Origin": "*",
        },
      })

      console.log("Response status:", response.status)
      console.log("Response headers:", response.headers)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Error response body:", errorText)
        throw new Error(`Error HTTP ${response.status}: ${errorText}`)
      }

      const data = await response.json()
      console.log("Simulation data received:", data.length, "events")
      return data
    } catch (error) {
      console.error("Error completo en simulationService.runSimulation:", error)
      throw error
    }
  },
}
