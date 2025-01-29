import { check, validationResult } from 'express-validator'
import { Ventas, VentasDetalle, Marcas, Productos, Parametro, Cliente, Departamento, Municipio, Inventarios , PedidosDetalle } from '../models/index.js'
import { tipoParametro, parametros, origenInventario } from '../config/constantes.js'
import { formatoFechaVista, formatoFechaIso,formatoMoneda } from '../utils/formatos.js'
import { Op } from 'sequelize'
import { sequelize } from '../config/database.js'
import { cargaSalidas } from './inventariosController.js'
import { createObjectCsvWriter } from 'csv-writer'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const PAGINA = 'Control de Ventas'

const lista = async (req, res) => {
    
    try {

        const { pagoId, compraId } = req.params
          
        const whereConditions = {}

        if (pagoId != 0) {
            
            whereConditions.pagoId = pagoId
        }

        if (compraId != 0) {
            whereConditions.compraId = compraId
        }

        const page = parseInt(req.query.page) || 1
        const limit = 7 // Número de elementos por página
        const offset = (page - 1) * limit
    
        const { count, rows } = await Ventas.findAndCountAll({
            include: [
                {
                    model: VentasDetalle,
                    required: false
                },
                {
                    model: Cliente,
                    required: true
                },
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
                }
            ],
            where: whereConditions,
            limit: limit,
            offset: offset,
            distinct: true
        })
        
        const totalPages = Math.ceil(count / limit)

        const tipoPagos = await Parametro.findAll({ where :{ parametroTipoId: tipoParametro.pago }})
        const tipoCompras = await Parametro.findAll({ where :{ parametroTipoId: tipoParametro.compra }})     
        
        const nuevaLista = rows.map(item => ({
            id: item.ventaId,
            cliente: item.cliente.nombre,
            numeroVenta: item.numeroVenta,
            fechaDeVenta: formatoFechaVista(item.fechaDeVenta),
            precioTotal: formatoMoneda(item.precioTotal),
            precioTotalCosto: formatoMoneda(item.precioTotalCosto),
            envio: formatoMoneda(item.envio),
            activo: item.activo,
            estadoId: item.estadoId,
            ventas_detalles: item.ventas_detalles
        }))

        return res.render('ventas/ventas', {
            pagina: PAGINA,
            csftToken: req.csrfToken(),
            barra: true,
            ventas: nuevaLista,
            currentPage: page,
            totalPages: totalPages,
            tipoPagos,
            tipoCompras,
            pagoId,
            compraId
        })
        
    } catch (error) {
        console.log(error)        
    }
}

async function generaNumeroVenta() {
    // Obtener la fecha actual y ajustar a la zona horaria de Guatemala (UTC-6)
    const fecha = new Date()
    const zonaGuatemalaOffset = 6 * 60 * 60 * 1000
    const fechaGuatemala = new Date(fecha.getTime() - zonaGuatemalaOffset)

    // Obtener componentes de la fecha en formato YYYYMMDD
    const year = fechaGuatemala.getFullYear()
    const month = String(fechaGuatemala.getMonth() + 1).padStart(2, '0')
    const day = String(fechaGuatemala.getDate()).padStart(2, '0')
    const fechaFormato = `${year}${month}${day}`

    // Definir el rango de tiempo del día (inicio y fin)
    const startOfDay = new Date(fechaGuatemala)
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date(fechaGuatemala)
    endOfDay.setHours(23, 59, 59, 999)

    // Contar cuántas guías se han creado en el día actual
    const totalGuiasHoy = await Ventas.count({
        where: {
            createdAt: {
                [Op.between]: [startOfDay, endOfDay] // Rango de fecha para el día actual
            }
        }
    })

    // Generar el número secuencial con 4 dígitos
    const numeroSecuencial = String(totalGuiasHoy + 1).padStart(4, '0')

    // Formar el número de guía final
    return `${fechaFormato}-${numeroSecuencial}`
}

const formulario = async (req, res) => {

    try {

        const ventaPendiente = await Ventas.findOne({
            where: {  
                activo: true,
                estadoId: parametros.creada
            }
        })

        if(ventaPendiente){
            return res.redirect('/alerta/mostrarAlerta?mensaje=Existe venta pendientes de finalizar&tipo=error&href=/ventas/formularioDetalle/'+ ventaPendiente.ventaId) 
        }

        const { nit } = req.params
        const cliente = await Cliente.findOne({ 
            where: { nit },
            include: [
                { model: Departamento },
                { model: Municipio }
            ]
        })

        const tipoPagos = await Parametro.findAll({ where :{ parametroTipoId: tipoParametro.pago }})
        const tipoCompras = await Parametro.findAll({ where :{ parametroTipoId: tipoParametro.compra }})        
        
        const numeroVenta = await generaNumeroVenta()
        const estadoId = Parametro.creada
    
        return res.render('ventas/ventasFormulario', {
            pagina: PAGINA,
            csftToken: req.csrfToken(),
            barra: true,
            datos: {
                numeroVenta,
                estadoId,
                estado: 'Creado'
            },
            tipoPagos,
            tipoCompras,
            cliente
        })
        
    } catch (error) {
        console.log(error)        
    }
}

const crearVenta = async (req, res) => {    

    const { numeroVenta, estadoId, nit, clienteId, fechaVenta, pagoId, compraId, envio } = req.body

    await check('fechaVenta').notEmpty().withMessage('la fecha de venta es requerida').run(req)
    await check('pagoId').notEmpty().withMessage('el tipo de pago es requerido').run(req)
    await check('compraId').notEmpty().withMessage('el tipo de compra   es requerido').run(req)
    if(pagoId == '5'){
        await check('envio').notEmpty().withMessage('el costo de envio es requerido').run(req)
    }

    let resultado = validationResult(req)

    if(!resultado.isEmpty()){

        const { nit } = req.body
        const cliente = await Cliente.findOne({ 
            where: { nit },
            include: [
                { model: Departamento },
                { model: Municipio}
            ]
        })
 
        const tipoPagos = await Parametro.findAll({ where :{ parametroTipoId: tipoParametro.pago }})
        const tipoCompras = await Parametro.findAll({ where :{ parametroTipoId: tipoParametro.compra }})     
        const dataConEstado = { ...req.body, estado: 'Creado' }
        
        return res.render('ventas/ventasFormulario', {
            pagina: PAGINA,
            csftToken: req.csrfToken(),
            barra: true,
            datos: dataConEstado,
            tipoPagos,
            tipoCompras,
            cliente,
            errores: resultado.array()
        })

    }

    try {
        
        const venta = await Ventas.create({
            numeroVenta,
            fechaDeVenta: fechaVenta,
            pagoId,
            compraId,
            envio: envio ? envio.replace(/[^\d.-]/g, '') : 0,
            nit,
            clienteId
        })

        res.redirect('/alerta/mostrarAlerta?mensaje=Venta registrada correctamente&tipo=exito&href=/ventas/formularioDetalle/'+venta.ventaId) 

    } catch (error) {
        console.log(error)
    }

}

const formularioDetalle = async (req, res) => {

    const { ventaId } = req.params

    const venta = await Ventas.findByPk(ventaId,{
        include: [
            {
                model: VentasDetalle,
                required: false,
                where: { activo: true },
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
            },
            {
                model: Cliente,
                required: true,
                include: [
                    {
                        model: Departamento,
                        required: true
                    },
                    {
                        model: Municipio,
                        required: true
                    }
                ]
            }
        ]
    })

    const inventarios = await Inventarios.findAll({
        where: {
            activo: true,        
            existencia: {        
                [Op.gt]: 0
            }
        },
        include: [{
            model: Productos,   
            include: [{
                model: Marcas,    
                attributes: ['marcaId', 'nombre']                        
                }]
        }],
        attributes: []  
    })

    const datos = {
        ventaId: venta.ventaId,
        numeroVenta: venta.numeroVenta,
        fechaDeVenta: formatoFechaIso(venta.fechaDeVenta),  
        precioTotal: formatoMoneda(venta.precioTotal),
        precioTotalCosto: formatoMoneda(venta.precioTotalCosto),
        cantidadTotal: venta.cantidadTotal !== null ? venta.cantidadTotal : '0',
        envio: formatoMoneda(venta.envio),   
        ventas_detalles: venta.ventas_detalles,
        cliente: `NIT: ${venta.cliente.nit} -  Nombre: ${venta.cliente.nombre} - Telefono: ${venta.cliente.telefono}
Direccion: ${venta.cliente.municipio.nombre}, ${venta.cliente.departamento.nombre},  ${venta.cliente.direccion} `
        , cantidadMaxima: '(existencia = 0)'
    }

    const marcasUnicas = Array.from(
        new Set(
            inventarios.map(item => JSON.stringify(item.Producto.marca))
        )
      ).map(marcaStr => JSON.parse(marcaStr))
    
    res.render('ventas/ventasFormularioDetalle', {
        pagina: PAGINA,
        csftToken: req.csrfToken(),
        barra: true,
        datos,
        marcas: marcasUnicas,
        productos: {},
        errores: [{msg: 'Existe venta pendientes de finalizar'}]
    })

}

const productosMarcas = async (req, res) => {

    try {    

        const { marcaId } = req.params
  
        const inventarios = await Inventarios.findAll({
            where: {
                activo: true,        
                existencia: {        
                    [Op.gt]: 0
                }
            },
            include: [{
                model: Productos,   
                include: [{
                    model: Marcas,    
                    where : { marcaId },
                    attributes: ['marcaId', 'nombre']                        
                    }]
            }],
            attributes: []  
        })
        
        const productosUnicos = Array.from(
            new Set(
                inventarios.map(item => JSON.stringify(item.Producto))
            )
          ).map(marcaStr => JSON.parse(marcaStr))

        res.json(productosUnicos)       
  
    } catch (error) {        
        console.log(error)
    }   
  
}

const productosDatos = async (req, res) => {
    try {    
      
        const { productoId, ventaId } = req.params

        const inventario = await Inventarios.findOne({
            where : {
                activo: true,        
                productoId
            }
        })

        let precio = 0
        let precioCosto = 0

        switch (inventario.origen) {
            case origenInventario.pedidos: {

                const pedido = await PedidosDetalle.findOne({
                    where: {
                        activo: true,
                        pedidoId: inventario.registroId,
                        productoId: inventario.productoId
                    }
                })

                precio = pedido.precioUnitario
                precioCosto = pedido.precioCosto
                
            }
            break

            case origenInventario.ventas: {

                const venta = await Ventas.findOne({
                    where: {
                        activo: true,
                        ventaId: inventario.registroId
                    }
                })

                precio = venta.precioTotal
                precioCosto = venta.precioTotalCosto
                
            }
            break

        }

        const ventaDetalle = await VentasDetalle.findOne({
            where: {
                ventaId,
                productoId,
                activo: true
            }
        })

        res.json({
            precioUnitario: ventaDetalle && ventaDetalle.precioVenta ? ventaDetalle.precioVenta : precio,
            precioCosto: ventaDetalle && ventaDetalle.precioCosto ? ventaDetalle.precioCosto : precioCosto,
            cantidad: inventario.existencia,
            existenciaValor: ventaDetalle && ventaDetalle.cantidad ? ventaDetalle.cantidad : '0',
            aplicaColor: ventaDetalle ? true : false
        })
         
        
  
    } catch (error) {        
        console.log(error)
    }   
  
}

const crearDetalle = async (req, res) => {

    await check('marcaId').notEmpty().withMessage('Debe de ingresar el marca').run(req)
    await check('productoId').notEmpty().withMessage('Debe de ingresar el producto').run(req)
    await check('precioUnitario').notEmpty().withMessage('Debe de ingresar el precio unitario').run(req)
    await check('cantidad')
    .notEmpty().withMessage('Debe de ingresar la cantidad')
    .isInt({ min: 1 }).withMessage('La cantidad debe ser mayor a 0')
    .run(req)

    let resultado = validationResult(req)

    const { ventaId, marcaId , productoId, precioCostoVenta, precioUnitario, cantidad } = req.body

    if(!resultado.isEmpty()){

        const venta = await Ventas.findByPk(ventaId,{
            include: [
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
                },
                {
                    model: Cliente,
                    required: true,
                    include: [
                        {
                            model: Departamento,
                            required: true
                        },
                        {
                            model: Municipio,
                            required: true
                        }
                    ]
                }
            ]
        })
    
        const inventarios = await Inventarios.findAll({
            where: {
                activo: true,        
                existencia: {        
                    [Op.gt]: 0
                }
            },
            include: [{
                model: Productos,   
                include: [{
                    model: Marcas,    
                    attributes: ['marcaId', 'nombre']                        
                    }]
            }],
            attributes: []  
        })
    
    
        const datos = {
            ventaId: venta.ventaId,
            numeroVenta: venta.numeroVenta,
            fechaDeVenta: formatoFechaIso(venta.fechaDeVenta),  
            precioTotal: formatoMoneda(venta.precioTotal),
            precioTotalCosto: formatoMoneda(venta.precioTotalCosto),
            cantidadTotal: venta.cantidadTotal !== null ? venta.cantidadTotal : '0',
            envio: formatoMoneda(venta.envio),   
            ventas_detalles: venta.ventas_detalles,
            cliente: `NIT: ${venta.cliente.nit} -  Nombre: ${venta.cliente.nombre} - Telefono: ${venta.cliente.telefono}
    Direccion: ${venta.cliente.municipio.nombre}, ${venta.cliente.departamento.nombre},  ${venta.cliente.direccion} `, 
            cantidadMaxima: '(existencia = 0)',
            marcaId,
            productoId
        }
    
        const marcasUnicas = Array.from(
            new Set(
                inventarios.map(item => JSON.stringify(item.Producto.marca))
            )
          ).map(marcaStr => JSON.parse(marcaStr))
        
        return res.render('ventas/ventasFormularioDetalle', {
            pagina: PAGINA,
            csftToken: req.csrfToken(),
            barra: true,
            datos,
            marcas: marcasUnicas,
            productos: {},
            errores: resultado.array()
        })
    }
    const precioUnitarioValue = precioUnitario.replace(/[^\d.-]/g, '')



    try {
        
        const ventaDetalle = await VentasDetalle.findOne({
            where: {
                ventaId,
                productoId,
                activo: true
            }
        })

        if(ventaDetalle){

            ventaDetalle.set({
                cantidad,
                precioVenta: precioUnitarioValue,
                precioTotalVenta: precioUnitarioValue  * cantidad,
                precioCosto: precioCostoVenta,
                precioTotalCosto: precioCostoVenta * cantidad,
                ventaId,
                productoId
            })

            await ventaDetalle.save()

            res.redirect('/alerta/mostrarAlerta?mensaje=Registro actualizado correctamente&tipo=exito&href=/ventas/formularioDetalle/'+ventaId) 
                   
        }else{

            await VentasDetalle.create({
                cantidad,
                precioVenta: precioUnitarioValue,
                precioTotalVenta: precioUnitarioValue  * cantidad,
                precioCosto: precioCostoVenta,
                precioTotalCosto: precioCostoVenta * cantidad,
                ventaId,
                productoId
            })
        
            res.redirect('/alerta/mostrarAlerta?mensaje=Registro creado correctamente&tipo=exito&href=/ventas/formularioDetalle/'+ventaId) 

        }

    } catch (error) {
        console.log(error)        
    }
 
}


const mensajeEliminarVenta = async (req, res) => {

    try {

        const { ventaId } = req.params

        res.redirect(`/alerta/mostrarAlertaConfirmacion?mensaje=¿Estás seguro de eliminar el registro?&tipo=warning&hrefAceptar=/ventas/eliminarVenta/${ventaId}&hrefCancelar=/ventas/lista/0/0`)

    } catch (error) {
        console.log(error)
        
    }

}

const eliminarVenta = async (req, res) => {
    
    const { ventaId } = req.params

    const venta = await Ventas.findByPk(ventaId,{
        include: [
            {
                model: VentasDetalle,
                required: false
            }
        ]
    })  

const transaction = await sequelize.transaction()

    try {

        venta.set({ activo: false })

        await venta.save({ transaction })
        if (venta.ventas_detalles && venta.ventas_detalles.length > 0) {
            await Promise.all(
                venta.ventas_detalles.map(async (detalle) => {
                    detalle.set({ activo: false })
                    await detalle.save({ transaction })
                })
            )
        }

        await transaction.commit()
        res.redirect('/alerta/mostrarAlerta?mensaje=Registro eliminado correctamente&tipo=exito&href=/ventas/lista/0/0')    

    } catch (error) {
        await transaction.rollback()
        console.error(error)
    }
    
}

const mensajeEliminarVentaDetalle = async (req, res) => {

    try {

        const { ventasDetalleId } = req.params

        const ventaDetalle = await VentasDetalle.findByPk(ventasDetalleId) 

        res.redirect(`/alerta/mostrarAlertaConfirmacion?mensaje=¿Estás seguro de eliminar el registro?&tipo=warning&hrefAceptar=/ventas/eliminarVentaDetalle/${ventasDetalleId}&hrefCancelar=/ventas/formularioDetalle/${ventaDetalle.ventaId}`)

    } catch (error) {
        console.log(error)
        
    }

}

const eliminarVentaDetalle = async (req, res) => {
    
    try {
        const { ventasDetalleId } = req.params

        const ventaDetalle = await VentasDetalle.findByPk(ventasDetalleId)  
    
        ventaDetalle.set({
            activo: false
        })    
    
        await ventaDetalle.save()
    
        res.redirect('/alerta/mostrarAlerta?mensaje=Registro eliminado correctamente&tipo=exito&href=/ventas/formularioDetalle/'+ ventaDetalle.ventaId)
        
    } catch (error) {
        console.log(error)
    }
    
}

const finalizaVenta = async (req, res) => {

    try {

        const { ventaId } = req.body

        const venta = await Ventas.findByPk(ventaId,{
            include: [
                {
                    model: VentasDetalle,
                    required: true,
                    where: { activo: true }
                }
            ]
        })

        // Inicializar los totales
        let totalPrecioVenta = 0
        let totalPrecioCosto = 0
        let totalCantidad = 0

        // Verificar si hay detalles de ventas
        if (venta.ventas_detalles && venta.ventas_detalles.length > 0) {
            venta.ventas_detalles.forEach(detalle => {
                totalPrecioVenta += detalle.precioTotalVenta
                totalPrecioCosto += detalle.precioTotalCosto
                totalCantidad += detalle.cantidad
            })
        }

        venta.estadoId = Parametro.finalizada
        venta.precioTotal = totalPrecioVenta
        venta.precioTotalCosto = totalPrecioCosto
        venta.cantidadTotal = totalCantidad

        await venta.save()
        
        cargaSalidas(venta.ventaId)
        
        res.redirect('/alerta/mostrarAlerta?mensaje=Registro eliminado correctamente&tipo=exito&href=/ventas/lista/0/0')

    } catch (error) {
        console.log(error)
    }
}

const exportCSVConsolidado = async (req, res) => {
    
    try {
            const { ventaId } = req.params

            const whereConditions = {}

            if (ventaId !== 0) {
                whereConditions.ventaId = ventaId
            }

            const ventas = await Ventas.findAll({
                include: [
                    {
                        model: VentasDetalle,
                        required: false,
                        where : { activo: true },
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
                    },
                    {
                        model: Cliente,
                        required: true
                    },
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
                    }
                ],
                where: whereConditions
            })  

            if (ventaId !== 0) {
                if (ventas[0].ventas_detalles.length === 0){
                    res.redirect('/alerta/mostrarAlerta?mensaje=Venta no cuenta con productos asociados&tipo=error&href=/ventas/lista/0/0')
                }
            }
            
            const filePath = path.join(__dirname, '../../', 'public', 'csv', 'ventasConsolidado.csv')

            const directoryPath = path.dirname(filePath)
                if (!fs.existsSync(directoryPath)) {
                fs.mkdirSync(directoryPath, { recursive: true })
            }

            const csvWriter = createObjectCsvWriter({
                path: filePath,
                header: [
                    { id: 'numeroVenta', title: 'Numero de Venta' },
                    { id: 'nit', title: 'NIT' },
                    { id: 'cliente', title: 'Cliente' },
                    { id: 'fechaDeVenta', title: 'Fecha de Venta' },
                    { id: 'precioCosto', title: 'Precio de Costo' },
                    { id: 'precioVenta', title: 'Precio de Venta' },
                    { id: 'cantidad', title: 'Cantidad' },
                    { id: 'marca', title: 'Marca' },
                    { id: 'producto', title: 'Producto' },
                    { id: 'pagoParametro', title: 'Tipo de Pago' },
                    { id: 'compraParametro', title: 'Tipo de Compra' }
                ],
                fieldDelimiter: ',',
                quoteStrings: '"',
            })

            const records = ventas.map(venta => 
                venta.ventas_detalles.map(detalle => ({
                    numeroVenta: venta.numeroVenta, 
                    nit: venta.cliente.nit,
                    cliente: venta.cliente.nombre,
                    fechaDeVenta: formatoFechaVista(venta.fechaDeVenta),
                    precioCosto: detalle.precioCosto,
                    precioVenta: detalle.precioTotalVenta,
                    cantidad: detalle.cantidad,
                    marca: detalle.Producto.marca.nombre,
                    producto: detalle.Producto.nombre,
                    pagoParametro: venta.pagoParametro.nombre,
                    compraParametro: venta.compraParametro.nombre
                }))
            ).flat() 
            
            await csvWriter.writeRecords(records)
            
            const nombreArchivo = ventaId === 0 ? 'ventasConsolidado.csv' : 'venta' + ventaId + '.csv'
            res.download(filePath, nombreArchivo)

        } catch (error) {
        console.error('Error al exportar ventasConsolidado:', error)
        res.status(500).send('Error al exportar ventasConsolidado')
    }
    
}

export {
    lista,
    formulario,
    crearVenta,
    formularioDetalle,
    productosMarcas,
    productosDatos,
    crearDetalle,
    mensajeEliminarVenta,
    eliminarVenta,
    mensajeEliminarVentaDetalle,
    eliminarVentaDetalle,
    finalizaVenta,
    exportCSVConsolidado
}
