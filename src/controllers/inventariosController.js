import { Inventarios, Productos, Marcas, PedidosDetalle, VentasDetalle } from '../models/index.js'
import { origenInventario, conceptoInventario } from '../config/constantes.js'
import { formatoFechaVista } from '../utils/formatos.js'
import { createObjectCsvWriter } from 'csv-writer'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

// Definir __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const PAGINA = 'Control de Inventarios'

const lista = async (req, res) => {

  try {

      const { op } = req.params

      const page = parseInt(req.query.page) || 1
      const limit = 10 // Número de elementos por página
      const offset = (page - 1) * limit

      const whereCondition = {}
      if (op == 1) {
          whereCondition.activo = true
      }
      
      const { count, rows } = await Inventarios.findAndCountAll({  
          include: 
              [
                  {
                    model: Productos,
                    required: false,
                    include: [
                      {
                        model: Marcas,
                        required: false
                      }
                    ] 
                  }                                     
                     
              ],
          order:[
              ['productoId', 'asc'], 
              ['inventarioId', 'asc']     
          ],
          where: whereCondition,        
          limit: limit,
          offset: offset
      })
        
      const nuevaLista = rows.map(row => {          
        return {
            id: `${row.productoId || ''}${row.Producto?.marcaId || ''}`,
            fecha: formatoFechaVista(row.fecha),
            concepto: row.concepto,
            marca: row.Producto.marca.nombre,
            producto: row.Producto.nombre,
            entrada: row.entrada,
            salida: row.salida,
            existencia: row.existencia,
            activo: row.activo
        }          
      }).filter(item => item !== undefined) // Eliminamos los registros undefined
            
      const totalPages = Math.ceil(count / limit)       

      res.render('inventarios/inventarios', {
          pagina: PAGINA,
          csftToken: req.csrfToken(),
          barra: true,
          inventarios: nuevaLista,
          currentPage: page,
          totalPages: totalPages,
          op: parseInt(op)
      })

  } catch (error) {
      console.log(error)        
  }

}

async function cargaEntradas (pedidoId)  {

    try {

        const pedidoDetalle = await PedidosDetalle.findAll({ where: { pedidoId, activo: true }})
         
        for (const detalle of pedidoDetalle) {
      
            const registro = await Inventarios.findOne({
                where: { productoId : detalle.productoId, activo: true}
            })
      
            const concepto = registro ? conceptoInventario.compra : conceptoInventario.inicial
            const entrada = detalle.cantidad
            const salida = 0
            const existencia = entrada + (registro?.existencia ?? 0)
      
            if (registro) { 
                registro.activo = false
                await registro.save()
            }
      
            await Inventarios.create({
                fecha: new Date(),
                concepto,
                entrada,
                salida,
                existencia,
                origen: origenInventario.pedidos,
                registroId: pedidoId,
                productoId: detalle.productoId
            })
        }
        
    } catch (error) {
        console.log(error)   
    }
}

async function cargaSalidas(ventaId) {

    try {

        const ventasDetalle = await VentasDetalle.findAll({ where: { ventaId, activo: true }})

        for (const detalle of ventasDetalle) {

            const registro = await Inventarios.findOne({
                where: { productoId : detalle.productoId, activo: true}
            })

            const concepto = 'Venta'
            const entrada = 0
            const salida = detalle.cantidad
            const existencia = (registro?.existencia ?? 0) - salida 

            if (registro) { 
                registro.activo = false
                await registro.save()
            }
    
            await Inventarios.create({
                fecha: new Date(),
                concepto,
                entrada,
                salida,
                existencia,
                origen: origenInventario.ventas,
                registroId: ventaId,
                productoId: detalle.productoId
            })

        }

    } catch (error) {
        console.log(error)   
    }
}

const exportCSV = async (req, res) => {
    
    try {


        const filtroId = req.query.filtroId

        const whereClause = filtroId == 1 ? { activo: true } : {}
        
        const inventarios = await Inventarios.findAll({
            include: [
                {
                    model: Productos,
                    required: false,
                    include: [
                        {
                            model: Marcas,
                            required: false
                        }
                    ]
                }
            ],         
            order:[
                ['productoId', 'asc'],
                ['inventarioId', 'asc']
            ],
            where: whereClause
        })
        
        const filePath = path.join(__dirname, '../../', 'public', 'csv', 'inventarios.csv')

        const directoryPath = path.dirname(filePath)
            if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(directoryPath, { recursive: true })
        }

        const csvWriter = createObjectCsvWriter({
            path: filePath,
            header: [
                { id: 'id', title: 'Id' },
                { id: 'fecha', title: 'Fecha de Creación' },
                { id: 'concepto', title: 'Concepto' },
                { id: 'marca', title: 'Marca' },
                { id: 'producto', title: 'Producto' },
                { id: 'entrada', title: 'Entrada' },
                { id: 'salida', title: 'Salida' },
                { id: 'existencia', title: 'Existencia' }
            ],
            fieldDelimiter: ',',
            quoteStrings: '"',
        })

        const records = inventarios.map(row => ({
            id: `${row.productoId || ''}${row.Producto?.marcaId || ''}`,
            fecha: formatoFechaVista(row.fecha),
            concepto: row.concepto,
            marca: row.Producto.marca.nombre,
            producto: row.Producto.nombre,
            entrada: row.entrada,
            salida: row.salida,
            existencia: row.existencia
        }))

        await csvWriter.writeRecords(records)

        res.download(filePath, 'inventarios.csv')

        } catch (error) {
        console.error('Error al exportar inventarios:', error)
        res.status(500).send('Error al exportar inventarios')
    }
    
}

export {
    lista,
    cargaEntradas,
    cargaSalidas,
    exportCSV
}