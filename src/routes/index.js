import express from 'express'
import authRoutes from './authRoutes.js'
import alertaRoutes from './templateRoutes.js'
import principalRoute from './principalRoutes.js'
import cliesntesRoutes from './clienteRoutes.js'
import departamentos from './departamentoRoutes.js'
import municipios from './municipioRoutes.js'
import marcasRoutes from './marcasRoutes.js'
import productosRoutes from './productosRoutes.js'
import pedidosRoutes from './pedidosRoutes.js'
import inventariosRoutes from './inventariosRoutes.js'
import ventasRouter from './ventasRoutes.js'

const router = express.Router()

router.use('/', principalRoute)
router.use('/alerta', alertaRoutes)
router.use('/auth', authRoutes)
router.use('/clientes', cliesntesRoutes)
router.use('/departamentos', departamentos)
router.use('/municipios', municipios)
router.use('/marcas', marcasRoutes)
router.use('/productos', productosRoutes)
router.use('/pedidos', pedidosRoutes)
router.use('/inventarios', inventariosRoutes)
router.use('/ventas', ventasRouter)

export default router
