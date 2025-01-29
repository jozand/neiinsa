import { check, validationResult } from 'express-validator'
import { Municipio, Departamento } from '../models/index.js'

const PAGINA = 'Mantenimiento de Municipios'

const municipiosDepartamentos = async (req, res) => {       
    const { departamentoId } = req.params
    try {
        const municipios = await Municipio.findAll({
            where: { departamentoId, activo : true  }
        })
        
        res.json(municipios)
    } catch (error) {
        console.error('Error al obtener municipios:', error)
        res.status(500).json({ error: 'Error al obtener municipios' })
    }
}

const obtenerMunicipiosPorDepartamento = async (req, res) => {

    const { departamentoId } = req.params
    const { page = 1, limit = 7 } = req.query  
    const offset = (page - 1) * limit

    try {
        const { count, rows: municipios } = await Municipio.findAndCountAll({
            where: { departamentoId, activo: true },
            offset: parseInt(offset),
            limit: parseInt(limit)
        })        
        
        res.json({
            municipios,
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
        })

    } catch (error) {
        console.error('Error al obtener los municipios:', error)
        res.status(500).send('Error al obtener los municipios.')
    }
}

const municipios = async (req, res) => {

    try {
        const departamentos = await Departamento.findAll({
            where :{ activo : true }
        })

        res.render('municipios/municipios', {
            pagina: PAGINA,
            csftToken: req.csrfToken(),
            barra: true,
            departamentos,
            municipios: {}
        })

    } catch (error) {
        
    }
}

const editar = async (req, res) => {

    try {
        
        const { municipioId } = req.params

        const municipio = await Municipio.findByPk(municipioId)   

        res.render('municipios/municipiosEditar', {
            pagina: PAGINA,
            csftToken: req.csrfToken(),
            barra: true,
            municipio
        })

    } catch (error) {
        
    }
    
}


const actualizar = async (req, res) => {

    try {

        const { municipioId, nombre, lat, lng } = req.body

        const municipio = await Municipio.findByPk(municipioId)

        municipio.set({
            nombre,
            lat,
            lng
        })

        await municipio.save()

        res.redirect('/alerta/mostrarAlerta?mensaje=Registro actualizado correctamente&tipo=exito&href=/municipios/municipios')
        
    } catch (error) {
        
    }
}


const cargaEliminar = async (req, res) => {
    
    try {
        
        const { municipioId } = req.params
    
        const municipio = await Municipio.findByPk(municipioId)

        res.render('municipios/municipiosEliminar', {
            pagina: PAGINA,
            csftToken: req.csrfToken(),
            barra: true,
            municipio,
            errores: [{msg: 'Datos del municipio a eliminar'}]
        })

    } catch (error) {
        
    }

}

const eliminar = async (req, res) => {

    try {

        const { municipioId } = req.body
    
        const municipio = await Municipio.findByPk(municipioId)
    
        municipio.activo = false
        await municipio.save()
    
        res.redirect('/alerta/mostrarAlerta?mensaje=Registro eliminado correctamente&tipo=exito&href=/municipios/municipios')
        
    } catch (error) {
        console.error('Error al obtener los clientes:', error)
        res.status(500).send('Hubo un error al obtener los clientes.')
    }
}

const formulario = async (req, res) => {

    try {
        
        const departamentos = await Departamento.findAll({ where: { activo: true}})

        return res.render('municipios/municipiosCrear', {
            pagina: PAGINA,
            csftToken: req.csrfToken(),
            barra: true,
            departamentos,
            datos: {},
            errores: {}
        })

    } catch (error) {
        
    }
}


const crear = async (req, res) => {

    await check('departamentoId').notEmpty().withMessage('El departamento es obligatorio').run(req)
    await check('nombre').notEmpty().withMessage('El nombre es requerido').run(req)
    await check('lat').notEmpty().withMessage('la Latitud requerido').run(req)
    await check('lng').notEmpty().withMessage('la longitud es requerido').run(req)

    let resultado = validationResult(req)

    if(!resultado.isEmpty()){

        const departamentos = await Departamento.findAll({ where: { activo: true}})

        return res.render('municipios/municipiosCrear', {
            pagina: PAGINA,
            csftToken: req.csrfToken(),
            barra: true,
            departamentos,
            datos: {},
            errores: resultado.array()
        })
    }

    try {
        
        const { nombre, lat, lng, departamentoId } = req.body
        
        await Municipio.create({  
            nombre,
            lat,
            lng,
            departamentoId
        })
        
        res.redirect('/alerta/mostrarAlerta?mensaje=Registro creado correctamente&tipo=exito&href=/municipios/municipios')

    } catch (error) {
        console.log(error)
        
    }

}


export {
    municipiosDepartamentos,
    obtenerMunicipiosPorDepartamento,
    municipios,
    editar,
    actualizar,
    cargaEliminar,
    eliminar,
    formulario,
    crear
}