import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'
import { baseModelAttributes, baseModelHooks } from './BaseModel.js'

const Municipio = sequelize.define(
  'municipio',
  {
    municipioId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lat: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lng: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ...baseModelAttributes(),
  },
  {
    tableName: 'municipios',
    hooks: {
      ...baseModelHooks(),
    },
  }
)

export default Municipio
