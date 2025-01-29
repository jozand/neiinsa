import { check, validationResult } from 'express-validator'
import { Productos, Marcas} from '../models/index.js'
import { formatoFechaVista } from '../utils/formatos.js'
import { Op } from 'sequelize'
import { createObjectCsvWriter } from 'csv-writer'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const PAGINA = 'Control de Productos'

const lista = async (req, res) => {
    
    try {``

        const page = parseInt(req.query.page) || 1
        const limit = 7 // Número de elementos por página
        const offset = (page - 1) * limit
       
        const { count, rows } = await Productos.findAndCountAll({
            where: {
                activo: true
            },
            include: [
                { model: Marcas }
            ],
            limit: limit,
            offset: offset            
        })
       
        const totalPages = Math.ceil(count / limit)

        const nuevaLista = rows.map(item => ({
            id: item.productoId,
            codigo: `${item.productoId || ''}${item.marca?.marcaId || ''}`,
            nombre: item.nombre,
            createdAt: formatoFechaVista(item.createdAt),
            marca: item.marca.nombre
        }))

        return res.render('productos/productos', {
            pagina: PAGINA,
            csftToken: req.csrfToken(),
            barra: true,
            productos: nuevaLista,
            currentPage: page,
            totalPages: totalPages
        })
        
    } catch (error) {
        console.log(error)        
    }
}
 
const formularioBuscarProductos = async (req, res) => {

    const marcas = await Marcas.findAll({
        where: { activo: true }
    })

    res.render('productos/productosBuscar', {
        pagina: PAGINA,
        csftToken: req.csrfToken(),
        barra: true,
        marcas,
        datos: {}
    })
}

const formularioProductos = async (req, res) => {

    await check('marcaId').isNumeric().withMessage('Debe seleccionar una marca').run(req)
    await check('nombre').notEmpty().withMessage('Debe de ingresar nombre del producto').run(req)
    
    let resultado = validationResult(req)
    
    if(!resultado.isEmpty()){
        
        const marcas = await Marcas.findAll()

        return res.render('productos/productosBuscar', {
            pagina: PAGINA,
            csftToken: req.csrfToken(),
            barra: true,
            marcas,
            datos: req.body,
            errores: resultado.array()
        })
    }

    const { marcaId } = req.body

    const marcas = await Marcas.findAll()  

    const productos = await Productos.findAll({where: { marcaId, activo: true}})

    res.render('productos/productosGuardar', {
        pagina: PAGINA,
        csftToken: req.csrfToken(),
        barra: true,
        marcas,
        datos: req.body,
        tabla: productos,
        errores: [{msg: 'El producto no existe precione guardar para continuar'}]
    })

}



const guardarProducto = async (req, res) => {

    const { nombre, marcaId, descripcion } = req.body
    
    await Productos.create({nombre, marcaId, descripcion})

    res.redirect('/alerta/mostrarAlerta?mensaje=Registro creado correctamente&tipo=exito&href=/productos/buscar')
}

const cargaEditar = async (req, res) => {
    
    const marcas = await Marcas.findAll()

    const { productoId } = req.params

    const producto = await Productos.findOne({
        where: { productoId, activo: true}
    })

    if(producto){

        const productos = await Productos.findAll({
            where: {
                marcaId: producto.marcaId,
                activo: true,
                productoId: { [Op.ne]: producto.productoId } 
            }
        })

        return res.render('productos/productosEditar', {
            pagina: PAGINA,
            csftToken: req.csrfToken(),
            barra: true,
            marcas,
            datos: producto,
            tabla: productos,
            errores: [{msg: 'Datos del producto registrado '}]
        })
    }
}

const actualizarProducto = async (req, res) => {
    const { productoId, marcaId } = req.body

    await check('nombre').notEmpty().withMessage('Debe de ingresar nombre del producto').run(req)

    let resultado = validationResult(req)
    
    if(!resultado.isEmpty()){
        
        const marcas = await Marcas.findAll()

        const productos = await Productos.findAll({
            where: {
                marcaId: marcaId,
                activo: true,
                productoId: { [Op.ne]: productoId } 
            }
        })

        return res.render('productos/productosEditar', {
            pagina: PAGINA,
            csftToken: req.csrfToken(),
            barra: true,
            marcas,
            datos: req.body,
            tabla: productos,
            errores: resultado.array()
        })
    }

    const producto = await Productos.findByPk(productoId)  

    producto.set({
        nombre: req.body.nombre
    })

    await producto.save()

    res.redirect('/alerta/mostrarAlerta?mensaje=Registro actualizado correctamente&tipo=exito&href=/productos/lista')
    
}

const cargaEliminar = async (req, res) => {
    
    const marcas = await Marcas.findAll()

    const { productoId } = req.params

    const producto = await Productos.findOne({
        where: { productoId, activo: true}
    })

    if(producto){

        const productos = await Productos.findAll({
            where: {
                marcaId: producto.marcaId,
                activo: true,
                productoId: { [Op.ne]: producto.productoId } 
            }
        })

        return res.render('productos/productosEliminar', {
            pagina: PAGINA,
            csftToken: req.csrfToken(),
            barra: true,
            marcas,
            datos: producto,
            tabla: productos,
            errores: [{msg: 'Datos del producto a elimiar'}]
        })
    }
}


const eliminarProducto = async (req, res) => {
    const { productoId } = req.body

    const producto = await Productos.findByPk(productoId)  

    producto.set({
        activo: false
    })

    await producto.save()

    res.redirect('/alerta/mostrarAlerta?mensaje=Registro actualizado correctamente&tipo=exito&href=/productos/lista')
    
}

const exportCSV = async (req, res) => {
    
    try {
            const productos = await Productos.findAll({
                where: {
                    activo: true
                },
                include: [
                    { model: Marcas }
                ]       
            })

            const filePath = path.join(__dirname, '../../', 'public', 'csv', 'marcas.csv')

            const directoryPath = path.dirname(filePath)
                if (!fs.existsSync(directoryPath)) {
                fs.mkdirSync(directoryPath, { recursive: true })
            }

            const csvWriter = createObjectCsvWriter({
                path: filePath,
                header: [
                    { id: 'id', title: 'ID' },
                    { id: 'codigo', title: 'Codigo' },
                    { id: 'marca', title: 'Marca' },
                    { id: 'producto', title: 'Producto' },
                    { id: 'fechaCreacion', title: 'Fecha de Creación' }
                ],
                fieldDelimiter: ',',
                quoteStrings: '"',
            })

            const records = productos.map(producto => ({
                id: producto.productoId,
                codigo: `${producto.productoId || ''}${producto.marca?.marcaId || ''}`,
                marca: producto.marca.nombre,
                producto: producto.nombre,
                fechaCreacion: formatoFechaVista(producto.createdAt)
            }))

            await csvWriter.writeRecords(records)

            res.download(filePath, 'productos.csv')

        } catch (error) {
        console.error('Error al exportar productos:', error)
        res.status(500).send('Error al exportar productos')
    }
}

export {
    lista,
    formularioBuscarProductos,
    formularioProductos,
    guardarProducto,
    cargaEditar,
    actualizarProducto,
    cargaEliminar,
    eliminarProducto,
    exportCSV
}