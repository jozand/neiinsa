import express from 'express'
import protegerRuta from '../middleware/protegerRuta.js'
import { lista, formulario, crear, productosMarcas, crearDetalle, obtenerDetalle, mensajeEliminarPedidoDetalle, eliminarPedido, mensajeEliminarPedido, eliminarPedidoDetalle, finalizaPedido, buscarProveedores, exportCSV } from '../controllers/pedidosController.js'  

const router = express.Router()

router.get('/lista', protegerRuta, lista)
router.get('/formulario', protegerRuta, formulario)
router.post('/crear', protegerRuta, crear)
router.get('/productosMarcas/:marcaId', protegerRuta , productosMarcas)
router.post('/crearDetalle', protegerRuta, crearDetalle)
router.get('/obtenerDetalle/:pedidoId/:productoId', protegerRuta, obtenerDetalle)
router.get('/mensajeEliminarPedidoDetalle/:pedidoDetalleId', protegerRuta, mensajeEliminarPedidoDetalle)
router.get('/eliminarPedidoDetalle/:pedidoDetalleId', protegerRuta, eliminarPedidoDetalle)
router.get('/mensajeEliminarPedido/:pedidoId', protegerRuta, mensajeEliminarPedido)
router.get('/eliminarPedido/:pedidoId', protegerRuta, eliminarPedido)
router.post('/finalizaPedido', protegerRuta, finalizaPedido)
router.get('/buscarProveedor', protegerRuta, buscarProveedores)
router.get('/exportar-csv/:pedidoId', exportCSV)

export default router