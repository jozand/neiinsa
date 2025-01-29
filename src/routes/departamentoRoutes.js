import express from 'express'
import protegerRuta from '../middleware/protegerRuta.js'
import { departamentos, editar, actualizar, cargaEliminar, eliminar } from '../controllers/departamentoController.js'

const router = express.Router()

router.get('/departamentos', protegerRuta, departamentos)
router.get('/editar/:id', protegerRuta, editar)
router.post('/actualizar', protegerRuta, actualizar)
router.get('/cargaEliminar/:id', protegerRuta, cargaEliminar)
router.post('/eliminar', protegerRuta, eliminar)

export default router