import express from 'express'
import protegerRuta from '../middleware/protegerRuta.js'
import { mostrarAlerta, mostrarAlertaConfirmacion } from '../controllers/templateController.js'

const router = express.Router()

router.use('/mostrarAlerta', protegerRuta, mostrarAlerta)
router.use('/mostrarAlertaConfirmacion', protegerRuta, mostrarAlertaConfirmacion)

export default router