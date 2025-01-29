import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'
import { baseModelAttributes, baseModelHooks } from './BaseModel.js'

const Parametro = sequelize.define(
  'parametro',
  {
    parametroId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ...baseModelAttributes(),
  },
  {
    tableName: 'parametro',
    hooks: {
      ...baseModelHooks(),
    },
  }
)

export default Parametro
