import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'
import { baseModelAttributes, baseModelHooks } from './BaseModel.js'

const Marcas = sequelize.define(
  'marcas',
  {
    marcaId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    ...baseModelAttributes(),
  },
  {
    tableName: 'marcas',
    hooks: {
      ...baseModelHooks(),
    },
  }
)

export default Marcas
