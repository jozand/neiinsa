import { Cliente, Departamento, Municipio, Parametro, Ventas, VentasDetalle, Marcas, Productos } from "../models/index.js"
import { formatoFechaIso, formatoMoneda, formatoFechaVista } from "../utils/formatos.js"

const PAGINA = 'Dashboard'

const principal = async (req, res) => {  

  const clientes  = await Cliente.findAll({
    where: {
      activo: true
    },
    include: [
      { model: Departamento }
    ],
    order: [['nit', 'ASC']]
  }) 

  // Agrupar clientes por departamento y contar cuántos hay en cada uno
  const departamentosCount = clientes.reduce((acc, cliente) => {
  const deptoNombre = cliente.departamento.nombre
    
    // Si el departamento ya está en el acumulador, incrementar el contador
    if (acc[deptoNombre]) {
        acc[deptoNombre]++
    } else {
        // Si no está, inicializar con 1
        acc[deptoNombre] = 1
    }

    return acc
  }, {})

  // Crear los datos para el gráfico
  const labelsClientes = Object.keys(departamentosCount) // Nombres de los departamentos
  const dataClientes = Object.values(departamentosCount) // Número de clientes por departamento
  const maxClientes = Math.max(...dataClientes) + 1

  // Crear el objeto chartData
  const chartDataClientes = JSON.stringify({
    labels: labelsClientes,
    datasets: [{
        label: 'Número de Clientes por Departamento',
        data: dataClientes + [maxClientes],
        backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
    }]
  })

  const ventas = await Ventas.findAll({
    include: [
      {
          model: Parametro,
          as: 'pagoParametro'  
      },
      {
          model: Parametro,
          as: 'compraParametro' 
      },
      {
          model: Parametro,
          as: 'estadoParametro' 
      },
      {
        model: VentasDetalle,
        required: false,
        include: [
            {
                model: Productos,
                required: true,
                include: [
                    {
                        model: Marcas,
                        required: true
                    }
                ]
            }
        ]
      }
    ],
  })
  
  // Agrupar las guías por 'pagoParametro.nombre' y contar cuántas hay por cada uno
  const pagoParametroCount = ventas.reduce((acc, venta) => {
  const pagoNombre = venta.pagoParametro.nombre

    // Si el pagoNombre ya está en el acumulador, incrementar el contador
    if (acc[pagoNombre]) {
        acc[pagoNombre]++
    } else {
        // Si no está, inicializar con 1
        acc[pagoNombre] = 1
    }

    return acc
  }, {})

  // Crear los datos para el gráfico de pie
  const labelsPagoParametro = Object.keys(pagoParametroCount) // Nombres de los parámetros de pago
  const dataPagoParametro = Object.values(pagoParametroCount) // Número de guías por cada parámetro

  // Crear el objeto chartData para el gráfico de pie
  const chartDataVentasPagoParametro = JSON.stringify({
      labels: labelsPagoParametro,
      datasets: [{
          label: 'Guías por Tipo de Pago',
          data: dataPagoParametro,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
      }]
  })

  // Agrupar las guías por 'compraParametro.nombre' y contar cuántas hay por cada uno
  const compraParametroCount = ventas.reduce((acc, venta) => {
  const envioNombre = venta.compraParametro.nombre

    // Si el pagoNombre ya está en el acumulador, incrementar el contador
    if (acc[envioNombre]) {
        acc[envioNombre]++
    } else {
        // Si no está, inicializar con 1
        acc[envioNombre] = 1
    }

    return acc
  }, {})

  // Crear los datos para el gráfico de pie
  const labelsEnvioParametro = Object.keys(compraParametroCount) // Nombres de los parámetros de envio
  const dataEnvioParametro = Object.values(compraParametroCount) // Número de guías por cada parámetro
  

  // Crear el objeto chartData para el gráfico de pie
  const chartDataVentaCompraParametro = JSON.stringify({
    labels: labelsEnvioParametro,
    datasets: [{
        label: 'Guías por Tipo Envío',
        data: dataEnvioParametro,
        backgroundColor: [
          'rgba(75, 192, 192, 0.2)',  // Verde agua
          'rgba(255, 159, 64, 0.2)',  // Naranja
          'rgba(153, 102, 255, 0.2)', // Púrpura
          'rgba(255, 205, 86, 0.2)',  // Amarillo claro
          'rgba(54, 162, 235, 0.2)',  // Azul claro
          'rgba(201, 203, 207, 0.2)'  // Gris claro
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',    // Verde agua
          'rgba(255, 159, 64, 1)',    // Naranja
          'rgba(153, 102, 255, 1)',   // Púrpura
          'rgba(255, 205, 86, 1)',    // Amarillo claro
          'rgba(54, 162, 235, 1)',    // Azul claro
          'rgba(201, 203, 207, 1)'    // Gris claro
        ],
        borderWidth: 1
    }]
  })

  const agrupacionMarcaColor = ventas.reduce((acc, ventas) => {
    ventas.ventas_detalles.forEach(detalle => {
        const marcaNombre = detalle.Producto.marca.nombre
        const productoColor = detalle.Producto.nombre
        const key = `${marcaNombre}-${productoColor}`

        // Si la combinación ya está en el acumulador, incrementar el contador
        if (acc[key]) {
            acc[key]++
        } else {
            // Si no está, inicializar con 1
            acc[key] = 1
        }
    })
    
    return acc
  }, {})

  const topN = 10
  const labelsGuias = Object.keys(agrupacionMarcaColor).slice(0, topN) // Nombres de los primeros 15 parámetros
  const dataGuias = Object.values(agrupacionMarcaColor).slice(0, topN) // Número de guías para los primeros 15

  // Crear el objeto chartData para el gráfico de pie
  const chartDataLine = JSON.stringify({
      labels: labelsGuias,
      datasets: [{
          label: 'Productos por Ventas',
          data: dataGuias,
          pointStyle: 'circle',
          pointRadius: 10,
          pointHoverRadius: 15,
          backgroundColor: [
              'rgba(54, 162, 235, 0.2)',  // Azul
              'rgba(153, 102, 255, 0.2)',  // Púrpura
              'rgba(255, 99, 132, 0.2)',  // Rojo suave
              'rgba(255, 159, 64, 0.2)',  // Naranja
              'rgba(255, 205, 86, 0.2)',  // Amarillo
              'rgba(75, 192, 192, 0.2)',  // Verde agua
              'rgba(255, 99, 132, 0.2)',  // Rojo suave (repetido para completar 15)
              'rgba(255, 159, 64, 0.2)',  // Naranja (repetido para completar 15)
              'rgba(255, 205, 86, 0.2)',  // Amarillo (repetido para completar 15)
              'rgba(75, 192, 192, 0.2)',  // Verde agua (repetido para completar 15)
              'rgba(54, 162, 235, 0.2)',  // Azul (repetido para completar 15)
              'rgba(153, 102, 255, 0.2)',  // Púrpura (repetido para completar 15)
              'rgba(255, 99, 132, 0.2)',  // Rojo suave (repetido para completar 15)
              'rgba(255, 159, 64, 0.2)',  // Naranja (repetido para completar 15)
              'rgba(255, 205, 86, 0.2)'   // Amarillo (repetido para completar 15)
          ],
          borderColor: [
              'rgba(75, 192, 192, 1)',    // Verde agua
              'rgba(153, 102, 255, 1)',   // Púrpura
              'rgba(255, 99, 132, 1)',    // Rojo
              'rgba(255, 159, 64, 1)',    // Naranja
              'rgba(255, 205, 86, 1)',    // Amarillo
              'rgba(54, 162, 235, 1)',    // Azul
              'rgba(75, 192, 192, 1)',    // Verde agua (repetido)
              'rgba(153, 102, 255, 1)',   // Púrpura (repetido)
              'rgba(255, 99, 132, 1)',    // Rojo (repetido)
              'rgba(255, 159, 64, 1)',    // Naranja (repetido)
              'rgba(255, 205, 86, 1)',    // Amarillo (repetido)
              'rgba(54, 162, 235, 1)',    // Azul (repetido)
              'rgba(75, 192, 192, 1)',    // Verde agua (repetido)
              'rgba(153, 102, 255, 1)',   // Púrpura (repetido)
              'rgba(255, 99, 132, 1)'     // Rojo (repetido)
          ],
          borderWidth: 1
      }]
  })

  const detalleCalentario = async (req, res) => {

    const { id } = req.params
    try {
        const guia = await Guias.findByPk(id, {
            include: [
                {
                    model: Parametro,
                    as: 'pagoParametro',
                    attributes: ['id', 'nombre']
                },
                {
                    model: Parametro,
                    as: 'envioParametro',
                    attributes: ['id', 'nombre']
                },
                {
                    model: Parametro,
                    as: 'estadoParametro',
                    attributes: ['id', 'nombre']
                },
                {
                    model: Clientes,
                    include: [
                        {
                            model: Departamentos
                        },
                        {
                            model: Municipios
                        }
                    ]
                }
            ]
        })
  
       
        res.json({
          numeroGuia: guia.numeroGuia,
          precioTotal: formatoMoneda(guia.precioTotal),
          clienteNombre: guia.cliente.nombre,
          estado: guia.estadoParametro.nombre,
          tipoPago: guia.pagoParametro.nombre,
          tipoEnvio: guia.envioParametro.nombre,
          fechaEntrega: formatoFechaVista(guia.fechaEntrega),
          direccion: `${guia.cliente.municipio?.nombre}, ${guia.cliente.departamento?.nombre},  ${guia.cliente.direccion}`,
        })
  
  
    } catch (error) {
      console.log(error)
      
      res.status(500).json({ error: 'Error al obtener los detalles de la guía' })
    }
  
  }

  const events = ventas.map(venta => ({
    id: venta.ventaId,
    title: `${venta.numeroVenta}`,
    start: formatoFechaIso(venta.fechaDeVenta)
  }))

  res.render('principal/principal', {
    pagina: PAGINA,
    csftToken: req.csrfToken(),
    barra: true,
    chartDataClientes,
    chartDataVentasPagoParametro,
    chartDataVentaCompraParametro,
    chartDataLine,
    events
  })
  
}

const detalleCalendario = async (req, res) => {

  const { id } = req.params
  try {
      const venta = await Ventas.findByPk(id, {
          include: [
              {
                model: Parametro,
                as: 'pagoParametro'  
              },
              {
                model: Parametro,
                as: 'compraParametro' 
              },
              {
                model: Cliente,
                include: [
                    {
                        model: Departamento
                    },
                    {
                        model: Municipio
                    }
                ]
              }
          ]
      })

     
      res.json({
        numeroGuia: venta.numeroVenta,
        precioTotal: formatoMoneda(venta.precioTotal),
        clienteNombre: venta.cliente.nombre,
        estado: venta.pagoParametro.nombre,
        tipoPago: venta.compraParametro.nombre,
        fechaEntrega: formatoFechaVista(venta.fechaDeVenta),
        direccion: `${venta.cliente.municipio?.nombre}, ${venta.cliente.departamento?.nombre},  ${venta.cliente.direccion}`,
      })


  } catch (error) {
    console.log(error)
  }

}


export {
  principal,
  detalleCalendario
}