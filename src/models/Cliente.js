import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'
import { baseModelAttributes, baseModelHooks } from './BaseModel.js'

const Cliente = sequelize.define(
  'cliente',
  {
    clienteId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nit: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    telefono: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    direccion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ...baseModelAttributes(),
  },
  {
    tableName: 'clientes',
    hooks: {
      ...baseModelHooks(),
    }
  }
)

export default Cliente
