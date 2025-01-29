import { check, validationResult } from 'express-validator'
import { Marcas, Productos } from "../models/index.js"
import { formatoFechaVista } from '../utils/formatos.js'
import { createObjectCsvWriter } from 'csv-writer'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const PAGINA = 'Control de Marcas'

const lista = async (req, res) => {
    
    try {

        const page = parseInt(req.query.page) || 1
        const limit = 7 // Número de elementos por página
        const offset = (page - 1) * limit
       
        const { count, rows }  = await Marcas.findAndCountAll({
            where: {
                activo: true
            },
            include: [
                { 
                    model: Productos,
                    required: false,

                }
            ],
            limit: limit,
            offset: offset            
        })
        
        const totalPages = Math.ceil(count / limit)

        const nuevaLista = rows.map(item => ({
            id: item.marcaId,
            nombre: item.nombre,
            createdAt: formatoFechaVista(item.createdAt), 
            cantidadProductos: item.Productos ? item.Productos.length : 0
        }))

        return res.render('marcas/marcas', {
            pagina: PAGINA,
            csftToken: req.csrfToken(),
            barra: true,
            marcas: nuevaLista,
            currentPage: page,
            totalPages: totalPages
        })
        
    } catch (error) {
        console.log(error)        
    }
}

const crearFormulario = (req, res) => {
    return res.render('marcas/marcasCrear', {
        pagina: PAGINA,
        csftToken: req.csrfToken(),
        barra: true,
        errores: {}
    })
}

const crear = async (req, res) => {

    await check('nombre').notEmpty().withMessage('El nombre de la marca no puede ir vacio').run(req)

    let resultado = validationResult(req)

    const marcas = await Marcas.findAll()

    if(!resultado.isEmpty()){
        return res.render('marcas/marcasCrear', {
            pagina: PAGINA,
            csftToken: req.csrfToken(),
            barra: true,
            marcas,
            errores: resultado.array()
        })
    }


    try {

        await Marcas.create({
            nombre: req.body.nombre
        })

        res.redirect('/alerta/mostrarAlerta?mensaje=Registro creado correctamente&tipo=exito&href=/marcas/crearFormulario')

    } catch (error) {
        console.log(error)        
    }

}

const editar = async (req, res) => {

    try {
        
        const { marcaId } = req.params

        const marca = await Marcas.findByPk(marcaId)   

        res.render('marcas/marcasEditar', {
            pagina: PAGINA,
            csftToken: req.csrfToken(),
            barra: true,
            marca,
            errores: [{msg: 'datos de la marca registrada'}]
        })

    } catch (error) {
        console.log(error)        
    }
    
}

const actualizar = async (req, res) => {

    try {

        const { marcaId, nombre } = req.body

        const marca = await Marcas.findByPk(marcaId)  

        marca.set({
            nombre
        })

        await marca.save()

        res.redirect('/alerta/mostrarAlerta?mensaje=Registro actualizado correctamente&tipo=exito&href=/marcas/lista')
        
    } catch (error) {
        console.log(error)        
    }
}

const cargaEliminar = async (req, res) => {
    
    try {
        
        const { marcaId } = req.params
    
        const marca = await Marcas.findByPk(marcaId)

        res.render('marcas/marcasEliminar', {
            pagina: PAGINA,
            csftToken: req.csrfToken(),
            barra: true,
            marca,
            errores: [{msg: 'Datos de la marca a eliminar'}]
        })

    } catch (error) {
        console.log(error)        
    }

}

const eliminar = async (req, res) => {

    try {

        const { marcaId } = req.body
    
        const marca = await Marcas.findByPk(marcaId)
    
        marca.activo = false
        await marca.save()
    
        res.redirect('/alerta/mostrarAlerta?mensaje=Registro eliminado correctamente&tipo=exito&href=/marcas/lista')
        
    } catch (error) {
        console.log(error)        
    }
}

const exportCSV = async (req, res) => {
    
    try {
            const marcas = await Marcas.findAll({
                where: {
                    activo: true
                },
                include: [
                    { 
                        model: Productos,
                        required: false,
    
                    }
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
                    { id: 'nombre', title: 'Nombre' },
                    { id: 'fechaCreacion', title: 'Fecha de Creación' },
                    { id: 'cantidadProductos', title: 'Cantidad de Productos' }
                ],
                fieldDelimiter: ',',
                quoteStrings: '"',
            })

            const records = marcas.map(marca => ({
                id: marca.marcaId,
                nombre: marca.nombre,
                fechaCreacion: formatoFechaVista(marca.createdAt),
                cantidadProductos: marca.Productos ? marca.Productos.length : 0
              }))

            await csvWriter.writeRecords(records)

            res.download(filePath, 'marcas.csv')

        } catch (error) {
        console.error('Error al exportar marcas:', error)
        res.status(500).send('Error al exportar marcas')
    }
}

export {
    lista,
    crear,
    crearFormulario,
    editar,
    actualizar,
    cargaEliminar,
    eliminar,
    exportCSV
}