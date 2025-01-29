import express from 'express'
import protegerRuta from '../middleware/protegerRuta.js'
import { formularioClientes, registrarClientes, formularioBuscaClientes,  buscarClientes, mostrarClientes, editar, cargaEliminar, eliminar, exportCSV } from '../controllers/clienteController.js'

const router = express.Router()

router.get('/formulario', protegerRuta, formularioClientes)
router.post('/registar', protegerRuta, registrarClientes)
router.get('/buscar', protegerRuta, formularioBuscaClientes)
router.post('/buscar', protegerRuta, buscarClientes)
router.get('/clientes', protegerRuta, mostrarClientes)
router.get('/editar/:nit', protegerRuta, editar)
router.get('/cargaEliminar/:nit', protegerRuta, cargaEliminar)
router.post('/eliminar', protegerRuta, eliminar)
router.get('/exportar-csv', exportCSV)

export default router