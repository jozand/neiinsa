import { Departamento } from '../models/index.js'

const PAGINA = 'Mantenimiento de Departamentos'

const departamentos = async (req, res) => {

    try {
        const page = parseInt(req.query.page) || 1
        const limit = 7 // Número de elementos por página
        const offset = (page - 1) * limit

        const { count, rows } = await Departamento.findAndCountAll({
            limit: limit,
            offset: offset,
            where :{ activo : true }
        })

        const totalPages = Math.ceil(count / limit)

        res.render('departamentos/departamentos', {
            pagina: PAGINA,
            csftToken: req.csrfToken(),
            barra: true,
            departamentos: rows,
            currentPage: page,
            totalPages: totalPages
        })

    } catch (error) {
        
    }
}

const editar = async (req, res) => {

    try {
        
        const { id } = req.params

        const departamento = await Departamento.findByPk(id)   

        res.render('departamentos/departamentosEditar', {
            pagina: PAGINA,
            csftToken: req.csrfToken(),
            barra: true,
            departamento
        })

    } catch (error) {
        
    }
    
}

const actualizar = async (req, res) => {

    try {

        const { id, nombre, lat, lng } = req.body

        const departamento = await Departamento.findByPk(id)

        departamento.set({
            nombre,
            lat,
            lng
        })

        await departamento.save()

        res.redirect('/alerta/mostrarAlerta?mensaje=Registro actualizado correctamente&tipo=exito&href=/departamentos/departamentos')
        
    } catch (error) {
        
    }
}

const cargaEliminar = async (req, res) => {
    
    try {
        
        const { id } = req.params
    
        const departamento = await Departamento.findByPk(id)
    
        res.render('departamentos/departamentosEliminar', {
            pagina: PAGINA,
            csftToken: req.csrfToken(),
            barra: true,
            departamento,
            errores: [{msg: 'Datos del departamento a eliminar'}]
        })

    } catch (error) {
        
    }

}

const eliminar = async (req, res) => {

    try {

        const { id } = req.body
    
        const departamento = await Departamento.findByPk(id)
    
        departamento.activo = false
        await departamento.save()
    
        res.redirect('/alerta/mostrarAlerta?mensaje=Registro eliminado correctamente&tipo=exito&href=/departamentos/departamentos')
        
    } catch (error) {
        console.error('Error al obtener los clientes:', error)
        res.status(500).send('Hubo un error al obtener los clientes.')
    }
}

export {
    departamentos,
    editar,
    actualizar,
    cargaEliminar,
    eliminar
}

