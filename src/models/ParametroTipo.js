import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'
import { baseModelAttributes, baseModelHooks } from './BaseModel.js'

const ParametroTipo = sequelize.define(
  'parametro_tipo',
  {
    parametroTipoId: {
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
    tableName: 'parametro_tipo',
    hooks: {
      ...baseModelHooks(),
    },
  }
)

export default ParametroTipo
