import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'
import { baseModelAttributes, baseModelHooks } from './BaseModel.js'

const ParametroValor = sequelize.define(
  'parametroValor',
  {
    parametroValorId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    valor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ...baseModelAttributes(),
  },
  {
    tableName: 'parametro_valor',
    hooks: {
      ...baseModelHooks(),
    }
  }
)

export default ParametroValor