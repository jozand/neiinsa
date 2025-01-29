import express from 'express'
import protegerRuta from '../middleware/protegerRuta.js'
import { formularioBuscarProductos, formularioProductos, guardarProducto, lista, cargaEditar, actualizarProducto, cargaEliminar, eliminarProducto, exportCSV} from '../controllers/productosController.js'

const router = express.Router()

router.get('/lista', protegerRuta, lista)
router.get('/buscar', protegerRuta, formularioBuscarProductos)
router.post('/buscar', protegerRuta, formularioProductos)
router.post('/guardar', protegerRuta, guardarProducto)
router.get('/editar/:productoId', protegerRuta, cargaEditar)
router.post('/actualiarProducto', protegerRuta, actualizarProducto)
router.get('/cargaEliminar/:productoId', protegerRuta, cargaEliminar)
router.post('/eliminarProducto', protegerRuta, eliminarProducto)
router.get('/exportar-csv', exportCSV)

export default router