import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'
import { baseModelAttributes, baseModelHooks } from './BaseModel.js'

const Inventarios = sequelize.define(
  'inventarios',
  {
    inventarioId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    concepto: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    entrada: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    salida: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    existencia: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    origen: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    registroId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ...baseModelAttributes(),
  },
  {
    tableName: 'inventarios',
    hooks: {
      ...baseModelHooks(),
    },
  }
)

export default Inventarios
