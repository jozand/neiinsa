import express from 'express'
import { municipiosDepartamentos, editar, actualizar, cargaEliminar, eliminar, municipios, obtenerMunicipiosPorDepartamento , formulario , crear } from '../controllers/municipioController.js'
import protegerRuta from '../middleware/protegerRuta.js'

const router = express.Router()

router.get('/porDepartamento/:departamentoId', protegerRuta,  municipiosDepartamentos)
router.get('/por-departamento/:departamentoId', obtenerMunicipiosPorDepartamento)
router.get('/municipios', protegerRuta, municipios)
router.get('/editar/:municipioId', protegerRuta, editar)
router.post('/actualizar', protegerRuta, actualizar)
router.get('/cargaEliminar/:municipioId', protegerRuta, cargaEliminar)
router.post('/eliminar', protegerRuta, eliminar)
router.get('/formulario', protegerRuta, formulario)
router.post('/crear', protegerRuta, crear)

export default router
