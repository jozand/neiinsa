import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'
import { baseModelAttributes, baseModelHooks } from './BaseModel.js'

const Productos = sequelize.define(
  'Productos',
  {
    productoId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    ...baseModelAttributes(),
  },
  {
    tableName: 'productos',
    hooks: {
      ...baseModelHooks(),
    },
  }
)

export default Productos
