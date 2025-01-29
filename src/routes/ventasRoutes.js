import express from 'express'
import protegerRuta from '../middleware/protegerRuta.js'
import { lista, formulario, crearVenta, formularioDetalle, productosMarcas, productosDatos, crearDetalle, mensajeEliminarVenta, eliminarVenta, mensajeEliminarVentaDetalle, eliminarVentaDetalle, finalizaVenta, exportCSVConsolidado } from '../controllers/ventasController.js'

const router = express.Router()

router.get('/lista/:pagoId/:compraId', protegerRuta, lista)
router.get('/formulario/:nit', protegerRuta, formulario);
router.post('/crearVenta', protegerRuta, crearVenta);  
router.get('/formularioDetalle/:ventaId', protegerRuta, formularioDetalle);
router.get('/productosMarcas/:marcaId', protegerRuta , productosMarcas)
router.get('/productosDatos/:productoId/:ventaId', protegerRuta, productosDatos)
router.post('/crearDetalle', protegerRuta, crearDetalle)
router.get('/mensajeEliminarVenta/:ventaId', protegerRuta, mensajeEliminarVenta)
router.get('/eliminarVenta/:ventaId', protegerRuta, eliminarVenta)
router.get('/mensajeEliminarVentaDetalle/:ventasDetalleId', protegerRuta, mensajeEliminarVentaDetalle)
router.get('/eliminarVentaDetalle/:ventasDetalleId', protegerRuta, eliminarVentaDetalle)
router.post('/finalizaVenta', protegerRuta, finalizaVenta)
router.get('/exportar-csv/:ventaId', protegerRuta, exportCSVConsolidado)
router.get('/exportar-csv/:ventaId', protegerRuta, exportCSVConsolidado)

export default router 