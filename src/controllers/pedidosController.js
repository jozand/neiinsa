import { check, validationResult } from 'express-validator'
import { Pedidos, Marcas, Productos, PedidosDetalle } from '../models/index.js'
import { formatoFechaVista, formatoFechaIso, formatoMoneda } from '../utils/formatos.js'
import { sequelize } from '../config/database.js'
import { cargaEntradas } from './inventariosController.js'
import { Op, Sequelize  } from 'sequelize'
import { createObjectCsvWriter } from 'csv-writer'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const PAGINA = 'Control de Pedidos'

const lista = async (req, res) => {

  try {

      const page = parseInt(req.query.page) || 1
      const limit = 5 // Número de elementos por página
      const offset = (page - 1) * limit

      const { count, rows } = await Pedidos.findAndCountAll({
          limit: limit,
          offset: offset
      })

      const totalPages = Math.ceil(count / limit)

      const nuevaLista = rows.map(item => ({
          id: item.pedidoId,
          nombreProveedor: item.nombreProveedor,
          fecha:formatoFechaVista(item.fecha),
          fechaOld: item.fecha,
          precioTotal: item.precioTotal,
          cantidadTotal: item.cantidadTotal,
          finalizado: item.finalizado,
          activo: item.activo,
          createdAt: formatoFechaVista(item.createdAt),
          updatedAt: item.updatedAt             
      }))
        

      res.render('pedidos/pedidos', {
          pagina: PAGINA,
          csftToken: req.csrfToken(),
          barra: true,
          pedidos: nuevaLista,
          currentPage: page,
          totalPages: totalPages
      })


  } catch (error) {
      console.log(error)
      
  }
}

const formulario = async (req, res) => {

  try {
      
      const pedidoPendiente = await Pedidos.findOne({ where: {finalizado: false, activo: true}})

      if(pedidoPendiente){  

          const marcas = await Marcas.findAll({ 
              where: {activo: true},
              include: [{ model: Productos, required: true}]
          })

          const { pedidoId, fecha , precioTotal, cantidadTotal, nombreProveedor} = pedidoPendiente

          const formattedDate = formatoFechaIso(fecha)
          
          const detallePedDB = await PedidosDetalle.findAll(
            { 
                where : { pedidoId , activo: true},
                include: [
                    { 
                        model: Productos, required: true,
                        include: [
                            { model: Marcas, required: true }
                        ]
                    }
                ]
            })

          let precioCalcDB = 0
          let cantidadCalDB = 0 
          let precioTxt = 0                    

          if(detallePedDB){
              detallePedDB.forEach((elemento) => {
                  if(elemento.activo){
                      precioCalcDB += parseFloat(elemento.precioCosto)  * parseInt(elemento.cantidad)
                      cantidadCalDB += parseInt(elemento.cantidad)
                  }                    
              })   
              precioTxt = formatoMoneda(precioCalcDB)
          }          

          return res.render('pedidos/pedidosFormularioDetalle', {
              pagina: PAGINA,
              csftToken: req.csrfToken(),
              barra: true,
              datos: {
                  fecha: formattedDate,
                  precioTotal: `${formatoMoneda(precioTotal)} / ${precioTxt}`,
                  cantidadTotal: `${cantidadTotal} / ${cantidadCalDB}`,
                  pedidoId,
                  nombreProveedor
              },
              marcas,
              productos: {},
              pedidosDetalle: detallePedDB,
              errores: [{msg: 'Existe pedidos pendientes de completar'}]
          })

      }else{

          return res.render('pedidos/pedidosFormulario', {
              pagina: PAGINA,
              csftToken: req.csrfToken(),
              barra: true,
              datos: {}
          })

      }

  } catch (error) {
      console.log(error)        
  }   
}

const crear = async (req, res) => {

  await check('fecha').notEmpty().withMessage('Debe de ingresar la fecha del pedido').run(req)
  await check('precioTotal').notEmpty().withMessage('Debe de ingresar el precio total del pedido').run(req)
  await check('cantidadTotal').notEmpty().withMessage('Debe de ingresar la cantidad total del pedido').run(req)
  await check('nombreProveedor').notEmpty().withMessage('el nombre del proveedor no puede ir vacio').run(req)

  let resultado = validationResult(req)

  if(!resultado.isEmpty()){
      return res.render('pedidos/pedidosFormulario', {
          pagina: PAGINA,
          csftToken: req.csrfToken(),
          barra: true,
          datos: req.body,
          errores: resultado.array()
      })
  }

  try {

      const { fecha, precioTotal, cantidadTotal, nombreProveedor} = req.body

      await Pedidos.create({
          fecha: new Date(fecha),
          precioTotal: precioTotal.replace(/[^\d.-]/g, ''),
          cantidadTotal,
          nombreProveedor
      })
      
      res.redirect('/alerta/mostrarAlerta?mensaje=Registro creado correctamente&tipo=exito&href=/pedidos/formulario') 
             
  } catch (error) {
      console.log(error)        
  }

}

const productosMarcas = async (req, res) => {

  try {    

      const { marcaId } = req.params

      const productos = await Productos.findAll({
          where: { marcaId, activo: true }
      })     

      res.json(productos)       

  } catch (error) {
      
      console.log(error)
  }   

}

const crearDetalle = async (req, res) => {

    await check('marcaId').notEmpty().withMessage('Debe de ingresar el marca').run(req)
    await check('productoId').notEmpty().withMessage('Debe de ingresar el producto').run(req)
    await check('precioCosto').notEmpty().withMessage('Debe de ingresar el precio costo').run(req)
    await check('precioUnitario').notEmpty().withMessage('Debe de ingresar el precio unitario').run(req)
    await check('cantidad').notEmpty().withMessage('Debe de ingresar la cantidad').run(req)

    let resultado = validationResult(req)

    if(!resultado.isEmpty()){

        const pedidoPendiente = await Pedidos.findOne({ where: {finalizado: false, activo: true}})

      if(pedidoPendiente){  

          const marcas = await Marcas.findAll({ 
              where: {activo: true},
              include: [{ model: Productos, required: true}]
          })

          const { pedidoId, fecha , precioTotal, cantidadTotal, nombreProveedor} = pedidoPendiente

          const formattedDate = formatoFechaIso(fecha)
          
          const detallePedDB = await PedidosDetalle.findAll(
            { 
                where : { pedidoId , activo: true},
                include: [
                    { 
                        model: Productos, required: true,
                        include: [
                            { model: Marcas, required: true }
                        ]
                    }
                ]
            })

          let precioCalcDB = 0
          let cantidadCalDB = 0 
          let precioTxt = 0                    

          if(detallePedDB){
              detallePedDB.forEach((elemento) => {
                  if(elemento.activo){
                      precioCalcDB += parseFloat(elemento.precioCosto)  * parseInt(elemento.cantidad)
                      cantidadCalDB += parseInt(elemento.cantidad)
                  }                    
              })   
              precioTxt = formatoMoneda(precioCalcDB)
          }          

          return res.render('pedidos/pedidosFormularioDetalle', {
              pagina: PAGINA,
              csftToken: req.csrfToken(),
              barra: true,
              datos: {
                  fecha: formattedDate,
                  precioTotal: `${formatoMoneda(precioTotal)} / ${precioTxt}`,
                  cantidadTotal: `${cantidadTotal} / ${cantidadCalDB}`,
                  pedidoId,
                  nombreProveedor
              },
              marcas,
              productos: {},
              pedidosDetalle: detallePedDB,
              errores: resultado.array()
          })
      }
    }

    try {     


        const { precioCosto, precioUnitario, cantidad, pedidoId , productoId } = req.body

        const detalle = await PedidosDetalle.findOne({
            where: { pedidoId, productoId, activo: true }
        })

        if(detalle){
            
            detalle.set({
                precioCosto: precioCosto.replace(/[^\d.-]/g, ''),
                precioUnitario: precioUnitario.replace(/[^\d.-]/g, ''),
                cantidad
            })

            await detalle.save()

            res.redirect('/alerta/mostrarAlerta?mensaje=Registro actualizado correctamente&tipo=exito&href=/pedidos/formulario') 
                   
        }else{

          await PedidosDetalle.create({
              precioCosto: precioCosto.replace(/[^\d.-]/g, ''),
              precioUnitario: precioUnitario.replace(/[^\d.-]/g, ''),
              cantidad,
              pedidoId,
              productoId
          })
        
          res.redirect('/alerta/mostrarAlerta?mensaje=Registro creado correctamente&tipo=exito&href=/pedidos/formulario') 
        }

               
    } catch (error) {
        console.log(error)        
    }

}

const obtenerDetalle = async (req, res) => {

    try {

        const { pedidoId, productoId } = req.params

        const detalle = await PedidosDetalle.findOne({
            where: { pedidoId, productoId, activo: true }
        })

        const aplicaColor = detalle.pedidoDetalleId ? true : false

        res.json({ ...detalle.toJSON(), aplicaColor })    

    } catch (error) {
        
        console.log(error)
    }   

}

const mensajeEliminarPedidoDetalle = async (req, res) => {

    try {

        const { pedidoDetalleId } = req.params

        res.redirect(`/alerta/mostrarAlertaConfirmacion?mensaje=¿Estás seguro de eliminar el registro?&tipo=warning&hrefAceptar=/pedidos/eliminarPedidoDetalle/${pedidoDetalleId}&hrefCancelar=/pedidos/formulario`)

    } catch (error) {
        console.log(error)
        
    }

}

const eliminarPedidoDetalle = async (req, res) => {
    const { pedidoDetalleId } = req.params

    const pedidoDetalle = await PedidosDetalle.findByPk(pedidoDetalleId)  

    pedidoDetalle.set({
        activo: false
    })

    await pedidoDetalle.save()

    res.redirect('/alerta/mostrarAlerta?mensaje=Registro eliminado correctamente&tipo=exito&href=/pedidos/formulario')
    
}

const mensajeEliminarPedido = async (req, res) => {

    try {

        const { pedidoId } = req.params

        res.redirect(`/alerta/mostrarAlertaConfirmacion?mensaje=¿Estás seguro de eliminar el registro?&tipo=warning&hrefAceptar=/pedidos/eliminarPedido/${pedidoId}&hrefCancelar=/pedidos/lista`)

    } catch (error) {
        console.log(error)
        
    }

}

const eliminarPedido = async (req, res) => {
    const { pedidoId } = req.params

    const pedido = await Pedidos.findByPk(pedidoId,{
        include: [
            {
                model: PedidosDetalle,
                required: false
            }
        ]
    })  

    const transaction = await sequelize.transaction()

    try {
        // Actualiza `Pedido` dentro de la transacción
        pedido.set({ activo: false })
        await pedido.save({ transaction })

        // Verifica que `PedidosDetalles` existe y tiene elementos antes de actualizar
        if (pedido.PedidosDetalles && pedido.PedidosDetalles.length > 0) {
            await Promise.all(
                pedido.PedidosDetalles.map(async (detalle) => {
                    detalle.set({ activo: false })
                    await detalle.save({ transaction })
                })
            )
        }

        // Confirma (commitea) la transacción
        await transaction.commit()
        console.log("Pedido y detalles (si existen) actualizados a inactivos.")

    } catch (error) {
        // Deshace (rollback) la transacción en caso de error
        await transaction.rollback()
        console.error("Error al actualizar Pedido y detalles:", error)
    }

    res.redirect('/alerta/mostrarAlerta?mensaje=Registro eliminado correctamente&tipo=exito&href=/pedidos/lista')
    
}

const finalizaPedido = async (req, res) => {

   const { pedidoId } = req.body

   const pedido = await Pedidos.findByPk(pedidoId, {
        include: [
            {
                model: PedidosDetalle,
                required: true,
                where: { activo: true }
            }
        ]
    })

    let totalPrecioCosto = 0
    let totalCantidad = 0  

    if (pedido && pedido.pedidos_detalles) {
        totalPrecioCosto = pedido.pedidos_detalles.reduce((total, detalle) => {
            return total + (detalle.totalCosto || 0)
        }, 0)

        totalCantidad = pedido.pedidos_detalles.reduce((total, detalle) => {
            return total + (detalle.cantidad || 0)
        }, 0)
    }

    if (pedido.precioTotal !== totalPrecioCosto) {
        return res.redirect('/alerta/mostrarAlerta?mensaje=El precio total de pedido difiere al precio total acumulado del detalle&tipo=error&href=/pedidos/formulario')
    }

    if (pedido.cantidadTotal !== totalCantidad) {
        return res.redirect('/alerta/mostrarAlerta?mensaje=La cantidad total de pedido difiere al precio total acumulado del detalle&tipo=error&href=/pedidos/formulario')
    }

    pedido.set({
        finalizado: true
    })

    await pedido.save()

    cargaEntradas(pedido.pedidoId)

    res.redirect('/alerta/mostrarAlerta?mensaje=Pedido finalizado correctamente&tipo=exito&href=/pedidos/lista')
    
}

const buscarProveedores = async (req, res) => {
    const { termino } = req.query // Obtener el término de búsqueda
    try {
      const proveedores = await Pedidos.findAll({
        where: {
          nombreProveedor: {
            [Op.like]: `%${termino}%`, // Coincidencia parcial
          },
        },
        attributes: [
          [Sequelize.fn('DISTINCT', Sequelize.col('nombreProveedor')), 'nombreProveedor'], // Aplicar DISTINCT
        ],
        limit: 5, // Limita el número de resultados
      })
  
      res.json(proveedores)
    } catch (error) {
      console.error('Error al buscar proveedores:', error)
      res.status(500).json({ error: 'Error al buscar proveedores' })
    }
}

const exportCSV = async (req, res) => {
    
    try {

            const { pedidoId } = req.params
            const pedido = await Pedidos.findByPk(pedidoId, {
                include: [
                    {
                        model: PedidosDetalle,
                        required    : false,
                        where: { activo: true },
                        include: [
                            {
                            model: Productos,
                            include: [
                                {   
                                    model: Marcas
                                }
                            ]
                            }
                        ]
                    }
                ]
            })

            if (pedido.pedidos_detalles.length === 0){
                res.redirect('/alerta/mostrarAlerta?mensaje=Pedido no cuenta con productos asociados&tipo=error&href=/pedidos/lista')
            }
            
            const filePath = path.join(__dirname, '../../', 'public', 'csv', 'pedidos.csv')

            const directoryPath = path.dirname(filePath)
                if (!fs.existsSync(directoryPath)) {
                fs.mkdirSync(directoryPath, { recursive: true })
            }

            const csvWriter = createObjectCsvWriter({
                path: filePath,
                header: [
                    { id: 'marca', title: 'Marca' },
                    { id: 'producto', title: 'Producto' },
                    { id: 'cantidad', title: 'Cantidad' },
                    { id: 'precioUnitario', title: 'Precio Unitario' },
                    { id: 'precioCosto', title: 'Precio Costo' },
                    { id: 'previoVentaTotal', title: 'Total Previsto' },
                    { id: 'precioCostoTotal', title: 'Total Costo' },
                    { id: 'fechaCreacion', title: 'Fecha de Creación' }
                ],
                fieldDelimiter: ',',
                quoteStrings: '"',
            })

            const records = pedido.pedidos_detalles.map(detalle => ({
                marca: detalle.Producto.marca.nombre,
                producto: detalle.Producto.nombre,
                cantidad: detalle.cantidad,
                precioUnitario: detalle.precioUnitario,
                precioCosto: detalle.precioCosto,
                previoVentaTotal: detalle.totalVenta,
                precioCostoTotal: detalle.totalCosto,
                fechaCreacion: formatoFechaVista(detalle.createdAt)
            }))

            await csvWriter.writeRecords(records)

            res.download(filePath, 'pedido' + pedidoId + '.csv')

        } catch (error) {
        console.error('Error al exportar pedido:', error)
        res.status(500).send('Error al exportar pedido '+ pedidoId)
    }
    
}

export {
    lista,
    formulario,
    crear,
    productosMarcas,
    crearDetalle,
    obtenerDetalle,
    mensajeEliminarPedidoDetalle,
    eliminarPedidoDetalle,
    mensajeEliminarPedido,
    eliminarPedido,
    finalizaPedido,
    buscarProveedores,
    exportCSV
} 