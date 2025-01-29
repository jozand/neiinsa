import express from 'express'
import protegerRuta from '../middleware/protegerRuta.js'
import { lista, crear, crearFormulario, editar, cargaEliminar, eliminar, actualizar, exportCSV } from '../controllers/marcasController.js'

const router = express.Router()

router.get('/lista', protegerRuta, lista)
router.get('/crearFormulario', protegerRuta, crearFormulario)
router.post('/crear', protegerRuta, crear)
router.get('/editar/:marcaId', protegerRuta, editar)
router.get('/cargaEliminar/:marcaId', protegerRuta, cargaEliminar)
router.post('/eliminar', protegerRuta, eliminar)
router.post('/actualizar', protegerRuta, actualizar)
router.get('/exportar-csv', exportCSV)

export default router
