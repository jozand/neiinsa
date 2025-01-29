import { exit } from 'node:process'
import { sequelize } from '../src/config/database.js'
import { Usuario, ParametroTipo, Parametro, ParametroValor, Departamento, Municipio } from '../src/models/index.js'
import usuario from './usuario.js'
import parametroTipo from './parametroTipo.js'
import parametro from './parametro.js'
import parametroValor from './parametroValor.js'
import departamento from './departamento.js'
import municipio from './municipio.js'

const importarDatos = async () => {
  try {

    await sequelize.authenticate()
    await sequelize.sync()

    await Promise.all([
      Usuario.bulkCreate(usuario),
      ParametroTipo.bulkCreate(parametroTipo),
      Parametro.bulkCreate(parametro),
      //ParametroValor.bulkCreate(parametroValor),
      Departamento.bulkCreate(departamento),
      Municipio.bulkCreate(municipio)
    ])

    console.log('Datos de prueba creados exitosamente.')
  } catch (error) {
    console.error('Error al crear los datos de prueba:', error)
    exit(1)
  }
}

const eliminarDatos = async () => {
  try {

    await sequelize.drop();
    
    console.log('Datos de prueba eliminados exitosamente.')
  } catch (error) {
    console.error('Error al eliminar los datos de prueba:', error)
    exit(1) 
  }
}

if(process.argv[2] === "-i"){
  importarDatos();
}

if(process.argv[2] === "-e"){
  eliminarDatos();
}