import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'
import { baseModelAttributes, baseModelHooks } from './BaseModel.js'

const Departamento = sequelize.define(
  'departamento',
  {
    departamentoId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    lat: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lng: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ...baseModelAttributes(),
  },
  {
    tableName: 'departamentos',
    hooks: {
      ...baseModelHooks(),
    },
  }
)

export default Departamento
