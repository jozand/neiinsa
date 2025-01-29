import { check, validationResult } from 'express-validator'
import { Cliente, Departamento, Municipio } from '../models/index.js'
import { createObjectCsvWriter } from 'csv-writer'
import { Sequelize } from 'sequelize'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
// Definir __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const PAGINA = 'Control de Clientes'

const formularioClientes = async (req, res) => {

    res.render('clientes/clientesFormulario', {
        pagina: PAGINA,
        csftToken: req.csrfToken(),
        barra: true,
        datos: {}
    })
}

const registrarClientes = async (req, res) => {   

    await check('nit').notEmpty().withMessage('El número de NIT es requerido').run(req)
    await check('nombre').notEmpty().withMessage('El nombre no puede ir vacio').run(req)
    await check('telefono')
        .notEmpty().withMessage('El telefono no puede ir vacio')
        .isLength({ min: 8, max: 8 }).withMessage('El número de telefono no es correcto')
    .run(req)

    await check('departamentoId').notEmpty().withMessage('El departamento es obligatorio').run(req)
    await check('municipioId').notEmpty().withMessage('El municipio es obligatorio').run(req)
    await check('direccion').notEmpty().withMessage('La dirección no puede ir vacia').run(req)
    
    let resultado = validationResult(req)

    const { nit, nombre, telefono, direccion, departamentoId, municipioId } = req.body

    if(!resultado.isEmpty()){

        const [departamentos, municipios] = await Promise.all([
            Departamento.findAll(),
            Municipio.findAll({where: { departamentoId }})
        ])

        return res.render('clientes/clientesFormulario', {
            pagina: PAGINA,
            csftToken: req.csrfToken(),
            barra: true,
            datos: req.body,
            departamentos,
            municipios,
            errores: resultado.array()
        })
    }

    const existeUsuario = await Cliente.findOne({where: { nit }}) 

    if(existeUsuario){

        existeUsuario.nombre = nombre
        existeUsuario.telefono = telefono
        existeUsuario.direccion = direccion
        existeUsuario.departamentoId = departamentoId
        existeUsuario.municipioId = municipioId
        
        await existeUsuario.save()
       
        res.redirect('/alerta/mostrarAlerta?mensaje=Registro actualizado correctamente&tipo=exito&href=/clientes/clientes')
        
    }else{        

        try {
           const formattedNombre = nombre.trim().toLowerCase().replace(/\s+/g, '%')
            
            const usuarioLike = await Cliente.findOne({
                where: {
                    [Sequelize.Op.or]: [
                        {
                            nombre: {
                                [Sequelize.Op.like]: `%${formattedNombre}%`
                            }
                        },
                        {
                            telefono
                        }
                    ]
                }
            })
            
            if (usuarioLike){

                const mensaje = `El cliente ya existe:<br><strong>NIT: ${usuarioLike.nit}</strong><br><strong>Nombre: ${usuarioLike.nombre}</strong>`
                res.redirect(`/alerta/mostrarAlerta?mensaje=${encodeURIComponent(mensaje)}&tipo=error&href=/clientes/buscar`)

                
            }else {

                await Cliente.create({
                    nit,
                    nombre,
                    telefono,
                    direccion,
                    departamentoId,
                    municipioId
                })
            
                res.redirect('/alerta/mostrarAlerta?mensaje=Registro creado correctamente&tipo=exito&href=/clientes/buscar')
            }

        } catch (error) {    
            console.log(error)
                   
            res.redirect('/alerta/mostrarAlerta?mensaje=!Ha ocurrido un error :(<br> Contacta al administrador del sistema!&tipo=Error&href=/')
        }        
    }    
}

const formularioBuscaClientes = async (req, res) => {
    
    res.render('clientes/clientesBuscar', {
        pagina: PAGINA,
        csftToken: req.csrfToken(),
        barra: true,
        datos: {}
    })
}

function esNitValido(nit) {
    nit = nit.replace(/[^0-9Kk]/g, '') // Remover caracteres no válidos, excepto K

    if (!/^[0-9]+[kK]?$/.test(nit)) return false // Verificar formato básico

    const cuerpo = nit.slice(0, -1)
    const digitoVerificador = nit.slice(-1).toUpperCase()

    let suma = 0
    let multiplicador = cuerpo.length + 1

    for (let i = 0; i < cuerpo.length; i++) {
        suma += parseInt(cuerpo[i]) * multiplicador
        multiplicador--
    }

    const modulo = suma % 11
    const verificadorCalculado = modulo === 0 ? '0' : (11 - modulo === 10 ? 'K' : (11 - modulo).toString())

    return verificadorCalculado === digitoVerificador
}

const buscarClientes = async (req, res) => {

    await check('nit')
        .notEmpty().withMessage('El número de NIT es requerido')
        .bail() // Detener la validación si el campo está vacío
        .custom((value) => esNitValido(value))
        .withMessage('El NIT ingresado no es válido para Guatemala')
        .run(req)

    let resultado = validationResult(req)

    if(!resultado.isEmpty()){
        return res.render('clientes/clientesBuscar', {
            pagina: PAGINA,
            csftToken: req.csrfToken(),
            barra: true,
            datos: req.body,
            errores: resultado.array(),
        })
    }

    const { nit } = req.body

    const existeUsuario = await Cliente.findOne({where: { nit }}) 
    
    const departamentos = await Departamento.findAll()
     
    if(existeUsuario){   
        //Consultar catalogos
        const municipios = await Municipio.findAll({where :{ municipioId : existeUsuario.municipioId }})

        res.render('clientes/clientesFormulario', {
            pagina: PAGINA,
            csftToken: req.csrfToken(),
            barra: true,
            datos: existeUsuario,
            departamentos,
            municipios,
            errores: [{msg: 'Datos del cliente registrado'}]
        })
    }else{

        res.render('clientes/clientesFormulario', {
            pagina: PAGINA,
            csftToken: req.csrfToken(),
            barra: true,
            datos: req.body,
            departamentos,
            municipios: {}
        })
    }
}

const mostrarClientes = async (req, res) => {
    try {
        
        const page = parseInt(req.query.page) || 1
        const limit = 7 // Número de elementos por página
        const offset = (page - 1) * limit
       
        const { count, rows } = await Cliente.findAndCountAll({
            where: {
              activo: true
            },
            include: [
              { model: Departamento },
              { model: Municipio }
            ],
            limit: limit,
            offset: offset,
            // Ordenar por el valor convertido de nitEntero
            order: [
              [Sequelize.literal('CAST(nit AS UNSIGNED)'), 'ASC']
            ]
          })
          
          const totalPages = Math.ceil(count / limit)
  
          return res.render('clientes/clientes', {
                pagina: PAGINA,
                csftToken: req.csrfToken(),
                barra: true,
                clientes: rows,
                currentPage: page,
                totalPages: totalPages
            })
        
    } catch (error) {
        console.error('Error al obtener los clientes:', error)
        res.status(500).send('Hubo un error al obtener los clientes.')
    }
}

const editar = async (req, res) => {

    const { nit } = req.params

    const usuario = await Cliente.findOne({where: { nit }}) 
    const departamentos = await Departamento.findAll()
    const municipios = await Municipio.findAll({where :{ municipioId : usuario.municipioId }})
    
    res.render('clientes/clientesFormulario', {
        pagina: PAGINA,
        csftToken: req.csrfToken(),
        barra: true,
        datos: usuario,
        departamentos,
        municipios,
        errores: [{msg: 'Datos del cliente registrado'}]
    })
}

const cargaEliminar = async (req, res) => {

    const { nit } = req.params

    const usuario = await Cliente.findOne({where: { nit }}) 
    const departamentos = await Departamento.findAll()
    const municipios = await Municipio.findAll({where :{ municipioId : usuario.municipioId }})
    
    res.render('clientes/clientesEliminar', {
        pagina: PAGINA,
        csftToken: req.csrfToken(),
        barra: true,
        datos: usuario,
        departamentos,
        municipios,
        errores: [{msg: 'Datos del cliente a eliminar'}]
    })
}

const eliminar = async (req, res) => {

    const { nit } = req.body
    try {

        const usuario = await Cliente.findOne({where: { nit }}) 
    
        usuario.activo = false
        await usuario.save()
    
        res.redirect('/alerta/mostrarAlerta?mensaje=Registro eliminado correctamente&tipo=exito&href=/clientes/clientes') 

    } catch (error) {
        console.error('Error al obtener los clientes:', error)
        res.status(500).send('Hubo un error al obtener los clientes.')
    }
}

const exportCSV = async (req, res) => {
    
    try {
            // Consultar la tabla `clientes`
            const clientes = await Cliente.findAll({
                include: [
                  { model: Departamento },
                  { model: Municipio }
                ],
                where: { activo: true },
                // Ordenar por el valor numérico de nit
                order: [
                  [Sequelize.literal('CAST(nit AS UNSIGNED)'), 'ASC']
                ]
              })
              
            
            // Ruta donde se guardará el archivo CSV
            const filePath = path.join(__dirname, '../../', 'public', 'csv', 'clientes.csv')

            // Verificar si el directorio 'scv' existe, y si no, crearlo
            const directoryPath = path.dirname(filePath)
                if (!fs.existsSync(directoryPath)) {
                fs.mkdirSync(directoryPath, { recursive: true })
            }

            // Configurar el escritor de CSV
            const csvWriter = createObjectCsvWriter({
                path: filePath,
                header: [
                    { id: 'id', title: 'ID' },
                    { id: 'nit', title: 'NIT' },
                    { id: 'nombre', title: 'Nombre' },
                    { id: 'telefono', title: 'Teléfono' },
                    { id: 'direccion', title: 'Dirección' },
                    // Agregar otros campos según tu tabla
                ],
                fieldDelimiter: ',',
                quoteStrings: '"',
            })

            // Mapear los datos para incluir nombres de departamento y municipio
            const records = clientes.map(cliente => ({
                id: cliente.clienteId,
                nit: cliente.nit,
                nombre: cliente.nombre,
                telefono: cliente.telefono,
                direccion: `${cliente.municipio?.nombre}, ${cliente.departamento?.nombre},  ${cliente.direccion}`
              }))

            // Escribir datos en el archivo CSV
            await csvWriter.writeRecords(records)

            // Enviar el archivo CSV como respuesta para descarga
            res.download(filePath, 'clientes.csv')

        } catch (error) {
        console.error('Error al exportar clientes:', error)
        res.status(500).send('Error al exportar clientes')
    }

}

export {
    formularioClientes,
    registrarClientes,
    formularioBuscaClientes,
    buscarClientes,
    mostrarClientes,
    editar,
    cargaEliminar,
    eliminar,
    exportCSV
}
