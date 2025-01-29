import express from 'express'
import protegerRuta from '../middleware/protegerRuta.js'
import { principal, detalleCalendario } from '../controllers/principalController.js'

const router = express.Router()

router.get('/', protegerRuta, principal)
router.get('/detalleCalentario/:id', protegerRuta , detalleCalendario)

export default router