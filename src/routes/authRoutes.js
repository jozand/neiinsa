import express from 'express'
import { formularioLogin , autenticar, cerrarSession } from '../controllers/authController.js'

const router = express.Router()

router.get('/login',  formularioLogin)
router.post('/login',  autenticar)
router.post('/cerrar-session', cerrarSession)

export default router
