import express from 'express'
import protegerRuta from '../middleware/protegerRuta.js' 
import { lista, exportCSV} from '../controllers/inventariosController.js'

const router = express.Router()

router.get('/lista/:op', protegerRuta, lista)
router.get('/exportar-csv', exportCSV)

export default router